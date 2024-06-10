import { useEffect, useState } from "react";
import { env } from "../../env";
import defaultRewardPhoto from '../../assets/reward-default.jpg'
import { Button, Image } from "react-bootstrap";

function Reward({ reward }) {
    console.log(reward)
    const [selectedReward, setSelectedReward] = useState(null);
    const handleRewardClick = (reward) => {
        setSelectedReward(reward);
    };
    useEffect(() => {
        if (reward.length > 0) {
            setSelectedReward(reward[0]);
        }
    }, [reward]);
    return (
        <div className="campaign-wrapper">
            <div className="list-campaign">
                {reward.map((item) => (
                    <div
                        className={selectedReward && selectedReward.id === item.id ? "list-campaign-item selected" : "list-campaign-item"}
                        key={item.id}
                        onClick={() => handleRewardClick(item)}
                    >
                        {item.title}
                    </div>

                ))}
            </div>
            <div className="content-campaign" style={{ width: '100%' }}>
                {selectedReward ? (
                    <>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <h2 style={{ marginBottom: 20, textAlign: "center" }}>{selectedReward.title}</h2>
                            <Button className='campaign-list-button' style={{ width: '20%' }}>Engagement de {selectedReward.price} €</Button>
                        </div>

                        <Image
                            src={selectedReward.photo ? `${env.URL}file/${selectedReward.photo}` : defaultRewardPhoto}
                            style={{ width: '100%', height: '350px', objectFit: 'contain', marginBottom: 30 }}
                        />
                        <p>{selectedReward.description}</p>

                    </>
                ) : (
                    <p>Select a campaign to see details</p>
                )}
            </div>
        </div>
    )
}
export default Reward