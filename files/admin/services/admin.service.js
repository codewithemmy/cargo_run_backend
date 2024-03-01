// const mongoose = require("mongoose")
// const { verifyPassword, hashPassword } = require("../../../utils")
// const {
//   ProfileFailure,
//   ProfileSuccess,
//   adminMessages,
// } = require("../admin.messages")
// const { AdminRepository } = require("../admin.repository")
// const { UserRepository } = require("../../user/user.repository")

// class ProfileService {
//   static async updateAdminService(data) {
//     const { body, params } = data
//     if (body.password) delete body.password

//     const user = await AdminRepository.updateAdminDetails(params.id, body)
//     if (!user) return { success: false, msg: ProfileFailure.UPDATE }

//     return {
//       success: true,
//       msg: ProfileSuccess.UPDATE,
//     }
//   }

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
//   }

//   static async softDeleteAdmin(body) {
//     const { id } = body

//     const user = await AdminRepository.findSingleAdminWithParams({
//       _id: new mongoose.Types.ObjectId(body.id),
//     })

//     if (!user) return { success: false, msg: ProfileFailure.NO_USER_FOUND }

//     const softDeleteUser = await AdminRepository.updateAdminDetails(id, {
//       isDeleted: true,
//     })

//     if (!softDeleteUser) return { success: false, msg: ProfileFailure.DELETE }

//     return {
//       success: true,
//       msg: ProfileSuccess.DELETE,
//     }
//   }

//   static async uploadImageService(data, payload) {
//     const { image } = data

//     const updateImage = await AdminRepository.updateAdminDetails(payload._id, {
//       image,
//     })

//     if (!updateImage) return { success: false, msg: ProfileFailure.UPDATE }

//     return {
//       success: true,
//       msg: ProfileSuccess.UPDATE,
//     }
//   }

//   static async setTransactionPinService(body) {
//     let transactionPin = await hashPassword(body.transactionPin)
//     const setPin = await AdminRepository.updateAdminDetails(body.adminId, {
//       transactionPin,
//     })

//     if (!setPin) return { success: false, msg: ProfileFailure.TRANSACTION_PIN }

//     return {
//       success: true,
//       msg: ProfileSuccess.TRANSACTION_PIN,
//     }
//   }

//   static async disburseToggle({ canDisburseFunds, userId, userType }) {
//     let response
//     switch (userType) {
//       case "staff":
//         response = await UserRepository.updateUserProfile(
//           {
//             _id: new mongoose.Types.ObjectId(userId),
//           },
//           {
//             $set: { canDisburseFunds },
//           }
//         )
//         break
//       case "admin":
//         response = await AdminRepository.updateAdminDetails(userId, {
//           canDisburseFunds,
//         })
//         break

//       default:
//         return { success: false, msg: adminMessages.MISSING_INPUT }
//     }

//     if (!response) return { success: false, msg: ProfileFailure.UPDATE }

//     return { success: true, msg: ProfileSuccess.UPDATE }
//   }
// }

// module.exports = { ProfileService }
