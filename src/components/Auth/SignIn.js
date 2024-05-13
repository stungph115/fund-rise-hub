import { useEffect, useRef, useState } from 'react'
import '../../styles/Auth/SignIn.css'
import InputEmail from '../Input/InputEmail'
import InputPassword from '../Input/InputPassword'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { Fade } from 'react-reveal'
import sha512 from 'js-sha512'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { env } from '../../env'
import { toast } from 'react-toastify'
import { saveStoreUser } from '../../store/actions/userAction'
import jwt_decode from "jwt-decode"
import setAuthToken from '../../utils/axiosConfig'

function SignIn() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const saveInfoUser = (userData) => dispatch(saveStoreUser(userData))

    const emailRef = useRef()
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState(null)

    const passwordRef = useRef()
    const [password, setPassword] = useState("")
    const [passwordError, setPasswordError] = useState(null)

    //loading
    const [isLoading, setIsLoading] = useState(false)
    //disable
    const [signInDisabled, setSignInDisabled] = useState(true)

    useEffect(() => {
        if (emailError || passwordError || email === "" || password === "") {
            setSignInDisabled(true)
        } else {
            setSignInDisabled(false)
        }
    }, [emailError, passwordError, email, password])
    function signIn() {
        setIsLoading(true)
        const passwordFormat = sha512(password).slice(10, 40)
        const toastId = toast.loading("Connexion...")
        axios.post(env.URL + 'user/signIn', {
            email: email,
            password: passwordFormat
        },).then((response) => {
            if (response.data) {
                const JWTDecoded = jwt_decode(response.data)
                saveInfoUser({ role: JWTDecoded.role.name, email: JWTDecoded.email, firstname: JWTDecoded.firstname, lastname: JWTDecoded.lastname, tokenJWT: response.data, id: JWTDecoded.id, photo: JWTDecoded.photo })
                setAuthToken(response.data)
                const toastMessage = <span>Bonjour, <strong>{JWTDecoded.firstname}</strong></span>;
                toast.update(toastId, { render: toastMessage, type: "success", isLoading: false, autoClose: 5000 })
                navigate('/')
                setIsLoading(false)
            }
        }).catch((error) => {
            var err
            if (error.response.data === 'USER_NOT_FOUND') {
                err = "L'utilisateur est introuvable"
            } else if (error.response.data === 'ERROR_PASS') {
                err = "Le mot de passe est incorrect"
            } else if (error.response.data === 'ERROR_TOKENJWT') {
                err = "Erreur lors de la création du token de connexion"
            }
            toast.update(toastId, { render: err, type: "error", isLoading: false, autoClose: 5000 })
            setIsLoading(false)
        })
    }

    return (
        <Fade right>
            <div className='sign-in-wrapper'>
                <div className='sign-in-title'>Connexion</div>
                <InputEmail
                    ref={emailRef}
                    email={email} setEmail={setEmail}
                    emailError={emailError} setEmailError={setEmailError}
                    placeholder={"E-mail"}
                />
                <InputPassword
                    ref={passwordRef}
                    password={password} setPassword={setPassword}
                    passwordError={passwordError} setPasswordError={setPasswordError}
                    placeholder={"Mot de passe"}
                    onPressEnter={() => signInDisabled ? null : signIn()}
                />
                <div style={{ paddingBlock: 10 }}><Link to='/forget-password' >Mot de passe oublié ?</Link></div>

                <Button className='button-sign-in' variant="success" onClick={() => signIn()} disabled={signInDisabled}> Se connecter</Button>
                <div className='sign-in-link-sign-up' style={{ fontSize: 18, fontWeight: 500 }}>
                    Nouveau client ? <Link to='/sign-up' style={{ marginLeft: 10 }}> Créer votre compte</Link>
                </div>
            </div>
        </Fade>
    )
}
export default SignIn