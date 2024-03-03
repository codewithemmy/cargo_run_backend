const { uploadManager } = require("../../utils/multer")
const riderRoute = require("express").Router()
const { isAuthenticated, adminVerifier } = require("../../utils")

const {
  createRiderController,
  updateRiderController,
  vehicleDetailsController,
  riderLoginController,
  verifyRiderController,
  resentOtpController,
  forgotPasswordController,
  resetPasswordController,
  verifyRiderCredentialController,
} = require("./rider.controller")

riderRoute.route("/login").post(riderLoginController)
riderRoute.route("/verify").post(verifyRiderController)
riderRoute.route("/forgot-password").post(forgotPasswordController)
riderRoute.route("/reset-password").post(resetPasswordController)

//routes
riderRoute.route("/").post(createRiderController)

riderRoute.use(isAuthenticated)
riderRoute.route("/resend-otp").post(resentOtpController)

riderRoute.route("/").patch(updateRiderController)
riderRoute
  .route("/credential/:id")
  .patch(adminVerifier, verifyRiderCredentialController)

riderRoute
  .route("/vehicle")
  .patch(uploadManager("riderImage").single("image"), vehicleDetailsController)

module.exports = riderRoute
