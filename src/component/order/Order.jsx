import { useState } from "react";
import { Card, CardContent, Typography, List, ListItem, Divider } from "@mui/material";

import CourseInOrder from "./CourseInOrder";

const Order = ({ order }) => {
    const [courses] = useState(order.courses);

    return (
        <Card sx={{ width: "80%", mx: "auto", my: 2, p: 2, boxShadow: 3, borderRadius: 2 }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>

                <Typography>
                    date: {order.date.substring(0, 10)}
                </Typography>
                <Typography>
                    courses: {order.count}
                </Typography>
                <Typography>
                    price: {order.totalSum}$
                </Typography>

                <Divider sx={{ my: 2, width: "100%" }} />

                <List sx={{ width: "100%" }}>
                    <ListItem sx={{ p: 1, borderBottom: "1px solid #ddd", textAlign: "left" }}>
                        {courses.map((item) => (
                            <CourseInOrder course={item} />

                        ))}
                    </ListItem>
                </List>
            </CardContent>

        </Card>
    );
};

export default Order;
