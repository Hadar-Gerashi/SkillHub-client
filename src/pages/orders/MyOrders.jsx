import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

import Order from "../../component/order/Order";
import { getOrderById, getOrders } from '../../api/ordersService'


const MyOrders = ({ status }) => {
    let user = useSelector(state => state.users.currentUser)
    const [orders, setOrders] = useState([])

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (status === "One") {
                    const res = await getOrderById(user._id);
                    setOrders(res.data);
                    console.log(res.data);
                } else if (status === "All") {
                    const res = await getOrders();
                    setOrders(res.data);
                    console.log(res.data);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchOrders();
    }, []);




    return (<>

        <ul style={{ marginTop: "5%" }}>
            <h1 style={{ color: "white", textAlign: "left", marginLeft: "11%", fontSize: "2rem" }}>
                {status === "One" ? <span>- My</span> : <span>- All</span>} orders -
            </h1>
            {orders.map(item => (
                <li key={item._id} >
                    <Order order={item} />
                </li>
            ))}
        </ul>

    </>)
}

export default MyOrders;