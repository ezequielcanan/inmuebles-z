import { newMessage } from "../controllers/message.controller.js"
import Z_Router from "./router.js"

export default class MessageRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN", "EXECUTIVE", "BANK", "SECRETARY"], newMessage)
  }
}