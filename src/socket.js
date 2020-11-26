import io from 'socket.io-client';
// const sockets = io('https://e92d9cbad3d1.ngrok.io');
// const sockets = io('http://localhost:9000');
const sockets = io.connect('https://remote-ssh.graymove.com', {secure:true});
export default sockets;
