import io from 'socket.io-client';
// const sockets = io('https://5f074af17a4d.ngrok.io');
const sockets = io('http://localhost:9000');
export default sockets;
