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

  console.log("displayAdd: ", displayAdd);
  
  const peersRef = useRef([]);
  const userVideoRef = useRef();
  const screenTrackRef = useRef();
  const userStream = useRef();
  var roomId = props.match.params.roomId;
  console.log("Room ", sessionStorage);

  //replace with firebase pictures
  //get picture from database
  const images = firebase.storage().ref().child('foodImages');
  images.child(currentUser).getDownloadURL().then(function(url) {
    setFoodImage(url);
  })
  // console.log("image: ", foodImage);

  const foodBackground = {
    backgroundImage: `url(${foodImage})`
  }

  // console.log("firebaseUrl: ", firebaseUrl);

  useEffect(() => {
    // Set Back Button Event
    window.addEventListener('popstate', goToBack);
    console.log("peers ", peers);
    // Connect Camera & Mic
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideoRef.current.srcObject = stream;
        userStream.current = stream;
        // console.log(currentUser);
        socket.emit('BE-join-room', { roomId, userName: currentUser});
        socket.on('FE-user-join', (users) => {
          // all users
          console.log(users);
          const peers = [];
          users.forEach(({ userId, info }) => {
            let { userName, video, audio } = info;

            if (userName !== currentUser) {
              const peer = createPeer(userId, socket.id, stream, roomId);

              peer.userName = userName;
              peer.peerID = userId;

              peersRef.current.push({
                peerID: userId,
                peer,
                userName,
              });
              peers.push(peer);

              setUserVideoAudio((preList) => {
                return {
                  ...preList,
                  [peer.userName]: { video, audio },
                };
              });
            }
          });

          setPeers(peers);
        });

        socket.on('FE-receive-call', ({ signal, from, info }) => {
          let { userName, video, audio } = info;
          const peerIdx = findPeer(from);

          if (!peerIdx) {
            const peer = addPeer(signal, from, stream);

            peer.userName = userName;

            peersRef.current.push({
              peerID: from,
              peer,
              userName: userName,
            });
            setPeers((users) => {
              return [...users, peer];
            });
            setUserVideoAudio((preList) => {
              return {
                ...preList,
                [peer.userName]: { video, audio },
              };
            });
          }
        });

        socket.on('FE-call-accepted', ({ signal, answerId }) => {
          const peerIdx = findPeer(answerId);
          peerIdx.peer.signal(signal);
        });

        socket.on('FE-user-leave', ({ userId, userName }) => {
          const peerIdx = findPeer(userId);
          peerIdx.peer.destroy();
          setPeers((users) => {
            users = users.filter((user) => user.peerID !== peerIdx.peer.peerID);
            return [...users];
          });
        });
      });

    socket.on('FE-toggle-camera', ({ userId, switchTarget }) => {
      const peerIdx = findPeer(userId);

      setUserVideoAudio((preList) => {
        let video = preList[peerIdx.userName].video;
        let audio = preList[peerIdx.userName].audio;

        if (switchTarget === 'video') video = !video;
        else audio = !audio;

        return {
          ...preList,
          [peerIdx.userName]: { video, audio },
        };
      });
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const start = new Date();
    let latestCheckTime = start;
    const intervalId = setInterval(() => {
      const now = new Date();
      const delta = now - latestCheckTime;
      console.log(delta);
      latestCheckTime = now;
      //update firebase user studytime by adding
    }, 60000);
    return () => {
      // unmount
      clearInterval(intervalId);
    }
  }, []);

  function createPeer(userId, caller, stream, roomId) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socket.emit('BE-call-user', {
        userToCall: userId,
        from: caller,
        signal,
        roomId: roomId,
      });
    });
    peer.on('disconnect', () => {
      peer.destroy();
    });

    return peer;
  }

  function addPeer(incomingSignal, callerId, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socket.emit('BE-accept-call', { signal, to: callerId });
    });

    peer.on('disconnect', () => {
      peer.destroy();
    });

    peer.signal(incomingSignal);

    return peer;
  }

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

    const peerName = peer.userName;
    // console.log("firebaseUrl: ", firebaseUrl.wulanfrom);
    console.log("firebase peername:", firebaseUrl.peerName);
    
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
            <VideoCard key={index} peer={peer} number={arr.length} />
          </VideoBox>
        }
        <UserName className='room-userName'>{peer.userName}</UserName>
        {/* <UserFood className='room-userFood'>
              <img src={`url(${firebaseUrl})`'} width="300" height="300" alt={peer.userName} />
        </UserFood> */}
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

  const clickScreenSharing = () => {
    if (!screenShare) {
      navigator.mediaDevices
        .getDisplayMedia({ cursor: true })
        .then((stream) => {
          const screenTrack = stream.getTracks()[0];

          peersRef.current.forEach(({ peer }) => {
            // replaceTrack (oldTrack, newTrack, oldStream);
            peer.replaceTrack(
              peer.streams[0]
                .getTracks()
                .find((track) => track.kind === 'video'),
              screenTrack,
              userStream.current
            );
          });

          // Listen click end
          screenTrack.onended = () => {
            peersRef.current.forEach(({ peer }) => {
              peer.replaceTrack(
                screenTrack,
                peer.streams[0]
                  .getTracks()
                  .find((track) => track.kind === 'video'),
                  userStream.current
              );
            });
            userVideoRef.current.srcObject = userStream.current;
            setScreenShare(false);
          };

          userVideoRef.current.srcObject = stream;
          screenTrackRef.current = screenTrack;
          setScreenShare(true);
        });
    } else {
      screenTrackRef.current.onended();
    }
  };

  const expandScreen = (e) => {
    const elem = e.target;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
    }
  };

  return (
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
          <VideoContainer style={foodBackground} className='room-video-container'>
            {/* Current User Video */}
              <VideoBox
              className='room-video-box'
              >
                <FaIcon className="fas fa-expand" />
                <MyVideo
                  onClick={expandScreen}
                  ref={userVideoRef}
                  muted
                  autoPlay
                  playInline
                  // className = 'myvideo'
              ></MyVideo>
              </VideoBox>
              {/* <UserFood className='room-userFood'>
                <img src={'https://thumbs.dreamstime.com/b/liver-detox-diet-food-concept-fruits-vegetables-nuts-olive-oil-garlic-cleansing-body-healthy-eating-top-view-flat-lay-liver-166983115.jpg'} />
              </UserFood> */}
              <UserName className='room-userName'>{currentUser}</UserName>

          </VideoContainer>
            {/* Joined User Vidoe */}
            {peers &&
              peers.map((peer, index, arr) => {
                addImageList(peer)
                createUserVideo(peer, index, arr)
              })
            }
        </div>
        }
        <BottomBar
          clickScreenSharing={clickScreenSharing}
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
