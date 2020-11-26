import io from 'socket.io-client';
const sockets = io('https://e92d9cbad3d1.ngrok.io');
// const sockets = io('http://localhost:9000');
// const sockets = io('https://3.35.238.94:9000');
export default sockets;
