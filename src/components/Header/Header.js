import React, { useState, useEffect, useRef } from 'react'
import { Badge, Image } from 'react-bootstrap'
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
import { toast } from 'react-toastify'
import DOMPurify from 'dompurify'

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [unreadMessageCount, setUnreadMessageCount] = useState(0)
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
    const currentUserId = useSelector((state) => state.userReducer.id)

    const location = useLocation()
    const navigate = useNavigate()
    const currentRoute = location.pathname
    const [categories, setCategories] = useState([])
    const [hoveredCategory, setHoveredCategory] = useState(null)
    const [isHovering, setIsHovering] = useState(false)
    //count unread notification
    const [countUnreadNotification, setCountUnreadNotification] = useState(0)
    useEffect(() => {
        getCountUnreadNotification()
    }, [])
    function getCountUnreadNotification() {
        axios.get(env.URL + 'notification/count-unread/' + currentUserId).then((response) => {
            setCountUnreadNotification(response.data.numberUnreadNotification)
        }).catch((error) => {
            console.error(error)
        })
    }
    function onClickNotification(notification) {
        if (notification.read === 0) {
            setReadNotification(notification.id, 1)
        }
        navigate(notification.path)
    }
    function setReadNotification(notificationId, read) {
        axios.patch(env.URL + 'notification/' + notificationId + '/' + read).then((response => {
            if (response.data.message === 'NOTIFICATION_READ_UPDATED') {
                getCountUnreadNotification()
            }
        })).catch((error) => {
            console.log("error :\n" + JSON.stringify(error) + "\n\n")
        })
    }
    //socket notification
    useEffect(() => {
        socket.on("new_notification_" + currentUserId, (notificationSave) => {
            if (notificationSave) {
                getCountUnreadNotification()
                toast.info(
                    <>
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(notificationSave.content) }} />
                        {notificationSave.path && <div className='pop-notif-link' onClick={() => onClickNotification(notificationSave)}>Cliquez ici pour voir</div>}
                    </>,
                    {
                        position: "top-left",
                        autoClose: false,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    }
                )
            }
        })
        return () => {
            socket.off("new_notification_" + currentUserId)
        }
    }, [currentUserId])
    useEffect(() => {
        let intervalId
        if (countUnreadNotification > 0 && unreadMessageCount === 0) {
            intervalId = setInterval(() => {
                document.title =
                    document.title === 'Fund Rise Hub'
                        ? countUnreadNotification > 1
                            ? countUnreadNotification + ' nouvelles notifications'
                            : 'Nouvelle notification'
                        : 'Fund Rise Hub'
            }, 1000)
        } else if (countUnreadNotification === 0 && unreadMessageCount > 0) {
            intervalId = setInterval(() => {
                document.title =
                    document.title === 'Fund Rise Hub'
                        ? unreadMessageCount > 1
                            ? unreadMessageCount + ' nouveaux messages'
                            : 'Nouveau message'
                        : 'Fund Rise Hub'
            }, 1000)
        } else if (countUnreadNotification > 0 && unreadMessageCount > 0) {
            let flashingTitle = [
                countUnreadNotification > 1
                    ? countUnreadNotification + ' nouvelles notifications'
                    : 'Nouvelle notification',
                unreadMessageCount > 1
                    ? unreadMessageCount + ' nouveaux messages'
                    : 'Nouveau message',
                'Fund Rise Hub'
            ]
            let flashingIndex = 0

            intervalId = setInterval(() => {
                document.title = flashingTitle[flashingIndex];
                flashingIndex = (flashingIndex + 1) % flashingTitle.length
            }, 1000)
        }
        else {
            document.title = "Fund Rise Hub"
        }
        return () => {
            clearInterval(intervalId)
        }
    }, [countUnreadNotification, unreadMessageCount])
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

    //socket user
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
    // get number total of unread chat
    useEffect(() => {
        if (currentUser.id) {
            getCountUnreadChatMessage()

        }
    }, [currentUser])
    function getCountUnreadChatMessage() {
        if (currentUser.id) {
            axios.post(env.URL + 'conversation/count-message-unread', { userId: currentUser.id }).then((res) => {
                if (res.data && res.data.message) {
                    setUnreadMessageCount(res.data.message)
                } else {
                    setUnreadMessageCount(0)
                }
            }).catch((error) => {
                console.error(error.toJSON())
            })
        }

    }

    const headerLogoOnlyRoutes = ['/sign-in', '/sign-up', '/forget-password', '/start']
    //sockets
    useEffect(() => {
        socket.on('new_message_' + currentUser.id, () => {
            getCountUnreadChatMessage()
        })
        return () => {
            socket.off('new_message_' + currentUser.id)
        }
    }, [currentUser])
    useEffect(() => {
        socket.on('new_file_' + currentUser.id, () => {
            getCountUnreadChatMessage()
        })
        return () => {
            socket.off('new_file_' + currentUser.id)
        }
    }, [currentUser])
    useEffect(() => {
        socket.on('file_read_updated_' + currentUser.id, () => {
            getCountUnreadChatMessage()
        })
        return () => {
            socket.off('file_read_updated_' + currentUser.id)
        }
    }, [currentUser])
    useEffect(() => {
        socket.on('message_read_updated_' + currentUser.id, () => {
            getCountUnreadChatMessage()
        })
        return () => {
            socket.off('message_read_updated_' + currentUser.id)
        }
    }, [currentUser])
    //notification
    useEffect(() => {
        socket.on("new_notification_" + currentUser.id, (notificationSave) => {
            if (notificationSave) {
                getCountUnreadChatMessage()
            }
        })
        return () => {
            socket.off("new_notification_" + currentUser.id)
        }
    }, [currentUser])
    const totalCount = countUnreadNotification + unreadMessageCount
    function handleSearch(title, category, subCategory, topFavorites, topComments, reach90Percent, expireSoon, topLatest, topPassedGoal) {
        const searchParams = new URLSearchParams({
            title, category, subCategory, topFavorites, topComments, reach90Percent, expireSoon, topLatest, topPassedGoal
        }).toString();

        navigate(`/discover?${searchParams}`);
    }

    if (headerLogoOnlyRoutes.includes(currentRoute) || /^\/reset-password\/.*/.test(currentRoute) || /^\/project\/checkout\/.*/.test(currentRoute) || /^\/checkout\/.*/.test(currentRoute)) {
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
                            <div className='button-create-project' onClick={() => navigate("start")}> Démarrer un projet</div>
                            {currentUser.tokenJWT ?
                                <>
                                    <Image src={user && user.photo ? env.URL + 'file/' + user.photo : avatarDefault}
                                        roundedCircle
                                        className='header-user-photo'
                                        onClick={toggleMenu}
                                    />
                                    {totalCount > 0 && (
                                        <h5>
                                            <Badge pill bg="danger" style={{ position: 'relative', top: '-10px', left: '-15px', color: 'white' }}>
                                                {totalCount > 99 ? '99+' : totalCount}
                                            </Badge>
                                        </h5>
                                    )}

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
                                        <div key={index} className="sub-category" style={{ marginTop: 10 }} onClick={() => { handleSearch('', hoveredCategory.id, subCategory.id, false, false, false, false, false, false) }}>{subCategory.name}</div>
                                        /* architechture: list of sub cat | filters | feature project (most liked) */
                                    ))}
                                </div>

                            </div>

                            <div className='sub-categories-filters'>
                                <div className='sub-categories-other-tile'>Filtrer par</div>
                                <div className="sub-category-filter" onClick={() => { handleSearch('', hoveredCategory.id, null, true, false, false, false, false, false) }}>  Nos coups de cœur</div>
                                <div className="sub-category-filter" onClick={() => { handleSearch('', hoveredCategory.id, null, false, true, false, false, false, false) }}>  Les tendances</div>
                                <div className="sub-category-filter" onClick={() => { handleSearch('', hoveredCategory.id, null, false, false, true, false, false, false) }}>  Projets presque financés</div>
                                <div className="sub-category-filter" onClick={() => { handleSearch('', hoveredCategory.id, null, false, false, false, false, true, false) }}>  En début de campagne</div>
                                <div className="sub-category-filter" onClick={() => { handleSearch('', hoveredCategory.id, null, false, false, false, false, false, true) }}>  Très au-dessus de l'objectif</div>
                            </div>
                            <div className='sub-categories-project'>
                                <div className='sub-categories-other-tile'>Projet sélectionné</div>
                            </div>

                        </div>
                    </Fade>
                )}
                {isMenuOpen && (
                    <div ref={menuRef}>
                        <Fade top>
                            <div className="menu-block-header">
                                <HeaderUserPanel currentUser={currentUser} toggleMenu={toggleMenu} unreadMessageCount={unreadMessageCount} getCountUnreadNotificationHeader={getCountUnreadNotification} countUnreadNotification={countUnreadNotification} />
                            </div>
                        </Fade>
                    </div>
                )}
            </div>
        )
    }
}

export default Header
