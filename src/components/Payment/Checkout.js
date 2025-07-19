import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router"
import { env } from "../../env"
import ListCard from "./CardList"
import '../../styles/checkout.css'
import defaultRewardPhoto from '../../assets/project-default.jpg'
import { Image } from "react-bootstrap"
import { useStripe } from '@stripe/react-stripe-js'
import { Fade } from "react-reveal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import SpinnerGreen from "../../utils/Spinner"

function Checkout() {
    const stripe = useStripe()
    const navigate = useNavigate()
    const [project, setProject] = useState(null)
    const [reward, setReward] = useState(null)
    const [selectedCard, setSelectedCard] = useState(null)
    //saved payment
    const [paymentIntent, setPaymentIntent] = useState(null)
    const idProject = useParams().idProject
    const idReward = useParams().idReward
    const amout = useParams().amout
    const currentUser = useSelector((state) => state.userReducer)
    //loading and return
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [succeeded, setSucceeded] = useState(null)
    const [loadingStatus, setLoadingStatus] = useState(null)
    const [disabledSubmit, setDisableSubmit] = useState(true)

    console.log(paymentIntent)
    useEffect(() => {
        if (project && project.reward && project.reward.length > 0) {
            const rewardId = parseInt(idReward, 10); // Parse idReward to a number
            const foundReward = project.reward.find((item) => item.id === rewardId);
            setReward(foundReward);
        }
    }, [project, idReward])

    useEffect(() => {
        getProjectDetail()
    }, [idProject])

    function getProjectDetail() {
        axios.get(env.URL + 'projects/' + idProject).then((res) => {
            setProject(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }
    const createPayment = async (event) => {
        setIsLoading(true)
        event.preventDefault()
        if (!stripe) {
            return
        }
        const paymentItentData = {
            userId: currentUser.id,
            montant: amout * 100
        }
        if (paymentIntent) {
            setLoadingStatus("Vérification de méthode de paiement...")
            confirmPayment(paymentIntent, selectedCard.id)
        } else {
            setLoadingStatus("Création du paiement...")
            //create payment
            await axios.post(env.URL + 'payment', {
                paymentItentData
            }).then(async (res) => {
                /* console.log('create payment intent res: ', res) */
                setPaymentIntent(res.data.paymentData)
                setLoadingStatus("Vérification de méthode de paiement...")
                //confirm payment
                confirmPayment(res.data.paymentData, selectedCard.id)
            }).catch((error) => {
                console.log(error)
                setIsLoading(false)
            })
        }
    }
    async function confirmPayment(paymentIntent, paymentMethod) {
        console.log(paymentIntent, paymentMethod)
        stripe.confirmCardPayment(paymentIntent.clientSecret, {
            payment_method: paymentMethod
        })
            .then(function (res) {
                if (res.paymentIntent) {
                    if (res.paymentIntent.status === 'succeeded') {
                        //ridirect
                        setSucceeded("Paiement réussit")

                        //create invest
                        createInvest(paymentIntent.paymentId)
                        //create reward earned if needed
                        if (reward) {
                            createRewardEarned()
                        }
                        navigate("/payment/success/" + idProject)
                    }
                }
                if (res.error) {
                    if (res.error.code === 'incorrect_cvc') {
                        setError("Code cryptogramme visuel est incorrect.")
                        //code générale information incorrects
                    }
                    if (res.error.code === 'card_declined') {
                        setError("Paiement refusé. Réessayer ou choisir une autre carte.")
                    }
                    if (res.error.code === 'payment_intent_authentication_failure') {
                        setError('Paiement refusé. Authentification échouée.')
                    }
                }
                setIsLoading(false)
            })
    }
    async function createInvest(paymentId) {
        const params = {
            userId: currentUser.id,
            paymentId: paymentId,
            amount: amout,
            projectId: project.id,
        }
        axios.post(env.URL + 'invest', params).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }
    async function createRewardEarned() {
        const params = {
            userId: currentUser.id,
            rewardId: reward.id,
        }
        axios.post(env.URL + 'reward-earned', params).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })

    }
    return (
        <Fade right>
            <>
                {isLoading ?
                    (<div style={{ padding: 20 }}>

                        {loadingStatus && <div style={{ color: 'blue', marginBottom: 20 }}>{loadingStatus}</div>}
                        <SpinnerGreen />
                    </div>)
                    :
                    <div className="checkout-wrapper">
                        <div>
                            <h2 style={{ marginBottom: 30 }}>Résumé de l'engagement pour:</h2>
                            <div>
                                <b>{project && project.title} </b> par <b>{project && project.userCreator.firstname} {project && project.userCreator.lastname}</b>
                            </div>
                            {project && <Image
                                src={project.photos.length > 0 ? `${env.URL}file/${project.photos[0].name}` : defaultRewardPhoto}
                                style={{ width: '500px', height: '300px', objectFit: 'contain', marginBottom: 30, backgroundColor: "white", border: '1px solid gray', borderRadius: 5 }}
                            />}
                            <h4>Votre engagement</h4>
                            <div style={{ paddingLeft: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ marginRight: 20 }}>Récompense</div>
                                    {idReward === 'no-reward' ?
                                        <div>Non merci, je souhaite simplement soutenir le projet</div>
                                        :
                                        <>
                                            <div>{reward && reward.title}</div>
                                            <div>{reward && reward.price} €</div>
                                        </>
                                    }
                                </div>
                                {(reward && amout > reward.price) && <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 5 }}>
                                    <div style={{ marginRight: 20 }}>Bonus</div>
                                    <div>{amout - reward.price} €</div>

                                </div>}
                                {!reward && <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 5 }}>
                                    <div style={{ marginRight: 20 }}>Bonus</div>
                                    <div>{amout} €</div>

                                </div>}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, paddingTop: 5, borderTop: '1px solid gray' }}>
                                    <b style={{ marginRight: 20 }}>Montant total</b>
                                    <b style={{ color: 'green' }}>{amout && amout + " €"}</b>
                                </div>


                            </div>
                        </div>
                        <div style={{ backgroundColor: 'white', padding: 20, border: '1px solid gray', textAlign: 'center' }}>
                            <h3 style={{ marginBottom: 20 }}>Choissisez une carte de paiment</h3>
                            <div>
                                <ListCard client={currentUser} selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
                            </div>

                            {selectedCard &&
                                <>
                                    {error && <div style={{ color: 'red', marginBlock: 10 }}>{error}</div>}

                                    <div className="project-page-num-button-invest" style={{ marginTop: 50 }} onClick={createPayment}>Je m'engage</div>
                                    <p style={{ width: 500 }}>En validant votre engagement, vous acceptez les Conditions d'utilisation et la Politique de confidentialité de FundRiseHub et vous autorisez Stripe, notre prestataire de traitement des règlements, à débiter votre moyen de paiement.</p>

                                </>
                            }
                        </div>
                    </div >
                }
                {succeeded && <div style={{ color: 'green', marginBlock: 10 }}>{succeeded}</div>}
            </>

        </Fade>
    )
}
export default Checkout
