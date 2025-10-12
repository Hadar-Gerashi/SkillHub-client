import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { isOpenDrawer } from '../../features/cartSlice.js';
import IsChecked from '../common/IsChecked.jsx';
import './DrawerCart.css';

//קומפוננטה להצגת סל קניות מוקטן
export default function DrawerCart() {

    let drawerIsOpen = useSelector(state => state.cart.drawerIsOpen)
    let cartDetails = useSelector(state => state.cart.arr)
    let sum = useSelector(state => state.cart.sum)
    let count = useSelector(state => state.cart.count)

    let dispatch = useDispatch()

    const [cartItems, setCartItems] = useState(
        cartDetails
    );

    const subtotal = sum;

    useEffect(() => {
        if (drawerIsOpen) {
            const timer = setTimeout(() => {
                dispatch(isOpenDrawer(false));
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [drawerIsOpen]);

    return (
        <div>
            <Drawer
                open={drawerIsOpen}
                variant="persistent"
                className="drawer-style"
            >
                <Box sx={{ width: 420 }} />
                <div className="drawer-header">
                    <h2 className="drawer-title">Shopping cart</h2>
                    <span
                        onClick={() => { dispatch(isOpenDrawer(false)) }}
                        className="drawer-close"
                    >
                        X
                    </span>
                </div>
                {cartItems.map((item) => (
                    <div key={item._id} className="drawer-item">
                        <IsChecked course={item} checked={item.checked} dis={false} />
                        <img
                            src={`${import.meta.env.VITE_CLOUDINARY_URL}/${item?.img}`}
                            alt={item.name}
                            className="drawer-item-img"
                        />
                        <div>
                            <div className="drawer-item-name">{item.name}</div>
                            <div>Quantity: {item.qty}</div>
                        </div>
                        <div className="drawer-item-price">${item.price}</div>
                    </div>
                ))}
                <div className="drawer-footer">
                    <div>
                        <p><u>Subtotal</u>: ${subtotal}</p>
                        <p className="drawer-count"><u>Count</u>: {count}</p>
                    </div>
                    <button className="drawer-btn">
                        <Link to="/cart" onClick={() => dispatch(isOpenDrawer(false))}>
                            Checkout
                        </Link>
                    </button>
                </div>
            </Drawer>
        </div>
    );
}
