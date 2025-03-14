import register, {
  httpRequestCounter,
  httpRequestDuration,
} from '@shared/monitoring/Prometheus'
import { NextFunction, Request, Response } from 'express'

export function prometheusMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = process.hrtime()

  res.on('finish', () => {
    const duration = process.hrtime(start)
    const responseTimeInSeconds = duration[0] + duration[1] / 1e9

    httpRequestDuration
      .labels(
        req.method,
        req.route?.path || req.path,
        res.statusCode.toString()
      )
      .observe(responseTimeInSeconds)

    httpRequestCounter
      .labels(
        req.method,
        req.route?.path || req.path,
        res.statusCode.toString()
      )
      .inc()
  })

  next()
}

export function metricsEndpoint(req: Request, res: Response) {
  res.set('Content-Type', 'text/plain')
  register.metrics().then((data) => res.send(data))
}
