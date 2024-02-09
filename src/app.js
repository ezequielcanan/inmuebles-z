import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import ProjectsRouter from "./routes/projects.router.js"
import FloorRouter from "./routes/floor.router.js"
import ApartmentRouter from "./routes/apartments.router.js"
import RentRouter from "./routes/rent.router.js"
import OwnerRouter from "./routes/owner.router.js"
import TenantRouter from "./routes/tenant.router.js"
import TransactionRouter from "./routes/transaction.router.js"
import QuotaRouter from "./routes/quotas.router.js"
import SessionRouter from "./routes/session.router.js"
import UserRouter from "./routes/users.router.js"
import SupplierRouter from "./routes/supplier.router.js"
import BudgetRouter from "./routes/budget.router.js"
import AccountRouter from "./routes/account.router.js"
import PaymentRouter from "./routes/payment.router.js"
import WhitePaymentRouter from "./routes/whitePayment.router.js"
import BlackPaymentRouter from "./routes/blackPayment.router.js"
import BillRouter from "./routes/bill.router.js"
import CheckRouter from "./routes/check.router.js"
import TransferRouter from "./routes/transfer.router.js"
import cors from "cors"
import __dirname from "./utils.js"
import initializePassport from "./config/passport.config.js"
import passport from "passport"
import { Server as SocketServer } from "socket.io"
import { addLogger } from "./utils/logger.js"

dotenv.config() // .env config
const app = express()

app.use(addLogger)
// POST AND COOKIES
app.use(cors({ credentials: true, origin: true }))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use("/static", express.static(__dirname + "/public"))

const projectsRouter = new ProjectsRouter()
const floorRouter = new FloorRouter()
const apartmentRouter = new ApartmentRouter()
const tenantRouter = new TenantRouter()
const rentRouter = new RentRouter()
const ownerRouter = new OwnerRouter()
const transactionRouter = new TransactionRouter()
const quotaRouter = new QuotaRouter()
const sessionRouter = new SessionRouter()
const userRouter = new UserRouter()
const supplierRouter = new SupplierRouter()
const bugdetRouter = new BudgetRouter()
const accountRouter = new AccountRouter()
const paymentRouter = new PaymentRouter()
const whitePaymentRouter = new WhitePaymentRouter()
const blackPaymentRouter = new BlackPaymentRouter()
const billRouter = new BillRouter()
const checkRouter = new CheckRouter()
const transferRouter = new TransferRouter()

initializePassport()
app.use(passport.initialize())

app.use("/api/projects", projectsRouter.getRouter())
app.use("/api/floor", floorRouter.getRouter())
app.use("/api/apartments", apartmentRouter.getRouter())
app.use("/api/tenant", tenantRouter.getRouter())
app.use("/api/rent", rentRouter.getRouter())
app.use("/api/owner", ownerRouter.getRouter())
app.use("/api/transaction", transactionRouter.getRouter())
app.use("/api/quota", quotaRouter.getRouter())
app.use("/api/session", sessionRouter.getRouter())
app.use("/api/user", userRouter.getRouter())
app.use("/api/supplier", supplierRouter.getRouter())
app.use("/api/budget", bugdetRouter.getRouter())
app.use("/api/account", accountRouter.getRouter())
app.use("/api/payment", paymentRouter.getRouter())
app.use("/api/bill", billRouter.getRouter())
app.use("/api/white-payment", whitePaymentRouter.getRouter())
app.use("/api/black-payment", blackPaymentRouter.getRouter())
app.use("/api/check", checkRouter.getRouter())
app.use("/api/transfer", transferRouter.getRouter())

// MONGO CONNECTION AND RUNNING SERVER
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB })
  .then(() => {
    const httpServer = app.listen(process.env.PORT, () => console.log("Running on port " + process.env.PORT))
    const io = new SocketServer(httpServer)
  })
  .catch(e => console.error(e))


