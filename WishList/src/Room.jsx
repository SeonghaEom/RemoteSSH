import React, { useState } from 'react';


export default function Products({ setWishList, wishlist }) {
  
  const [room] = useState([
    {
      userImage:
        'https://toppng.com/uploads/preview/stock-person-png-stock-photo-man-11563049686zqeb9zmqjd.png',
      userName: 'User Name 1',
      foodImage:
        'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    },
    {
      userImage:
      'https://toppng.com/uploads/preview/stock-person-png-stock-photo-man-11563049686zqeb9zmqjd.png',
      userName: 'User Name 2',
      foodImage:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RedDot_Burger.jpg/1200px-RedDot_Burger.jpg',
    },
  ]);

  const addToWishList = (food) => {
    let newCart = [...wishlist];
    let itemInCart = {...food,};
    newCart.push(itemInCart);
    setWishList(newCart);
  };

  return (
    <>
      <h1>Room</h1>
      <div className="room" class="row">
        {room.map((food, idx) => (
          <div className="food" display="flex" key={idx}>
                <img src={food.userImage} width="300" height="300" alt={food.userName} />
                <p>{food.userName}</p>
                <img src={food.foodImage} width="300" height="300" alt={food.userName} />
                <button onClick={()=>addToWishList(food)}>
                  Add to Wishlist
                </button>
          </div>
        ))}
      </div>
    </>
  );
}
