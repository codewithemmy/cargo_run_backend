const mongoose = require("mongoose")
const { verifyPassword, hashPassword } = require("../../../utils")
const { adminMessages } = require("../admin.messages")
const { AdminRepository } = require("../admin.repository")

class ProfileService {
  static async updateAdminService(data, params) {
    const { body, image } = data
    if (body.password) delete body.password

    const admin = await AdminRepository.updateAdminDetails(params, {
      ...body,
      image,
    })
    if (!admin) return { success: false, msg: adminMessages.UPDATE_ERROR }

    return {
      success: true,
      msg: adminMessages.UPDATE_SUCCESS,
    }
  }

  //   static async changeAdminPassword(body) {
  //     const { oldPassword, confirmPassword, newPassword } = body

  //     if (!oldPassword || !confirmPassword || !newPassword)
  //       return { success: false, msg: ProfileFailure.REQUIRED_FIELDS }

  //     const user = await AdminRepository.findSingleAdminWithParams({
  //       _id: new mongoose.Types.ObjectId(body.id),
  //     })

  //     if (!user) return { success: false, msg: ProfileFailure.NO_USER_FOUND }

  //     //verify password
  //     const passwordMatch = await verifyPassword(oldPassword, user.password)
  //     if (!passwordMatch) return { success: false, msg: ProfileFailure.PASSWORD }

  //     if (newPassword !== confirmPassword)
  //       return { success: false, msg: ProfileFailure.PASSWORD_MISMATCHED }

  //     let password = await hashPassword(body.newPassword)

  //     const changePassword = await AdminRepository.updateAdminDetails(body.id, {
  //       password,
  //     })

  //     if (!changePassword) return { success: false, msg: ProfileFailure.PASSWORD }

  //     return {
  //       success: true,
  //       msg: ProfileSuccess.PASSWORD,
  //     }
  //   }  }
}

module.exports = { ProfileService }
