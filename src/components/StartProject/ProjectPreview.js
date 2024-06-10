import React from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { env } from '../../env';

const ProjectPreview = ({ projectData, onBack, categories }) => {
    const currentUserId = useSelector((state) => state.userReducer.id)
    const { category, subCategory, title, description, photos, campaigns, rewards, goal, deadline } = projectData;
    async function createProject() {
        const photosProjectUploaded = await Promise.all(photos.map(photo => uploadPhoto(photo)));
        const rewardsProjectUploaded = await Promise.all(rewards.map(reward => uploadPhoto(reward.photo)));

        const photoIds = photosProjectUploaded.filter(photo => photo !== null);
        const rewardData = rewards.map((reward, index) => ({
            ...reward,
            photo: rewardsProjectUploaded[index] || null,
        }));

        const params = {
            userId: currentUserId,
            goal: parseInt(goal),
            deadline: deadline,
            title: title,
            descriptions: description,
            category: parseInt(category),
            subCategory: parseInt(subCategory),
            photos: photoIds,
            campaigns,
            rewards: rewardData,
        };
        console.log(params)
        try {
            const response = await axios.post(env.URL + 'projects', params);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    async function uploadPhoto(file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await axios.post(env.URL + 'file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return res.data;
        } catch (err) {
            console.error(err);
            return null;
        }
    }
    return (
        <>
            <div>
                <h4>Catégorie:</h4>
                <p>{category}</p>
                {subCategory && (
                    <>
                        <h4>Sous-catégorie:</h4>
                        <p>{subCategory}</p>
                    </>
                )}
                <h4>Titre:</h4>
                <p>{title}</p>
                <h4>Description:</h4>
                <p>{description}</p>
                <h4>Objectif de financement:</h4>
                <p>{goal} €</p>
                <h4>Date limite:</h4>
                <p>{deadline && deadline.toLocaleDateString('fr-FR')}</p>
                <h4>Photos:</h4>
                <div className='photos-list'>
                    {photos.map((photo, index) => (
                        <Image key={index} src={URL.createObjectURL(photo)} alt={`photo-${index}`} style={{ width: '100px', marginRight: '10px' }} />
                    ))}
                </div>
                <h4>Campagnes:</h4>
                <div className='campaign-list'>
                    {campaigns.map((campaign, index) => (
                        <Card key={index} className='campaign-card'>
                            <Card.Body>
                                <Card.Title>{campaign.title}</Card.Title>
                                <Card.Text>{campaign.content}</Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
                <h4>Récompenses:</h4>
                <div className='campaign-list'>
                    {rewards.map((reward, index) => (
                        <Card key={index} className='reward-card'>
                            {reward.photo && <Card.Img variant="top" src={URL.createObjectURL(reward.photo)} />}
                            <Card.Body>
                                <Card.Title>{reward.title}</Card.Title>
                                <div className='reward-content'>{reward.description}</div>
                                <div className='reward-price'>Prix: {reward.price} €</div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </div>
            <div className='start-project-button-page'>
                <div className='start-project-button-previous' onClick={onBack}>
                    <FontAwesomeIcon icon={faArrowLeftLong} style={{ marginRight: 10 }} /> Retour
                </div>
                <div className={'start-project-button-next'} onClick={() => createProject()}>
                    Soumettre le projet
                </div>
            </div>
        </>
    );
};

export default ProjectPreview;
