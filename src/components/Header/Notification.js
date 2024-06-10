import axios from 'axios'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { env } from '../../env'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCircle, faEllipsis, faTrash, faXmark, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import { faBell } from '@fortawesome/free-regular-svg-icons'
import '../../styles/Notification.css'
import { Badge, Button, Modal } from 'react-bootstrap'
import DOMPurify from 'dompurify'
import { formatDistanceToNow } from 'date-fns'
import { useRef } from 'react'
import NotificationSetting from './NotificationSetting'
import { toast } from 'react-toastify'
import { socket } from '../../utils/socket'

function Notification({ getCountUnreadNotificationHeader, countUnreadNotification }) {
    const currentUserId = useSelector((state) => state.userReducer.id)
    const navigate = useNavigate()

    const [notifications, setNotifications] = useState([])

    const [showNotifItemSetting, setShowNotifItemSetting] = useState(null)
    const [showNotifications, setShowNotifications] = useState(false)
    const [showNotificationsSetting, setShowNotificationsSetting] = useState(false)

    const containerRef = useRef(null)
    const notifsSettingRef = useRef(null)

    const toggleNotifications = (e) => { e.stopPropagation(); setShowNotifications(!showNotifications) }
    const toggleNotificationsSetting = (e) => { e.stopPropagation(); setShowNotificationsSetting(!showNotificationsSetting) }
    const [filter, setFilter] = useState('all')
    const handleFilterChange = (filter) => { setFilter(filter) }
    const [displayDeleteAllNotif, setDisplayDeleteAllNotif] = useState(false)

    useEffect(() => {
        getNotification()
    }, [])
    useEffect(() => {
        getNotification()
    }, [countUnreadNotification])
    function getNotification() {
        axios.get(env.URL + 'notification/' + currentUserId).then((response) => {
            if (response.data.notifications.length > 0) {
                setNotifications(response.data.notifications)
            } else {
                setNotifications([])
            }
        }).catch((error) => {
            console.error(error)
        })
    }

    function setReadNotification(notificationId, read) {
        axios.patch(env.URL + 'notification/' + notificationId + '/' + read).then((response => {
            if (response.data.message === 'NOTIFICATION_READ_UPDATED') {
                getNotification()
                getCountUnreadNotificationHeader()
                setShowNotifItemSetting(null)
            }
        })).catch((error) => {
            console.log("error :\n" + JSON.stringify(error) + "\n\n")
        })
    }
    function setReadAllNotification() {
        axios.post(env.URL + 'notification/all-read', { userId: currentUserId }).then((response) => {
            if (response.data.message === 'ALL_NOTIFICATIONS_MARKED_AS_READ') {
                getNotification()
                getCountUnreadNotificationHeader()
            }
        }).catch((error) => {
            console.log("error :\n" + JSON.stringify(error) + "\n\n")
        })
    }
    function deleteAllNotification() {
        axios.delete(env.URL + 'notification').then((response) => {
            if (response.data.message === 'ALL_NOTIFICATIONS_DELETED') {
                getNotification()
                getCountUnreadNotificationHeader()
                setDisplayDeleteAllNotif(false)
            }
        }).catch((error) => {
            console.log("error :\n" + JSON.stringify(error) + "\n\n")
        })
    }
    function deleteNotification(id) {
        axios.delete(env.URL + 'notification/' + id).then((response) => {
            if (response.data.message === 'NOTIFICATION_DELETED') {
                getNotification()
                getCountUnreadNotificationHeader()
            }
        }).catch((error) => {
            console.log("error :\n" + JSON.stringify(error) + "\n\n")
        })
    }
    let filtered = []
    if (filter === 'all') {
        filtered = notifications
    } else if (filter === 'unread') {
        filtered = notifications.filter(item => item.read === 0)
    }
    const filteredNotifications = filtered
    const hasUnreadNotifications = notifications.some(notification => notification.read === 0)

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowNotifications(false)
            }
            if (notifsSettingRef.current && !notifsSettingRef.current.contains(event.target)) {
                setShowNotificationsSetting(false)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    //format timestamp
    const [currentTime, setCurrentTime] = useState(new Date())
    useEffect(() => {
        // Update the current time every minute
        const interval = setInterval(() => {
            setCurrentTime(new Date())
        }, 60000)

        return () => {
            clearInterval(interval)
        }
    }, [])
    const formatTimestamp = (timestamp) => {
        if (currentTime) {
            const date = new Date(timestamp)
            return formatDistanceToNow(date, { addSuffix: true })
        }
    }
    function onClickNotification(notification) {
        if (notification.read === 0) {
            setReadNotification(notification.id, 1)
        }
        navigate(notification.path)
        setShowNotifications(false)
    }
    //socket notification
    useEffect(() => {
        socket.on("new_notification_" + currentUserId, (notificationSave) => {
            if (notificationSave) {
                getNotification()
                getCountUnreadNotificationHeader()
                /* toast.info(
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
                ) */
            }
        })
        return () => {
            socket.off("new_notification_" + currentUserId)
        }
    }, [currentUserId])

    return (
        <>


            <div className="menu-header-item" onClick={toggleNotifications} style={{ display: 'flex', alignItems: "center" }} >
                <div className="menu-header-icon" >

                    <div className={showNotifications ? "notification-icon-container-active" : "notification-icon-container"}>
                        <FontAwesomeIcon icon={faBell} shake={countUnreadNotification > 0 ? true : false} size='lg' />


                    </div>

                </div>
                <div className={showNotifications ? "notification-text-active" : 'notification-text'} >Notifications</div>
                {countUnreadNotification > 0 && (
                    <h5>
                        <Badge pill bg="danger" style={{ color: 'white', marginLeft: 5, fontSize: 12 }}>
                            {countUnreadNotification > 99 ? '99+' : countUnreadNotification}
                        </Badge>
                    </h5>
                )}

            </div>
            {showNotifications &&
                <div className="notification-dropdown" ref={containerRef}>
                    <div style={{ display: "flex", justifyContent: 'space-between', marginBottom: 0 }} >
                        <h4 style={{ padding: '10px 10px 0 10px', fontWeight: 600 }}>Notifications</h4>
                        <div ref={notifsSettingRef}>
                            <div style={{ display: 'flex' }}>
                                <div className={showNotificationsSetting ? 'notifications-setting-active' : 'notifications-setting'} onClick={toggleNotificationsSetting} >
                                    <FontAwesomeIcon icon={faEllipsis} size='xl' />
                                </div>
                                {showNotificationsSetting &&
                                    <div className='notifications-setting-dropdown' >
                                        <div className={hasUnreadNotifications ? 'notifications-setting-dropdown-item' : 'notifications-setting-dropdown-item disable'} onClick={(e) => { e.stopPropagation(); hasUnreadNotifications && setReadAllNotification() }}>
                                            <div className='dropdown-setting-icon'><FontAwesomeIcon icon={faCheck} /> </div>
                                            Tout marquer comme lu
                                        </div>
                                        <div className={notifications.length > 0 ? 'notifications-setting-dropdown-item' : 'notifications-setting-dropdown-item disable'} onClick={(e) => { e.stopPropagation(); notifications.length > 0 && setDisplayDeleteAllNotif(true) }}>
                                            <div className='dropdown-setting-icon' ><FontAwesomeIcon icon={faTrash} /> </div>
                                            Tout supprimer
                                        </div>
                                    </div>

                                }
                                <div className={showNotificationsSetting ? 'notifications-setting-active' : 'notifications-setting'} onClick={(e) => { e.stopPropagation(); setShowNotifications(false) }} >
                                    <FontAwesomeIcon icon={faXmark} size='xl' />
                                </div>
                            </div>

                            <Modal show={displayDeleteAllNotif} size="lg" onHide={(e) => { e.stopPropagation(); setDisplayDeleteAllNotif(false) }}>
                                <Modal.Header>
                                    <Modal.Title><div style={{ justifyContent: 'center' }}>Suppression des notifications</div></Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    Supprimer toutes les notifications ?
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant='danger' onClick={(e) => { e.stopPropagation(); deleteAllNotification() }}>Supprimer</Button>
                                </Modal.Footer>
                            </Modal>
                        </div>

                    </div>
                    <div className='filter-notification'>
                        <div style={{ marginRight: 5 }} className={filter === 'all' ? 'button-filter-active' : 'button-filter'} onClick={(e) => { e.stopPropagation(); handleFilterChange('all') }}> Tous</div>
                        <div className={filter === 'unread' ? 'button-filter-active' : 'button-filter'} onClick={(e) => { e.stopPropagation(); handleFilterChange('unread') }}> Non lu</div>
                    </div>
                    <div className="notification-list-scrollable">
                        {filteredNotifications.length > 0 ?
                            filteredNotifications.map((item, index) => {
                                return (
                                    <div className="notification-item" key={item.id} onClick={(e) => { e.stopPropagation(); onClickNotification(item) }}>
                                        <div className='notification-item-text'>
                                            <div className={item.read === 0 ? 'notification-item-content' : 'notification-item-content-read'} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content) }} />
                                            <div className={item.read === 0 ? 'notification-item-date' : 'notification-item-date-read'}>{formatTimestamp(item.createdAt)}</div>
                                        </div>
                                        {item.read === 0 && <div className='notification-item-read'><FontAwesomeIcon icon={faCircle} size='xs' /></div>}
                                        <div >
                                            <NotificationSetting
                                                notification={item}
                                                setReadNotification={setReadNotification}
                                                showNotifItemSetting={showNotifItemSetting}
                                                setShowNotifItemSetting={setShowNotifItemSetting}
                                                deleteNotification={deleteNotification}
                                            />
                                        </div>
                                    </div>
                                )
                            })
                            :
                            <div style={{ textAlign: "center", padding: 20, color: 'rgb(124, 124, 124)', fontWeight: 500 }}>Vous n'avez aucune notification {filter === 'all' ? '' : 'non lue'}</div>
                        }
                    </div>

                </div>
            }
        </>
    )

}
export default Notification