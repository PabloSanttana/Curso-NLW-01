import express from 'express'
import multer from 'multer'
import {celebrate, Joi} from 'celebrate'

import multerConfig from './config/multer'
import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'

const routes = express.Router()
const uploads = multer(multerConfig)

const poitnsController = new PointsController()
const itemsController = new ItemsController()

routes.get('/items',itemsController.index)

routes.get('/points', poitnsController.index)
routes.get('/points/:id', poitnsController.show)

routes.post('/points', 
    uploads.single('image'), 
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.string().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            items: Joi.string().required()
        })
    },{
        abortEarly: false
    }),
    poitnsController.create)

export default routes