const transactionRoute = require("express").Router()

const { isAuthenticated } = require("../../utils")
const {
  paymentTransactionController,
} = require("./controller/transaction.controller")

transactionRoute.use(isAuthenticated)

transactionRoute.post("/initiate", paymentTransactionController)

//routes
module.exports = transactionRoute
