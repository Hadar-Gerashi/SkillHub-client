import { useState } from 'react';
import { useSelector } from "react-redux";
import { Link as ScrollLink } from 'react-scroll';

import EmptyCart from "./EmptyCart";
import CourseInCart from '../../component/cart/CourseInCart.jsx';
import Checkout from './Checkout';
import './Cart.css';

const Cart = () => {
  let cartDetails = useSelector(state => state.cart.arr)
  let sum = useSelector(state => state.cart.sum)
  let count = useSelector(state => state.cart.count)
  const [cartItems, setCartItems] = useState(cartDetails);

  const [isBlinking, setIsBlinking] = useState(false);

  const handleCheckoutClick = () => {
    setIsBlinking(true);
    setTimeout(() => {
      setIsBlinking(false);
    }, 3000);
  }

  const onDelete = (id) => {
    let copy = cartItems.filter(item => item._id !== id)
    setCartItems(copy)
  }

  return (
    <div className="cart-container">
      <div className="cart-main">
        <div className="cart-box">
          <h1 className="cart-title">Shopping cart ({cartItems.length} Items)</h1>
          {cartDetails?.length ? (
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Courses</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th className="remove-header">Remove</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <CourseInCart key={item._id} course={item} onDelete={onDelete} />
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyCart />
          )}
        </div>

        <div className="total-box">
          <div className="total-inner">
            <h3>Total</h3>
            <div className="total-row">
              <span>Total:</span>
              <span>${sum}</span>
            </div>
            <div className="total-row">
              <span>Count:</span>
              <span>{count}</span>
            </div>
            <ScrollLink
              to="checkout-section"
              smooth={true}
              offset={-70}
              duration={1000}
              className="checkout-link"
              onClick={handleCheckoutClick}
            >
              Checkout
            </ScrollLink>
            <p className="payment-methods">
              We Accept:
              <img src="../images/mastercard.png" alt="Mastercard" className="pay-logo mastercard" />
              <img src="../images/american-express.png" alt="American Express" className="pay-logo amex" />
              <img src="../images/visa.png" alt="Visa" className="pay-logo visa" />
            </p>
          </div>

          <div id="checkout-section" className={isBlinking ? 'blinking' : ''}>
            <Checkout />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
