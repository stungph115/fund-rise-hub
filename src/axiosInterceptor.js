import axios from 'axios'
import { useNavigation } from './hooks'
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify'
import { removeStoreUser } from './store/actions/userAction';
/* import socket from './socket'; */

export function useAxiosInterceptor() {
    const navigate = useNavigation()
    const dispatch = useDispatch()

    axios.interceptors.response.use(
        response => response,
        error => {
            if (error.response && error.response.status === 403) {
                navigate('/403')
            }
            if (error.response && error.response.status === 401) {
                /* socket.emit("remove-socket") */
                dispatch(removeStoreUser())
                toast.warn("Il semble que votre session a expiré, veuillez vous reconnecter", { autoClose: 5000, toastId: 'unauthorized' })
                if (window.location.pathname == '/') {
                    navigate('/sign-in')
                } else if (!window.location.pathname.includes('sign-in')) {
                    navigate('/sign-in?redirectUrl=' + window.location.pathname + window.location.search)
                }
            }
            return Promise.reject(error)
        }
    )

    axios.interceptors.request.use(config => {
        config.withCredentials = true
        return config
    })
}
