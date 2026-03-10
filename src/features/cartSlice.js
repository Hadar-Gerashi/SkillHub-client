import { createSlice } from "@reduxjs/toolkit"

const updateLocalStorage = (state) => {
    localStorage.setItem('cart', JSON.stringify(state.arr))
    localStorage.setItem('sum', state.sum)
    localStorage.setItem('count', state.count)
}

const initialState = {
    arr: JSON.parse(localStorage.getItem('cart')) || [],
    sum: JSON.parse(localStorage.getItem('sum')) || 0,
    count: JSON.parse(localStorage.getItem('count')) || 0,
    drawerIsOpen: false
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const course = action.payload;
            const index = state.arr.findIndex(item => item._id === course._id);
            if (index === -1) {
                state.arr.push({
                    ...course,
                    qty: 1,
                    checked: true
                });
                state.sum += course.price;
                state.count += 1;
            }
            else {
                const item = state.arr[index];
                if (item.qty === 5) return;
                if (!item.checked) {
                    item.checked = true;
                    state.sum += item.price * item.qty;
                    state.count += item.qty;
                }
                item.qty += 1;
                state.sum += item.price;
                state.count += 1;
            }
            updateLocalStorage(state);
        }
        ,
        removeFromCart: (state, action) => {
            let index = state.arr.findIndex(course => course._id == action.payload)
            if (state.arr[index].checked == true) {
                state.sum -= (state.arr[index].price * state.arr[index].qty);
                state.count -= state.arr[index].qty;
            }
            state.arr.splice(index, 1)
            updateLocalStorage(state)
        },
        decreaseQty: (state, action) => {

            let index = state.arr.findIndex(course => course._id == action.payload._id)
            state.arr[index].qty -= 1
            if (state.arr[index].checked == true) {
                state.sum -= action.payload.price;
                state.count -= 1;
            }
            updateLocalStorage(state)

        },
        increaseQty: (state, action) => {

            let index = state.arr.findIndex(course => course._id == action.payload._id)
            state.arr[index].qty += 1
            if (state.arr[index].checked == true) {
                state.sum += action.payload.price;
                state.count += 1;
            }
            updateLocalStorage(state)

        },
        isOpenDrawer: (state, action) => {
            state.drawerIsOpen = action.payload
        },
        deleteCart: (state) => {
            state.sum = 0;
            state.count = 0;
            state.arr = [];
            updateLocalStorage(state)
        }
        ,
        updateCourseInCart: (state, action) => {
            const { id, data } = action.payload;
            let index = state.arr.findIndex(item => item._id === id);
            if (index !== -1) {
                const oldPrice = state.arr[index].price;
                const oldQty = state.arr[index].qty;
                state.arr[index] = { ...state.arr[index], ...data };
                const newPrice = state.arr[index].price;
                state.sum = parseFloat(state.sum) || 0;
                state.sum += (newPrice - oldPrice) * oldQty;
                updateLocalStorage(state)
            }
        },
        checkboxRemove: (state, action) => {
            let index = state.arr.findIndex(course => course._id == action.payload)
            let copy = { ...state.arr[index], checked: false }
            state.arr[index] = copy
            state.sum -= (state.arr[index].price * state.arr[index].qty);
            state.count -= state.arr[index].qty;
            updateLocalStorage(state)

        },
        checkboxAdd: (state, action) => {
            let index = state.arr.findIndex(course => course._id == action.payload)
            let copy = { ...state.arr[index], checked: true }
            state.arr[index] = copy
            state.sum += (state.arr[index].price * state.arr[index].qty);
            state.count += state.arr[index].qty;
            updateLocalStorage(state)
        },
    }
})



export const { increaseQty, checkboxAdd, checkboxRemove, updateCourseInCart, deleteCart, decreaseQty, addToCart, removeFromCart, isOpenDrawer } = cartSlice.actions
export default cartSlice.reducer


