const { responseHandler } = require("../../core/response")
const { manageAsyncOps } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { OrderService } = require("./order.service")

const createOrderController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    OrderService.createOrderService(req.body, res.locals.jwt._id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const fetchOrderController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(OrderService.fetchOrder(req.body))

  if (error) return next(error)

  if (!data.SUCCESS) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const orderRatingController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    OrderService.ratingOrderService(req.body, req.params.id, res.locals.jwt._id)
  )

  if (error) return next(error)

  if (!data.SUCCESS) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

module.exports = {
  createOrderController,
  fetchOrderController,
  orderRatingController,
}
