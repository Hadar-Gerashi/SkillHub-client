import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}/ai`

export const enhanceCourse = (name, token) => {
    return axios.post(`${baseUrl}/enhance-course`, { name }, {
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        }
    })
}