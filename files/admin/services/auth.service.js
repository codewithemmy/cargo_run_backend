const { default: mongoose } = require("mongoose")
const { hashPassword, tokenHandler, verifyPassword } = require("../../../utils")
const { adminMessages } = require("../admin.messages")
const { AdminRepository } = require("../admin.repository")
const { sendMailNotification } = require("../../../utils/email")

class AdminAuthService {
  static async signup(payload) {
    const admin = await AdminRepository.fetchAdmin({
      email: payload.email,
      isDeleted: false,
    })
    if (admin) return { success: false, msg: adminMessages.ADMIN_EXISTS }

    const password = await hashPassword(payload.password)

    const signUp = await AdminRepository.create({ ...payload, password })
    if (!signUp._id)
      return { success: false, msg: adminMessages.ADMIN_NOT_CREATED }

    signUp.password = undefined

    try {
      const substitutional_parameters = {
        name: signUp.name,
      }
      await sendMailNotification(
        signUp.email,
        "Admin Account",
        substitutional_parameters,
        "ADMIN_CREATION",
        true
      )
    } catch (error) {
      console.log("error", error)
    }

    return { success: true, msg: adminMessages.ADMIN_CREATED }
  }

  static async login(payload) {
    const admin = await AdminRepository.fetchAdmin({
      email: payload.email,
      isDeleted: false,
    })
    if (!admin) {
      return {
        success: false,
        msg: adminMessages.LOGIN_ERROR,
      }
    }

    const passwordCheck = await verifyPassword(payload.password, admin.password)
    if (!passwordCheck) {
      return { success: false, msg: adminMessages.LOGIN_ERROR }
    }

    const { password, createdAt, updatedAt, __v, isDelete, ...restOfPayload } =
      admin

    const token = await tokenHandler({
      email: admin.email,
      _id: admin._id,
      isAdmin: true,
      ...restOfPayload,
    })

    return {
      success: true,
      msg: adminMessages.ADMIN_FOUND,
      data: { ...restOfPayload, ...token },
    }
  }
}

module.exports = { AdminAuthService }
