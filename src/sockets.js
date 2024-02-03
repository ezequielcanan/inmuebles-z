import messageModel from "./models/message.model.js"

export default io => {
  io.on("connection", socket => {
    socket.on("connect", async (user) => {
      const uid = user._id
      socket.join(uid)

      const userMessages = await messageModel.find({_id: uid}).lean().exec()
      socket.emit("messages", userMessages)

      socket.on("sendMessage", async ({message, receiver}) => {
        const result = await messageModel.create(message)
        io.to(receiver._id).emit(result)
      })
    })
  })
}