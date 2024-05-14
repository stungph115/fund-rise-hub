import { useEffect, useRef, useState } from "react"
import InputEmail from "../Input/InputEmail"
import { Link } from "react-router-dom"
import { Button } from "react-bootstrap"
import { Fade } from "react-reveal"
import axios from "axios"
import { env } from "../../env"
import { toast } from "react-toastify"
import SuccessCheckAnimation from "../Animation/SuccessCheckAnimation"

function ForgotPassword() {
    const emailRef = useRef()
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState(null)
    const [successRequestResetPassword, setSuccessRequestResetPassword] = useState(false)
    const [buttonDisable, setButtonDisable] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        if (emailError || email === "") {
            setButtonDisable(true)
        } else {
            setButtonDisable(false)
        }
    }, [emailError, email])

    function resetPasswordRequest() {
        const toastId = toast.loading("Verifying email...")

        axios.post(env.URL + 'user/forgot-password', { email: email }).then((res) => {
            setEmail('')
            toast.update(toastId, { render: "Le lien de réinitialisation a été envoyé", type: "success", isLoading: false, autoClose: 5000 })
            setSuccessRequestResetPassword(true)
        }).catch((err) => {
            console.log(err)
            toast.update(toastId, { render: "Votre email n'existe pas, veuillez le vérifier", type: "error", isLoading: false, autoClose: 5000 })

        })
    }
    return (
        <Fade right>
            <div className='sign-in-wrapper'>

                {!successRequestResetPassword ?
                    <>
                        <div className='sign-in-title'>Mot de passe oublié ?</div>
                        <div className='sign-in-sub-title' style={{ marginBottom: '30px' }}>Veuillez saisir votre email de connexion afin de recevoir le lien de réinitialisation de votre mot de passe</div>
                        <InputEmail
                            ref={emailRef}
                            email={email} setEmail={setEmail}
                            emailError={emailError} setEmailError={setEmailError}
                            placeholder={"votre e-mail"}
                        />
                        {error &&
                            <>{error}</>
                        }
                        <Button style={{ marginBlock: 15 }} className='button-sign-in' variant="success" onClick={() => resetPasswordRequest()} disabled={buttonDisable}>Continuer</Button>

                        <p>
                            <Link to='/sign-in'>Retourner à la page de connexion</Link>
                        </p>
                    </>
                    :
                    <>
                        <div className="reset-password-success">
                            <p style={{ fontSize: 24, fontWeight: 700 }}> Le lien de réinitialisation a été envoyé</p>
                            <div style={{ padding: 20 }}><SuccessCheckAnimation /></div>
                            <p style={{ fontSize: 20, fontWeight: 500 }}> Veuillez vérifier votre boite de réception.</p>
                            <p>
                                <Link to='/sign-in'>Retourner à la page de connexion</Link>
                            </p>
                        </div>
                    </>
                }
            </div >
        </Fade>
    )
}
export default ForgotPassword
