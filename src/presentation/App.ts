import { container } from '@di/container'
import { tokens } from '@di/tokens'
import { RabbitMQBroker } from '@infra/broker/RabbitMQBroker'
import { RabbitMQConsumer } from '@infra/broker/RabbitMQConsumer'
import { setupSwagger } from '@shared/docs/swagger'
import logger from '@shared/logging/Logger'
import bodyParser from 'body-parser'
import cors from 'cors'
import * as dotenv from 'dotenv'
import express, { Router } from 'express'
import 'reflect-metadata'
import { Routes } from './http/Routes'
import { apiRateLimiter } from './http/middleware/ApiRateLimiter'
import {
  metricsEndpoint,
  prometheusMiddleware,
} from './http/middleware/PrometheusMiddleware'

dotenv.config()

const router = Router()
const routes = container.resolve<Routes>(tokens.Routes)
container.resolve<RabbitMQConsumer>(tokens.RabbitMQConsumer)
routes.setupRouter(router)

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(apiRateLimiter)

app.use(prometheusMiddleware)
app.get('/metrics', metricsEndpoint)

app.use(router)

setupSwagger(app)

const rabbitMQConsumer = container.resolve<RabbitMQConsumer>(
  tokens.RabbitMQConsumer
)

const rabbitMQBroker = container.resolve<RabbitMQBroker>(tokens.MessageBroker)

rabbitMQBroker.connect().then(() => {
  logger.info({ message: '✅ RabbitMQ Broker conectado com sucesso.' })
})

rabbitMQConsumer.start().then(() => {
  logger.info({ message: '✅ RabbitMQ Consumer iniciado com sucesso.' })
})

export default app
