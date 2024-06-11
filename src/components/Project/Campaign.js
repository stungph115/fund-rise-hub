import { useEffect, useState } from 'react';
import '../../styles/project/projectCampaign.css';
import { Button, Image } from 'react-bootstrap';
import defaultRewardPhoto from '../../assets/reward-default.jpg'
import { env } from '../../env';

function Campaign({ campaigns, reward, goToCheckOut, backable }) {
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const handleCampaignClick = (campaign) => {
        setSelectedCampaign(campaign);
    };
    useEffect(() => {
        if (campaigns.length > 0) {
            setSelectedCampaign(campaigns[0]);
        }
    }, [campaigns]);
    return (
        <div className='campaign-wrapper'>
            <div className="list-campaign">
                {campaigns.map((campaign) => (
                    <div
                        className={selectedCampaign && selectedCampaign.id === campaign.id ? "list-campaign-item selected" : "list-campaign-item"}
                        key={campaign.id}
                        onClick={() => handleCampaignClick(campaign)}
                    >
                        {campaign.title}
                    </div>
                ))}
            </div>
            <div className="content-campaign">
                {selectedCampaign ? (
                    <>
                        <h2 style={{ marginBottom: 20 }}>{selectedCampaign.title}</h2>
                        <p>{selectedCampaign.content}</p>

                    </>
                ) : (
                    <p>Select a campaign to see details</p>
                )}
            </div>
            <div className="campaign-list-reward">
                <div style={{ fontSize: 18, marginBottom: 20 }} >Assistance</div>
                {backable && <div className='campaign-list-reward-card'>
                    <div style={{ fontSize: 16, marginBottom: 20, color: 'rgb(59, 59, 59)' }}>S'engager sans recevoir de récompense</div>
                    <Button className='campaign-list-button' onClick={() => goToCheckOut()}>Continuer</Button>

                </div>}
                <div style={{ fontSize: 18, marginBottom: 20 }} >Récompenses disponibles</div>
                {reward.map((item) => (
                    <div key={item.id} className='campaign-list-reward-card'>
                        <Image
                            src={item.photo ? `${env.URL}file/${item.photo}` : defaultRewardPhoto}
                            style={{ width: '100%', height: '150px', objectFit: 'contain', marginBottom: '10px' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlock: '10px' }}>
                            <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                            <div style={{ fontWeight: 'bold' }}>{item.price} €</div>
                        </div>
                        <div className='reward-description'>{item.description}</div>
                        <div className='reward-description'>{item.description}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                            <Button className='campaign-button-white'>Détails</Button>
                            {backable && <Button className='campaign-list-button' style={{ width: '59%' }} onClick={() => goToCheckOut()}>Engagement de {item.price} €</Button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Campaign;
