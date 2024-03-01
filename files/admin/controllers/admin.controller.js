// const { BAD_REQUEST, SUCCESS } = require("../../../constants/statusCode")
// const { responseHandler } = require("../../../core/response")
// const { manageAsyncOps, fileModifier } = require("../../../utils")
// const { CustomError } = require("../../../utils/errors")
// const { ProfileService } = require("../services/admin.service")

// const updateAdminController = async (req, res, next) => {
//   const [error, data] = await manageAsyncOps(
//     ProfileService.updateAdminService(req)
//   )
//   if (error) return next(error)

//   if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

//   return responseHandler(res, 200, data)
// }

// const passwordChangeController = async (req, res, next) => {
//   const [error, data] = await manageAsyncOps(
//     ProfileService.changeAdminPassword(req.body)
//   )
//   if (error) return next(error)

//   if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

//   return responseHandler(res, SUCCESS, data)
// }

// const softDeleteAdminController = async (req, res, next) => {
//   const [error, data] = await manageAsyncOps(
//     ProfileService.softDeleteAdmin(req.body)
//   )

//   if (error) return next(error)

//   if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

//   return responseHandler(res, SUCCESS, data)
// }

// const imageUpload = async (req, res, next) => {
//   let value = await fileModifier(req)
//   const [error, data] = await manageAsyncOps(
//     ProfileService.uploadImageService(value, res.locals.jwt)
//   )
//   if (error) return next(error)

//   if (!data.success) return next(new CustomError(data.msg, 400, data))

//   return responseHandler(res, 200, data)
// }

// const setTransactionPinController = async (req, res, next) => {
//   const { _id } = req.payload
//   if (_id.toString() !== req.body.adminId)
//     return next(new CustomError("Unauthorized to access resource", 401, {}))

//   const [error, data] = await manageAsyncOps(
//     ProfileService.setTransactionPinService(req.body, res.locals.jwt)
//   )

//   if (error) return next(error)

//   if (!data?.success) return next(new CustomError(data.msg, 400, data))

//   return responseHandler(res, 200, data)
// }

// const disburseToggleController = async (req, res, next) => {
//   const [error, data] = await manageAsyncOps(
//     ProfileService.disburseToggle(req.body)
//   )

//   if (error) return next(error)

//   if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

//   return responseHandler(res, 200, data)
// }

// module.exports = {
//   updateAdminController,
//   passwordChangeController,
//   softDeleteAdminController,
//   imageUpload,
//   setTransactionPinController,
//   disburseToggleController,
// }
