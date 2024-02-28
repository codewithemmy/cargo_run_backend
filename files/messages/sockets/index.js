const { default: mongoose } = require("mongoose")
const { SocketRepository } = require("./sockets.repository")
const fs = require("fs")
const { OrderRepository } = require("../../order/order.repository")

module.exports.socketConnection = async (io) => {
  io.on("connection", async (socket) => {
    console.log(`⚡⚡: ${socket.id} user just connected!`)
    socket.emit("join", "Connection Successful")
    const orders = await OrderRepository.findOrderBySocket({
      paymentStatus: "paid",
    })
    socket.emit("get-orders", orders)
    console.log("get-orders", orders)

    socket.on("join", async (obj) => {
      try {
        //check to delete the socket id with the userId
        await SocketRepository.deleteMany({
          userId: new mongoose.Types.ObjectId(obj.userId),
        })

        //create a new socket
        const socketDetails = await SocketRepository.createSocket({
          socketId: socket.id,
          userId: obj.userId,
          modelType: obj.type,
        })

        //emit error sockets is not generated
        if (!socketDetails._id) {
          socket.emit("join", `Error: ${data.message}`)
        } else {
          socket.emit("join", "Connection Successful")
          socket.on("order-route", async (obj) => {
            const [order, location] = await Promise.all([
              await OrderRepository.findSingleOrderByParams({
                _id: new mongoose.Types.ObjectId(obj.orderId),
                riderId: obj.riderId,
                paymentStatus: "paid",
              }),
              await OrderRepository.findSingleOrderByParams({
                "receiverDetails.lat": obj.lat,
                "receiverDetails.lng": obj.lng,
                riderId: obj.riderId,
                paymentStatus: "paid",
              }),
            ])

            if (!order) {
              socket.emit("join", {
                success: true,
                msg: `Order not found`,
                data: [],
              })
            }
            if (!location) {
              socket.emit("join", { success: true, msg: `Destination reached` })
            }
            const socketDetails = await SocketRepository.findSingleSocket({
              userId: new mongoose.Types.ObjectId(order.userId),
            })

            if (socketDetails)
              io.to(socketDetails.socketId).emit("private-message", {
                order,
                ridersLocation: { lng: obj.lng, lat: obj.lat },
              })
          })
        }
      } catch (error) {
        console.log("socket error", error)
      }
    })

    socket.on("disconnect", async () => {
      await SocketRepository.deleteUser(socket.id)
      console.log("user disconnected")
    })

    socket.on("error", (error) => {
      fs.writeFileSync("errorlog.txt", `Error: ${error.message} /n`)
    })
  })
}
