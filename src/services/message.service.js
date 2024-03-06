import messageModel from "../models/message.model.js"

class MessageService {
  constructor() { }

  createMessage = async (message) => messageModel.create(message)

}

export default MessageService