import messageModel from "./models/message.model.js"

export default io => {
  io.on("connection", socket => {
    socket.once("connectEvt", async (user) => {
      const uid = user._id
      socket.join(uid)

      socket.on("getMessages", async () => {
        const userMessages = await messageModel.find({ to: uid }).lean().exec()
        socket.emit("messages", userMessages)
      })

      socket.on("sendMessage", async ({ message, receiver }) => {
        const result = await messageModel.create(message)
        io.to(receiver).emit("newMessage", result)
      })
    })
  })
}