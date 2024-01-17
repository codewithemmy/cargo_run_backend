const orderRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")

orderRoute.use(isAuthenticated)

const {
  createOrderController,
  orderRatingController,
  getOrderRouteController,
} = require("./order.controller")

orderRoute.route("/").post(createOrderController)
orderRoute.route("/rating/:id").patch(orderRatingController)
orderRoute.route("/route").get(getOrderRouteController)

module.exports = orderRoute
