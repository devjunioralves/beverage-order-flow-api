import { tokens } from '@di/tokens'
import { Routes } from '@presentation/http/Routes'
import { container } from 'tsyringe'

const childContainer = container.createChildContainer()

childContainer.registerSingleton(tokens.Routes, Routes)

import ResaleAppService from '@application/resale/ResaleAppService'
import ResaleService from '@domain/resale/services/ResaleService'
import { ResaleRepository } from '@infra/resale/ResaleRepository'
import ResaleCreateController from '@presentation/http/controllers/resale/ResaleCreateController'
import { ResaleRouter } from '@presentation/http/routes/ResaleRouter'

childContainer.registerSingleton(tokens.ResaleRouter, ResaleRouter)
childContainer.registerSingleton(
  tokens.ResaleCreateController,
  ResaleCreateController
)

childContainer.registerSingleton(tokens.ResaleAppService, ResaleAppService)
childContainer.registerSingleton(tokens.ResaleService, ResaleService)
childContainer.registerSingleton(tokens.ResaleRepository, ResaleRepository)

import OrderAppService from '@application/order/OrderAppService'
import OrderService from '@domain/order/services/OrderService'
import SendOrderToDistributorService from '@domain/order/services/SendOrderToDistributorService'
import { RabbitMQBroker } from '@infra/broker/RabbitMQBroker'
import { RabbitMQConsumer } from '@infra/broker/RabbitMQConsumer'
import { DistributorRepository } from '@infra/order/DistributorRepository'
import { OrderRepository } from '@infra/order/OrderRepository'
import OrderCreateController from '@presentation/http/controllers/order/OrderCreateController'
import { OrderRouter } from '@presentation/http/routes/OrderRouter'

childContainer.registerSingleton(tokens.OrderRouter, OrderRouter)
childContainer.registerSingleton(
  tokens.OrderCreateController,
  OrderCreateController
)

childContainer.registerSingleton(tokens.OrderAppService, OrderAppService)
childContainer.registerSingleton(tokens.OrderService, OrderService)
childContainer.registerSingleton(tokens.OrderRepository, OrderRepository)

childContainer.registerSingleton(tokens.MessageBroker, RabbitMQBroker)

childContainer.registerSingleton(
  tokens.SendOrderToDistributorService,
  SendOrderToDistributorService
)

childContainer.registerSingleton(tokens.RabbitMQConsumer, RabbitMQConsumer)

childContainer.registerSingleton(
  tokens.DistributorRepository,
  DistributorRepository
)

export { childContainer as container }
