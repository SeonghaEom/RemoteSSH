import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import socket from '../../socket';
// import socket from '../../socket';

const Wish = ({displayWishlist, setWishList, wishlist}) => {

  const currentUser = sessionStorage.getItem('user');

  const removeFromWishList = (foodToRemove) => {
    setWishList(
      wishlist.filter((food) => food !== foodToRemove)
    );
  };

  return (
      <AddWishContainer className={displayWishlist ? '' : 'width0'}>
        <TopHeader>Your Wish List</TopHeader>
        <Row>
          {wishlist.map((food, idx) => (
            <div className="food" display="flex" key={idx}>
                  <p>{food.userName}</p>
                  <img src={food.foodImage} width="300" height="300" alt={food.userName} />
                  <p></p>
                  <button onClick={()=>removeFromWishList(food)}>
                    Remove
                  </button>
            </div>
          ))}
        </Row>
      </AddWishContainer>

      /* <WishContainer className={displayWishlist ? '' : 'width0'}>
        <TopHeader>Add to Wish List</TopHeader>
        <Row>
          <img src={'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'} width="300" height="300" alt={currentUser} />
          <Label htmlFor="roomName">Food Name</Label>
          <Input type="text" id="roomName" onChange={(e) => {
            setfoodDes(e.currentTarget.value);
          }}/>
        </Row>
        <JoinButton onClick={()=>addToWishList(food)}> Join </JoinButton>
      </WishContainer> */
  );
};

// const MyContainer = styled.label``;

const AddWishContainer = styled.div`
  display: block;
  width: 50%;
  hieght: 100%;
  background-color: white;
  transition: all 0.5s ease;
  overflow: hidden;
`;

const WishContainer = styled.div`
  display: block;
  width: 50%;
  hieght: 100%;
  background-color: white;
  transition: all 0.5s ease;
  overflow: hidden;
`;

const TopHeader = styled.div`
  width: 100%;
  margin-top: 15px;
  font-weight: 600;
  font-size: 20px;
  color: black;
`;


const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 15px;
  line-height: 35px;
`;

const Label = styled.label``;

const Input = styled.input`
  width: 150px;
  height: 35px;
  margin-left: 15px;
  padding-left: 10px;
  outline: none;
  border: none;
  border-radius: 5px;
`;

const Error = styled.div`
  margin-top: 10px;
  font-size: 20px;
  color: #e85a71;
`;

const JoinButton = styled.button`
  height: 40px;
  margin-top: 35px;
  outline: none;
  border: none;
  border-radius: 15px;
  color: #d8e9ef;
  background-color: #4ea1d3;
  font-size: 25px;
  font-weight: 500;

  :hover {
    background-color: #7bb1d1;
    cursor: pointer;
  }
`;
export default Wish;
