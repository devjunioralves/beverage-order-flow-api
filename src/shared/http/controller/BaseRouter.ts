import { Router } from 'express'
import { controllerAdapter } from '../adapters/controllerAdapter'
import BaseController from './BaseController'

export default class BaseRouter {
  private router: Router

  constructor(router: Router) {
    this.router = router
  }

  post(path: string, handler: BaseController) {
    this.router.post(path, controllerAdapter(handler))
  }

  get(path: string, handler: BaseController) {
    this.router.get(path, controllerAdapter(handler))
  }

  patch(path: string, handler: BaseController) {
    this.router.patch(path, controllerAdapter(handler))
  }

  put(path: string, handler: BaseController) {
    this.router.put(path, controllerAdapter(handler))
  }

  delete(path: string, handler: BaseController) {
    this.router.delete(path, controllerAdapter(handler))
  }

  getRouter() {
    return this.router
  }
}
