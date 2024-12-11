import moment from "moment"
import incomingChecksModel from "../models/incomingChecks.model.js"
import mongoose, { Types } from "mongoose"


class IncomingChecksService {
  constructor() { }

  createCheck = async (check) => incomingChecksModel.create(check)

}

export default IncomingChecksService