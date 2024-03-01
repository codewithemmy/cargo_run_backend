const mongoose = require("mongoose")
const { Admin } = require("../admin/admin.model")

class AdminRepository {
  static async create(body) {
    return await Admin.create({ ...body })
  }

  static async fetchAdmin(body) {
    const admin = await Admin.findOne({ ...body }).lean()
    return admin
  }

  static async updateAdminDetails(id, params) {
    return Admin.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { ...params }
    )
  }

  static async findSingleAdminWithParams(adminPayload, select) {
    return Admin.findOne({ ...adminPayload }).select(select)
  }

  static async validateAdmin(userPayload) {
    return Admin.exists({ ...userPayload })
  }

  static async findAdminParams(userPayload) {
    const { limit, skip, sort, ...restOfPayload } = userPayload
    const admin = await Admin.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return admin
  }
}

module.exports = { AdminRepository }
