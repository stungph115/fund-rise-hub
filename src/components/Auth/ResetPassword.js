import { useEffect, useRef, useState } from "react"
import InputPassword from "../Input/InputPassword"
import { Button } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import { Fade } from "react-reveal"
import { toast } from "react-toastify"
import axios from "axios"
import { env } from "../../env"
import { sha512 } from "js-sha512"
import SuccessCheckAnimation from "../Animation/SuccessCheckAnimation"

function ResetPassword() {
    const passwordRef = useRef()
    const [password, setPassword] = useState("")
    const [passwordError, setPasswordError] = useState(null)
    const [successResetPassword, setSuccessResetPassword] = useState(false)
    const [buttonDisable, setButtonDisable] = useState(true)
    const [error, setError] = useState(null)
    const { token } = useParams()
    const [isLengthValid, setIsLengthValid] = useState(false)
    const [hasUpperCase, setHasUpperCase] = useState(false)
    const [hasLowerCase, setHasLowerCase] = useState(false)
    const [hasNumber, setHasNumber] = useState(false)
    const [hasSpecialChar, setHasSpecialChar] = useState(false)

    useEffect(() => {
        setIsLengthValid(password.length >= 8)
        setHasUpperCase(/[A-Z]/.test(password))
        setHasLowerCase(/[a-z]/.test(password))
        setHasNumber(/\d/.test(password))
        setHasSpecialChar(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
    }, [password])

    useEffect(() => {
        if (passwordError || password === "") {
            setButtonDisable(true)
        } else {
            setButtonDisable(false)
        }
    }, [passwordError, password])
    function resetPassword() {
        const toastId = toast.loading("Modification de mot de passe...")
        axios.post(env.URL + "user/reset-password", {
            token, password: sha512(password).slice(10, 40)
        }).then((response) => {
            if (response.data === 'USER_UPDATED') {
                setPassword('')
                setSuccessResetPassword(true)
                toast.update(toastId, { render: "Votre mot de passe a été changé", type: "success", isLoading: false, autoClose: 5000 })
            }
        }).catch((error) => {
            console.log(error.response.data)
            if (error.response.data === 'ERROR_USER_UPDATING' || error.response.data === 'USER_NOT_FOUND') {
                error = "Un problème s'est produit, veuillez recommencer."
            }
            else if (error.response.data === 'OLD_PASSWORD_NOT_ACCEPTED') {
                error = "Vous ne pouvez pas réutiliser le même mot de passe."
            }
            else if (error.response.data === 'TOKEN_INVALID') {
                error = "Votre demande a été expirée, veuillez recommencer."
            }
            toast.update(toastId, { render: error, type: "error", isLoading: false, autoClose: 5000 })

        })
    }
    return (
        <Fade right>
            <div className='sign-in-wrapper'>

                {!successResetPassword ?
                    <>
                        <div className='sign-in-title'>Réinitialisation de mot de passe</div>
                        <div style={{ fontSize: 18, fontWeight: 500 }} >Choisir un nouveau mot de passe</div>
                        <div style={{}}>
                            <ul>
                                <li style={{ color: password === "" ? 'gray' : isLengthValid ? 'green' : 'red' }}>Doit contenir au moins 8 caractères</li>
                                <li style={{ color: password === "" ? 'gray' : hasUpperCase ? 'green' : 'red' }}>Doit inclure au moins une lettre majuscule</li>
                                <li style={{ color: password === "" ? 'gray' : hasLowerCase ? 'green' : 'red' }}>Doit inclure au moins une lettre minuscule</li>
                                <li style={{ color: password === "" ? 'gray' : hasNumber ? 'green' : 'red' }}>Doit inclure au moins un chiffre</li>
                                <li style={{ color: password === "" ? 'gray' : hasSpecialChar ? 'green' : 'red' }}>Peut inclure des caractères spéciaux</li>
                            </ul>
                        </div>
                        <InputPassword
                            ref={passwordRef}
                            password={password} setPassword={setPassword}
                            passwordError={passwordError} setPasswordError={setPasswordError}
                            placeholder={"Nouveau mot de passe"}
                            onPressEnter={() => buttonDisable ? null : resetPassword()}
                        />
                        {error &&
                            <>{error}</>
                        }
                        <Button style={{ marginBlock: 15 }} className='button-sign-in' variant="success" onClick={() => resetPassword()} disabled={buttonDisable}>Continuer</Button>

                    </>

                    :
                    <>
                        <div className="reset-password-success">
                            <p style={{ fontSize: 20, fontWeight: 700 }}> Votre mot de passe a été changé avec succès !</p>
                            <div style={{ padding: 20 }}><SuccessCheckAnimation /></div>
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
export default ResetPassword
