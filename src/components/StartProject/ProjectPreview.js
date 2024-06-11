import React from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { env } from '../../env';
import { Fade } from 'react-reveal';
import '../../styles/project/projectPreview.css'
import { formatMontant } from '../../utils/utils';
import { useNavigate } from 'react-router';

const ProjectPreview = ({ projectData, onBack, categories }) => {
    const navigate = useNavigate()
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
        try {
            const response = await axios.post(env.URL + 'projects', params);
            if (response.data.status === 201 && response.data.projectId) {
                navigate('/start/success/' + response.data.projectId)
            }
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

    const getCategoryName = (id) => {
        const categoryObj = categories.find(cat => cat.id == id);
        return categoryObj ? categoryObj.name : '';
    };

    const getSubCategoryName = (categoryId, subCategoryId) => {
        const categoryObj = categories.find(cat => cat.id == categoryId);
        console.log(categoryObj)
        if (categoryObj && categoryObj.subCatgory) {
            const subCategoryObj = categoryObj.subCatgory.find(subCat => subCat.id == subCategoryId);
            return subCategoryObj ? subCategoryObj.name : 'N/A';
        }
        return 'N/A';
    };
    return (
        <Fade bottom>
            <>
                <div>
                    <div className='project-preview-item' >
                        <div className='project-preview-title'>Catégorie:</div>
                        <div className='project-preview-content'>{getCategoryName(category)}</div>
                    </div>

                    {subCategory && (
                        <div className='project-preview-item'>
                            <div className='project-preview-title'>Sous-catégorie:</div>
                            <div className='project-preview-content'>{getSubCategoryName(category, subCategory)}</div>
                        </div>
                    )}

                    <div className='project-preview-item'>
                        <div className='project-preview-title'>Titre:</div>
                        <div className='project-preview-content'>{title}</div>
                    </div>
                    <div className='project-preview-item'>
                        <div className='project-preview-title'>Description:</div>
                        <div className='project-preview-content'>{description}</div>
                    </div>
                    <div className='project-preview-item'>
                        <div className='project-preview-title'>Objectif de financement:</div>
                        <div className='project-preview-content'>{formatMontant(goal)}</div>
                    </div>
                    <div className='project-preview-item'>
                        <div className='project-preview-title'>Date limite:</div>
                        <div className='project-preview-content'>{deadline && deadline.toLocaleDateString('fr-FR')}</div>
                    </div>



                    <div className='project-preview-title' style={{ marginBottom: 10 }}>Photos:</div>
                    <div className='photos-list' style={{ marginBottom: 30 }}>
                        {photos.map((photo, index) => (
                            <Image key={index} src={URL.createObjectURL(photo)} alt={`photo-${index}`} style={{ width: '100px', marginRight: '10px' }} />
                        ))}
                    </div>
                    <div className='project-preview-title'>Campagnes:</div>
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
                    <div className='project-preview-title' style={{ marginTop: 20 }}>Récompenses:</div>
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
        </Fade>

    );
};

export default ProjectPreview;
