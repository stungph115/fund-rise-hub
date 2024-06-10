import React, { useState } from 'react';
import { Form, Button, Col, Row, Image, Modal, Card } from 'react-bootstrap';
import FileUploadForm from './PhotoFormWithCarousel';
import '../../styles/StartProject.css'
import { Fade } from 'react-reveal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faPlus, faPlusCircle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import fr from 'date-fns/locale/fr';
import Dropzone from 'react-dropzone';
import ProjectPreview from './ProjectPreview';
registerLocale('fr', fr);

const StartProject = ({ categories }) => {
    //info basic
    const [step, setStep] = useState(1)
    const [category, setCategory] = useState('')
    const [subCategory, setSubCategory] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [goal, setGoal] = useState('')
    const [deadline, setDeadline] = useState('')
    //campaigns
    const [campaigns, setCampaigns] = useState([])
    //campaign-form
    const [showFormCampain, setShowFormCampain] = useState(false)
    const [campaignTitle, setCampaignTitle] = useState('')
    const [campaignContent, setCampaignContent] = useState('')
    //rewards
    const [rewards, setRewards] = useState([])
    //rewards-form
    const [showFormReward, setShowFormReward] = useState(false)
    const [rewardTitle, setRewardTitle] = useState('')
    const [rewardDescription, setRewardDescription] = useState('')
    const [rewardPrice, setRewardPrice] = useState('')
    const [rewardPhoto, setRewardPhoto] = useState('')

    //for photos and carousel
    const [photos, setPhotos] = useState([])
    const [files, setFiles] = useState([])

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };
    const goToPreview = () => {
        setStep(6); // Set to preview step
    };
    function addCampain() {
        const newCampaign = {
            title: campaignTitle,
            content: campaignContent,
        }
        setCampaigns([...campaigns, newCampaign]);
        setCampaignTitle('')
        setCampaignContent('')
        setShowFormCampain(false)
    }

    function onCloseFormCampain() {
        setShowFormCampain(false)
        setCampaignTitle('')
        setCampaignContent('')
    }

    function addReward() {
        const newReward = {
            title: rewardTitle,
            description: rewardDescription,
            price: rewardPrice,
            photo: rewardPhoto
        }
        setRewards([...rewards, newReward])
        setRewardDescription('')
        setRewardPhoto('')
        setRewardPrice('')
        setRewardTitle('')
        setShowFormReward(false)
    }

    function onCloseFormReward() {
        setShowFormReward(false)
        setRewardDescription('')
        setRewardPhoto('')
        setRewardPrice('')
        setRewardTitle('')
    }
    const deleteCampaign = (index) => {
        const updatedCampaigns = campaigns.filter((_, i) => i !== index);
        setCampaigns(updatedCampaigns);
    }
    const deleteReward = (index) => {
        const updatedRewards = rewards.filter((_, i) => i !== index);
        setRewards(updatedRewards);
    }
    const projectData = {
        category,
        subCategory,
        title,
        description,
        photos,
        campaigns,
        rewards,
        goal,
        deadline,
    };
    return (
        <Fade right>
            <div style={{
                backgroundColor: 'white', padding: '30px 50px 20px 50px', margin: "20px",
                width: "40vw", height: 'max-content'
            }} className='listing'>
                <h2 style={{ textAlign: "center", marginBottom: 30 }}>
                    {step === 6 ?
                        "Prévisualisation de votre projet" :
                        "Démarrer votre projet"
                    }

                </h2>
                <Form>
                    {step === 1 && (
                        <Fade >
                            <div className='start-project-step'>
                                Etape 1/5 - Catégorie (obligatoire)
                            </div>

                            <div>
                                <Form.Group controlId="category">
                                    <Form.Label style={{ fontWeight: 500 }}>Catégorie</Form.Label>
                                    <Form.Control as="select" onChange={(e) => setCategory(e.target.value)} value={category}>
                                        <option value="">--- Sélectionner une category ---</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <div style={{ marginBottom: 20 }} />
                                {category && (
                                    <Form.Group controlId="subCategory">
                                        <Form.Label style={{ fontWeight: 500 }}> Sous-catégorie  (option)</Form.Label>
                                        <Form.Control as="select" onChange={(e) => setSubCategory(e.target.value)} value={subCategory}>
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
                            <div className={`start-project-button-page`} style={{ justifyContent: 'right' }} >
                                <div className={category ? 'start-project-button-next' : 'start-project-button-next-disable'} onClick={!category ? null : nextStep}>
                                    Suivant: Présentation
                                </div>
                            </div>

                        </Fade>
                    )}

                    {step === 2 && (
                        <Fade >
                            <div className='start-project-step'>
                                Etape 2/5 - Présentation (obligatoire)
                            </div>
                            <Form.Group controlId="title">
                                <Form.Label style={{ fontWeight: 500 }} >Titre</Form.Label>
                                <Form.Control type="text" onChange={(e) => setTitle(e.target.value)} value={title} />
                            </Form.Group>
                            <div style={{ marginBottom: 20 }} />
                            <Form.Group controlId="description">
                                <Form.Label style={{ fontWeight: 500 }} >Description</Form.Label>
                                <Form.Control as="textarea" rows={3} onChange={(e) => setDescription(e.target.value)} value={description} />
                            </Form.Group>
                            <div style={{ marginBottom: 20 }} />
                            <Form.Group controlId="photos">
                                <Form.Label style={{ fontWeight: 500 }}>Photos (option, max 10)</Form.Label>
                                <FileUploadForm
                                    photos={photos}
                                    setPhotos={setPhotos}
                                    files={files}
                                    setFiles={setFiles}
                                />
                            </Form.Group>
                            <div className='start-project-button-page'>
                                <div className='start-project-button-previous' onClick={prevStep}>
                                    <FontAwesomeIcon icon={faArrowLeftLong} style={{ marginRight: 10 }} /> Présentation
                                </div>
                                <div className={(title && description) ? 'start-project-button-next' : 'start-project-button-next-disable'} onClick={(!title || !description) ? null : nextStep}>
                                    Suivant: Campagnes
                                </div>
                            </div>


                        </Fade>
                    )}
                    {step === 3 && (
                        <>
                            <div className='start-project-step'>
                                Etape 3/5 - Campagnes (obligatoire)*
                            </div>
                            <div onClick={() => setShowFormCampain(true)} className='add-campaign'>
                                Ajouter une campange
                            </div>
                            {campaigns.length > 0 && (
                                <div className='campaign-list'>
                                    {campaigns.map((campaign, index) => (
                                        <Card key={index} className='campaign-card'>
                                            <Card.Body>
                                                <Card.Title>{campaign.title}</Card.Title>
                                                <Card.Text>
                                                    <div className='campaign-content'>{campaign.content}</div>

                                                </Card.Text>
                                                <button className='campaign-delete-btn' onClick={(e) => {
                                                    e.stopPropagation
                                                    e.preventDefault()
                                                    deleteCampaign(index)
                                                }}>
                                                    <FontAwesomeIcon icon={faXmarkCircle} size='lg' />
                                                </button>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            )}
                            <Modal show={showFormCampain} onHide={() => onCloseFormCampain(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Ajouter une campagne</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div style={{ padding: 20 }}>
                                        <Form.Group controlId="campaignTitle">
                                            <Form.Label style={{ fontWeight: 500 }}>Titre</Form.Label>
                                            <Form.Control type="text" onChange={(e) => setCampaignTitle(e.target.value)} value={campaignTitle} />
                                        </Form.Group>
                                        <div style={{ marginBottom: 20 }} />
                                        <Form.Group controlId="campaignContent">
                                            <Form.Label style={{ fontWeight: 500 }}>Contenu</Form.Label>
                                            <Form.Control as="textarea" rows={3} onChange={(e) => setCampaignContent(e.target.value)} value={campaignContent} />
                                        </Form.Group>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <div style={{ width: '100%', justifyContent: "center", display: 'flex' }}>
                                        <Button onClick={() => addCampain()} variant='success' disabled={!campaignTitle || !campaignContent}>Ajouter</Button>
                                    </div>
                                </Modal.Footer>
                            </Modal>

                            <div style={{ marginBottom: 20 }} />
                            <div className='start-project-note'>* Au moins une campagne requise</div>
                            <div className='start-project-button-page'>
                                <div className='start-project-button-previous' onClick={prevStep}>
                                    <FontAwesomeIcon icon={faArrowLeftLong} style={{ marginRight: 10 }} /> Présentation
                                </div>
                                <div className={campaigns.length > 0 ? 'start-project-button-next' : 'start-project-button-next-disable'} onClick={campaigns.length === 0 ? null : nextStep}>
                                    Suivant: financement
                                </div>
                            </div>
                        </>
                    )}

                    {step === 4 && (
                        <>
                            <div className='start-project-step'>
                                Etape 4/5 - Information financement (obligatoire)
                            </div>
                            <Form.Group controlId="goal">
                                <Form.Label style={{ fontWeight: 500 }}>Objectif (€)</Form.Label>
                                <Form.Control type="number" onChange={(e) => setGoal(e.target.value)} value={goal} />
                            </Form.Group>
                            <div style={{ marginBottom: 20 }} />
                            <Form.Group controlId="deadline">
                                <Form.Label style={{ fontWeight: 500, display: 'block' }}>Date limite</Form.Label>
                                <DatePicker
                                    selected={deadline}
                                    onChange={(date) => setDeadline(date)}
                                    locale="fr"
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    value={deadline}
                                />
                            </Form.Group>
                            <div className='start-project-button-page'>
                                <div className='start-project-button-previous' onClick={prevStep}>
                                    <FontAwesomeIcon icon={faArrowLeftLong} style={{ marginRight: 10 }} /> Présentation
                                </div>
                                <div className={goal && deadline ? 'start-project-button-next' : 'start-project-button-next-disable'} onClick={(!goal || !deadline) ? null : nextStep}>
                                    Suivant: Récompenses
                                </div>
                            </div>
                        </>
                    )}

                    {step === 5 && (
                        <>
                            <div className='start-project-step'>
                                Etape 5/5 - Récompenses (facultive)
                            </div>
                            <div onClick={() => setShowFormReward(true)} className='add-campaign'>
                                Ajouter une récompenses
                            </div>
                            {rewards.length > 0 && (
                                <div className='campaign-list'>
                                    {rewards.map((reward, index) => (
                                        <Card key={index} className='reward-card' >
                                            {reward.photo && <Card.Img variant="top" src={URL.createObjectURL(reward.photo)} />}
                                            <Card.Body>
                                                <Card.Title>{reward.title}</Card.Title>
                                                <div className='reward-content'>{reward.description}</div>
                                                <div className='reward-price'>Prix: {reward.price} €</div>

                                            </Card.Body>
                                            <button className='reward-delete-btn' onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                deleteReward(index);
                                            }}>
                                                <FontAwesomeIcon icon={faXmarkCircle} size='lg' />
                                            </button>
                                        </Card>
                                    ))}
                                </div>
                            )}
                            <Modal show={showFormReward} onHide={() => onCloseFormReward(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Ajouter une récompenses</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div style={{ padding: 20 }}>
                                        <Form.Group controlId="rewardTitle">
                                            <Form.Label style={{ fontWeight: 500 }}>Titre</Form.Label>
                                            <Form.Control type="text" onChange={(e) => setRewardTitle(e.target.value)} value={rewardTitle} />
                                        </Form.Group>
                                        <div style={{ marginBottom: 20 }} />
                                        <Form.Group controlId="rewardDescription">
                                            <Form.Label style={{ fontWeight: 500 }}>Description</Form.Label>
                                            <Form.Control as="textarea" rows={3} onChange={(e) => setRewardDescription(e.target.value)} value={rewardDescription} />
                                        </Form.Group>
                                        <div style={{ marginBottom: 20 }} />
                                        <Form.Group controlId="rewardPrice">
                                            <Form.Label style={{ fontWeight: 500 }}>Prix (€)</Form.Label>
                                            <Form.Control type="number" onChange={(e) => setRewardPrice(e.target.value)} value={rewardPrice} />
                                        </Form.Group>
                                        <div style={{ marginBottom: 20 }} />
                                        <Form.Group controlId="rewardPhoto">
                                            <Form.Label style={{ fontWeight: 500 }}>Photo</Form.Label>
                                            <Dropzone onDrop={(acceptedFiles) => setRewardPhoto(acceptedFiles[0])}>
                                                {({ getRootProps, getInputProps }) => (
                                                    <section className="container">
                                                        <div {...getRootProps({ className: 'dropzone' })}>
                                                            <input {...getInputProps()} />
                                                            <p>Drag 'n' drop some files here, or click to select files</p>
                                                        </div>
                                                    </section>
                                                )}
                                            </Dropzone>
                                            {rewardPhoto && (
                                                <div>
                                                    <strong>Fichier sélectionné:</strong> {rewardPhoto.name}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <div style={{ width: '100%', justifyContent: "center", display: 'flex' }}>
                                        <Button onClick={() => addReward()} variant='success' disabled={!rewardTitle || !rewardDescription || !rewardPrice || !rewardPhoto}>Ajouter</Button>
                                    </div>
                                </Modal.Footer>
                            </Modal>
                            <div className='start-project-button-page'>
                                <div className='start-project-button-previous' onClick={prevStep}>
                                    <FontAwesomeIcon icon={faArrowLeftLong} style={{ marginRight: 10 }} /> Présentation
                                </div>
                                <div onClick={goToPreview} className='start-project-button-next'>
                                    Continue
                                </div>
                            </div>
                        </>
                    )}
                </Form>
                {step === 6 && (
                    <ProjectPreview
                        projectData={projectData}
                        onBack={prevStep}
                        categories={categories}
                    />
                )}
            </div >
        </Fade >

    );

};

export default StartProject;
