import React from 'react';
import { Card } from 'react-bootstrap';
import { env } from '../../env';
import { addSpacesToNumber, formatDate, formatDateTime } from '../../utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router';

function ProjectCreated({ projects }) {
    console.log(projects)
    const navigate = useNavigate()
    function calculateDaysLeft(deadline) {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = Math.abs(deadlineDate - now);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return deadlineDate > now ? diffDays : 0;
    }
    if (projects) {
        return (
            <div className='project-list' >
                {projects.map(project => (
                    <Card key={project.id} className='project-card' onClick={() => navigate('/project/' + project.id)}>
                        {<Card.Img variant="top" src={`${env.URL}file/${project.photos[0].name}`} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />}
                        <Card.Body>
                            <Card.Title style={{ textAlign: 'left' }}>{project.title}</Card.Title>
                            <Card.Text style={{ textAlign: 'left' }}><b>Objectif :</b> {addSpacesToNumber(project.goal)} €</Card.Text>
                            <Card.Text style={{ textAlign: 'left' }}><FontAwesomeIcon icon={faClock} /> {calculateDaysLeft(project.deadline)} jours restants</Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        );
    }

}
export default ProjectCreated