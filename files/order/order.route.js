const orderRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")

orderRoute.use(isAuthenticated)

const {
  createOrderController,
  orderRatingController,
  getOrderRouteController,
  fetchOrderController,
  updateOrderController,
  addOrderController,
} = require("./order.controller")

orderRoute.route("/").post(createOrderController)
orderRoute.route("/rating/:id").patch(orderRatingController)
orderRoute.route("/route").get(getOrderRouteController)
orderRoute.route("/").get(fetchOrderController)
orderRoute.route("/:id").patch(updateOrderController)
orderRoute.route("/add").post(addOrderController)

module.exports = orderRoute
