import io from 'socket.io-client';
const sockets = io('0.0.0.0:9000');
export default sockets;
