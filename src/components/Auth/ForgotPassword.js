import { useEffect, useRef, useState } from "react"
import InputEmail from "../Input/InputEmail"
import { Link } from "react-router-dom"
import { Button } from "react-bootstrap"
import { Fade } from "react-reveal"

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

    }
    return (
        <Fade right>
            <div className='sign-in-wrapper'>
                <div className='sign-in-title'>Mot de passe oublié ?</div>
                {!successRequestResetPassword ?
                    <>
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
                            <p>Le lien de réinitialisation a été envoyé, veuillez vérifier votre boite de réception.</p>
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
