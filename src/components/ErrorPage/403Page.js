import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import '../../styles/notFoundPage.css'
import { Bounce } from 'react-reveal';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { env } from '../../env';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
// import { removeInfoStoreUser, removeTokenJWTStoreUser } from '../../store/actions/userAction';
const ForbiddenPage = () => {
    // const dispatch = useDispatch();
    const navigate = useNavigate()

    const handleLogout = () => {
        axios.post(env.URL + 'user/signOut')
            .then(response => {
                console.log(response)
                navigate('/signIn')
            })
        // dispatch(removeInfoStoreUser())
        // dispatch(removeTokenJWTStoreUser())

    }
    return (
        <Container>
            <Bounce>
                <Row>
                    <Col>
                        <div className="not-found-container">
                            <h1 className="not-found-text">403 - Forbidden  <FontAwesomeIcon icon={faTriangleExclamation} /> </h1>
                            <p>Désolé, vous n'avez pas la permission d'accéder à cette ressource.</p>
                            <p>
                                Retournez à la <Link to="/">page d'accueil</Link>
                            </p>
                            ou
                            <p>
                                <Link onClick={handleLogout}>Reconnectez vous</Link>
                            </p>
                        </div>
                    </Col>
                </Row>
            </Bounce>
        </Container>
    );
};

export default ForbiddenPage;
