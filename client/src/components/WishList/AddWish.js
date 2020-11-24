import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import Form from 'react-bootstrap/Form'
import {Link} from 'react-router-dom'
import socket from '../../socket';
import Modal from 'react-bootstrap/Modal';
// import socket from '../../socket';

//for firebase
// import firebase from '../../config/fbconfig'
import storage from '../../config/fbconfig'
import firestore from '../../config/fbconfig'
import * as firebase from 'firebase'

const AddWish = ({ display, setWishList, wishlist, userName, userFood, goToScreen}) => {

  const [room] = useState([
    {
      userName: userName,
      foodImage: userFood,
      foodName: "",
    }
  ]);
  
  const [show, setShow] = useState(false);
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const addToWishList = (food) => {
    let newWishList = [...wishlist];
    let foodWished = {
      ...food,
    }
    newWishList.push(foodWished);
    setWishList(newWishList);
    setTimeout(handleShow, 1000);
    
  };

  return <div className='roomlist-background'>
              <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'start'}}>
                <div className="close" onClick={goToScreen}></div>
                <div style={{color: 'white', fontSize: '26px', marginTop: '40px'}}>
                  Add To Wish List
                </div>
              </div>
              <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'start'}} >
                {room.map((food, idx) => (
                  <div className="roomlist-container">
                        <p>{food.userName}</p>
                        <img src={food.foodImage} width="300" height="300" alt={food.userName} />
                         <Form className="food-forms">
                            <Form.Group controlId="formFoodName" className="form-basic">
                                <div>
                                  <Form.Label>Food Name</Form.Label>
                                  <Form.Control type="text" id="foodname" 
                                  placeholder="Example: DaehagSaeng Chicken" />
                                </div>
                            </Form.Group>
                          </Form>
                          <button className="primary-button" onClick={() => addToWishList({
                            userName: food.userName,
                            foodImage: food.foodImage,
                            foodName: document.getElementById("foodname").value,
                          })}>Add Food</button>
                          <Modal show={show} onHide={handleClose}>
                            <Modal.Body>Woohoo, you added something</Modal.Body>
                          </Modal>
                  </div>
                ))}
              </div>  
          </div>;
};

export default AddWish;
