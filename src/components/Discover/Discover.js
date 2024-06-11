import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Card, Image } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { env } from '../../env';
import SpinnerGreen from '../../utils/Spinner';
import avatarDefault from '../../assets/default-avata.jpg';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addSpacesToNumber, formatDate, formatMonthYear } from '../../utils/utils';
import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Discover({ categories }) {
    const navigate = useNavigate();
    const query = useQuery();

    const [title, setTitle] = useState(query.get('title') || '');
    const [category, setCategory] = useState(query.get('category') || '');
    const [subCategory, setSubCategory] = useState(query.get('subCategory') || '');
    const [topFavorites, setTopFavorites] = useState(query.get('topFavorites') === 'true');
    const [topComments, setTopComments] = useState(query.get('topComments') === 'true');
    const [reach90Percent, setReach90Percent] = useState(query.get('reach90Percent') === 'true');
    const [expireSoon, setExpireSoon] = useState(query.get('expireSoon') === 'true');
    const [topLatest, setTopLatest] = useState(query.get('topLatest') === 'true');
    const [topPassedGoal, setTopPassedGoal] = useState(query.get('topPassedGoal') === 'true');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await axios.post(env.URL + 'projects/discover-advanced', {
                title,
                categoryId: parseInt(category),
                subCategoryId: parseInt(subCategory),
                topFavorites,
                topComments,
                reach90Percent,
                expireSoon,
                topLatest,
                topPassedGoal
            });
            setProjects(response.data.projects);
        } catch (error) {
            console.error('Error fetching projects', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProjects();
    }, [title, category, subCategory, topFavorites, topComments, reach90Percent, expireSoon, topLatest, topPassedGoal]);

    function calculateDaysLeft(deadline) {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = Math.abs(deadlineDate - now);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return deadlineDate > now ? diffDays : 0;
    }

    function calculatePercentageInvested(project) {
        const totalInvested = project.investments.reduce((sum, investment) => sum + investment.amount, 0);
        const percentageInvested = (totalInvested / project.goal) * 100;
        return percentageInvested.toFixed(2); // Returning the percentage with two decimal places
    }

    return (
        <Container>
            <Row className="mb-4" style={{ marginBlock: 50 }}>
                <Col>
                    <Form>
                        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                            <Form.Group controlId="title">
                                <Form.Label>Titre</Form.Label>
                                <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                            </Form.Group>
                            <Form.Group controlId="category">
                                <Form.Label>Catégorie</Form.Label>
                                <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="">--- Sélectionner une categorie ---</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            {category && (
                                <Form.Group controlId="subCategory">
                                    <Form.Label>Sous-catégorie</Form.Label>
                                    <Form.Control as="select" value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
                                        <option value="">--- Sélectionner une sous-catégorie ---</option>
                                        {categories
                                            .find((cat) => cat.id === parseInt(category))
                                            ?.subCatgory.map((subCat) => (
                                                <option key={subCat.id} value={subCat.id}>
                                                    {subCat.name}
                                                </option>
                                            ))}
                                    </Form.Control>
                                </Form.Group>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: "space-evenly", marginTop: 20 }}>
                            <Form.Check
                                type="checkbox"
                                label="Top 10 Favoris"
                                checked={topFavorites}
                                onChange={(e) => setTopFavorites(e.target.checked)}
                            />
                            <Form.Check
                                type="checkbox"
                                label="Top 10 Commentaires"
                                checked={topComments}
                                onChange={(e) => setTopComments(e.target.checked)}
                            />
                            <Form.Check
                                type="checkbox"
                                label="Atteint > 90% de l'objectif"
                                checked={reach90Percent}
                                onChange={(e) => setReach90Percent(e.target.checked)}
                            />
                            <Form.Check
                                type="checkbox"
                                label="Expirent bientôt"

                                checked={expireSoon}
                                onChange={(e) => setExpireSoon(e.target.checked)}
                            />
                            <Form.Check
                                type="checkbox"
                                label="Top 10 Derniers"
                                checked={topLatest}
                                onChange={(e) => setTopLatest(e.target.checked)}
                            />
                            <Form.Check
                                type="checkbox"
                                label="Top 10 Passé l'objectif"
                                checked={topPassedGoal}
                                onChange={(e) => setTopPassedGoal(e.target.checked)}
                            />
                        </div>
                    </Form>
                </Col>
            </Row>
            <Row>
                {loading ? (
                    <SpinnerGreen />
                ) : (
                    projects.map(project => (
                        <Col key={project.id} md={4}>
                            <Card className='project-card' onClick={() => navigate('/project/' + project.id)}>
                                {project.photos && project.photos.length > 0 && (
                                    <Card.Img
                                        variant="top"
                                        src={`${env.URL}file/${project.photos[0].name}`}
                                        style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                                    />
                                )}
                                <Card.Body>
                                    <Card.Title style={{ textAlign: 'left' }}>{project.title}</Card.Title>

                                    <b>Créé par: </b>
                                    <Image
                                        src={project.userCreator && project.userCreator.photo ? env.URL + 'file/' + project.userCreator.photo : avatarDefault}
                                        roundedCircle
                                        className="profile-user-photo-small"
                                        style={{ transform: 'scale(0.8)' }}
                                    />
                                    {project.userCreator.firstname} {project.userCreator.lastname} <b> en </b> {formatMonthYear(project.createdAt)}
                                    <Card.Text style={{ textAlign: 'left' }}><b>Objectif :</b> {addSpacesToNumber(project.goal)} €</Card.Text>
                                    <div style={{ display: 'flex' }}>
                                        <Card.Text style={{ textAlign: 'left' }}>
                                            <FontAwesomeIcon icon={faHeart} style={{ color: 'rgb(255, 96, 96)' }} /> {project.favorites.length}
                                        </Card.Text>
                                        <div style={{ paddingInline: 5, color: 'gray' }}>•</div>
                                        <Card.Text style={{ textAlign: 'left' }}>
                                            <FontAwesomeIcon icon={faComment} style={{ color: '#00769d' }} /> {project.comment.length}
                                        </Card.Text>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <Card.Text style={{ textAlign: 'left' }}>
                                            <FontAwesomeIcon icon={faClock} /> {calculateDaysLeft(project.deadline)}j restants
                                        </Card.Text>
                                        <div style={{ paddingInline: 5, color: 'gray' }}>•</div>
                                        <Card.Text>{calculatePercentageInvested(project)}% funded</Card.Text>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </Container>
    );
}

export default Discover;

