const mongoose = require("mongoose")
const {
  hashPassword,
  tokenHandler,
  verifyPassword,
  queryConstructor,
} = require("../../utils")

const { UserSuccess, UserFailure } = require("./user.messages")
const { UserRepository } = require("./user.repository")
const {
  SocketRepository,
} = require("../../files/messages/sockets/sockets.repository")
const { OrderRepository } = require("../order/order.repository")

const { LIMIT, SKIP, SORT } = require("../../constants")
const { sendMailNotification } = require("../../utils/email")

class UserService {
  static async createUserService(body) {
    const { phone, fullName } = body

    const userExist = await UserRepository.validateUser({
      phone,
    })

    if (userExist) return { success: false, msg: UserFailure.PHONE }

    const password = await hashPassword(body.password)

    const user = await UserRepository.create({
      phone,
      password,
      fullName,
    })

    if (!user._id) return { success: false, msg: UserFailure.CREATE }
    let token

    user.password = undefined

    token = await tokenHandler({
      _id: user._id,
    })

    return {
      success: true,
      msg: UserSuccess.CREATE,
      token,
    }
  }

  static async userLoginService(payload) {
    const { email, password } = payload

    //return result
    const userProfile = await UserRepository.findSingleUserWithParams({
      email: email,
    })

    if (!userProfile) return { success: false, msg: UserFailure.EMAIL_EXIST }

    if (!userProfile.isVerified)
      return { success: false, msg: UserFailure.VERIFIED }

    const isPassword = await verifyPassword(password, userProfile.password)

    if (!isPassword) return { success: false, msg: UserFailure.PASSWORD }

    let token

    userProfile.password = undefined

    token = await tokenHandler({
      _id: userProfile._id,
      fullName: userProfile.fullName,
      email: userProfile.email,
      phone: userProfile.phone,
      userType: "User",
    })

    const user = {
      _id: userProfile._id,
      fullName: userProfile.fullName,
      email: userProfile.email,
      phone: userProfile.phone,
      ...token,
    }

    //return result
    return {
      success: true,
      msg: UserSuccess.FETCH,
      data: user,
    }
  }

  static async updateProfileService(id, body) {
    delete body.email

    const userprofile = await UserRepository.updateUserById(id, {
      ...body,
    })

    if (!userprofile) return { success: false, msg: UserFailure.UPDATE }

    return {
      success: true,
      msg: UserSuccess.UPDATE,
    }
  }

  static async getRiderRoute({ body, io, locals }) {
    const { lat, lng, orderId } = body

    const [order] = await Promise.all([
      await OrderRepository.findSingleOrderByParams({
        _id: new mongoose.Types.ObjectId(orderId),
        paymentStatus: "paid",
      }),
    ])

    if (!order) return { success: true, msg: `Order not found`, data: [] }

    const socketDetails = await SocketRepository.findSingleSocket({
      userId: new mongoose.Types.ObjectId(locals),
    })
    console.log({ lng, lat })
    if (socketDetails)
      io.to(socketDetails.socketId).emit("private-message", { lng, lat })

    return { success: true, msg: UserSuccess.LOCATION }
  }
}
module.exports = { UserService }
