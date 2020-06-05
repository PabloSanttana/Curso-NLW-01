import React,{useState,useEffect, ChangeEvent, FormEvent} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {FiArrowLeft, FiCheckCircle} from 'react-icons/fi'
import { Map, TileLayer, Marker} from 'react-leaflet'
import axios from 'axios'
import {LeafletMouseEvent} from 'leaflet'

import './styles.css'
import logo from '../../assets/logo.svg'
import api from '../../servers/api'
import Dropzone from '../../components/Dropzone'

interface Item {
    id: number,
    title: string,
    image_url: string
}
interface IBGEUFResponse {
    sigla: string
}
interface IBGECityResponse {
    nome: string
}

const CreatePoint = () =>{
    const history = useHistory()
    const [items,setItems] = useState<Item[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])
    const [submit, setSubmit] = useState(false)

    const [initialPosition, setInitialPosition] = useState<[number,number]>([0,0])

    const [formData, setFormData] = useState({
        name:'',
        email:'',
        whatsapp:''
    })

    const [selectedUf, setSelectedUf] = useState('0')
    const [selectedCity, setSelectedCity] = useState('0')
    const [selectedItems, setSelectedItems]= useState<number[]>([])
    const [selectedPosition, setSelectedPosition] = useState<[number,number]>([0,0])
    const [selectedFile, setSelectedFile] = useState<File>()

  // 

    useEffect(()=>{
        getItems()
        getUF()
        initialPositionMap()
    },[])
    useEffect(()=>{
        if(selectedUf === '0') return;
        async function getMunicipiosUF(){
            try {
                const response = await axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
                const cityName = response.data.map(city => city.nome)
                setCities(cityName)
            } catch (error) {
                alert('Erro do servior')
            }
        }
        getMunicipiosUF()
    },[selectedUf])

    async function getItems(){
        try {
            const response = await api.get('items')
            setItems(response.data)
        } catch (error) {
            alert('Erro no servidor')
        }
    }
   async function getUF(){
        try {
           const response = await axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
           const ufInitials = response.data.map(uf => uf.sigla)
           setUfs(ufInitials)
        } catch (error) {
            alert('Erro no servidor')
        }
    }
    async function initialPositionMap(){
        await   navigator.geolocation.getCurrentPosition(position=>{
            setInitialPosition([position.coords.latitude, position.coords.longitude])
        })
    }
   

    function handleSelectedUf(event:ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value
      setSelectedUf(uf)
    }
    function handleSelectedCity(event:ChangeEvent<HTMLSelectElement>){
        const city = event.target.value
        setSelectedCity(city)
    }
    function handleMapClick( event:LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){

        const {name, value } = event.target
        setFormData({...formData, [name]:value})
    }

    function handleSelectedItem(id: number){
        const alreadySelected = selectedItems.findIndex(item => item === id)

        if(alreadySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems)
        }else{
            setSelectedItems([...selectedItems,id])
            
        }

      
    }

   async function handleSubmit(event:FormEvent ){
        event.preventDefault()

        console.log(selectedFile)
        
        const { name ,email,whatsapp} = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude,longitude] = selectedPosition
        const items = selectedItems


        if(name === '' || email === '' || whatsapp === '' || latitude === 0 || longitude === 0 || items.length === 0 || uf === '0' ||  city === '0'  ) return alert('Peencha todos os campos')


        const data = new FormData()


        data.append('name',name)
        data.append('email',email)
        data.append('whatsapp',whatsapp)
        data.append('uf',uf)
        data.append('city',city)
        data.append('latitude', String(latitude))
        data.append('longitude',String(longitude))
        data.append('items',items.join(','))
       if(selectedFile){
        data.append('image',selectedFile)
       }

        try {
            await api.post('points',data)
            let time : any
            setSubmit(true)
            time = setTimeout(() => {
                history.push('/')
                clearTimeout(time)
            }, 2000);
          
        } catch (error) {
            alert('Erro ')
        }
      

    }

    return(
        <>
       <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>

                <Link to='/'>
                    <FiArrowLeft/>
                    Voltar para home
                </Link>
            </header>
           
           <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/> ponto de coleta</h1>

                <Dropzone  onFileUpolad={setSelectedFile}/>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                    </div>

                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    {!submit &&       <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                     />
                     <Marker position={selectedPosition}/>
                    </Map>

                 }
                    <div className="field-group">
                        <div className="field">
                          <label htmlFor="uf">Estado (UF)</label>
                         <select name="uf" id="uf" value={selectedUf} onChange={handleSelectedUf}>
                             <option value="0">Selecione uma UF</option>
                             {ufs? ufs.map(uf =>(
                                 <option key={uf} value={uf}>{uf}</option>
                             )) :null}
                         </select>
                        </div>
                        <div className="field">
                          <label htmlFor="city">Cidade</label>
                         <select name="uf" id="uf" value={selectedCity} onChange={handleSelectedCity}>
                             <option value="0">Selecione uma cidade</option>
                             {cities? cities.map(city =>(
                                  <option key={city} value={city}>{city}</option>
                             )) :null}
                         </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Items de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items? items.map(item  =>(
                            <li 
                                key={item.id} 
                                onClick={() => handleSelectedItem(item.id)}
                                className={selectedItems.includes(item.id)? 'selected':''}
                                >
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                            )
                        ):null}
                       
                    </ul>
                </fieldset>
                <button type="submit">
                    Cadastrar um ponto de coleta
                </button>
           </form>
        </div>

      {submit &&
        <div id="modal">
            <div id="modal__content">
                <span><FiCheckCircle /></span> 
                <h1>Cadastro concluído!</h1>
            </div>
        </div>
      }  
    </>
    )
}

export default CreatePoint