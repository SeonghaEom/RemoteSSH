import io from 'socket.io-client';
const sockets = io.connect('https://e20f32fed856.ngrok.io');
// const sockets = io.connect('https://localhost:9000', {secure: true});
// const sockets = io.connect('https://remote-ssh.graymove.com', {secure:true});
export default sockets;
