import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef, useImperativeHandle } from "react";
import { Form, InputGroup } from "react-bootstrap";
import colors from "../../styles/colors";
const InputEmail = forwardRef((props, ref) => {

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    useImperativeHandle(ref, () => ({
        emailValidation: (email) => emailValidation(email)
    }))

    function emailValidation(email) {
        if (email && emailRegex.test(email)) {
            props.setEmailError(false);
            return true;
        } else {
            props.setEmailError(true);
            return false;
        }
    }

    function emailFormat(email) {
        if (email) {
            props.setEmail(email.toLowerCase().trim());
        }
    }

    return (

        <InputGroup style={{ paddingBlock: 10 }}>
            <InputGroup.Text style={{ borderWidth: 2, backgroundColor: 'white', borderRight: "none", height: 40, borderColor: props.emailError == null ? null : !props.emailError ? colors.success : colors.error, fontSize: 18, fontWeight: 600, }}>
                <FontAwesomeIcon icon={faEnvelope} />
            </InputGroup.Text>
            <Form.Control
                style={{ borderWidth: 2, borderLeft: "none", height: 40, borderColor: props.emailError == null ? null : !props.emailError ? colors.success : colors.error, fontSize: 18, fontWeight: 600 }}
                type={"email"}
                placeholder={props.placeholder}
                value={props.email}
                onChange={(e) => {
                    props.setEmail(e.target.value)
                    emailValidation(e.target.value)
                }}
                onBlur={(e) => emailFormat(e.target.value)}
            />
        </InputGroup>

    )

})

export default InputEmail