import React, { useState, useEffect, useRef, useHistory } from 'react';
import Peer from 'simple-peer';
import styled from 'styled-components';
import socket from '../../socket';
import VideoCard from '../Video/VideoCard';
import BottomBar from '../BottomBar/BottomBar';
import Chat from '../Chat/Chat';
import AddWish from '../WishList/AddWish';
import Wish from '../WishList/Wish';
import RoomList from '../RoomList';
import Layout from '../TopicModal/Layout'
import wishicon from '../../assets/wish_red.svg';
import Volume from '../Volume/Volume'

//firebase imports
import * as firebase from 'firebase'

const Room = (props) => {
  var currentUser = sessionStorage.getItem('user');
  // console.log("current user: ", currentUser);
  const [peers, setPeers] = useState([]);
  const [userVideoAudio, setUserVideoAudio] = useState({
    localUser: { video: true, audio: true },
  });
  const [wishlist, setWishList] = useState([]);
  const [displayChat, setDisplayChat] = useState(false);
  const [displayWish, setDisplayWish] = useState(false);
  const [displayVolume, setDisplayVolume] = useState(false);
  const [displayOtherTable, setDisplayOtherTable] = useState(false);
  const [displayAdd, setDisplayAdd] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [foodImage, setFoodImage] = useState("");
  const [firebaseUrl, setFirebaseUrl] = useState([]);
  const [other, setOther] = useState(false);
  

  console.log("displayAdd: ", displayAdd);
  
  const peersRef = useRef([]);
  const userVideoRef = useRef();
  const localVideoComponent = useRef();
  const remoteVideoComponent = useRef();
  const screenTrackRef = useRef();
  const userStream = useRef();
  var roomId = props.match.params.roomId;
  let localStream
  let remoteStream
  let isRoomCreator
  let rtcPeerConnection // Connection between the local device and the remote peer.
  const mediaConstraints = {
  audio: true,
  video: true,
  }

  const foodBackground = {
    backgroundImage: `url(${foodImage})`
  }

  // Free public STUN servers provided by Google.
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
    ],
  }

  async function setLocalStream(mediaConstraints) {
  let stream
  try {
    stream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
  } catch (error) {
    console.error('Could not get user media', error)
  }

  localStream = stream;
  
  if (localVideoComponent.current) {
    console.log("localVideoCompoenent not null!");
    localVideoComponent.current.srcObject = stream;
  }
  
  // userVideoRef.current.srcObject = stream;
  console.log("localvideocomponent ", localVideoComponent, userVideoRef);
  }

  // console.log("firebaseUrl: ", firebaseUrl);

  useEffect(() => {
    // Set Back Button Event
    window.addEventListener('popstate', goToBack);
    console.log("peers ", peers);
        socket.emit('BE-join-room', { roomId, userName: currentUser});
        socket.on('FE-user-join', (users) => {
          // all users
          console.log(users);
          const peers = [];

          setPeers(peers);

        // socket.on('FE-receive-call', ({ signal, from, info }) => {
        //   let { userName, video, audio } = info;
        //   const peerIdx = findPeer(from);
        // });

        // socket.on('FE-call-accepted', ({ signal, answerId }) => {
        //   const peerIdx = findPeer(answerId);
        //   peerIdx.peer.signal(signal);
        // });

        // socket.on('FE-user-leave', ({ userId, userName }) => {
        //   const peerIdx = findPeer(userId);
        //   peerIdx.peer.destroy();
        //   setPeers((users) => {
        //     users = users.filter((user) => user.peerID !== peerIdx.peer.peerID);
        //     return [...users];
        //   });
        });

        // SOCKET EVENT CALLBACKS =====================================================
        socket.on('room_created', async ({roomId, userName}) => {
          console.log(userName, ' Socket event callback: room_created ', roomId)

          await setLocalStream(mediaConstraints)
          isRoomCreator = true
        })

        socket.on('room_joined', async ({roomId, userName}) => {
          console.log(userName, ' Socket event callback: room_joined ', roomId)
          setPeers([...peers, userName])
          setOther(userName);

          await setLocalStream(mediaConstraints)
          socket.emit('start_call', roomId)
        })

        socket.on('full_room', () => {
          console.log('Socket event callback: full_room')

          alert('The room is full, please try another one')
        })

        // SOCKET EVENT CALLBACKS =====================================================
        socket.on('start_call', async () => {
          console.log('Socket event callback: start_call')

          if (isRoomCreator) {
            rtcPeerConnection = new RTCPeerConnection(iceServers)
            addLocalTracks(rtcPeerConnection)
            setOther(true);
            rtcPeerConnection.ontrack = setRemoteStream
            rtcPeerConnection.onicecandidate = sendIceCandidate
            await createOffer(rtcPeerConnection)
            
          }
        })

        socket.on('webrtc_offer', async (event) => {
          console.log('Socket event callback: webrtc_offer')

          if (!isRoomCreator) {
            rtcPeerConnection = new RTCPeerConnection(iceServers)
            addLocalTracks(rtcPeerConnection)
            rtcPeerConnection.ontrack = setRemoteStream
            rtcPeerConnection.onicecandidate = sendIceCandidate
            rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
            await createAnswer(rtcPeerConnection)
          }
        })

        socket.on('webrtc_answer', (event) => {
          console.log('Socket event callback: webrtc_answer')

          rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
        })

        socket.on('webrtc_ice_candidate', (event) => {
          console.log('Socket event callback: webrtc_ice_candidate')

          // ICE candidate configuration.
          var candidate = new RTCIceCandidate({
            sdpMLineIndex: event.label,
            candidate: event.candidate,
          })
          rtcPeerConnection.addIceCandidate(candidate)
        })

        // FUNCTIONS ==================================================================
        function addLocalTracks(rtcPeerConnection) {
          localStream.getTracks().forEach((track) => {
            rtcPeerConnection.addTrack(track, localStream)
          })
        }

        async function createOffer(rtcPeerConnection) {
          let sessionDescription
          try {
            sessionDescription = await rtcPeerConnection.createOffer()
            rtcPeerConnection.setLocalDescription(sessionDescription)
          } catch (error) {
            console.error(error)
          }

          socket.emit('webrtc_offer', {
            type: 'webrtc_offer',
            sdp: sessionDescription,
            roomId,
          })
        }

        async function createAnswer(rtcPeerConnection) {
          let sessionDescription
          try {
            sessionDescription = await rtcPeerConnection.createAnswer()
            rtcPeerConnection.setLocalDescription(sessionDescription)
          } catch (error) {
            console.error(error)
          }

          socket.emit('webrtc_answer', {
            type: 'webrtc_answer',
            sdp: sessionDescription,
            roomId,
          })
        }

        function setRemoteStream(event) {
          console.log("setRemoteStream ", remoteVideoComponent);
          remoteVideoComponent.current.srcObject = event.streams[0]
          remoteStream = event.stream
        }

        function sendIceCandidate(event) {
          if (event.candidate) {
            socket.emit('webrtc_ice_candidate', {
              roomId,
              label: event.candidate.sdpMLineIndex,
              candidate: event.candidate.candidate,
            })
          }
        }






    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);


  function findPeer(id) {
    return peersRef.current.find((p) => p.peerID === id);
  }

  function addImageList(peer) { 
    const images = firebase.storage().ref().child('foodImages');
    images.child(peer.userName).getDownloadURL().then(function(url) {
      setFirebaseUrl(firebaseUrl => ({...firebaseUrl, [peer.userName]: url}))
    });
  }

  function createUserVideo(peer, index, arr) {
    // const images = firebase.storage().ref().child('foodImages');
    // images.child(peer.userName).getDownloadURL().then(function(url) {
    //   setFirebaseUrl(firebaseUrl => ({...firebaseUrl, [peer.userName]: url}))
    // });
    console.log("createUserVideo ", peer);
    // const peerName = peer.userName;
    // console.log("firebaseUrl: ", firebaseUrl.wulanfrom);
    // console.log("firebase peername:", firebaseUrl.peerName);
    
    return (
      <div >
        {/* style={{backgroundImage: `url(${firebaseUrl.peerName})`}} */}
      <VideoContainer className='room-video-container' style>
        {displayWish ?
            <AddWish display ={displayAdd} setWishList={setWishList} wishlist={wishlist} userName={peer.userName} userFood={'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'} goToScreen={clickAdd} />:
          <VideoBox 
            className="room-video-box"
            key={index}
          >
            {/* {writeUserName(peer.userName)} */}
            {/* <FaIcon className="fas fa-expand" /> */}
            <VideoCard key={index} peer={peer} number={arr.length} ref={remoteVideoComponent}/>
          </VideoBox>
        }
        <UserName className='room-userName'>{peer.userName}</UserName>
        <UserFood className='room-userFood'>
              <img src={'https://i.fltcdn.net/contents/984/original_1420785942178_y0nppv3rf6r.octet-stream'} width="300" height="300" alt={peer.userName} />
        </UserFood>
        <AddButton className='room-wishlist-addbutton' onClick={clickAdd}>
          <img src={wishicon} alt="add wish"/>
        </AddButton>
      </VideoContainer>
          {/* <AddWish 
          displayAdd={displayAdd}
          wishlist={wishlist}
          setWishList={setWishList}
          userName={peer.userName}
          userFood={wishicon} /> */}
        </div>
    );
  }

  function writeUserName(userName, index) {
    if (userVideoAudio.hasOwnProperty(userName)) {
      if (!userVideoAudio[userName].video) {
        return <UserName key={userName}>{userName}</UserName>;
      }
    }
  }

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
    e.stopPropagation();
    setDisplayOtherTable(!displayOtherTable);
    console.log(displayOtherTable);
    // e.preventDefault();
    // socket.emit('BE-leave-room', { roomId, leaver: currentUser });
    // sessionStorage.removeItem('user');
    // window.location.href = '/room-list';
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
    socket.emit('BE-leave-room', { roomId, leaver: currentUser });
    sessionStorage.removeItem('user');
    window.location.href = '/';
  };

  const toggleCameraAudio = (e) => {
    console.log("toggle")
    const target = e.target.getAttribute('data-switch');

    setUserVideoAudio((preList) => {
      let videoSwitch = preList['localUser'].video;
      let audioSwitch = preList['localUser'].audio;

      if (target === 'video') {
        const userVideoTrack = userVideoRef.current.srcObject.getVideoTracks()[0];
        videoSwitch = !videoSwitch;
        userVideoTrack.enabled = videoSwitch;
      } else {
        const userAudioTrack = userVideoRef.current.srcObject.getAudioTracks()[0];
        audioSwitch = !audioSwitch;

        if (userAudioTrack) {
          userAudioTrack.enabled = audioSwitch;
        } else {
          userStream.current.getAudioTracks()[0].enabled = audioSwitch;
        }
      }

      return {
        ...preList,
        localUser: { video: videoSwitch, audio: audioSwitch },
      };
    });

    socket.emit('BE-toggle-camera-audio', { roomId, switchTarget: target });
  };

  return (
    <div className='room-title'>
      <div className='room-title-text'> You're now in room {roomId}</div>
    <RoomContainer>
      
      <Layout/>
      <VideoAndBarContainer>
        {displayWish ?
        <Wish display ={displayWish} setWishList={setWishList} wishlist={wishlist} goToScreen={clickWish} /> :
        displayAdd ?
        <AddWish display ={displayAdd} setWishList={setWishList} wishlist={wishlist} userName={currentUser} userFood={'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'} goToScreen={clickAdd} />:
        displayOtherTable ?
        <RoomList display={displayOtherTable} roomId={roomId} goToScreen={goToOtherTable}/> :
        displayVolume?
        <Volume display={displayVolume} goToScreen={goToVolume}/> :
        <div className="room-display-every">
          <VideoContainer className='room-video-container'>
            {/* Current User Video */}
              <VideoBox
              className='room-video-box'
              >
                <FaIcon className="fas fa-expand" />
                <MyVideo
                  ref={localVideoComponent}
                  muted
                  autoPlay
                  playInline
                  // className = 'myvideo'
              ></MyVideo>
              </VideoBox>
              <UserFood className='room-userFood'>
                <img src={'https://pakwired.com/wp-content/uploads/2017/09/pizza-1.jpg'} />
              </UserFood>
              <UserName className='room-userName'>{currentUser}</UserName>

          </VideoContainer>
          {other && 
            <VideoContainer className='room-video-container'>
              <VideoBox
              className='room-video-box'
              >
                <FaIcon className="fas fa-expand" />
                <MyVideo
                  ref={remoteVideoComponent}
                  muted
                  autoPlay
                  playInline
                  // className = 'myvideo'
              ></MyVideo>
              </VideoBox>
              <UserFood className='room-userFood'>
                <img src={'https://pakwired.com/wp-content/uploads/2017/09/pizza-1.jpg'} />
              </UserFood>
              <UserName className='room-userName'>{other}</UserName>
          </VideoContainer>
          
          }

            {/* Joined User Vidoe */}
            {peers &&
              peers.map((peer, index, arr) => {
                // addImageList(peer)
                console.log("how many peers? ", peers.length);
                console.log("who are the peer ", peer);
                console.log("who are the peersRef ", peersRef);
                console.log("who are the uservideoRef ", userVideoRef);
                createUserVideo(peer, index, arr)
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
          toggleCameraAudio={toggleCameraAudio}
          clickVolume={clickVolume}
          userVideoAudio={userVideoAudio['localUser']}
          screenShare={screenShare}
        />
      </VideoAndBarContainer>
      <Chat display={displayChat} roomId={roomId}/>
      
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
