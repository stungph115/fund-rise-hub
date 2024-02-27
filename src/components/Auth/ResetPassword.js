import { Form } from "react-bootstrap"
import { Fade, Zoom } from "react-reveal"
import { useParams } from "react-router"
import ButtonPrimary from "../Button/ButtonPrimary"
import InputPassword from "../Input/InputPassword"
import { useState } from 'react'
import axios from "axios"
import { env } from '../../env'
import { sha512 } from 'js-sha512'
import '../../styles/Auth/ResetPassword.css'
/* import AlertError from '../Alert/AlertError'
 */import { Link } from "react-router-dom"
import { RotatingLines } from "react-loader-spinner"
import { toast } from 'react-toastify'

function ResetPassword() {
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState(null)
    /* const [alertError, setAlertError] = useState(false)*/
    const { token } = useParams()
    const [successResetPassword, setSuccessResetPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    function handleSubmit(e) {
        e && e.preventDefault() // prevent the default form submission behavior
        ResetPassword()
    }
    function ResetPassword() {
        console.log("resetting")
        setIsLoading(true)
        var error = []
        if (!password) {
            error.push("Veuillez saisir le nouveau mot de passe")
        } /* else if (passwordError) {
            error += "Mot de passe doit contenir au minimum 8 caractères, au moins une lettre minuscule, une lettre majuscule et un chiffre."
        } */
        if (error.length > 0) {
            error.map((item) => toast.error(item))
            setIsLoading(false)
        } else {
            const toastId = toast.loading("Modification de mot de passe...")
            axios.post(env.URL + "user/reset-password", {
                token, password: sha512(password).slice(10, 40)
            }).then((response) => {
                if (response.data === 'USER_UPDATED') {
                    setPassword('')
                    setIsLoading(false)
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

                setIsLoading(false)
                /*      setAlertError(error)
                     setTimeout(function () {
                         setAlertError(false)
                     }, 5000) */
            })
        }
    }
    return (
        <div className="reset-password-page">
            <Zoom>
                <div className="adminTitle">
                    <div className='adminTitleBlack'>Réinitialisation de mot de passe</div>
                </div>
                <div className="form-wrapper">

                    {!successResetPassword ?
                        <>
                            <Form onSubmit={handleSubmit}>
                                <Form.Floating className="mb-3">
                                    <InputPassword
                                        password={password}
                                        setPassword={setPassword}
                                        passwordError={passwordError}
                                        setPasswordError={setPasswordError}
                                        placeholder='Nouveau mot de passe'
                                    />
                                </Form.Floating>
                                {!isLoading ?
                                    <ButtonPrimary text="Valider le nouveau mot de passe" onClickAction={handleSubmit} />
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
                        <Zoom>
                            <div className="reset-password-success">
                                <p>Votre mot de passe a été changé avec succès !</p>
                            </div>
                            <p>
                                <Link to='/signIn'>retourner à la page de connexion</Link>
                            </p>
                        </Zoom>
                    }
                </div>
            </Zoom>
        </div>
    )
}
export default ResetPassword
