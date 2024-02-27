import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import '../../styles/notFoundPage.css'
import { Bounce } from 'react-reveal';

const NotFound = () => {
    return (
        <Container>
            <Bounce>
                <Row>
                    <Col>
                        <div className="not-found-container">
                            <h1 className="not-found-text">Page Not Found</h1>
                            <p>Désolé, la page que vous recherchez est introuvable.</p>
                            <p>
                                Retournez à la <Link to="/">page d'accueil</Link>
                            </p>
                        </div>
                    </Col>
                </Row>
            </Bounce>
        </Container>
    );
};

export default NotFound;