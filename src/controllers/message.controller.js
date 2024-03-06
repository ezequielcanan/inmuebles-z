import MessageService from "../services/message.service.js"

const messageService = new MessageService()
export const newMessage = async (req,res) => {
  try {
    const result = await messageService.createMessage(req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}