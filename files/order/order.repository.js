const { Order } = require("./order.model")

class OrderRepository {
  static async createOrder(payload) {
    return await Order.create(payload)
  }

  static async findSingleOrderByParams(payload) {
    return await Order.findOne({ ...payload })
  }
  static async findOrderBySocket(payload) {
    return await Order.find({ ...payload }).sort({ createdAt: -1 })
  }

  static async findSingleOrderExist(payload) {
    return await Order.exists({ ...payload })
  }

  static async fetchOrderByParams(payload) {
    let { limit, skip, sort, ...restOfPayload } = payload

    const order = await Order.find({
      ...restOfPayload,
    })
      .populate({ path: "userId" })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return order
  }

  static async updateOrderDetails(params, payload) {
    return await Order.findOneAndUpdate(
      { ...params },
      { ...payload },
      { new: true, runValidators: true }
    )
  }

  static async fetchOrderWithoutParams(payload) {
    return await Order.find({ ...payload }).sort({ createdAt: -1 })
  }

  static async orderYearlyAnalysis(payload) {
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1)

    const order = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
          // status: { $in: ["completed", "pending", "ongoing", "cancelled"] }, // Filter by "completed" and "pending" statuses
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: { month: "$month" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.month": 1 }, // Sort by month
      },
    ])

    return order
  }
}

module.exports = { OrderRepository }
