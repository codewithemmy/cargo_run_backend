const mongoose = require("mongoose")
const { OrderRepository } = require("./order.repository")
const {
  queryConstructor,
  AlphaNumeric,
  generateOtp,
} = require("../../utils/index")
const { orderMessage } = require("./order.messages")
const { SocketRepository } = require("../messages/sockets/sockets.repository")

class OrderService {
  static async createOrderService(payload, params) {
    // const orderExist = await OrderRepository.findSingleOrderExist({
    //   userId: new mongoose.Types.ObjectId(params),
    // })

    // if (orderExist) return { success: false, msg: orderMessage.ORDER_EXIST }

    const { otp } = generateOtp()
    const trackingId = AlphaNumeric(9)

    const order = await OrderRepository.createOrder({
      userId: new mongoose.Types.ObjectId(params),
      orderId: otp,
      trackingId,
      ...payload,
    })

    if (!order) return { success: false, msg: orderMessage.ORDER_ERROR }

    return { success: true, msg: orderMessage.ORDER_CREATED, data: order }
  }

  static async fetchOrder(query) {
    const { error, params, limit, skip, sort } = queryConstructor(
      query,
      "createdAt",
      "Order"
    )

    if (error) return { success: false, msg: error }

    const order = await OrderRepository.fetchOrderByParams({
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

  static async updateOrderService(payload, params, jwtId) {
    const findOrder = await OrderRepository.findSingleOrderByParams({
      _id: new mongoose.Types.ObjectId(params),
    })

    if (!findOrder) return { success: false, msg: orderMessage.ORDER_NOT_FOUND }

    if (payload.status === "accepted") {
      payload.riderId = new mongoose.Types.ObjectId(jwtId)
    }

    const order = await OrderRepository.updateOrderDetails(
      { _id: new mongoose.Types.ObjectId(params), paymentStatus: "paid" },
      { ...payload }
    )

    if (!order)
      return {
        success: false,
        msg: `Payment Status for this order is currently not paid or does not exist`,
      }

    return {
      success: true,
      msg: orderMessage.UPDATE,
    }
  }

  static async ratingOrderService(payload, params) {
    const findOrder = await OrderRepository.findSingleOrderByParams({
      _id: new mongoose.Types.ObjectId(params),
    })

    if (!findOrder) return { success: false, msg: orderMessage.ORDER_NOT_FOUND }

    const order = await OrderRepository.updateOrderDetails(
      { _id: new mongoose.Types.ObjectId(params) },
      { $push: { ratings: { ...payload } } }
    )

    if (!order) return { success: false, msg: orderMessage.UPDATE_ERROR }

    return {
      success: true,
      msg: orderMessage.UPDATE,
    }
  }

  static async orderAnalysisService(params) {
    const order = await OrderRepository.fetchOrderByParams({
      riderId: new mongoose.Types.ObjectId(params),
    })

    if (!order)
      return {
        success: true,
        msg: `Rider does not have order currently`,
        data: [],
      }

    const totalEarning = order.reduce((total, item) => {
      return total + (item.amount || 0)
    }, 0)

    return {
      success: true,
      msg: orderMessage.ORDER_FETCHED,
      data: { totalEarning, totalOrder: order.length },
    }
  }

  static async orderDashboardService() {
    const analysis = await OrderRepository.orderYearlyAnalysis({})
    const order = await OrderRepository.fetchOrderWithoutParams()

    const pendingOrder = order.filter(
      (item) => item.status === "delivered"
    ).length

    const cancelledOrder = order.filter(
      (item) => item.status === "cancelled"
    ).length

    const deliveredOrder = order.filter(
      (item) => item.status === "delivered"
    ).length

    if (!order)
      return {
        success: true,
        msg: `Rider does not have order currently`,
        data: [],
      }

    return {
      success: true,
      msg: orderMessage.ORDER_FETCHED,
      data: {
        analysis,
        pendingOrder,
        deliveredOrder,
        cancelledOrder,
        totalOrder: order.length,
      },
      order,
    }
  }
}

module.exports = { OrderService }
