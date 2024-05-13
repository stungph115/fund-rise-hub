import { useState, useEffect } from 'react';
import '../../styles/Home.css';
import { Fade } from 'react-reveal';
import CountUp from 'react-countup';
import { addSpacesToNumber, formatMontant } from '../../utils/utils';

function Home() {
    // Stats
    const [fundedProjectCount, setFundedProjectCount] = useState(0);
    const [fundedCount, setFundedCount] = useState(0);
    const [pledgeCount, setPledgeCount] = useState(0);

    // Simulate data fetching or initialization
    useEffect(() => {
        setTimeout(() => {
            setFundedProjectCount(258396);
            setFundedCount(8000108341);
            setPledgeCount(95017147);
        }, 1000); // Simulating asynchronous data fetching
    }, []);

    return (
        <Fade bottom>
            <div className='home-wrapper'>
                <div className='home-tile'>Faisons vivre les projets créatifs.</div>
                <div className='home-stats'>
                    <div className='home-stats-title'>SUR FUND RISE HUB:</div>

                    <div className='home-stats-main'>
                        <div className='home-stats-content'>
                            <div className='home-stats-number'><CountUp end={fundedProjectCount} duration={2} separator=" " /></div>
                            <div className='home-stats-text'>projets financés</div>
                        </div>
                        <div className='home-stats-content' style={{ borderInline: "1px solid rgb(211, 211, 211)" }}>
                            <div className='home-stats-number'><CountUp end={fundedCount} duration={2} separator=" " /> €</div>
                            <div className='home-stats-text'>destinés à des travaux créatifs</div>
                        </div>
                        <div className='home-stats-content'>
                            <div className='home-stats-number'><CountUp end={pledgeCount} duration={2} separator=" " /></div>

                            <div className='home-stats-text'>engagements</div>
                        </div>
                    </div>
                </div>

                {/* Other content */}
            </div>
        </Fade>
    );
}

export default Home;
