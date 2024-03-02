const { responseHandler } = require("../../../core/response")
const { manageAsyncOps } = require("../../../utils")
const { CustomError } = require("../../../utils/errors")
const { AdminAuthService } = require("../services/auth.service")

const adminSignUpController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(AdminAuthService.signup(req.body))
  if (error) return next(error)

  if (!data?.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const adminLoginController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(AdminAuthService.login(req.body))

  if (error) return next(error)

  if (!data?.success) return next(new CustomError(data.msg, 401, data))

  return responseHandler(res, 200, data)
}

module.exports = {
  adminSignUpController,
  adminLoginController,
}
