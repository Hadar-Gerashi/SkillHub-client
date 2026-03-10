import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}/course`
const baseUrlUpload = `${import.meta.env.VITE_API_URL}/upload`

// קבלת רשימת כל הקורסים 
export const getAllCourses = (pageNum, search = "", categories = []) => {
    return axios.get(`${baseUrl}/?page=${pageNum}&limit=12&search=${search}&categories=${categories.join(",")}`)
}

// קבלת קורס בודד 
export const getCourse = (id) => {
    return axios.get(`${baseUrl}/${id}`)
}

// קבלת מספר העמודים שיש באתר
export const getTotalPages = (search = "", categories = []) => {
    return axios.get(`${baseUrl}/getCount/?limit=12&search=${search}&categories=${categories.join(",")}`)
}

// קבלת קטגוריות של קורסים
export const getCategories = () => {
    return axios.get(`${baseUrl}/categories`)
}

// הוספת תמונה לשרת
export const addImage = (data) => {
    return axios.post(baseUrlUpload, data, {
        headers: { "Content-Type": "multipart/form-data" },
    })
}

// אפשרות להוספת קורס 
export const addCourse = (course, token) => {
    return axios.post(`${baseUrl}`, course, {
        headers: { authorization: token }
    })
}

// אפשרות למחיקת קורס  
export const deleteCourse = (id, token) => {
    return axios.delete(`${baseUrl}/${id}`, {
        headers: { authorization: token }
    })
}

// עדכון קורס
export const updateCourse = (course, updateData, token) => {
    return axios.put(`${baseUrl}/${course._id}`, updateData, {
        headers: { authorization: token }
    })
}

// קבלת כל הקורסים הממתינים לאישור
export const getPendingCourses = (token) => {
    return axios.get(`${baseUrl}/admin/pending`, {
        headers: { authorization: token }
    })
}

// אישור / דחיית קורס
export const handleCourseApproval = (courseId, action, token) => {
    return axios.put(`${baseUrl}/admin/approve/${courseId}`, { action }, {
        headers: { authorization: token }
    })
}

// קבלת כל הקורסים של המשתמש המחובר
export const getMyCourses = (token) => {
    return axios.get(`${baseUrl}/my/courses`, {
        headers: { authorization: token }
    })
}

// שליחת קורס לעריכה מחדש
export const submitCourseEdit = (courseId, editData, token) => {
    return axios.put(`${baseUrl}/${courseId}`, editData, {
        headers: { authorization: token }
    })
}

// שליחת קורס לאישור מחדש לאחר דחייה
export const resubmitCourse = (courseId, token) => {
    return axios.put(`${baseUrl}/resubmit/${courseId}`, {}, {
        headers: { authorization: token }
    })
}