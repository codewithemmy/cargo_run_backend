const notificationRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")

notificationRoute.use(isAuthenticated)

const { fetchNotifications } = require("./notification.controller")

//route
notificationRoute.route("/").get(fetchNotifications)

module.exports = notificationRoute
