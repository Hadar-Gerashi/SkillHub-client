import axios from 'axios'

const baseUrl = "https://skillhub-1-a27y.onrender.com/api/course"
const baseUrlUpload = "https://skillhub-1-a27y.onrender.com/api/upload"
// const baseUrlUpload = "http://localhost:8000/api/upload"




//קבלת רשימת כל הקורסים
export const getAllCourses = (pageNum) => {
    return axios.get(`${baseUrl}/?page=${pageNum}&limit=12`)
}


//קבלת קורס בודד  
export const getCourse = (id) => {
    return axios.get(`${baseUrl}/${id}`)
}

//אפשרות למחיקת קורס  
export const deleteCourse = (id, token) => {
    console.log(token);
    return axios.delete(`${baseUrl}/${id}`, {
        headers: {
            authorization: token
        }
    })
}

//אפשרות להוספת קורס
export const addCourse = (course, token) => {
    console.log(token);
    return axios.post(`${baseUrl}`, course, {
        headers: {
            authorization: token
        }
    })
}

// עדכון קורס
export const updateCourse = (course, updateCourse, token) => {
    return axios.put(`${baseUrl}/${course._id}`, updateCourse, {
        headers: {
            authorization: token
        }
    })
}

// קבלת מספר העמודים שיש באתר
export const getTotalPages = () => {
    return axios.get(`${baseUrl}/getCount/?limit=12`)
}

// הוספת תמונה לשרת
export const addImage = (data) => {
    return axios.post(baseUrlUpload, data, {
        headers: { "Content-Type": "multipart/form-data" },
    })
}








