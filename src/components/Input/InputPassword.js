import { faEnvelope, faEye, faEyeSlash, faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import colors from "../../styles/colors";
const InputPassword = forwardRef((props, ref) => {

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
    const [showPassword, setShowPassword] = useState(false)

    useImperativeHandle(ref, () => ({
        passwordValidation: (password) => passwordValidation(password)
    }))

    function passwordValidation(password) {
        if (password && passwordRegex.test(password)) {
            props.setPasswordError(false)
            return true
        } else {
            props.setPasswordError(true)
            return false
        }
    }
    return (

        <InputGroup style={{ paddingBlock: 10 }}>
            <InputGroup.Text style={{ borderWidth: 2, backgroundColor: 'white', borderRight: "none", height: 40, borderColor: props.passwordError == null ? null : !props.passwordError ? colors.success : colors.error, fontSize: 18, fontWeight: 600 }}>
                <FontAwesomeIcon icon={faKey} />
            </InputGroup.Text>
            <Form.Control
                style={{ borderWidth: 2, borderInline: "none", height: 40, borderColor: props.passwordError == null ? null : !props.passwordError ? colors.success : colors.error, fontSize: 18, fontWeight: 600 }}
                type={showPassword ? "Text" : "password"}
                placeholder={props.placeholder}
                value={props.password}
                onChange={(e) => {
                    props.setPassword(e.target.value)
                    passwordValidation(e.target.value)
                }}
                onKeyPress={(event) => props.onPressEnter && event.key === "Enter" ? props.onPressEnter() : null}
            />
            <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ borderWidth: 2, backgroundColor: 'white', borderLeft: "none", height: 40, borderColor: props.passwordError == null ? null : !props.passwordError ? colors.success : colors.error, fontSize: 18, fontWeight: 600 }}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </InputGroup.Text>
        </InputGroup>

    )

})

export default InputPassword