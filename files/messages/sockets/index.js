const { default: mongoose } = require("mongoose")
const { SocketRepository } = require("./sockets.repository")
const fs = require("fs")
const { OrderRepository } = require("../../order/order.repository")

module.exports.socketConnection = async (io) => {
  io.on("connection", async (socket) => {
    console.log(`⚡⚡: ${socket.id} user just connected!`)
    socket.emit("join", "Connection Successful")
    const orders = await OrderRepository.findOrderBySocket({
      status: "paid",
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
          const orders = await OrderRepository.findOrderBySocket({
            status: "paid",
          })
          console.log("get-orders", orders)
          // Emit the order details to the client
          socket.emit("get-orders", orders)
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
