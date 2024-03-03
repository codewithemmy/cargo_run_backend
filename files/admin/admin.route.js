const adminRoute = require("express").Router()
const { checkSchema } = require("express-validator")
const { isAuthenticated, adminVerifier } = require("../../utils")
const { uploadManager } = require("../../utils/multer")
const { validate } = require("../../validations/validate")
const {
  adminSignUpController,
  adminLoginController,
} = require("./controllers/auth.controller")
const { updateAdminController } = require("./controllers/admin.controller")

//auth routes
adminRoute.post("/sign-up", adminSignUpController)
adminRoute.post("/login", adminLoginController)

adminRoute.use(isAuthenticated)

adminRoute.patch(
  "/:id",
  uploadManager("image").single("image"),
  updateAdminController
)

module.exports = adminRoute
