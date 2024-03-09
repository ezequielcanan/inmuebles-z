import { newMessage, getUserMessages } from "../controllers/message.controller.js"
import Z_Router from "./router.js"

export default class MessageRouter extends Z_Router {
  init() {
    this.get("/:uid", ["ADMIN", "EXECUTIVE", "BANK", "SECRETARY"], getUserMessages)
    this.post("/", ["ADMIN", "EXECUTIVE", "BANK", "SECRETARY"], newMessage)
  }
}