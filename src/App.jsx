import { Routes, Route } from 'react-router-dom'

import './App.css'
import CoursesList from './pages/courses/CoursesList.jsx'
import { Provider } from "../src/components/ui/provider"
import Cart from './pages/cart/Cart.jsx'
import CourseDetails from './pages/courses/CourseDetails.jsx'
import { SignUp } from './pages/auth/SignUp.jsx'
import Login from './pages/auth/Login.jsx'
import NavBar from './component/layout/NavBar.jsx'
import AddCourse from './pages/courses/AddCourseForm.jsx'
import Checkout from './pages/cart/Checkout.jsx'
import MyOrders from './pages/orders/MyOrders.jsx'
import HomePage from './pages/home/HomePage.jsx'
import Footer from './component/layout/Footer.jsx'
import ScrollToTop from './component/common/ScrollToTop.jsx'


function App() {

  return (

    <>
      <Provider>
        <NavBar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<CoursesList type={'list'} />} >
            <Route path="details/:id" element={<CourseDetails />} />
          </Route>
          <Route path="/cart" element={<Cart />} />
          <Route />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/add" element={<AddCourse key="Add" />} />
          <Route path="/edit/:id" element={<AddCourse key="Edit" />} />
          <Route path="/myOrders" element={<MyOrders status={"One"} key="One" />} />
          <Route path="/orders" element={<MyOrders status={"All"} key="All" />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        <Footer />
      </Provider>
    </>
  )
}

export default App





