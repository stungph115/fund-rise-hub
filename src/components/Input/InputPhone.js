import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import colors from "../../styles/colors";

const InputPhone = forwardRef((props, ref) => {
    const phoneRegex = /^0[1-9](?:\d{2}){4}$/;

    const [formattedPhone, setFormattedPhone] = useState(formatPhoneNumber(props.phone));

    useImperativeHandle(ref, () => ({
        phoneValidation: (phone) => phoneValidation(phone)
    }));

    function phoneValidation(phone) {
        if (phone && phoneRegex.test(phone)) {
            props.setPhoneError(false);
            return true;
        } else {
            props.setPhoneError(true);
            return false;
        }
    }

    function formatPhoneNumber(phone) {
        // Remove any non-digit characters from the input
        const cleaned = ('' + phone).replace(/\D/g, '');

        // Insert a space after every two characters
        const formatted = cleaned.replace(/(\d{2})(?=\d)/g, '$1 ');

        return formatted;
    }

    function handleChange(e) {
        let inputPhone = e.target.value;
        // Remove non-digit characters and limit input to 10 characters
        inputPhone = inputPhone.replace(/\D/g, '').slice(0, 10);

        setFormattedPhone(formatPhoneNumber(inputPhone));
        props.setPhone(inputPhone);
        phoneValidation(inputPhone);
    }

    return (
        <InputGroup style={{ paddingBlock: 10 }}>
            <InputGroup.Text style={{ borderWidth: 2, backgroundColor: 'white', borderRight: "none", height: 40, borderColor: props.phoneError == null ? null : !props.phoneError ? colors.success : colors.error, fontSize: 18, fontWeight: 600 }}>
                <FontAwesomeIcon icon={faPhone} />
            </InputGroup.Text>
            <Form.Control
                style={{ borderWidth: 2, borderLeft: "none", height: 40, borderColor: props.phoneError == null ? null : !props.phoneError ? colors.success : colors.error, fontSize: 18, fontWeight: 600 }}
                type={"tel"} // Change type to "tel" for better mobile support
                placeholder={props.placeholder}
                value={formattedPhone}
                maxLength={14} // 10 digits + 4 spaces
                onChange={handleChange}
                onBlur={handleChange}
            />
        </InputGroup>
    );
});

export default InputPhone;
