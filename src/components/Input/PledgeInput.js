import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

const PledgeInput = ({ value, onChange, minAmount, submit }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };
    return (
        <>
            <Form.Group controlId="pledgeAmount" >
                <Form.Label style={{ fontSize: 14 }}>Montant engagé</Form.Label>
                <InputGroup>
                    <Form.Control
                        className='no-focus-border'
                        type="number"
                        value={value}
                        onChange={onChange}
                        placeholder=""
                        min={minAmount}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        style={{ borderRadius: 0, borderColor: isFocused ? 'green' : '#ced4da' }}
                    />
                    <InputGroup.Text style={{ addingInline: 20, backgroundColor: 'white', borderRadius: 0, borderColor: isFocused ? 'green' : '#ced4da' }}> € </InputGroup.Text>
                </InputGroup>
                <div className='project-page-num-button-invest' style={{ marginTop: 20 }} onClick={() => submit()}>
                    Engagement de {value} €
                </div>
            </Form.Group>
        </>

    );
};

export default PledgeInput;
