import { Router } from 'express'

export interface IRouter {
  setup(): Router
}
