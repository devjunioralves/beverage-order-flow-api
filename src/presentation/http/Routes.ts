import { tokens } from '@di/tokens'
import { IRouter } from '@presentation/http/routes/IRouter'
import { Router } from 'express'
import { inject, injectable } from 'tsyringe'

@injectable()
export class Routes {
  constructor(
    @inject(tokens.ResaleRouter)
    private resaleRouter: IRouter,
    @inject(tokens.OrderRouter)
    private orderRouter: IRouter
  ) {}

  public setupRouter(router: Router) {
    router.use('/api', this.resaleRouter.setup())
    router.use('/api', this.orderRouter.setup())
  }
}
