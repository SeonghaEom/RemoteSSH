import io from 'socket.io-client';
const sockets = io('https://remote-ssh.herokuapp.com:9000');
export default sockets;
