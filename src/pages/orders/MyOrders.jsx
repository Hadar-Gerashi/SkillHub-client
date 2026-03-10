import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

import Order from "../../component/order/Order";
import { getOrderById, getOrders } from "../../api/ordersService";
import { getUserById } from "../../api/userService";
import Loading from "../../component/common/Loading.jsx";
import "./MyOrders.css";

const MyOrders = ({ status }) => {
    const currentUser = useSelector(state => state.users.currentUser);

    const [orders, setOrders] = useState([]);
    const [usersMap, setUsersMap] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser && status === "One") return;

        const fetchData = async () => {
            try {
                setLoading(true);

                let ordersData = [];

                if (status === "One") {
                    const res = await getOrderById(currentUser._id);
                    ordersData = Array.isArray(res.data) ? res.data : [res.data];
                } else if (status === "All") {
                    const res = await getOrders();
                    ordersData = res.data;
                }

                setOrders(ordersData);

                if (status === "All") {
                    const uniqueUserIds = [...new Set(ordersData.map(o => o.userId))];

                    const usersResponses = await Promise.all(
                        uniqueUserIds.map(id => getUserById(id))
                    );

                    const map = {};
                    usersResponses.forEach(res => {
                        map[res.data._id] = res.data;
                    });

                    setUsersMap(map);
                }

            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser, status]);

    if (loading) {
        return (
            <div className="loading-container">
                <Loading />
            </div>
        );
    }

    return (
        <>
            <h1 className="orders-title">
                {status === "One" ? "- My orders -" : "- All orders -"}
            </h1>

            {orders.map(order => (
                <Order
                    key={order._id}
                    order={order}
                    status={status}
                    user={usersMap[order.userId]}
                />
            ))}
        </>
    );
};

export default MyOrders;