const orderRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")

orderRoute.use(isAuthenticated)

const {
  createOrderController,
  orderRatingController,
  fetchOrderController,
  updateOrderController,
  orderAnalysisController,
  orderDashboardController,
} = require("./order.controller")

orderRoute.route("/").post(createOrderController)
orderRoute.route("/rating/:id").patch(orderRatingController)
orderRoute.route("/").get(fetchOrderController)
orderRoute.route("/:id").patch(updateOrderController)
orderRoute.route("/analysis").get(orderAnalysisController)
orderRoute.route("/dashboard/analysis").get(orderDashboardController)

module.exports = orderRoute
