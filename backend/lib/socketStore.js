
let io;

const setIO = (serverIO) => {
  io = serverIO;
};

const getIO = () => io;

const onlineUsers = new Map();

module.exports = {
  setIO,
  getIO,
  onlineUsers,
};