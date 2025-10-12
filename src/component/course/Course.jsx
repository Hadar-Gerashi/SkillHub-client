import { Badge, Box, Button, Card, HStack, Image } from "@chakra-ui/react"
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';


import { deleteCourse } from '../../api/courseService.js'
import { removeFromCart, addToCart, isOpenDrawer } from '../../features/cartSlice.js'
import AlertDialog from "../common/AlertDialog.jsx";
import './Course.css'


// קומפוננטה של קורס בודד ברשימת הקורסים
const Course = ({ course, onDelete, type, setIsCourse }) => {
    let dispatch = useDispatch()
    let navigate = useNavigate()
    let user = useSelector(state => state.users.currentUser)

    const deleted = async () => {
        try {
            await deleteCourse(course._id, user?.token)
            onDelete(course._id)
            dispatch(removeFromCart(course._id))
        }
        catch (ex) {
            if (ex.response.status === 401)
                navigate('/login')
            console.log(ex);
            alert(ex.response.data.message)
        }
    };

    return (
        <Card.Root flexDirection="row" overflow="hidden" height="246px" width="390px" border="none">

            <Image
                objectFit="cover"
                width="30%"
                height="246px"
                src={`${import.meta.env.VITE_CLOUDINARY_URL}/${course?.img}`}
                alt={`${course?.name} image`}
            />

            <Box>

                <Card.Body>
                    <Card.Title mb="2">{course?.name[0].toUpperCase() + course?.name.slice(1).toLowerCase()}</Card.Title>
                    <Card.Description className="description" >
                        {course?.motivation}
                    </Card.Description>
                    <HStack mt="4">
                        {course?.categories.map((item) => (
                            <Badge key={item}>{item[0].toUpperCase() + item.slice(1).toLowerCase()}</Badge>
                        ))}
                    </HStack>
                </Card.Body>

                <Card.Footer>
                    <HStack spacing={4}>
                        {type == 'Show' &&
                            <Link to={"/details/" + course?._id} target="_blank" rel="noopener noreferrer">
                                <Button>Show Details</Button>
                            </Link>}

                        {type != 'Show' &&
                            <Link to={"details/" + course?._id}>
                                <Button onClick={() => { setIsCourse(course?.name) }}>Show Details</Button>
                            </Link>}
                        <button
                            className="add-to-cart"
                            onClick={() => {
                                dispatch(addToCart(course))
                                dispatch(isOpenDrawer(true))
                            }}
                        >
                            <AddShoppingCartIcon sx={{ color: "black" }} />
                        </button>
                        {user?.role === "ADMIN" && <AlertDialog deleted={deleted} />}
                        {user?.role === "ADMIN" && (
                            <button
                                onClick={() => {
                                    navigate(`/edit/${course?._id}`, { state: { status: "EDIT", details: { course } } })
                                }}
                            >
                                <DriveFileRenameOutlineOutlinedIcon />
                            </button>
                        )}

                    </HStack>
                </Card.Footer>

            </Box>

        </Card.Root>
    );
};

export default Course;

