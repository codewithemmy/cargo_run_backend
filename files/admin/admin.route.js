const adminRoute = require("express").Router()
const { checkSchema } = require("express-validator")
const { isAuthenticated, adminVerifier } = require("../../utils")
const { uploadManager } = require("../../utils/multer")
const { validate } = require("../../validations/validate")
const { adminSignUpController } = require("./controllers/auth.controller")

//auth routes
adminRoute.post("/signup", adminSignUpController)

module.exports = adminRoute
