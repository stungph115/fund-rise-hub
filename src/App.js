import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import 'react-notifications-component/dist/theme.css'
import NotificationWindows from './NotificationWindows'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import AppRoutes from './components/Routes'
import ZipCodeLocator from './components/Location/Location'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import setAuthToken from './utils/axiosConfig'
import { useEffect } from 'react'
import axios from 'axios'
import { env } from './env'
import axiosConfig from './utils/axiosConfig';
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useAxiosInterceptor } from './axiosInterceptor'

const stripePromise = loadStripe(env.PUBLIC_KEY_STRIPE)

function App() {
  useAxiosInterceptor()
  const navigate = useNavigate()
  // get tokenJWT from store
  const tokenJWTStore = useSelector((state) => state.userReducer.tokenJWT)
  setAuthToken(tokenJWTStore)
  return (
    <div className="App">
      <Header />
      <div className='app-body'>
        <ToastContainer position='top-left' theme='light' style={{ marginTop: "12vh" }}
        />
        <Elements stripe={stripePromise}>
          <AppRoutes />
        </Elements>
      </div>
      <Footer />
      <NotificationWindows />
    </div>
  )
}

export default App
