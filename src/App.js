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
import { useEffect, useState } from 'react'
import axios from 'axios'
import { env } from './env'
import axiosConfig from './utils/axiosConfig';
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useAxiosInterceptor } from './axiosInterceptor'
import { socket } from './utils/socket'


function App() {
  //current user
  const user = useSelector((state) => state.userReducer)

  useAxiosInterceptor()
  const navigate = useNavigate()
  // get tokenJWT from store
  const tokenJWTStore = useSelector((state) => state.userReducer.tokenJWT)
  setAuthToken(tokenJWTStore)

  useEffect(() => {
    if (user.id && tokenJWTStore) {
      axios.post(env.URL + "user/verifSignIn", {
        tokenJWT: tokenJWTStore
      }).then((res) => {
        if (res.data === "TOKENJWT_VERIFIED") {
          console.log('check sign in res: ',res)
          socket.emit("user-connect", user.id)
        }
      }).catch((error) => {
         console.log('check sign in err: ',error)
        console.log("error :\n" + JSON.stringify(error) + "\n\n")
      })
    }
  }, [user.id])


  const stripePromise = loadStripe(env.PUBLIC_KEY_STRIPE)
  const [categories, setCategories] = useState([])
  function getCategories() {
    axios.get(env.URL + 'category')
      .then((res) => {
        if (res.data) {
          setCategories(res.data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  useEffect(() => {
    getCategories()
  }, [])

  return (
    <div className="App">
      <Header />
      <div className='app-body'>
        <ToastContainer position='top-left' theme='light' style={{ marginTop: "12vh" }}
        />
        <Elements stripe={stripePromise}>
          <AppRoutes categories={categories} />
        </Elements>
      </div>
      <Footer />
      <NotificationWindows />
    </div>
  )
}

export default App
