const mongoose = require("mongoose")
const {
  hashPassword,
  tokenHandler,
  verifyPassword,
  queryConstructor,
  sanitizePhoneNumber,
  generateOtp,
  AlphaNumeric,
} = require("../../utils")
const createHash = require("../../utils/createHash")
const { UserSuccess, UserFailure } = require("./user.messages")
const { UserRepository } = require("./user.repository")

const { LIMIT, SKIP, SORT } = require("../../constants")
const { sendMailNotification } = require("../../utils/email")

class UserService {
  static async createUserService(payload) {
    const { body } = payload
    const { phone, fullName } = body

    const userExist = await UserRepository.validateUser({
      phone,
    })

    if (userExist) return { success: false, msg: UserFailure.EXIST }

    // const otp = AlphaNumeric(6, "number")

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

  static async updateProfileService(id, payload) {
    const { body, image } = payload

    delete body.email

    const userprofile = await UserRepository.updateUserById(id, {
      profileImage: image,
      ...body,
    })

    if (!userprofile) return { success: false, msg: UserFailure.UPDATE }

    return {
      success: true,
      msg: UserSuccess.UPDATE,
    }
  }
}
module.exports = { UserService }
