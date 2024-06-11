import { Link, useNavigate, useParams } from "react-router-dom"
import SuccessCheckAnimation from "../Animation/SuccessCheckAnimation"
import axios from "axios"
import { env } from "../../env"
import { useEffect, useState } from "react"
import { Card } from "react-bootstrap"
import { addSpacesToNumber } from "../../utils/utils"
import { faClock } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function ProjectCreated() {
    const idProject = useParams().idProject
    const navigate = useNavigate()
    const [project, setProject] = useState(null)

    useEffect(() => {
        getProjectDetail()
    }, [idProject])
    function getProjectDetail() {
        axios.get(env.URL + 'projects/' + idProject).then((res) => {
            setProject(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }
    function calculateDaysLeft(deadline) {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = Math.abs(deadlineDate - now);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return deadlineDate > now ? diffDays : 0;
    }
    return (
        <div className='sign-up-wrapper' >
            <div className='sign-in-title' style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Votre projet a été créé avec succès</div>
            <div style={{ padding: 20 }}><SuccessCheckAnimation /></div>
            {project &&
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', fontSize: 18, padding: 10 }}>
                    <Card className='project-card' onClick={() => navigate('/project/' + project.id)}>
                        {project && project.photos && < Card.Img variant="top" src={`${env.URL}file/${project.photos[0].name}`} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />}
                        <Card.Body>
                            <Card.Title style={{ textAlign: 'left' }}>{project.title}</Card.Title>
                            <Card.Text style={{ textAlign: 'left' }}><b>Objectif :</b> {addSpacesToNumber(project.goal)} €</Card.Text>
                            <Card.Text style={{ textAlign: 'left' }}><FontAwesomeIcon icon={faClock} /> {calculateDaysLeft(project.deadline)} jours restants</Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            }


        </div>
    )
}

export default ProjectCreated