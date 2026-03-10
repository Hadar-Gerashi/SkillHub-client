import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}/external`

export const searchExternalCourses = (query) => {
    return axios.get(`${baseUrl}/search?q=${encodeURIComponent(query)}`)
}