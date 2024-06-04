import { useEffect, useState } from 'react'
import '../../styles/Message.css'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { env } from '../../env'
import { Form, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { Fade } from 'react-reveal'
function Message() {
    const [conversations, setConversations] = useState([])
    const currentUser = useSelector((state) => state.userReducer)

    useEffect(() => {
        getConversations()
    }, [])

    function getConversations() {
        axios.get(env.URL + 'conversation/conversation/' + currentUser.id).then((res) => {
            setConversations(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <Fade right>
            <div className='inbox-wrapper'>
                <div className='inbox-list'>
                    <div className='inbox-list-title'> Messageries</div>
                    <div className='inbox-list-search'>
                        <InputGroup size="lg" className='inbox-list-search-bar' style={{}}>
                            <InputGroup.Text style={{ backgroundColor: 'white', borderRight: "none", borderRadius: '25px 0px 0px 25px', backgroundColor: "#F0F2F5" }}>
                                <FontAwesomeIcon icon={faSearch} style={{ color: "#656969" }} />
                            </InputGroup.Text>
                            <Form.Control style={{ borderLeft: "none", borderRadius: '0px 25px 25px 0px', backgroundColor: "#F0F2F5" }}
                                placeholder="Chercher utilisateurs ou messages"
                            />
                        </InputGroup>
                    </div>
                    <div className='inbox-list-conversations'></div>
                </div>

                <div className='inbox-chatbox'></div>
            </div>
        </Fade>

    )
}
export default Message