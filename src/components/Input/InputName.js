import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { forwardRef, useImperativeHandle } from 'react'
import { Form, InputGroup } from "react-bootstrap";
import colors from "../../styles/colors";
const InputName = forwardRef((props, ref) => {
    const nameRegex = /^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u

    useImperativeHandle(ref, () => ({ nameValidation: (name) => nameValidation(name) }))

    function nameValidation(name) {

        if (name && nameRegex.test(name)) {
            props.setNameError(false)
            return true
        } else {
            props.setNameError(true)
            return false
        }

    }


    function nameFormat(name) {

        if (name) {
            var nameFormat = name.toLowerCase().split(' ').map((item) => item.charAt(0).toUpperCase() + item.substring(1)).join(' ')
            nameFormat = nameFormat.split('-').map((item) => item.charAt(0).toUpperCase() + item.substring(1)).join('-')
            nameFormat = nameFormat.split('\'').map((item) => item.charAt(0).toUpperCase() + item.substring(1)).join('\'')
            props.setName(nameFormat)
        }

    }
    return (

        <InputGroup style={{ paddingBlock: 10 }}>
            <InputGroup.Text style={{ borderWidth: 2, backgroundColor: 'white', borderRight: "none", height: 40, borderColor: props.nameError == null ? null : !props.nameError ? colors.success : colors.error, fontSize: 18, fontWeight: 600 }}>
                <FontAwesomeIcon icon={faUser} />
            </InputGroup.Text>
            <Form.Control
                style={{ borderWidth: 2, borderLeft: "none", height: 40, borderColor: props.nameError == null ? null : !props.nameError ? colors.success : colors.error, fontSize: 18, fontWeight: 600 }}
                type={"text"}
                placeholder={props.placeholder}
                value={props.name}
                onChange={(e) => {
                    props.setName(e.target.value)
                    nameValidation(e.target.value)
                    nameFormat(e.target.value)
                }}
                onKeyPress={(event) => props.onPressEnter && event.key === "Enter" ? props.onPressEnter() : null}

            />
        </InputGroup>

    )

})

export default InputName