import axios from 'axios'
import '../../styles/Project.css'
import { env } from '../../env'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button, Card, Image } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faLink, faTag, faTags, faHeart as faHeartSolid, faDollarSign } from '@fortawesome/free-solid-svg-icons'
import { faSquareFacebook, faSquareTwitter } from '@fortawesome/free-brands-svg-icons'
import { faCheckCircle, faEnvelope, faHeart, faUser } from '@fortawesome/free-regular-svg-icons'
import { formatDateTime } from '../../utils/utils'
import Campaign from './Campaign'
import Reward from './Reward'
import FAQ from './FAQ'
import Updates from './Updates'
import Community from './Community'
import Comment from './Comments'
import { projectDummy } from '../../utils/Dummy'
import { useSelector } from 'react-redux'
import avatarDefault from '../../assets/default-avata.jpg'

function Project({ }) {
    const currentUser = useSelector((state) => state.userReducer)
    const [project, setProject] = useState(null)
    const projectId = useParams().projectId
    const [menuItem, setMenuItem] = useState(1)
    const navigate = useNavigate()
    console.log(project)
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
    //photo gallery
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
    useEffect(() => {
        const interval = setInterval(() => {
            nextPhoto();
        }, 3000);
        return () => clearInterval(interval);
    }, [currentPhotoIndex])

    function nextPhoto() {
        setCurrentPhotoIndex((prevIndex) => (project && project.photos && project.photos.length > 0 ? (prevIndex + 1) % project.photos.length : 0));
    }

    function prevPhoto() {
        setCurrentPhotoIndex((prevIndex) => (project && project.photos && project.photos.length > 0 ? (prevIndex - 1 + project.photos.length) % project.photos.length : 0));
    }
    //days left
    function calculateDaysLeft(deadline) {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = Math.abs(deadlineDate - now);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return deadlineDate > now ? diffDays : 0;
    }
    function addFavorite() {
        axios.post(env.URL + 'favorite', {
            userId: currentUser.id,
            projectId
        }).then((res) => {
            if (res.status !== 201) {
                console.log("error_sever")
            }
            getProjectDetail()
        }).catch((err) => {
            console.log(err)
        })

    }
    function deleteFavorite() {
        const favorite = project.favorites.find(favorite => favorite.user.id === currentUser.id)
        axios.delete(env.URL + 'favorite/' + favorite.id).then((res) => {
            console.log(res)
            if (res) {
                getProjectDetail()
            }
            getProjectDetail()
        }).catch((err) => {
            console.log(err)
        })
    }
    const isFavorite = project && project.favorites.some(favorite => favorite.user.id === currentUser.id);

    if (project) {
        return (
            <div className='project-page'>
                <div className='project-page-title'>{project.title}</div>
                <div className='project-page-description'>{project.descriptions}</div>
                <div className='project-page-top'>
                    <div className='project-page-top-right'>
                        <div className='project-page-photos'>
                            {project && project.photos && project.photos.length > 0 && (
                                <Card style={{ width: '700px', height: '500px', position: 'relative' }}>
                                    <Card.Img variant="top" src={`${env.URL}file/${project.photos[currentPhotoIndex].name}`} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                                    <Button className='project-page-button-next' style={{ left: '10px' }} onClick={prevPhoto}> <FontAwesomeIcon icon={faChevronLeft} /></Button>
                                    <Button className='project-page-button-next' style={{ right: '10px' }} onClick={nextPhoto}><FontAwesomeIcon icon={faChevronRight} /></Button>
                                </Card>
                            )}
                        </div>
                        <div className='project-page-tags'>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {project.category &&
                                    <div style={{ marginRight: 20 }} className='project-page-tag'>
                                        <FontAwesomeIcon icon={faTag} style={{ marginRight: 5 }} />
                                        {project.category.name}
                                    </div>
                                }
                                {project.subCategory &&
                                    <div style={{ marginRight: 20 }} className='project-page-tag'>
                                        <FontAwesomeIcon icon={faTags} style={{ marginRight: 5 }} />
                                        {project.subCategory.name}
                                    </div>
                                }
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => navigate('/profile/' + project.userCreator.id)}>
                                <b>Créé par:</b>
                                <div className='project-page-user'>
                                    <Image src={project.userCreator && project.userCreator.photo ? env.URL + 'file/' + project.userCreator.photo : avatarDefault}
                                        roundedCircle
                                        className="profile-user-photo-small"
                                        style={{ transform: 'scale(0.8)' }}
                                    />

                                    {project.userCreator.firstname} {project.userCreator.lastname}
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className='project-page-top-right-left'>
                        <div className='project-page-progress'>
                            <div className='project-page-num-total'>
                                1 035 895€
                            </div>
                            <div className='project-page-text-under'>
                                engagés sur objectif de {project.goal}€
                            </div>
                        </div>
                        <div className='project-page-num-investor'>
                            <div className='project-page-num-normal'>
                                10 743
                            </div>
                            <div className='project-page-text-under'>
                                contributeurs
                            </div>
                        </div>
                        <div className='project-page-num-day-left'>
                            {calculateDaysLeft(project.deadline) > 0 ? (
                                <>
                                    <div className='project-page-num-normal'>
                                        {calculateDaysLeft(project.deadline)}
                                    </div>
                                    <div className='project-page-text-under'>
                                        jours avant la fin
                                    </div>
                                </>
                            ) : (
                                <div>La date limite est passée</div>
                            )}

                        </div>
                        <div className='project-page-num-button-invest'>
                            Je soutiens ce projet
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            {

                            }
                            {currentUser.id !== project.userCreator.id ?
                                <div className={isFavorite ? 'project-page-num-button-favorited' : 'project-page-num-button-favorite'}
                                    onClick={() => {
                                        isFavorite ?
                                            deleteFavorite()
                                            :
                                            addFavorite(project && project.favorite)
                                    }}>
                                    <FontAwesomeIcon icon={isFavorite ? faHeartSolid : faHeart} style={{ marginRight: 10 }} /> {isFavorite ? 'enregistré' : 'Rappel'}
                                </div>
                                :
                                <div className={'project-page-num-button-favorited'} >
                                    <FontAwesomeIcon icon={faHeartSolid} style={{ marginRight: 10 }} /> {project && project.favorites.length} j'aime
                                </div>
                            }
                            <div className='project-page-num-share'>
                                <div className='project-page-num-share-icon'><FontAwesomeIcon icon={faSquareFacebook} size='xl' /></div>
                                <div className='project-page-num-share-icon'><FontAwesomeIcon icon={faSquareTwitter} size='xl' /></div>
                                <div className='project-page-num-share-icon'><FontAwesomeIcon icon={faEnvelope} size='xl' /></div>
                                <div className='project-page-num-share-icon'><FontAwesomeIcon icon={faLink} size='xl' /></div>
                            </div>
                        </div>
                        <div className='project-page-notice'>
                            <span>Tout ou rien.</span> Ce projet ne sera financé que si l'objectif de financement est atteint avant le {formatDateTime(project.deadline)}
                        </div>
                    </div>
                </div>
                <div className='project-page-middle'>
                    <div className='project-middlepage-text'>
                        <FontAwesomeIcon icon={faUser} className='project-middle-page-icon' />
                        Fund Rise Hub réunit le créateur et ses contributeurs autour du financement d'un projet.
                    </div>
                    <div className='project-middlepage-text'>
                        <FontAwesomeIcon icon={faCheckCircle} className='project-middle-page-icon' />
                        Les récompenses ne sont pas garanties, mais le créateur s'engage à informer ses contributeurs régulièrement.
                    </div>
                    <div className='project-middlepage-text'>
                        <FontAwesomeIcon icon={faDollarSign} className='project-middle-page-icon' />
                        Votre contribution n'est prélevée que si l'objectif de financement du projet est atteint avant la date limite.
                    </div>
                </div>
                <div className='project-page-menu'>
                    <div className='project-page-menu-item-left'>
                        <div className={menuItem === 1 ? 'project-page-menu-item chosen' : 'project-page-menu-item'} onClick={() => setMenuItem(1)}>Campagne</div>
                        <div className={menuItem === 2 ? 'project-page-menu-item chosen' : 'project-page-menu-item'} onClick={() => setMenuItem(2)}>Récompenses</div>
                        <div className={menuItem === 3 ? 'project-page-menu-item chosen' : 'project-page-menu-item'} onClick={() => setMenuItem(3)}>FAQ</div>
                        <div className={menuItem === 4 ? 'project-page-menu-item chosen' : 'project-page-menu-item'} onClick={() => setMenuItem(4)}>Actus</div>
                        <div className={menuItem === 5 ? 'project-page-menu-item chosen' : 'project-page-menu-item'} onClick={() => setMenuItem(5)}>Commentaires</div>
                        <div className={menuItem === 6 ? 'project-page-menu-item chosen' : 'project-page-menu-item'} onClick={() => setMenuItem(6)}>Communauté</div>
                    </div>
                    <div className='project-page-menu-item-right'>
                        <div className='project-page-num-button-invest' style={{ width: 'fit-content', marginBlock: 0, marginInline: 20 }}>
                            Je soutiens ce projet
                        </div>

                        {currentUser.id !== project.userCreator.id ?
                            <div className={isFavorite ? 'project-page-num-button-favorited' : 'project-page-num-button-favorite'}
                                onClick={() => {
                                    isFavorite ?
                                        deleteFavorite()
                                        :
                                        addFavorite(project && project.favorite)
                                }}
                                style={{ width: 'fit-content', height: 'fit-content', marginBlock: 0 }}
                            >
                                <FontAwesomeIcon icon={isFavorite ? faHeartSolid : faHeart} style={{ marginRight: 10 }} /> {isFavorite ? 'enregistré' : 'Rappel'}
                            </div>
                            :
                            <div className={'project-page-num-button-favorited'} >
                                <FontAwesomeIcon icon={faHeartSolid} style={{ marginRight: 10 }} /> {project && project.favorites.length} j'aime
                            </div>
                        }

                    </div>
                </div>
                {menuItem === 1 && <Campaign campaigns={project.campaign} reward={project.reward} />}
                {menuItem === 2 && <Reward reward={project.reward} />}
                {menuItem === 3 && <FAQ faq={project.faq} />}
                {menuItem === 4 && <Updates update={project.update} />}
                {menuItem === 5 && <Comment comment={project.comment} />}
                {menuItem === 6 && <Community />}
            </div >
        )
    }

}
export default Project