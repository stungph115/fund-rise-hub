import Zoom from 'react-reveal/Zoom'
import Fade from 'react-reveal'
import InputEmail from '../Input/InputEmail'
import ButtonPrimary from '../Button/ButtonPrimary'
import Form from 'react-bootstrap/Form'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/Auth/ForgotPassword.css'
import axios from 'axios'
import { env } from '../../env'
/* import AlertError from '../Alert/AlertError'
import AlertSuccess from '../Alert/AlertSuccess' */
import { RotatingLines } from "react-loader-spinner"
import { toast } from 'react-toastify'

function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState(null)
    /*     const [alertError, setAlertError] = useState(false)
        const [alertSuccess, setAlertSuccess] = useState(false) */
    const [isLoading, setIsLoading] = useState(false)
    const [successRequestResetPassword, setSuccessRequestResetPassword] = useState(false)

    function handleSubmit(event) {
        event.preventDefault() // prevent the default form submission behavior
        resetPasswordRequest()
    }
    function resetPasswordRequest() {
        setIsLoading(true)
        var error = []
        if (!email) {
            error.push("Veuillez saisir votre e-mail ")
        }
        else if (emailError) {
            error.push("E-mail est incorrect  ")
        }
        if (error.length > 0) {
            error.map((item) => toast.error(item))
            setIsLoading(false)
            /*   setAlertError(error) */
            /*   setTimeout(function () {
                  setAlertError(false)
              }, 5000) */
        } else {
            const toastId = toast.loading("Verifying email...")
            axios.post(env.URL + "user/forgot-password", {
                email
            }).then((response) => {
                if (response.data.message === 'REQUEST_SENT') {
                    setEmail('')
                    setIsLoading(false)
                    toast.update(toastId, { render: "Le lien de réinitialisation a été envoyé", type: "success", isLoading: false, autoClose: 5000 })
                    setSuccessRequestResetPassword(true)
                }
            }).catch((error) => {
                console.log(error)
                if (error.response.data === 'USER_NOT_FOUND') {
                    error = "Votre email n'est pas trouvé, veuillez le vérifier"
                    toast.update(toastId, { render: error, type: "error", isLoading: false, autoClose: 5000 })
                    setIsLoading(false)
                }
            })
        }
    }

    return (
        <div className="password-forgot-page">
            <Zoom>
                <div className='adminTitle'>
                    <div className='adminTitleBlack'>Mot de passe oublié ?</div>

                </div>
                {!successRequestResetPassword ?
                    <div className='adminSubtitle' style={{ marginBottom: '30px' }}>Veuillez saisir votre email de connexion afin de recevoir le lien de réinitialisation de votre mot de passe</div>
                    :
                    <></>
                }
                <div className='form-wrapper'>
                    {!successRequestResetPassword ?
                        <>
                            <Form onSubmit={handleSubmit}>

                                <Form.Floating className='mb-3' >
                                    <InputEmail
                                        setEmail={setEmail}
                                        emailError={emailError}
                                        setEmailError={setEmailError}
                                        value={email}
                                        placeholder='Adresse e-mail'
                                    />
                                </Form.Floating>

                                {!isLoading ?
                                    <ButtonPrimary text="Recevoir le lien" onClickAction={resetPasswordRequest} />
                                    :
                                    <Fade bottom>
                                        <div className='spinnerContainer'>
                                            <RotatingLines
                                                strokeColor="black"
                                                strokeWidth="5"
                                                animationDuration="1"
                                                width="50"
                                                visible={true}
                                            />
                                        </div>
                                    </Fade>
                                }
                            </Form>
                            <p>
                                <Link to='/signIn'>retourner à la page de connexion</Link>
                            </p>
                        </>
                        :
                        <>
                            <Zoom>
                                <div className="reset-password-success">
                                    <p>Le lien de réinitialisation a été envoyé, veuillez vérifier votre boite de réception.</p>
                                </div>
                                <p>
                                    <Link to='/signIn'>retourner à la page de connexion</Link>
                                </p>
                            </Zoom>
                        </>
                    }


                </div>
            </Zoom>
        </div >
    )
}
export default ForgotPassword
