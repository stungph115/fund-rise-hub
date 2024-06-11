import React from 'react';
import { Card } from 'react-bootstrap';
import { env } from '../../env';

function RewardEarned({ rewards }) {
    return (
        <div className='reward-list'>
            {rewards.map(rewardEarned => (
                <Card key={rewardEarned.id} className='reward-card'>
                    {rewardEarned.reward.photo && (
                        <Card.Img variant="top" src={`${env.URL}file/${rewardEarned.reward.photo}`} />
                    )}
                    <Card.Body>
                        <Card.Title>{rewardEarned.reward.title}</Card.Title>
                        <Card.Text>{rewardEarned.reward.description}</Card.Text>
                        <Card.Text><b>Prix: </b> {rewardEarned.reward.price} €</Card.Text>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
}
export default RewardEarned