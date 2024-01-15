import { Router } from "express"
import jwt from "jsonwebtoken"
import { jwtSign } from "../utils.js"

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

  put = (path, ...callbacks) => {
    this.router.put(path, this.generateCustomResponse, this.applyCallbacks(callbacks))
  }

  delete = (path, ...callbacks) => {
    this.router.delete(path, this.generateCustomResponse, this.applyCallbacks(callbacks))
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

  handlePolicies = policies => (req, res, next) => {
    if (policies.length > 0) {
      const token = req.cookies.jwt
      if (!token) return res.sendNoAuthenticatedError('No token')
      const user = jwt.verify(token, jwtSign)

      if (!policies.includes(user.role.toUpperCase())) {
        return res.sendNoAuthorizedError()
      }

      req.user = user
      return next()
    }

    return res.sendNoAuthenticatedError('This resource is private ')
  }

  generateCustomResponse = (req, res, next) => {
    res.sendSuccess = payload => res.json({ status: 'success', payload })
    res.sendServerError = error => res.status(500).json({ status: 'error', error })
    res.sendUserError = error => res.status(400).json({ status: 'error', error })
    res.sendNoAuthenticatedError = (error = 'No auth') => res.status(401).json({ status: 'error', error })
    res.sendNoAuthorizedError = (error = 'No authorized') => res.status(403).json({ status: 'error', error })

    next()
  }
}