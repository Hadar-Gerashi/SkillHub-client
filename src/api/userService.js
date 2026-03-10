import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}/user`

//אפשרות לכניסת משתמש
export const login = (email, password) => {
    return axios.post(`${baseUrl}/logIn`, { email, password })
}

//אפשרות להוספת משתמש
export const signUp = (password, tz, email, name, role) => {
    return axios.post(`${baseUrl}`, { password, tz, email, name, role })
}

//קבלת כל המשתמשים
export const getUser = () => {
    return axios.get(`${baseUrl}`)
}

//קבלת משתמש לפי מזהה
export const getUserById = (id) => {
    return axios.get(`${baseUrl}/${id}`)
}

// שליחת בקשה להיות instructor
export const requestInstructor = (token) => {
    return axios.post(`${baseUrl}/instructor/request`, {}, {
        headers: { authorization: token }
    })
}

// קבלת כל הבקשות הממתינות ל - Instructor
export const getPendingInstructors = (token) => {
    return axios.get(`${baseUrl}/admin/pending-instructors`, {
        headers: { authorization: token }
    })
}

// אישור / דחיית בקשת Instructor
export const handleInstructorRequest = (userId, action, token) => {
    return axios.put(`${baseUrl}/admin/instructor/${userId}`, { action }, {
        headers: { authorization: token }
    })
}








