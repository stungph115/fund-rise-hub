import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router"
import { env } from "../../env"
import '../../styles/project/projectCheckout.css'
import { Fade } from "react-reveal"
import PledgeInput from "../Input/PledgeInput"
import defaultRewardPhoto from '../../assets/reward-default.jpg'
import { Image } from "react-bootstrap"
import { projectDummy } from "../../utils/Dummy"

function ProjectCheckOut() {
    const [project, setProject] = useState(null)
    const projectId = useParams().projectId
    const [pledgeAmount, setPledgeAmount] = useState(0)
    const [chosen, setChosen] = useState(null)
    const navigate = useNavigate()
    useEffect(() => {
        getProjectDetail()
    }, [projectId])
    /* useEffect(() => {
        setProject(projectDummy)
    }, []) */
    function getProjectDetail() {
        axios.get(env.URL + 'projects/' + projectId).then((res) => {
            setProject(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }
    function handleContinue() {
        console.log(pledgeAmount)
        console.log(projectId)
        console.log(chosen)
        navigate('/checkout/' + projectId + '/' + chosen + '/' + pledgeAmount)
    }
    useEffect(() => {
        if (chosen === 'no-reward') {
            setPledgeAmount(1)
        }
    }, [chosen])

    const handleRewardSelection = (rewardId, price) => {
        if (chosen !== rewardId) {
            setChosen(rewardId)
            setPledgeAmount(price)
        }
    }

    return (
        <Fade right>
            <div className="project-checkout-wrapper" >
                <div className="project-chetout-top">
                    <div style={{ fontSize: 30 }}>{project && project.title}</div>
                    <div>
                        <span>créé par </span>
                        <span className="project-page-user">{project && project.userCreator.firstname} {project && project.userCreator.lastname}</span>
                    </div>
                </div>
                <div style={{ marginTop: 50, paddingInline: '10vw' }}>
                    <h3>Veuillez sélectionner votre récompense</h3>
                    <p style={{ marginBottom: 50 }}>Veuillez sélectionner une option ci-dessous.</p>

                    <div style={{ paddingInline: '20vw' }}>
                        <div className={chosen === 'no-reward' ? "project-checkout-noreward chosen" : "project-checkout-noreward"}
                            style={{ backgroundColor: "white" }}
                            onClick={() => setChosen('no-reward')}
                        >
                            <p style={{ fontSize: 20 }}>Engagement sans récompense</p>
                            {chosen === 'no-reward' && <PledgeInput
                                value={pledgeAmount}
                                onChange={(e) => setPledgeAmount(e.target.value)}
                                minAmount={1}
                                submit={handleContinue}
                            />}
                        </div>
                        {(project && project.reward) &&
                            project.reward.map((item) => {
                                return (
                                    <div className={chosen === item.id ? "project-checkout-noreward chosen" : "project-checkout-noreward"}
                                        style={{ backgroundColor: "white" }}
                                        onClick={() => handleRewardSelection(item.id, item.price)}
                                        key={item.id}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <p style={{ fontSize: 20 }}>Engagement de {item.price} €</p>
                                                <b style={{ fontSize: 18 }}>{item.title}</b>

                                                <p className="project-checkout-description">{item.description}</p>
                                            </div>
                                            <div>
                                                <Image
                                                    src={item.photo ? `${env.URL}file/${item.photo}` : defaultRewardPhoto}
                                                    style={{ width: '150px', height: '100%', objectFit: 'contain', marginBottom: 30 }}
                                                />

                                            </div>
                                        </div>
                                        {chosen === item.id &&
                                            <PledgeInput
                                                value={pledgeAmount}
                                                onChange={(e) => setPledgeAmount(e.target.value)}
                                                minAmount={item.price}
                                                submit={handleContinue}
                                            />
                                        }

                                    </div>
                                )
                            })
                        }
                    </div>

                </div>
            </div>
        </Fade >

    )
}
export default ProjectCheckOut