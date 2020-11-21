import React from 'react';

export default function WishList({ wishlist, setWishList }) {

  const removeFromWishList = (foodToRemove) => {
    setWishList(
      wishlist.filter((food) => food !== foodToRemove)
    );
  };

  return (
    <>
      <h1>Your Wish List</h1>
      <div className="foods" class="row">
        {wishlist.map((food, idx) => (
          <div className="food" display="flex" key={idx}>
            <h3>{food.userName}</h3>
            <img src={food.foodImage} width="300" height="300" alt={food.userName} />
            <button onClick={() => removeFromWishList(food)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
