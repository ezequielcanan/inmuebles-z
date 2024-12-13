import moment from "moment"
import incomingChecksModel from "../models/incomingChecks.model.js"
import mongoose, { Types } from "mongoose"


class IncomingChecksService {
  constructor() { }

  createCheck = async (check) => incomingChecksModel.create(check)
  getProjectChecks = async (pid) => incomingChecksModel.find({ project: pid })
  getIncomingCheck = async (cid) => incomingChecksModel.findOne({ _id: cid })
  updateIncomingCheck = async (cid, property, value, action = "$set") => incomingChecksModel.findOneAndUpdate({ _id: cid }, { [action]: { [property]: value || "" } }, { new: true })
  updateAllIncomingCheck = async (cid, check) => incomingChecksModel.findOneAndUpdate({ _id: cid }, { $set: check }, { new: true })
  insertNewTransfer = async (cid, transfer) => incomingChecksModel.findOneAndUpdate({ _id: cid }, { $push: { transfers: transfer } }, { new: true })
  deleteTransfer = async (cid, tid) => incomingChecksModel.findOneAndUpdate({ _id: cid }, { $pull: { transfers: { _id: tid } } }, { new: true })
}

export default IncomingChecksService