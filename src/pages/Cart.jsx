import React, { useState } from 'react';
import { useSelector } from "react-redux";
import './cart.css'

import EmptyCart from "./EmptyCart";
import CourseInCart from '../component/CourseInCart';
import Checkout from './Checkout';
import { Link as ScrollLink } from 'react-scroll';

const Cart = () => {
  let cartDetails = useSelector(state => state.cart.arr)
  let sum = useSelector(state => state.cart.sum)
  let count = useSelector(state => state.cart.count)
  const [cartItems, setCartItems] = useState(cartDetails);

  const [isBlinking, setIsBlinking] = useState(false);

  const handleCheckoutClick = () => {
    setIsBlinking(true);
    setTimeout(() => {
      setIsBlinking(false); // להפסיק את ההבהוב אחרי 3 שניות
    }, 3000);
  }

  const onDelete = (id) => {
    let copy = cartItems.filter(item => item._id !== id)
    setCartItems(copy)
  }


  return (
    <div style={{ height: "100%", marginBottom: "30%" }}>

      < div style={{ display: "flex", justifyContent: "center", marginTop: "5%" }}>
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: "#fafafa", width: '800px', margin: '20px 20px 20px 1px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h1 style={{ marginRight: "70%", fontSize: "20px" }}><b>Shopping cart</b> ({cartItems.length} Items)</h1>
          {cartDetails?.length ? <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <th style={{ padding: '10px', width: '40%' }}>Courses</th>
                <th style={{ padding: '10px' }}>Price</th>
                <th style={{ padding: '10px' }}>Quantity</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <CourseInCart key={item._id} course={item} onDelete={onDelete} />
              ))}
            </tbody>
          </table> : <EmptyCart />}


        </div>


        <div style={{ marginTop: '20px', width: "300px", height: "250px" }}>
          <div style={{ width: '100%', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginBottom: "-10px" }}>
            <h3 style={{ borderBottom: '1px solid #ddd' }}>Total</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Total:</span>
              <span>${sum}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Count:</span>
              <span>{count}</span>
            </div>
            <ScrollLink
              to="checkout-section"
              smooth={true}
              offset={-70}
              duration={1000}
              style={{
                backgroundColor: 'black',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                // marginTop: '30px',
                width: '100%',
                borderTop: '1px solid #ddd'
              }}
              onClick={handleCheckoutClick}
            >
              Checkout
            </ScrollLink>
            <p style={{ marginTop: '30px', display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
              We Accept:
              <img src="../images/mastercard.png" alt="Mastercard" style={{ margin: '0 5px', height: '20px', width: 'auto' }} />
              <img src="../images/american-express.png" alt="American Express" style={{ margin: '0 5px', height: '30px', width: 'auto' }} />
              <img src="../images/visa.png" alt="Visa" style={{ margin: '0 5px', height: '30px', width: 'auto' }} />

            </p>      </div>

          {/* אזור ה-Checkout */}
          <div id="checkout-section" className={isBlinking ? 'blinking' : ''}>
            <Checkout />
          </div>
        </div>



      </div></div>
  );
};

export default Cart;


