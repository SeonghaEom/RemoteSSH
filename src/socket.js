import io from 'socket.io-client';
const sockets = io('127.0.0.1:9000');
export default sockets;
