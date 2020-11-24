import io from 'socket.io-client';
const sockets = io('0.0.0.0:29529');
export default sockets;
