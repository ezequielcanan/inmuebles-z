import messageModel from "../models/message.model.js"

class MessageService {
  constructor() { }

  createMessage = async (message) => messageModel.create(message)
  getUserMessages = async (uid) => messageModel.find({ to: uid })

}

export default MessageService