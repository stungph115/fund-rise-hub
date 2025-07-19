import { Link, useParams } from "react-router-dom"
import SuccessCheckAnimation from "../Animation/SuccessCheckAnimation"
import { useSelector } from "react-redux"

function PaymentSuccess() {
    const currentUser = useSelector((state) => state.userReducer)
    const idProject = useParams().idProject

    return (
        <div className='sign-up-wrapper' >
            <div className='sign-in-title' style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Payment réussit</div>
            <div style={{ padding: 20 }}><SuccessCheckAnimation /></div>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'center', fontSize: 18, padding: 10 }}>
                {idProject && <Link to={'/project/' + idProject} style={{ marginLeft: 10 }}>Retourner au projet</Link>}
            </div>

        </div>
    )
}
export default PaymentSuccess