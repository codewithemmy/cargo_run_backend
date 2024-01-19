const { uploadManager } = require("../../utils/multer")
const { checkSchema } = require("express-validator")
const userRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const { validate } = require("../../validations/validate")

//controller files
const {
  createUserController,
  userLoginController,
  userUpdateController,
} = require("./user.controller")

const { loginValidation } = require("../../validations/users/loginValidation")

//routes
userRoute.route("/").post(createUserController)

userRoute
  .route("/login")
  .post(validate(checkSchema(loginValidation)), userLoginController)

userRoute.use(isAuthenticated)

userRoute.route("/").patch(userUpdateController)

module.exports = userRoute
