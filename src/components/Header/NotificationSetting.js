import { faCheck, faCircle, faEllipsis, faRectangleXmark, faSquareXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect } from "react"
import { useRef } from "react"
import { useState } from "react"
import { Button, Modal } from "react-bootstrap"

function NotificationSetting({
    setReadNotification,
    notification,
    setShowNotifItemSetting,
    showNotifItemSetting,
    deleteNotification
}) {
    const dropdownShow = showNotifItemSetting && showNotifItemSetting === notification.id
    const notifItemSettingRef = useRef(null)
    const [displayDeleteNotif, setDisplayDeleteNotif] = useState(false)

    const toggleNotifItemSetting = () => {
        setShowNotifItemSetting(
            showNotifItemSetting === notification.id ?
                null : notification.id
        )
    }

    function toggleRead(event, notification) {
        event.stopPropagation()
        setReadNotification(notification.id, notification.read === 0 ? 1 : 0)
    }
    function onClickDelete(event) {
        event.stopPropagation()
        setDisplayDeleteNotif(true)
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (notifItemSettingRef.current && !notifItemSettingRef.current.contains(event.target)) {
                setShowNotifItemSetting(null)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    return (
        <div>
            <div className={dropdownShow ? 'notification-item-setting-active' : 'notification-item-setting'} onClick={(event) => {
                event.stopPropagation()
                toggleNotifItemSetting()
            }}>
                <FontAwesomeIcon icon={faEllipsis} size='lg' />
                {dropdownShow &&
                    <div className='notif-item-setting-dropdown' ref={notifItemSettingRef}>
                        <div className="notif-item-setting-dropdown-item" onClick={(event) => toggleRead(event, notification)}>
                            <div className="dropdown-setting-icon">{notification.read === 0 ?
                                <FontAwesomeIcon icon={faCheck} className="notif-item-setting-dropdown-item-icon" />
                                :
                                <FontAwesomeIcon icon={faCircle} className="notif-item-setting-dropdown-item-icon" style={{ color: '#0866FF' }} size="sm" />}
                            </div>
                            Marquer comme {notification.read === 0 ? ' lu' : 'non lu'}
                        </div>
                        <div className="notif-item-setting-dropdown-item" onClick={(event) => onClickDelete(event)}>
                            <div className="dropdown-setting-icon">
                                <FontAwesomeIcon icon={faSquareXmark} className="notif-item-setting-dropdown-item-icon" />
                            </div>
                            Supprimer
                        </div>
                        <Modal show={displayDeleteNotif} size="lg" onHide={() => setDisplayDeleteNotif(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title><div style={{ justifyContent: 'center' }}>Suppression de notification</div></Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Supprimer  cette notification ?
                            </Modal.Body>
                            <Modal.Footer >
                                <Button variant="danger" onClick={() => deleteNotification(notification.id)}>Supprimer</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                }
            </div>

        </div>
    )
}
export default NotificationSetting
