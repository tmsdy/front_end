import { Router } from 'express'
import topicDetail from './detail/controller'
import topicSquare from './square/controller'
const router = new Router()

export default function (app) {
    app.use('/topicpk',router);
    topicDetail(router);
    topicSquare(router);
}