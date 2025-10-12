import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}/order`

//אפשרות להוספת הזמנה
export const addOrder = (data, token) => {
    return axios.post(`${baseUrl}`, data, {
        headers: {
            authorization: token
        }
    })
}

//אפשרות לקבלת רשימת הזמנות לפי משתמש
export const getOrderById = (id) => {
    return axios.get(`${baseUrl}/${id}`)
}

//אפשרות לקבלת כל ההזמנות שבוצעו
export const getOrders = () => {
    return axios.get(`${baseUrl}/`)
}





