import { Card, CardContent, Typography, List, ListItem, Divider } from "@mui/material";
import CourseInOrder from "./CourseInOrder";

const Order = ({ order, status, user }) => {

    return (
        <Card sx={{ width: "80%", mx: "auto", my: 2, p: 2, boxShadow: 3, borderRadius: 2 }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>

                {status === "All" && user && (
                    <>
                        <Typography>
                            <b>User Name:</b> {user.name}
                        </Typography>
                        <Typography>
                            <b>User Email:</b> {user.email}
                        </Typography>
                    </>
                )}

                <Typography>
                    <b>Date:</b> {order.date.substring(0, 10)}
                </Typography>

                <Typography>
                    <b>Courses:</b> {order.count}
                </Typography>

                <Typography>
                    <b>Price:</b> {order.totalSum.toLocaleString()}$
                </Typography>

                <Divider sx={{ my: 2, width: "100%" }} />

                <List sx={{ width: "100%" }}>
                    {order.courses.map((item) => (
                        <ListItem key={item._id} sx={{ p: 1, borderBottom: "1px solid #ddd", textAlign: "left" }}>
                            <CourseInOrder course={item} />
                        </ListItem>
                    ))}
                </List>

            </CardContent>
        </Card>
    );
};

export default Order;