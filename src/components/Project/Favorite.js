import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Image, Spinner } from "react-bootstrap";
import '../../styles/Profile.css';
import { useNavigate } from "react-router";
import { addSpacesToNumber } from "../../utils/utils";
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { env } from "../../env";
import avatarDefault from '../../assets/default-avata.jpg'
import { Fade } from "react-reveal";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import SpinnerGreen from "../../utils/Spinner";

function Favorite() {
    const [currentUserInfo, setCurrentUserInfo] = useState(null)
    const currentUser = useSelector((state) => state.userReducer)
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        getCurrentUserInfo()
    }, [currentUser])

    async function getCurrentUserInfo() {
        setIsLoading(true)
        axios.get(env.URL + 'user/' + currentUser.id).then((res) => {
            setCurrentUserInfo(res.data)
            setIsLoading(false)
        }).catch((err) => {
            console.log(err);
            setIsLoading(false)
        });

    }
    function calculateDaysLeft(deadline) {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = Math.abs(deadlineDate - now);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return deadlineDate > now ? diffDays : 0;
    }
    return (
        <Fade right>
            <>
                <h1 style={{ textAlign: "center", paddingBlock: 50 }}>Projets enregistrés</h1>
                {isLoading ?
                    <SpinnerGreen />

                    :
                    <div className='favorite-list' style={{ display: "ruby" }}>
                        {currentUserInfo && currentUserInfo.favorites && currentUserInfo.favorites.map(favorite => (
                            <Card key={favorite.project.id} className='project-card' onClick={() => navigate('/project/' + favorite.project.id)}>
                                {<Card.Img variant="top" src={`${env.URL}file/${favorite.project.photos[0].name}`} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />}
                                <Card.Body>
                                    <div style={{ display: "flex", justifyContent: 'space-between' }}>
                                        <div>
                                            <Card.Title style={{ textAlign: 'left' }}>{favorite.project.title}</Card.Title>
                                            <Card.Text style={{ textAlign: 'left' }}><b>Objectif :</b> {addSpacesToNumber(favorite.project.goal)} €</Card.Text>
                                            <Card.Text style={{ textAlign: 'left' }}><FontAwesomeIcon icon={faClock} /> {calculateDaysLeft(favorite.project.deadline)} jours restants</Card.Text>

                                        </div>
                                        <div>
                                            <b>Créé par: </b>
                                            <Image src={favorite.project.userCreator && favorite.project.userCreator.photo ? env.URL + 'file/' + favorite.project.userCreator.photo : avatarDefault}
                                                roundedCircle
                                                className="profile-user-photo-small"
                                                style={{ transform: 'scale(0.8)' }}
                                            />
                                            {favorite.project.userCreator.firstname} {favorite.project.userCreator.lastname}
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                }

            </>

        </Fade>

    );
}

export default Favorite;
