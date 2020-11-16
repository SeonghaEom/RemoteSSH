import io from 'socket.io-client';
const sockets = io('http://localhost:9000/');
export default sockets;
