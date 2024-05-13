import { useEffect, useRef, useState } from "react"
import InputPassword from "../Input/InputPassword"
import { Button } from "react-bootstrap"
import { Link } from "react-router-dom"

function ResetPassword() {
    const passwordRef = useRef()
    const [password, setPassword] = useState("")
    const [passwordError, setPasswordError] = useState(null)
    const [successResetPassword, setSuccessResetPassword] = useState(false)
    const [buttonDisable, setButtonDisable] = useState(true)
    const [error, setError] = useState(null)

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

    }
    return (
        <div className='sign-in-wrapper'>
            <div className='sign-in-title'>Réinitialisation de mot de passe</div>
            {!successResetPassword ?
                <>
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
                        <p>Votre mot de passe a été changé avec succès !</p>
                        <p>
                            <Link to='/sign-in'>Retourner à la page de connexion</Link>
                        </p>
                    </div>
                </>
            }

        </div >
    )
}
export default ResetPassword
