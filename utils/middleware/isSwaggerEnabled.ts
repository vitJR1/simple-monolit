import { type Request, type Response, type NextFunction } from 'express'

export = (_req: Request, res: Response, next: NextFunction) => {
  if (process.env.SWAGGER_ENABLED) {
    next()
  } else {
    res.status(404).end()
  }
}
