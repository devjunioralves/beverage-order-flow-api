import { Router } from 'express'

import BaseController from '@shared/http/controller/BaseController'
import BaseRouter from '@shared/http/controller/BaseRouter'

import { tokens } from '@di/tokens'
import { inject, injectable } from 'tsyringe'

import { IRouter } from './IRouter'

@injectable()
export class ResaleRouter extends BaseRouter implements IRouter {
  constructor(
    @inject(tokens.ResaleCreateController)
    private resaleCreateController: BaseController
  ) {
    super(Router())
  }

  setup(): Router {
    this.post('/v1/resale', this.resaleCreateController)
    return this.getRouter()
  }
}
