import React from 'react';
import styled from 'styled-components';
import other_tables from '../../assets/other_tables.svg';
import heart from '../../assets/heart.svg';
import mute from '../../assets/mute.svg';
import volume from '../../assets/volume.svg';
import logout from '../../assets/logout.svg';
import mic from '../../assets/mic.svg';
import { useHistory } from 'react-router-dom';

const BottomBar = ({
  clickChat,
  clickWish,
  goToBack,
  goToOtherTable,
  goToVolume,
  toggleCameraAudio,
  userVideoAudio,
  clickScreenSharing,
  screenShare,
  goToScreen,
}) => {
  let history = useHistory()
  return (
    <Bar>
      <Left>
      </Left>
      <Center>
        <CameraButton onClick={toggleCameraAudio} data-switch="audio">
          <div>
            {userVideoAudio.audio ? (
              // <FaIcon className="fas fa-microphone"></FaIcon>
              <img src={mic} />
            ) : (
              // <FaIcon className="fas fa-microphone-slash"></FaIcon>
              <img src={mute} />
            )}
          </div>
          Audio
        </CameraButton>
        <WishList onClick={clickWish}>
          <div>
            {/* <FaIcon className="fas fa-heart"></FaIcon> */}
            <img src={heart} />
          </div>
          Wish List
        </WishList>
        <OtherTable onClick={(e) => {
          goToOtherTable(e);
          // history.go(0);
          }}>
          <div >
            <img src={other_tables} />
          </div>
          Other Table
        </OtherTable>
        <WishList onClick={goToVolume}>
          <div>
            {/* <FaIcon className="fa fa-volume-up"></FaIcon> */}
            <img src={volume} />
          </div>
          Table Volume
        </WishList>
      
      </Center>
      <Right>
        <StopButton onClick={goToBack}>
          <div>
            <img src={logout} />
          </div>
          Stop
        </StopButton>
      </Right>
    </Bar>
  );
};

const Bar = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 8%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  background-color: #ffffff;
`;
const Left = styled.div`
  display: flex;
  align-items: center;

  margin-left: 15px;
`;

const Center = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const Right = styled.div``;


const WishList = styled.div`
  width: auto;
  border: none;
  font-size: 0.9375rem;
  padding: 5px;

  :hover {
    background-color: #77b7dd;
    cursor: pointer;
    border-radius: 15px;
  }

  .sharing {
    color: #ee2560;
  }
`;

const OtherTable = styled.div`
  width: auto;
  border: none;
  font-size: 0.9375rem;
  padding: 5px;

  :hover {
    background-color: #77b7dd;
    cursor: pointer;
    border-radius: 15px;
  }

  .sharing {
    color: #ee2560;
  }
`;

const FaIcon = styled.i`
  width: 30px;
  font-size: calc(16px + 1vmin);
`;

const StopButton = styled.div`
  width: auto;
  border: none;
  font-size: 0.9375rem;
  padding: 5px;
  margin-right: 10px;

  :hover {
    background-color: #77b7dd;
    cursor: pointer;
    border-radius: 15px;
  }

  .sharing {
    color: #ee2560;
  }
`;

const CameraButton = styled.div`
  width: auto;
  border: none;
  font-size: 0.9375rem;
  padding: 5px;

  :hover {
    background-color: #77b7dd;
    cursor: pointer;
    border-radius: 15px;
  }

  .sharing {
    color: #ee2560;
  }
`;

export default BottomBar;
