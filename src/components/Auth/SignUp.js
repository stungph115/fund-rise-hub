import { Link } from 'react-router-dom'
import '../../styles/Auth/SignUp.css'
import { useEffect, useRef, useState } from 'react'
import InputEmail from '../Input/InputEmail'
import InputPassword from '../Input/InputPassword'
import { Button } from 'react-bootstrap'
import InputPhone from '../Input/InputPhone'
import InputName from '../Input/InputName'
import axios from 'axios'
import { env } from '../../env'
import sha512 from 'js-sha512'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons'
import SuccessCheckAnimation from '../Animation/SuccessCheckAnimation'
import { Fade } from 'react-reveal';

function SignUp() {
    const [showMorePolicy, setShowMorePolicy] = useState(false)
    const emailRef = useRef()
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const passwordRef = useRef()
    const [password, setPassword] = useState("")
    const [passwordError, setPasswordError] = useState(null)
    const [isLengthValid, setIsLengthValid] = useState(false)
    const [hasUpperCase, setHasUpperCase] = useState(false)
    const [hasLowerCase, setHasLowerCase] = useState(false)
    const [hasNumber, setHasNumber] = useState(false)
    const [hasSpecialChar, setHasSpecialChar] = useState(false)

    const [error, setError] = useState(null)
    const [succeeded, setSucceeded] = useState(false)
    useEffect(() => {
        setIsLengthValid(password.length >= 8)
        setHasUpperCase(/[A-Z]/.test(password))
        setHasLowerCase(/[a-z]/.test(password))
        setHasNumber(/\d/.test(password))
        setHasSpecialChar(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
    }, [password])

    const phoneRef = useRef()
    const [phone, setPhone] = useState("")
    const [phoneError, setPhoneError] = useState(null)

    const firstnameRef = useRef()
    const [firstname, setFirstname] = useState("")
    const [firstnameError, setFirstnameError] = useState(null)

    const lastnameRef = useRef()
    const [lastname, setLastname] = useState("")
    const [lastnameError, setLastnameError] = useState(null)

    const [signUpDisabled, setSignUpDisabled] = useState(true)

    useEffect(() => {
        if (emailError || passwordError || email === "" || password === "" || phone === "" || phoneError || firstname === "" || firstnameError || lastname === "" || lastnameError) {
            setSignUpDisabled(true)
        } else {
            setSignUpDisabled(false)
        }
    }, [emailError, passwordError, email, password, phone, phoneError, firstname, firstnameError, lastname, lastnameError])
    async function signUp() {
        setIsLoading(true)
        setError(null)
        setSucceeded(null)
        setTimeout(() => {

            const passwordFormat = sha512(password).slice(10, 40)
            const params = {
                firstname: firstname,
                lastname: lastname,
                email: email,
                phone: phone,
                password: passwordFormat
            }
            axios.post(env.URL + 'user', params).then((res) => {
                if (res.data === 'USER_CREATED') {
                    setSucceeded(true)
                    setIsLoading(false)
                }
            }).catch((error) => {
                if (error.response.data === 'EMAIL_ALREADY_EXIST') {
                    setError('Cette adresse e-mail est déjà utilisée ')
                }
                if (error.response.data === 'ERROR_USER_CREATION') {
                    setError("Une erreur s'est produite, veuillez réessayer plus tard")
                }
                setIsLoading(false)
            })
        }, 1000);

    }
    if (succeeded) {
        return (
            <div className='sign-up-wrapper' >
                <div className='sign-in-title' style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Inscription réussit</div>
                <div style={{ padding: 20 }}><SuccessCheckAnimation /></div>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', fontSize: 18, padding: 10 }}>
                    <div> Votre compte a été créé avec succès</div>
                    <Link to='/sign-in' style={{ marginLeft: 10 }}> Se connecter</Link>
                </div>

            </div>
        )
    } else {
        return (
            <Fade right>
                <div className='sign-up-wrapper'>
                    <div className='sign-up-top'>
                        Avez-vous un compte ? <Link to='/sign-in' style={{ marginLeft: 10 }}> Se connecter</Link>
                    </div>
                    <div className='sign-in-title' style={{ marginTop: 20 }}>Inscription</div>

                    <InputName
                        ref={firstnameRef}
                        name={firstname} setName={setFirstname}
                        nameError={firstnameError} setNameError={setFirstnameError}
                        placeholder={"Prénom"}
                    />
                    <InputName
                        ref={lastnameRef}
                        name={lastname} setName={setLastname}
                        nameError={lastnameError} setNameError={setLastnameError}
                        placeholder={"Nom"}
                    />
                    <InputPhone
                        ref={phoneRef}
                        phone={phone} setPhone={setPhone}
                        phoneError={phoneError} setPhoneError={setPhoneError}
                        placeholder={"Numéro téléphone"}
                    />
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
                        onPressEnter={() => signUpDisabled ? null : signUp()}
                    />
                    <div style={{}}>
                        <ul>
                            <li style={{ color: password === "" ? 'gray' : isLengthValid ? 'green' : 'red' }}>Doit contenir au moins 8 caractères</li>
                            <li style={{ color: password === "" ? 'gray' : hasUpperCase ? 'green' : 'red' }}>Doit inclure au moins une lettre majuscule</li>
                            <li style={{ color: password === "" ? 'gray' : hasLowerCase ? 'green' : 'red' }}>Doit inclure au moins une lettre minuscule</li>
                            <li style={{ color: password === "" ? 'gray' : hasNumber ? 'green' : 'red' }}>Doit inclure au moins un chiffre</li>
                            <li style={{ color: password === "" ? 'gray' : hasSpecialChar ? 'green' : 'red' }}>Peut inclure des caractères spéciaux</li>
                        </ul>
                    </div>

                    {error && <div className='error-text'>{error}</div>}
                    <Button className='button-sign-in' style={{ marginBlock: 20 }} variant="success" onClick={() => signUp()} disabled={isLoading ? true : signUpDisabled}>
                        {isLoading ?
                            <FontAwesomeIcon icon={faSpinner} pulse />
                            :
                            'Créer mon compte'
                        }

                    </Button>

                    <div className='sign-up-policy'>
                        En vous inscrivant, vous acceptez notre <span style={{ color: '#4C6CF8' }}> Politique de confidentialité </span>, notre <span style={{ color: '#4C6CF8' }}> Politique en matière de cookies </span> et nos <span style={{ color: '#4C6CF8' }}> Conditions d'utilisation </span> .
                    </div>
                    {!showMorePolicy && <div className='sign-up-policy-button' onClick={() => setShowMorePolicy(true)}>En savoir plus</div>}
                    {showMorePolicy && <div className='sign-up-policy'>Nos politiques expliquent comment nous utilisons vos données pour fournir, améliorer et promouvoir notre service et notre site, et comment vous pouvez exercer vos droits pour contrôler cette utilisation.</div>}
                    {showMorePolicy && <div className='sign-up-policy-button' onClick={() => setShowMorePolicy(false)}>En savoir moins</div>}
                </div>
            </Fade>

        )
    }

}
export default SignUp