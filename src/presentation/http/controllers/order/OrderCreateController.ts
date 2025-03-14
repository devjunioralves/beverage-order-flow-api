import OrderAppService from '@application/order/OrderAppService'
import { tokens } from '@di/tokens'
import { IRequest } from '@presentation/http/types/IRequest'
import { BaseError } from '@shared/exceptions/BaseError'
import BaseController from '@shared/http/controller/BaseController'
import logger from '@shared/logging/Logger'
import { orderSchema } from '@shared/validators/orderSchema'
import { inject, injectable } from 'tsyringe'

@injectable()
export default class OrderCreateController extends BaseController {
  constructor(
    @inject(tokens.OrderAppService)
    private orderAppService: OrderAppService
  ) {
    super()
  }

  public async execute(request: IRequest) {
    const requestId = Math.random().toString(36).substr(2, 9)
    const startTime = Date.now()

    logger.info({
      requestId,
      message: 'Received request to create order',
      body: request.body,
      timestamp: new Date().toISOString(),
    })

    try {
      const { error, value } = orderSchema.validate(request.body)

      if (error) {
        logger.warn({
          requestId,
          message: 'Validation failed for order creation',
          error: error.details[0].message,
          timestamp: new Date().toISOString(),
        })

        throw new BaseError({
          message: error.details[0].message,
          name: 'ValidationError',
          statusCode: 400,
        })
      }

      const result = await this.orderAppService.create(value)

      logger.info({
        requestId,
        message: 'Order successfully created',
        orderId: result.id,
        executionTimeMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      })

      return this.send(result)
    } catch (err) {
      logger.error({
        requestId,
        message: 'Error occurred while creating order',
        error: (err as BaseError).message,
        statusCode: (err as BaseError).statusCode,
        timestamp: new Date().toISOString(),
      })

      return this.error(err as BaseError)
    }
  }
}
