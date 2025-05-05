const { Server } = require("socket.io");

const socketSetup = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  const emailToSocketIdMap = new Map();
  const socketidToEmailMap = new Map();

  io.on("connection", (socket) => {
    console.log(`Socket Connected`, socket.id);
    socket.on("room:join", (data) => {
      const { email, room } = data;
      emailToSocketIdMap.set(email, socket.id);
      socketidToEmailMap.set(socket.id, email);
      io.to(room).emit("user:joined", { email, id: socket.id });
      socket.join(room);
      io.to(socket.id).emit("room:join", data);
    });

    socket.on("leave-room", (data) => {
      const { email, roomId } = data;
      emailToSocketIdMap.delete(email);
      socketidToEmailMap.delete(socket.id);
      socket.leave(roomId);
      io.to(roomId).emit("user:left", { email, id: socket.id });
    })

    socket.on('chat:message',({to,text,from,roomId})=>{
      console.log(`[${to}] ${from}: ${text}`);
      io.to(to).emit("receive-message", { from, text, roomId,to });
  })

  socket.on('file-upload',({to,from,roomId,file})=>{
    console.log(`[${to}] ${from}: ${file.name}`);
    io.to(to).emit("receive-file", { from, file, roomId,to });
  })

  
    socket.on("user:call", ({ to, offer }) => {
      io.to(to).emit("incomming:call", { from: socket.id, offer });
    }); 
  
    socket.on("call:accepted", ({ to, ans }) => {
      io.to(to).emit("call:accepted", { from: socket.id, ans });
    });
  
    socket.on("peer:nego:needed", ({ to, offer }) => {
      console.log("peer:nego:needed", offer);
      io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });
  
    socket.on("peer:nego:done", ({ to, ans }) => {
      console.log("peer:nego:done", ans);
      io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });
  });
  
  // io.on("connection", (socket) => {
  //   console.log("New client connected" + " " + socket.id);
  //   socket.on("join-room", (roomId) => {
  //     socket.join(roomId);
  //     console.log(`${socket.id} joined room: ${roomId}`);
  //     socket.to(roomId).emit("user-joined", socket.id);
  //   });
  //   socket.on("offer", ({ roomId, offer }) => {
  //     socket.to(roomId).emit("offer", { sender: socket.id, offer });
  //   });

  //   socket.on("answer", ({ roomId, answer }) => {
  //     socket.to(roomId).emit("answer", { sender: socket.id, answer });
  //   });

  //   socket.on("ice-candidate", ({ roomId, candidate }) => {
  //     socket.to(roomId).emit("ice-candidate", { sender: socket.id, candidate });
  //   });
  //   socket.on("disconnect", () => {
  //     console.log("Client disconnected" + socket.id);
  //   });
  // });
};

module.exports = socketSetup;
