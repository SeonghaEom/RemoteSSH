import io from 'socket.io-client';
// const sockets = io('https://86a836be39c3.ngrok.io');
const sockets = io.connect('http://localhost:9000');
// const sockets = io.connect('https://remote-ssh.graymove.com', {secure:true});
export default sockets;
