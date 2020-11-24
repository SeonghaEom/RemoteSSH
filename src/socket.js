import io from 'socket.io-client';
const sockets = io('http://localhost:29529');
export default sockets;
