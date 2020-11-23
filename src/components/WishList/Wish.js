import React, { useEffect, useState, useRef, useHistory } from 'react';
import styled from 'styled-components';
import socket from '../../socket';
// import socket from '../../socket';

const Wish = ({display, setWishList, wishlist, goToScreen}) => {

  const currentUser = sessionStorage.getItem('user');

  const removeFromWishList = (foodToRemove) => {
    setWishList(
      wishlist.filter((food) => food !== foodToRemove)
    );
  };

  // const history = useHistory();

  
  return <div className='roomlist-background'>
              <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'start'}}>
                <div className="close" onClick={(e) => {goToScreen(e); }}></div>
                <div style={{color: 'white', fontSize: '26px', marginTop: '40px'}}>
                  Add To Wish List
                </div>
              </div>
              <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'start'}} >
                {wishlist.map((food, idx) => (
                  <div className="roomlist-container">
                        <img src={food.foodImage} width="300" height="300" alt={food.userName} />
                        <p>{food.foodName}</p>
                        <p>From {food.userName}</p>
                        <button className="primary-button" onClick={() => removeFromWishList(food)}>Remove</button>
                  </div>
                ))}
              </div>  
          </div>;
};


export default Wish;
