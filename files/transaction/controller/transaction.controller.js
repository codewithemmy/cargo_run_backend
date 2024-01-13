const { BAD_REQUEST, SUCCESS } = require("../../../constants/statusCode")
const { responseHandler } = require("../../../core/response")
const { manageAsyncOps } = require("../../../utils")
const { CustomError } = require("../../../utils/errors")
const { TransactionService } = require("../services/transaction.service")
// const crypto = require("crypto")

const paymentTransactionController = async (req, res, next) => {
  const isUser = res.locals.jwt.isAdmin
  switch (isUser) {
    case true:
      req.body.userType = "Admin"
      break

    default:
      req.body.userType = "User"
      break
  }

  const [error, data] = await manageAsyncOps(
    TransactionService.initiatePaymentTransaction(req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  paymentTransactionController,
}
