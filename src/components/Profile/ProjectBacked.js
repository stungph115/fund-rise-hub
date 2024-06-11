import { Card, Image } from "react-bootstrap";
import { useNavigate } from "react-router";
import { addSpacesToNumber } from "../../utils/utils";
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { env } from "../../env";
import avatarDefault from '../../assets/default-avata.jpg'

function ProjectBacked({ investments }) {
    const uniqueProjects = [];
    const projectMap = new Map();
    const navigate = useNavigate()
    function calculateDaysLeft(deadline) {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = Math.abs(deadlineDate - now);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return deadlineDate > now ? diffDays : 0;
    }
    if (investments) {
        investments.forEach(investment => {
            const projectId = investment.project.id;
            if (projectMap.has(projectId)) {
                projectMap.get(projectId).totalInvestment += investment.amount;
            } else {
                projectMap.set(projectId, {
                    ...investment.project,
                    totalInvestment: investment.amount,
                });
                uniqueProjects.push(projectMap.get(projectId));
            }
        });
        return (
            <div className='project-list'>
                {uniqueProjects.map(project => (
                    <Card key={project.id} className='project-card' onClick={() => navigate('/project/' + project.id)}>
                        {<Card.Img variant="top" src={`${env.URL}file/${project.photos[0].name}`} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />}
                        <Card.Body>
                            <div style={{ display: "flex", justifyContent: 'space-between' }}>
                                <div>
                                    <Card.Title style={{ textAlign: 'left' }}>{project.title}</Card.Title>
                                    <Card.Text style={{ textAlign: 'left' }}><b>Objectif :</b> {addSpacesToNumber(project.goal)} €</Card.Text>
                                    <Card.Text style={{ textAlign: 'left' }}><FontAwesomeIcon icon={faClock} /> {calculateDaysLeft(project.deadline)} jours restants</Card.Text>

                                </div>
                                <div>
                                    <b>Créé par: </b>
                                    <Image src={project.userCreator && project.userCreator.photo ? env.URL + 'file/' + project.userCreator.photo : avatarDefault}
                                        roundedCircle
                                        className="profile-user-photo-small"
                                        style={{ transform: 'scale(0.8)' }}
                                    />
                                    {project.userCreator.firstname} {project.userCreator.lastname}
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        );
    }

}

export default ProjectBacked