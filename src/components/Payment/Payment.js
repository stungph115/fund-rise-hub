import { useSelector } from 'react-redux'
import '../../styles/Payment.css'
import { useState } from 'react'
import ListCard from './CardList'
import { Fade } from 'react-reveal'
function Payment() {
    const currentUser = useSelector((state) => state.userReducer)
    const [selectedCard, setSelectedCard] = useState(null)
    //button switch
    const [switchValue, setSwitchValue] = useState(1)
    return (
        <Fade right>
            <div className='payment-wrapper'>
                <div className='payment-switch'>
                    <div className={switchValue === 1 ? 'payment-switch-button chosen' : 'payment-switch-button'} onClick={() => setSwitchValue(1)}>Mes cartes  </div>
                    <div className={switchValue === 2 ? 'payment-switch-button chosen' : 'payment-switch-button'} onClick={() => setSwitchValue(2)}>Mes paiements  </div>
                    <div className={switchValue === 3 ? 'payment-switch-button chosen' : 'payment-switch-button'} onClick={() => setSwitchValue(3)}>Mes souscriptions  </div>
                </div>
                <div className='payment-content'>
                    {switchValue === 1 &&
                        <ListCard client={currentUser} selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
                    }
                    {/* lisst card */}

                    {/* add card */}
                    {/* payment history */}
                    {/* sub history */}
                </div>
            </div>
        </Fade>

    )
}
export default Payment