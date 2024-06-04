import React, { useState, useEffect, useRef } from 'react'
import { Image } from 'react-bootstrap'
import '../../styles/Header.css'
import logo from '../../assets/logo.png'
import axios from 'axios'
import { env } from '../../env'
import { useLocation, useNavigate } from 'react-router'
import { Fade } from 'react-reveal'
import { useSelector } from 'react-redux'
import HeaderUserPanel from './HeaderUserPanel'
import avatarDefault from '../../assets/default-avata.jpg'
import { socket } from '../../utils/socket'
import HeaderSearch from './HeaderSearch'

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const menuRef = useRef(null)
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // Toggle the menu directly
    }

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleDocumentClick);
        } else {
            document.removeEventListener('mousedown', handleDocumentClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
        };
    }, [isMenuOpen]);

    const currentUser = useSelector((state) => state.userReducer)
    const location = useLocation()
    const navigate = useNavigate()
    const currentRoute = location.pathname
    const [categories, setCategories] = useState([])
    const [hoveredCategory, setHoveredCategory] = useState(null)
    const [isHovering, setIsHovering] = useState(false)

    const [user, setUser] = useState(null)
    function getUserInfo(id) {
        axios
            .get(env.URL + 'user/' + id)
            .then((res) => {
                setUser(res.data)
            })
            .catch((err) => {
                console.log(err);
            });
    }
    useEffect(() => {
        if (currentUser.id) {
            getUserInfo(currentUser.id)
        }
        getCategories()
    }, [])
    useEffect(() => {
        if (currentUser.id) {
            getUserInfo(currentUser.id)
        }
    }, [currentUser.id])

    //socket
    useEffect(() => {
        socket.on('user_updated_' + currentUser.id, () => {
            getUserInfo(currentUser.id)
        })
        return () => {
            socket.off('user_updated_' + currentUser.id)
        }
    }, [currentUser])


    function getCategories() {
        axios.get(env.URL + 'category')
            .then((res) => {
                if (res.data) {
                    setCategories(res.data)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const headerLogoOnlyRoutes = ['/sign-in', '/sign-up', '/forget-password']

    if (headerLogoOnlyRoutes.includes(currentRoute) || /^\/reset-password\/.*/.test(currentRoute)) {
        return (
            <div className='header-container-logo-only' onClick={() => navigate("/")}>
                <Image className='header-logo-only' src={logo} />
            </div >
        )
    } else {

        return (
            <div className='header-container'>
                <div className='header-top'>
                    <Fade left>
                        <div className='header-logo-container' onClick={() => navigate("/")}>
                            <Image className='header-logo' src={logo} />
                        </div>
                    </Fade>
                    <HeaderSearch categories={categories} />
                    <Fade right>
                        <div className='header-right'>
                            <div className='button-create-project'> Démarrer un projet</div>
                            {currentUser.tokenJWT ?
                                <>
                                    <Image src={user && user.photo ? env.URL + 'file/' + user.photo : avatarDefault}
                                        roundedCircle
                                        className='header-user-photo'
                                        onClick={toggleMenu}
                                    />

                                </>

                                :
                                <div className='button-login' onClick={() => navigate("/sign-in")}>Connexion</div>
                            }

                        </div>
                    </Fade>

                </div>
                <Fade top>
                    <div className='header-categories'>
                        {categories.map((category, i) => (
                            <div key={i} className='header-category' onMouseEnter={() => (setHoveredCategory(category), setIsHovering(true))} onMouseLeave={() => setIsHovering(false)}>
                                {category.name}
                            </div>
                        ))}
                    </div>
                </Fade>

                {isHovering && hoveredCategory && (
                    <Fade >
                        <div className="sub-categories-overlay" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                            <div className='sub-categories-list'>
                                <div className='sub-categories-list-tile'>{hoveredCategory.name} {">"}</div>
                                <div className='sub-categories-columns'>
                                    {hoveredCategory.subCatgory.map((subCategory, index) => (
                                        <div key={index} className="sub-category" style={{ marginTop: 10 }}>{subCategory.name}</div>
                                        /* architechture: list of sub cat | filters | feature project (most liked) */
                                    ))}
                                </div>

                            </div>

                            <div className='sub-categories-filters'>
                                <div className='sub-categories-other-tile'>Filtrer par</div>
                                <div className="sub-category-filter">  Nos coups de cœur</div>
                                <div className="sub-category-filter">  Les tendances</div>
                                <div className="sub-category-filter">  Projets presque financés</div>
                                <div className="sub-category-filter">  En début de campagne</div>
                                <div className="sub-category-filter">  Projets près de chez vous</div>
                                <div className="sub-category-filter">  Bientôt en ligne</div>
                            </div>
                            <div className='sub-categories-project'>
                                <div className='sub-categories-other-tile'>Projet sélectionné</div>
                            </div>

                        </div>
                    </Fade>
                )}
                {isMenuOpen && (
                    <Fade top ref={menuRef} >

                        <div className="menu-block-header">
                            <HeaderUserPanel currentUser={currentUser} toggleMenu={toggleMenu} />
                        </div>
                    </Fade>
                )}
            </div>
        )
    }
}

export default Header
