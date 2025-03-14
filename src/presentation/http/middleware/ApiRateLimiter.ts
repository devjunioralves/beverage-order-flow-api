import rateLimit from 'express-rate-limit'

export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
})
