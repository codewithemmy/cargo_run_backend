const orderRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")

orderRoute.use(isAuthenticated)

const { createOrderController } = require("./order.controller")

orderRoute.route("/").post(createOrderController)

module.exports = orderRoute
