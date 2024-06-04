import { useEffect, useState } from 'react'
import '../../styles/Footer.css'
import axios from 'axios'
import { env } from '../../env'
import logoBlack from '../../assets/logo-black.png';
import { Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

function Footer() {
    const [categories, setCategories] = useState([])
    //get categories
    useEffect(() => {
        getCategories()
    }, [])
    function getCategories() {
        axios.get(env.URL + 'category').then((res) => {
            if (res.data) {
                setCategories(res.data)
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <div className='footer-container'>
            <div className='footer-top'>
                {categories.map((category, i) => (
                    <div key={i} className='footer-category'>{category.name}</div>
                ))}
            </div>
            <div className='footer-middle'>
                <div className='footer-middle-item'>
                    <div className='footer-middle-item-title'><strong> À PROPOS DE FUND RISE HUB</strong></div>
                    <div className='footer-middle-item-link'>À propos de nous</div>
                    <div className='footer-middle-item-link'>Notre charte</div>
                    <div className='footer-middle-item-link'>Statistiques</div>
                    <div className='footer-middle-item-link'>Presse</div>
                    <div className='footer-middle-item-link'>Carrières</div>
                    <div className='footer-middle-item-link'></div>
                </div>
                <div className='footer-middle-item'>
                    <div className='footer-middle-item-title'><strong> ASSISTANCE</strong></div>
                    <div className='footer-middle-item-link'>Centre d'aide</div>
                    <div className='footer-middle-item-link'>Nos règles</div>
                    <div className='footer-middle-item-link'>Ressources pour les créateurs</div>
                    <div className='footer-middle-item-link'>Forward Funds</div>
                    <div className='footer-middle-item-link'>Ressources de marque</div>
                </div>
                <div className='footer-middle-item'>
                    <div className='footer-middle-item-title'><strong>AUTRES RESSOURCES</strong></div>
                    <div className='footer-middle-item-link'>Lettres d'information</div>
                    <div className='footer-middle-item-link'>Actus de projet Fund Rise Hub</div>
                    <div className='footer-middle-item-link'>The Creative Independent</div>
                    <div className='footer-middle-item-link'>Applications mobiles</div>
                    <div className='footer-middle-item-link'>Recherche</div>
                </div>
            </div>
            <div className='footer-middle-lower'>
                <div className='footer-middle-lower-left'>
                    <Image src={logoBlack} style={{ height: 30, marginRight: 10 }} />
                    <div> - Fund Rise Hub, © 2024</div>
                </div>
                <div className='footer-middle-lower-right'>
                    <div className='footer-brand'>
                        <FontAwesomeIcon icon={faFacebook} size='xl' />
                    </div >
                    <div className='footer-brand'>
                        <FontAwesomeIcon icon={faInstagram} size='xl' />
                    </div>
                    <div className='footer-brand'>
                        <FontAwesomeIcon icon={faTwitter} size='xl' />
                    </div>
                    <div className='footer-brand'>
                        <FontAwesomeIcon icon={faYoutube} size='xl' />
                    </div>
                    <div className='footer-brand-currency'>
                        € Euro (EUR)
                    </div>
                </div>
            </div>
            <div className='footer-bottom'>
                <div className='footer-bottom-item'>Confiance et sécurité</div>
                <div className='footer-bottom-item'>Conditions d'utilisation</div>
                <div className='footer-bottom-item'>Politique de confidentialité</div>
                <div className='footer-bottom-item'>Politique en matière de cookies</div>
                <div className='footer-bottom-item'>Préférences pour les cookies</div>
                <div className='footer-bottom-item'>Déclaration d'accessibilité</div>
            </div>
        </div>
    )
}
export default Footer