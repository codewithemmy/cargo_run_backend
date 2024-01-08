const mongoose = require("mongoose")
const { OrderRepository } = require("./order.repository")
const {
  queryConstructor,
  AlphaNumeric,
  generateOtp,
} = require("../../utils/index")
const { orderMessage } = require("./order.messages")

class OrderService {
  static async createOrderService(payload, params) {
    const orderExist = await OrderRepository.findSingleOrderExist({
      userId: new mongoose.Types.ObjectId(params),
    })

    if (orderExist) return { success: false, msg: orderMessage.ORDER_EXIST }

    const { otp } = generateOtp()
    const trackingId = AlphaNumeric(9)

    const order = await OrderRepository.createOrder({
      userId: new mongoose.Types.ObjectId(params),
      orderId: otp,
      trackingId,
      ...payload,
    })

    if (!order) return { success: false, msg: orderMessage.ORDER_ERROR }

    return { success: true, msg: orderMessage.ORDER_CREATED }
  }

  static async fetchOrder(query) {
    const { error, params, limit, skip, sort } = queryConstructor(
      query,
      "createdAt",
      "Order"
    )

    if (error) return { success: false, msg: error }

    const order = await OrderRepository.fetchNotificationsByParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (!order)
      return {
        success: true,
        msg: orderMessage.ORDER_NOT_FOUND,
        data: [],
      }

    return {
      success: true,
      msg: orderMessage.ORDER_FETCHED,
      data: order,
    }
  }

  static async updateOrderService(payload, params) {
    const findOrder = await OrderRepository.findSingleOrderByParams({
      _id: new mongoose.Types.ObjectId(params),
    })

    if (!findOrder) return { success: false, msg: orderMessage.ORDER_NOT_FOUND }

    const order = await OrderRepository.updateOrderDetails(
      { _id: new mongoose.Types.ObjectId(params) },
      { ...payload }
    )

    if (!order) return { success: false, msg: orderMessage.UPDATE_ERROR }

    return {
      success: true,
      msg: orderMessage.UPDATE,
    }
  }
}

module.exports = { OrderService }
