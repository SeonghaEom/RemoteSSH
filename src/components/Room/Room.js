import React, { useState, useEffect, useRef, useHistory } from 'react';
import Peer from 'simple-peer';
import styled from 'styled-components';
import VideoCard from '../Video/VideoCard';
import BottomBar from '../BottomBar/BottomBar';
import AddWish from '../WishList/AddWish';
import Wish from '../WishList/Wish';
import RoomList from '../RoomList';
import Layout from '../TopicModal/Layout'
import wishicon from '../../assets/wish_red.svg';
import Volume from '../Volume/Volume'
import io from "socket.io-client";

//firebase imports
import * as firebase from 'firebase'

const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}

const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

function Room(props) {
  var currentUser = sessionStorage.getItem('user');
  const roomName = sessionStorage.getItem('roomName');
  // console.log("current user: ", currentUser);
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = props.match.params.roomId;
  const [wishlist, setWishList] = useState([]);
  const [displayChat, setDisplayChat] = useState(false);
  const [displayWish, setDisplayWish] = useState(false);
  const [displayVolume, setDisplayVolume] = useState(false);
  const [displayOtherTable, setDisplayOtherTable] = useState(false);
  const [displayAdd, setDisplayAdd] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [foodImage, setFoodImage] = useState("");
  const [firebaseUrl, setFirebaseUrl] = useState([]);


  // console.log("firebaseUrl: ", firebaseUrl);
  useEffect(() => {
    socketRef.current = io.connect('https://e20f32fed856.ngrok.io');
    navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit("join room", {roomID: roomID, userName: currentUser} );
        socketRef.current.on("all users", users => {
            const peers = [];
            users.forEach(userID => {
              // for each existing users, create new comer peer
                const peer = createPeer(userID, socketRef.current.id, stream);
                peersRef.current.push({
                    peerID: userID,
                    peer,
                })
                peers.push(peer);
            })
            console.log("peers ", peers);
            setPeers(peers);
        })

        socketRef.current.on("user joined", payload => {
          //add one more peer in this room
            const peer = addPeer(payload.signal, payload.callerID, stream);
            peersRef.current.push({
                peerID: payload.callerID,
                peer,
            })
            console.log("add one more peer ", peer);
            setPeers(users => [...users, peer]);
        });

        socketRef.current.on("receiving returned signal", payload => {
          console.log("receiving returned signal ", payload);
            const item = peersRef.current.find(p => p.peerID === payload.id);
            item.peer.signal(payload.signal);
        });
    })

    socketRef.current.on("user left", socketId => {
      console.log("user left ", socketId);
      console.log("before: ", peersRef, peers);
      const leaver = peersRef.current.filter(peerObj => peerObj.peerID === socketId)[0];
      // console.log("leaver ", leaver);
      if (leaver) {leaver.peer.destroy();}
      peersRef.current = peersRef.current.filter(peerObj => peerObj.peerID !== socketId);
      const newPeers = peersRef.current.filter(peerObj => peerObj.peer);
      setPeers(newPeers);
      console.log("after : ", peersRef, peers);
    })
  }, [props.history.location]);

  function createPeer(userToSignal, callerID, stream) {
      const peer = new Peer({
          initiator: true,
          trickle: false,
          stream,
      });

      peer.on("signal", signal => {
          socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
      })

      return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
      const peer = new Peer({
          initiator: false,
          trickle: false,
          stream,
      })

      peer.on("signal", signal => {
          socketRef.current.emit("returning signal", { signal, callerID })
      })

      peer.signal(incomingSignal);

      return peer;
  }
  function addImageList(peer) { 
    const images = firebase.storage().ref().child('foodImages');
    images.child(peer.userName).getDownloadURL().then(function(url) {
      setFirebaseUrl(firebaseUrl => ({...firebaseUrl, [peer.userName]: url}))
    });
  }

  // function createUserVideo(peer, index, arr) {
  //   // const images = firebase.storage().ref().child('foodImages');
  //   // images.child(peer.userName).getDownloadURL().then(function(url) {
  //   //   setFirebaseUrl(firebaseUrl => ({...firebaseUrl, [peer.userName]: url}))
  //   // });
  //   console.log("createUserVideo ", peer);
  //   // const peerName = peer.userName;
  //   // console.log("firebaseUrl: ", firebaseUrl.wulanfrom);
  //   // console.log("firebase peername:", firebaseUrl.peerName);
    
  //   return (
  //     <div >
  //       {/* style={{backgroundImage: `url(${firebaseUrl.peerName})`}} */}
  //     <VideoContainer className='room-video-container' style>
  //       {displayWish ?
  //           <AddWish display ={displayAdd} setWishList={setWishList} wishlist={wishlist} userName={peer.userName} userFood={'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'} goToScreen={clickAdd} />:
  //         <VideoBox 
  //           className="room-video-box"
  //           key={index}
  //         >
  //           {/* {writeUserName(peer.userName)} */}
  //           <FaIcon className="fas fa-expand" />
  //           <VideoCard key={index} peer={peer} number={arr.length} ref={remoteVideoComponent}/>
  //         </VideoBox>
  //       }
  //       <UserName className='room-userName'>{peer.userName}</UserName>
  //       <UserFood className='room-userFood'>
  //             <img src={'https://i.fltcdn.net/contents/984/original_1420785942178_y0nppv3rf6r.octet-stream'} width="300" height="300" alt={peer.userName} />
  //       </UserFood>
  //       <AddButton className='room-wishlist-addbutton' onClick={clickAdd}>
  //         <img src={wishicon} alt="add wish"/>
  //       </AddButton>
  //     </VideoContainer>
  //         {/* <AddWish 
  //         displayAdd={displayAdd}
  //         wishlist={wishlist}
  //         setWishList={setWishList}
  //         userName={peer.userName}
  //         userFood={wishicon} /> */}
  //       </div>
  //   );
  // }

  // function writeUserName(userName, index) {
  //   if (userVideoAudio.hasOwnProperty(userName)) {
  //     if (!userVideoAudio[userName].video) {
  //       return <UserName key={userName}>{userName}</UserName>;
  //     }
  //   }
  // }

  // Open Chat
  const clickChat = (e) => {
    e.stopPropagation();
    setDisplayChat(!displayChat);
  };

  const clickWish = (e) => {
    e.stopPropagation();
    setDisplayWish(!displayWish);
  };

  
  const clickAdd = (e) => {
    e.stopPropagation();
    setDisplayAdd(!displayAdd);
  };

  const clickVolume = (e) => {
    e.stopPropagation();
    setDisplayVolume(!displayVolume);
  };

  // BackButton
  const goToOtherTable = (e) => {
    // e.stopPropagation();
    // setDisplayOtherTable(!displayOtherTable);
    // console.log(displayOtherTable);
    e.preventDefault();
    socketRef.current.disconnect();
    window.location.href = '/join';
    // socket.emit('BE-leave-room', { roomId, leaver: currentUser });
    // sessionStorage.removeItem('user');
    // window.location.href = '/room-list';
    socketRef.current.disconnect();
    // window.location.href = '/join';
    props.history.go(1);
  };

  const goToVolume = (e) => {
    e.stopPropagation();
    setDisplayVolume(!displayVolume);
    console.log(displayVolume);
    // e.preventDefault();
    // socket.emit('BE-leave-room', { roomId, leaver: currentUser });
    // sessionStorage.removeItem('user');
    // window.location.href = '/room-list';
  };

  const goToBack = (e) => {
    e.preventDefault();
    // socket.emit('BE-leave-room', { roomId, leaver: currentUser });
    socketRef.current.disconnect();
    sessionStorage.removeItem('user');
    window.location.href = '/';
  };

  const switchRoom = (roomId) => {
    socketRef.current.disconnect();
    setDisplayOtherTable(false);
    props.history.replace(`/room/${roomId}`);
    
  }

  // const toggleCameraAudio = (e) => {
  //   console.log("toggle")
  //   const target = e.target.getAttribute('data-switch');

  //   setMediaConstraints((videoaudio) => {
  //     let videoSwitch = videoaudio.video;
  //     let audioSwitch = videoaudio.audio;
  //     console.log(videoaudio);
  //     if (target === 'video') {
  //       const userVideoTrack = localVideoComponent.current.srcObject.getVideoTracks()[0];
  //       videoSwitch = !videoSwitch;
  //       userVideoTrack.enabled = videoSwitch;
  //     } else {
  //       const userAudioTrack = localVideoComponent.current.srcObject.getAudioTracks()[0];
  //       console.log(localVideoComponent, userAudioTrack);
  //       audioSwitch = !audioSwitch;

  //       if (userAudioTrack) {
  //         console.log(userAudioTrack.enabled);
  //         userAudioTrack.enabled = audioSwitch;
  //         console.log(userAudioTrack.enabled);
  //       } else {
  //         localVideoComponent.current.getAudioTracks()[0].enabled = audioSwitch;
  //       }
  //     }

  //     return {
  //       video: videoSwitch,
  //       audio: audioSwitch
  //     };
  //   });

  //   socket.emit('BE-toggle-camera-audio', { roomId, switchTarget: target });
  // };
  
  return (
    <div className='room-title'>
    <RoomContainer>
      
      <Layout/>
      <VideoAndBarContainer>
        {displayWish ?
        <Wish display ={displayWish} setWishList={setWishList} wishlist={wishlist} goToScreen={clickWish} /> :
        displayAdd ?
        <AddWish display ={displayAdd} setWishList={setWishList} wishlist={wishlist} userName={currentUser} userFood={'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'} goToScreen={clickAdd} />:
        displayOtherTable ?
        <RoomList display={displayOtherTable} roomId={roomID} goToScreen={goToOtherTable}/> :
        displayVolume?
        <Volume display={displayVolume} goToScreen={goToVolume}/> :
        <div className="room-display-every">
          <VideoContainer className='room-video-container'>
            {/* Current User Video */}
              <VideoBox
              className='room-video-box'
              >
                <FaIcon className="fas fa-expand" />
                <StyledVideo muted ref={userVideo} autoPlay playsInline />
              </VideoBox>
              <UserFood className='room-userFood'>
                <img src={'https://pakwired.com/wp-content/uploads/2017/09/pizza-1.jpg'} />
              </UserFood>
              <UserName className='room-userName'>{currentUser}</UserName>

          </VideoContainer>
            {/* Joined User Vidoe */}
            {peers &&
              peers.map((peer, index, arr) => {
                return (
                    <Video key={index} peer={peer} />
                );
            })
            }
        </div>
        }
        <BottomBar
          clickChat={clickChat}
          clickWish={clickWish}
          goToBack={goToBack}
          goToOtherTable={goToOtherTable}
          goToVolume={goToVolume}
          // toggleCameraAudio={toggleCameraAudio}
          clickVolume={clickVolume}
          // mediaConstraints={mediaConstraints}
          screenShare={screenShare}
        />
      </VideoAndBarContainer>
      
    </RoomContainer>
    </div>
  );
};

const RoomContainer = styled.div`
  display: flex;
  width: 100%;
  max-height: 100vh;
  flex-direction: row;
  overflow: scroll;
  background-color: #121A2D;
`;

const VideoContainer = styled.div`

`;

const VideoAndBarContainer = styled.div`
  // position: relative;
  width: 100%;
  height: 100vh;
`;

const MyVideo = styled.video``;

const VideoBox = styled.div`

`;

const UserName = styled.div`

`;

const UserFood = styled.div`
  
`;

const AddButton = styled.div`
`;

const FaIcon = styled.i`
  display: none;
  position: absolute;
  right: 15px;
  top: 15px;
`;

export default Room;
