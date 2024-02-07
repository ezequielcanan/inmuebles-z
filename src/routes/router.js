import { Router } from "express"
import { jwtSign } from "../utils.js"
import UserService from "../services/user.service.js"
import jwt from "jsonwebtoken"

const userService = new UserService()
export default class Z_Router {

  constructor() {

    this.router = Router()
    this.init()
  }

  getRouter = () => this.router

  init() { }

  get = (path, policies, ...callbacks) => {
    this.router.get(path, this.generateCustomResponse, this.handlePolicies(policies), this.applyCallbacks(callbacks))
  }

  post = (path, policies, ...callbacks) => {
    this.router.post(path, this.generateCustomResponse, this.handlePolicies(policies), this.applyCallbacks(callbacks))
  }

  put = (path, policies, ...callbacks) => {
    this.router.put(path, this.generateCustomResponse, this.handlePolicies(policies), this.applyCallbacks(callbacks))
  }

  delete = (path, policies, ...callbacks) => {
    this.router.delete(path, this.generateCustomResponse, this.handlePolicies(policies), this.applyCallbacks(callbacks))
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

  handlePolicies = policies => async (req, res, next) => {
    if (policies.length > 0 && policies.length < 4) {
      const token = req.cookies.jwt
      if (!token) return res.sendNoAuthenticatedError('No token')
      const { user: jwtUser } = jwt.verify(token, jwtSign, {ignoreExpiration: true})
      const user = await userService.getUserById(jwtUser._id)

      if (!policies.includes(user.role.toUpperCase())) {
        return res.sendNoAuthorizedError()
      }

      req.user = user
      return next()
    }

    return next()
  }

  generateCustomResponse = (req, res, next) => {
    res.sendSuccess = payload => res.json({ status: 'success', payload })
    res.sendServerError = error => res.status(500).json({ status: 'error', error })
    res.sendUserError = error => res.status(400).json({ status: 'error', error })
    res.sendNoAuthenticatedError = (error = 'No auth') => res.status(401).json({ status: 'error', error })
    res.sendNoAuthorizedError = (error = 'No authorized') => res.status(403).json({ status: 'error', error })
    res.sendNotFoundError = (error = 'Not found') => res.status(404).json({ status: 'error', error })

    next()
  }
}