import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Room from './Room';
import WishList from './WishList';

const PAGE_ROOM = 'foods';
const PAGE_WISHLIST = 'wishlist';

function App() {
  const [wishlist, setWishList] = useState([]);
  const [page, setPage] = useState(PAGE_ROOM);

  const navigateTo = (nextPage) => {
    setPage(nextPage);
  };


  return (
    <div className="App">
      <header>
        <button onClick={() => navigateTo(PAGE_WISHLIST)}>
          Wishlist
        </button>

        <button onClick={() => navigateTo(PAGE_ROOM)}>
          Back to Room
        </button>
      </header>
      
      {page === PAGE_ROOM && (
        <Room wishlist={wishlist} setWishList={setWishList} />
      )}
      {page === PAGE_WISHLIST && (
        <WishList wishlist={wishlist} setWishList={setWishList} />
      )}
    </div>
  );
}

export default App;
