import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HStack, Button } from "@chakra-ui/react";
import { Outlet } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { useLocation } from 'react-router-dom';

import {
    PaginationItems,
    PaginationNextTrigger,
    PaginationPrevTrigger,
    PaginationRoot,
} from "../../components/ui/pagination.jsx";
import { getAllCourses, getTotalPages } from '../../api/courseService.js';
import Course from '../../component/course/Course.jsx';
import DrawerCart from '../../component/cart/DrawerCart.jsx';
import Loading from '../../component/common/Loading.jsx';
import Footer from '../../component/layout/Footer.jsx';
import './CourseList.css';


const CoursesList = ({ type }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState("init");
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [isCourse, setIsCourse] = useState("");
    const drawerIsOpen = useSelector(state => state.cart.drawerIsOpen);
    const dispatch = useDispatch();
    const location = useLocation();

    const onDelete = (id) => {
        setCourses(courses.filter(item => item._id !== id));
    };

    useEffect(() => {
        if (location.pathname === "/") setIsCourse("");
    }, [location.pathname]);


    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading("pending");
                const res = await getAllCourses(currentPage);
                if (type === 'Show') {
                    setCourses(prev => prev.length === 0 ? res.data : [...prev, ...res.data]);
                } else {
                    setCourses(res.data);
                }
            } catch (err) {
                console.log(err);
                alert("Error fetching courses");
            } finally {
                setLoading("finish");
            }
        };

        fetchCourses();
    }, [currentPage]);

    useEffect(() => {
        const fetchTotalPages = async () => {
            try {
                const res = await getTotalPages();
                setTotalPages(res.data.pages);
            } catch (err) {
                console.log(err);
                alert("Error fetching courses");
            }
        };

        fetchTotalPages();
    }, []);


    return (
        <>
            {loading === "pending" ? (
                type === 'Show' ? (
                    <Stack className="loading-stack">
                        <CircularProgress color="inherit" />
                    </Stack>
                ) : (
                    <div className="loading-container">
                        <Loading />
                    </div>
                )
            ) : (
                <>
                    {type !== 'Show' && (
                        <div className="breadcrumb-container">
                            <a href="/home" className="breadcrumb-link">Home</a>
                            <span className="breadcrumb-arrow">&gt; </span>
                            <a href="/" className="breadcrumb-link">Courses</a>
                            <span className="breadcrumb-arrow">&gt; </span>
                            {isCourse && <span className="breadcrumb-link">{isCourse}</span>}
                        </div>
                    )}

                    <ul className="courses-list">
                        {courses.map(item => (
                            <li key={item._id} className="course-item">
                                <Course course={item} onDelete={onDelete} type={type} setIsCourse={setIsCourse} />
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {type !== 'Show' && (
                <>
                    <div className="pagination-container">
                        <PaginationRoot className="pagination-root" count={totalPages} pageSize={1} defaultPage={currentPage} onPageChange={(e) => setCurrentPage(e.page)}>
                            <HStack>
                                <PaginationPrevTrigger className="pagination-arrows" />
                                <PaginationItems className="pagination-numbers" />
                                <PaginationNextTrigger className="pagination-arrows" />
                            </HStack>
                        </PaginationRoot>
                    </div>
                    <Outlet />
                </>
            )}

            {type === 'Show' && currentPage !== totalPages && (
                <Button className="show-more-btn" onClick={() => setCurrentPage(prev => prev + 1)}>show more</Button>
            )}

            {type === 'Show' && <Footer />}
            {drawerIsOpen && <DrawerCart />}
        </>
    );
};

export default CoursesList;
