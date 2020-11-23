import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import socket from '../../socket';
// import socket from '../../socket';

const AddWish = ({ displayAdd, setWishList, wishlist, userName, userFood}) => {

  const currentUser = sessionStorage.getItem('user');

  const [room] = useState([
    {
      userName: userName,
      foodImage: userFood,
    }
  ]);

  const addToWishList = (food, name) => {
    let newWishList = [...wishlist];
    let foodWished = {
      ...food,
      userdes: name, }
    ;
    newWishList.push(foodWished);
    setWishList(newWishList);
    displayAdd = false;
  };

  return (
      <AddWishContainer className={displayAdd ? '' : 'width0'}>
        <TopHeader>Add to Wish List</TopHeader>
        <Row>
          {room.map((food, idx) => (
            <div className="food" display="flex" key={idx}>
                  <p>{food.userName}</p>
                  <img src={food.foodImage} width="300" height="300" alt={food.userName} />
                  <label for="foodDes">Food name:</label>
                  <input type="text" id="foodDes" name="foodDes"></input>
                  <button onClick={()=>addToWishList(food, document.getElementById('foodDes'))}>
                    Add to Wishlist
                  </button>
            </div>
          ))}
        </Row>
      </AddWishContainer>
  );
};

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
export default AddWish;
