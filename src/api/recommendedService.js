import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}/recommend`

export const getRecommended = (token, limit = 6) => {
    return axios.get(`${baseUrl}?limit=${limit}`, {
        headers: {
            Authorization: token
        }
    })
}