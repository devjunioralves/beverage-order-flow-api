export const tokens = {
  Routes: Symbol('Routes'),
  ResaleRouter: Symbol('ResaleRouter'),
  ResaleCreateController: Symbol('ResaleCreateController'),
  ResaleAppService: Symbol('ResaleAppService'),
  ResaleService: Symbol('ResaleService'),
  ResaleRepository: Symbol('ResaleRepository'),

  OrderCreateController: Symbol('OrderCreateController'),
  OrderAppService: Symbol('OrderAppService'),
  OrderService: Symbol('OrderService'),
  OrderRepository: Symbol('OrderRepository'),
  OrderRouter: Symbol('OrderRouter'),

  MessageBroker: Symbol('MessageBroker'),

  SendOrderToDistributorService: Symbol('SendOrderToDistributorService'),
  DistributorRepository: Symbol('DistributorRepository'),

  RabbitMQConsumer: Symbol('RabbitMQConsumer'),
}
