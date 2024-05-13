import React, { useEffect } from "react"
import { useSelector } from 'react-redux'
import DOMPurify from "dompurify"
import { socket } from "./utils/socket"

const NotificationWindows = () => {
    const currentUserId = useSelector((state) => state.userReducer.id)

    useEffect(() => {

        socket.on("new_notification_" + currentUserId, (notificationSave) => {
            if (notificationSave) {
                if (!('Notification' in window)) {
                    alert('This browser does not support desktop notification')
                } else {
                    // Check if permission is granted
                    console.log(Notification.permission)
                    if (Notification.permission === 'granted') {
                        // Create a div element with sanitized HTML content
                        const notificationContent = document.createElement('div')
                        notificationContent.innerHTML = DOMPurify.sanitize(notificationSave.content)

                        // Create and show the notification with the HTML content as the title
                        new Notification(notificationContent.innerText)
                    } else if (Notification.permission !== 'denied') {
                        // Request permission from the user
                        Notification.requestPermission().then((permission) => {
                            if (permission === 'granted') {
                                // Create a div element with sanitized HTML content
                                const notificationContent = document.createElement('div')
                                notificationContent.innerHTML = DOMPurify.sanitize(notificationSave.content)

                                // Create and show the notification with the HTML content as the title
                                new Notification(notificationContent.innerText)
                            }
                        })
                    }
                }
            }
        })

        return () => {
            socket.off("new_notification_" + currentUserId)
        }
    }, [currentUserId])

    return <></>
}

export default NotificationWindows