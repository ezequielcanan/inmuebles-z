import { Router } from "express"

export default class Z_Router {

  constructor() {

    this.router = Router()
    this.init()
  }

  getRouter = () => this.router

  init() { }

  get = (path, ...callbacks) => {
    this.router.get(path, this.generateCustomResponse, this.applyCallbacks(callbacks))
  }

  post = (path, ...callbacks) => {
    this.router.post(path, this.generateCustomResponse, this.applyCallbacks(callbacks))
  }

  applyCallbacks = callbacks => {
    return callbacks.map(callback => async (...params) => {
      try {
        await callback.apply(this, params)
      }
      catch (error) {
        console.log(error)
        params[1].status(500).send(error)
      }
    })
  }

  generateCustomResponse = (req, res, next) => {
    res.sendSuccess = payload => res.json({ status: 'success', payload })
    res.sendServerError = error => res.status(500).json({ status: 'error', error })
    res.sendUserError = error => res.status(400).json({ status: 'error', error })
    res.sendNoAuthenticatedError = (error = 'No auth') => res.status(401).json({ status: 'error', error })
    res.sendNoAuthorizadError = (error = 'No authorized') => res.status(403).json({ status: 'error', error })

    next()
  }
}