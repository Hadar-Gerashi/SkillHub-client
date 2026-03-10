import { useEffect, useState, useRef } from 'react';
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
import { getAllCourses, getTotalPages, getCategories } from '../../api/courseService.js';
import Course from '../../component/course/Course.jsx';
import ExternalCourse from '../../component/course/ExternalCourse.jsx';
import DrawerCart from '../../component/cart/DrawerCart.jsx';
import Loading from '../../component/common/Loading.jsx';
import Footer from '../../component/layout/Footer.jsx';
import './CourseList.css';
import { searchExternalCourses } from '../../api/externalService.js';

const CoursesList = ({ type }) => {
    const [courses, setCourses] = useState([]);
    const [externalCourses, setExternalCourses] = useState([]);
    const [loading, setLoading] = useState("init");
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [isCourse, setIsCourse] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const drawerIsOpen = useSelector(state => state.cart.drawerIsOpen);
    const dispatch = useDispatch();
    const location = useLocation();

    const isAppendRef = useRef(false);

    const onDelete = (id) => {
        setCourses(courses.filter(item => item._id !== id));
    };

    useEffect(() => {
        if (location.pathname === "/") setIsCourse("");
    }, [location.pathname]);

    useEffect(() => {
        if (type === 'Show') {
            if (currentPage === 1) {
                setCourses([]);
                isAppendRef.current = false;
            } else {
                isAppendRef.current = true;
            }
        }
    }, [currentPage, type]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategories();
                setCategories(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategories]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading("pending");
                const res = await getAllCourses(currentPage, debouncedSearch, selectedCategories);
                if (type === 'Show') {
                    if (isAppendRef.current) {
                        setCourses(prev => [...prev, ...res.data]);
                    } else {
                        setCourses(res.data);
                    }
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
    }, [currentPage, debouncedSearch, selectedCategories]);

    useEffect(() => {
        const fetchTotalPages = async () => {
            try {
                const res = await getTotalPages(debouncedSearch, selectedCategories);
                setTotalPages(res.data.pages);
            } catch (err) {
                console.log(err);
            }
        };
        fetchTotalPages();
    }, [debouncedSearch, selectedCategories]);

    useEffect(() => {
        if (!debouncedSearch) { setExternalCourses([]); return; }
        const fetchExternal = async () => {
            try {
                const res = await searchExternalCourses(debouncedSearch);
                setExternalCourses(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchExternal();
    }, [debouncedSearch]);

    const toggleCategory = (cat) => {
        setSelectedCategories(prev =>
            prev.includes(cat)
                ? prev.filter(c => c !== cat)
                : [...prev, cat]
        );
    };

    return (
        <>
            {type !== 'Show' && (
                <>
                    <div
                        className={`filter-overlay ${filterOpen ? "open" : ""}`}
                        onClick={() => setFilterOpen(false)}
                    />
                    <div className={`filter-drawer ${filterOpen ? "open" : ""}`}>
                        <div className="filter-drawer-header">
                            <span>Filter by Category</span>
                            <button className="filter-drawer-close" onClick={() => setFilterOpen(false)}>✕</button>
                        </div>
                        {selectedCategories.length > 0 && (
                            <button className="filter-clear-all" onClick={() => setSelectedCategories([])}>
                                Clear all ({selectedCategories.length})
                            </button>
                        )}
                        <div className="filter-drawer-list">
                            {categories.map(cat => (
                                <label key={cat} className="filter-drawer-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat)}
                                        onChange={() => toggleCategory(cat)}
                                        className="filter-checkbox"
                                    />
                                    <span>{cat.charAt(0) + cat.slice(1).toLowerCase()}</span>
                                    {selectedCategories.includes(cat) && (
                                        <span className="filter-check-mark">✓</span>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>
                </>
            )}

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

                    {type !== 'Show' && (
                        <div className="search-filter-bar">
                            <div className="search-wrapper">
                                <span className="search-icon">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search courses..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onBlur={() => setDebouncedSearch(searchTerm)}
                                />
                                {searchTerm && (
                                    <button className="search-clear-btn" onClick={() => setSearchTerm("")}>✕</button>
                                )}
                            </div>
                            <button
                                className={`filter-btn ${selectedCategories.length > 0 ? "has-filters" : ""}`}
                                onClick={() => setFilterOpen(true)}
                            >
                                <span>⚙ Filter</span>
                                {selectedCategories.length > 0 && (
                                    <span className="filter-badge">{selectedCategories.length}</span>
                                )}
                            </button>
                        </div>
                    )}

                    {type !== 'Show' && selectedCategories.length > 0 && (
                        <div className="active-filters">
                            {selectedCategories.map(cat => (
                                <span key={cat} className="active-chip">
                                    {cat.charAt(0) + cat.slice(1).toLowerCase()}
                                    <button onClick={() => toggleCategory(cat)}>✕</button>
                                </span>
                            ))}
                        </div>
                    )}

                    {courses.length === 0 && externalCourses.length === 0 ? (
                        <div className="no-results">
                            <p>No courses found
                                {searchTerm ? ` for "${searchTerm}"` : ""}
                                {selectedCategories.length > 0 ? ` in "${selectedCategories.join(", ")}"` : ""}.
                            </p>
                        </div>
                    ) : courses.length > 0 ? (
                        <ul className="courses-list">
                            {courses.map(item => (
                                <li key={item._id} className="course-item">
                                    <Course course={item} onDelete={onDelete} type={type} setIsCourse={setIsCourse} />
                                </li>
                            ))}
                        </ul>
                    ) : null}

                    {type !== 'Show' && externalCourses.length > 0 && (
                        <>
                            <div className="external-courses-divider">
                                <span className="external-courses-divider__line" />
                                External Courses from Udemy
                                <span className="external-courses-divider__line" />
                            </div>
                            <ul className="courses-list">
                                {externalCourses.map((item, i) => (
                                    <li key={i} className="course-item">
                                        <ExternalCourse course={item} />
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
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