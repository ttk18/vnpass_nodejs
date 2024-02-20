// WebSocket api routes
const socketIO = require('socket.io');
const passport = require('passport');
const auth = require('./auth');
const { objectIsNull } = require("../utils/common");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

module.exports.websocketServer = function (server, logger) {
  let io;

  const setup = function () {
    io = socketIO(server, {
      maxHttpBufferSize: 1e8, // 100mb, this was a previous default in engine.io before the upgrade to 3.6.0 which sets it to 1mb.  May want to revisit.
      logger,
    });

    const wrapMiddlewareForSocketIo = (middleware) => (socket, next) => middleware(socket.request, {}, next);
    io.use(wrapMiddlewareForSocketIo(passport.initialize()));
    io.use(wrapMiddlewareForSocketIo(passport.session()));
    io.use(wrapMiddlewareForSocketIo(auth('getOtps')));
    io.on('connection', (socket) => {
      const userId = socket.request.user.id;
      if (objectIsNull(userId)) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'UserId is not found');
      }
      logger.info(`websocket: new socket connection with user id=${userId}`);
      socket.join(userId);
    });
  };

  const sendMsg = async function(event, otp) {
    if (objectIsNull(otp.assignedUser)) {
      logger.error(`websocket: Cannot determine user for otp=${otp.id} phoneNumber=${otp.phoneNumber} provider=${otp.provider}`);
      return;
    }
    io.sockets.adapter.rooms.forEach((value, room_key) => {
      if (room_key === otp.assignedUser.toString()) {
        logger.info(`websocket: sending event ${event} - ${JSON.stringify(otp)} to user=${room_key}`);
        io.sockets.to(room_key).emit(event, otp);
        return;
      }
    })

  };

  return { setup, sendMsg };
};
