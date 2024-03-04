import messageModel from "./models/message.model.js"

export default io => {
  io.on("connection", socket => {
    socket.once("connectEvt", async (user) => {
      const uid = user._id
      socket.join(uid)

      const sendMessages = async (receiver) => {
        const userMessages = await messageModel.find({ to: receiver || uid }).lean().exec()
        !receiver ? socket.emit("messages", userMessages) : io.to(receiver).emit("messages", userMessages)
      }

      sendMessages()

      socket.on("sendMessage", async ({ message, receiver }) => {
        const result = await messageModel.create(message)
        io.to(receiver).emit("newMessage", result)
        sendMessages(receiver)
      })
    })
  })
}