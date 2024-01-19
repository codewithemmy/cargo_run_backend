const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps, fileModifier } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { UserService } = require("./user.service")

const createUserController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    UserService.createUserService(req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const userLoginController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    UserService.userLoginService(req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const userUpdateController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    UserService.updateProfileService(res.locals.jwt._id, req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  createUserController,
  userLoginController,
  userUpdateController,
}
