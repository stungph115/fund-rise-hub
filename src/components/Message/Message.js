import { useEffect, useState } from 'react'
import '../../styles/Message.css'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { env } from '../../env'
import { Badge, Form, Image, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons'
import { Fade } from 'react-reveal'
import ChatBox from './ChatBox'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { socket } from '../../utils/socket'
import avatarDefault from '../../assets/default-avata.jpg'

import { formatDistanceToNow, setDefaultOptions } from 'date-fns'
import { fr } from 'date-fns/locale'
import StatusDotOnline from '../StatusDot/StatusDotOnline'
import NotSelectedChat from './NotSelectChat'

setDefaultOptions({ locale: fr })
function Message() {
    const navigate = useNavigate()

    const [selectedItem, setSelectedItem] = useState(null)

    const [searchName, setSearchName] = useState('')
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
    //current user
    const user = useSelector((state) => state.userReducer)

    const [conversations, setConversations] = useState([])
    const [conversation, setConversation] = useState(null)
    const currentUser = useSelector((state) => state.userReducer)
    useEffect(() => {
        getConversations()
    }, [])

    //update conversation after conversations changed
    useEffect(() => {
        if (conversation && conversation.length !== 0) {
            var conversationUpdated = conversations.find(x => x.id === conversation.id)
            setConversation(conversationUpdated)
        }
    }, [conversations])
    function getConversations() {
        axios.get(env.URL + 'conversation/' + currentUser.id).then((res) => {
            setConversations(res.data)
        }).catch((err) => {
            console.log(err)
        })

    }
    //fetch status online users
    const [userStatus, setUserStatus] = useState({}) // Store user status here

    useEffect(() => {
        if (conversations.length > 0) {
            fetchAllUserStatuses()
        }
    }, [conversations])
    const fetchUserStatus = (userId) => {
        return axios.get(`${env.URL}user/status/${userId}`)
            .then((res) => {
                return res.data.active
            })
            .catch((err) => {
                console.log(`Error fetching status for user ${userId}:`, err)
                return false
            })
    }

    const fetchAllUserStatuses = async () => {
        const statusPromises = conversations.flatMap(conversation =>
            conversation.participants
                .filter(participant => participant.id !== currentUser.id)
                .map(participant => fetchUserStatus(participant.id).then(status => ({ [participant.id]: status })))
        )
        const statuses = await Promise.all(statusPromises)
        const statusMap = statuses.reduce((acc, status) => ({ ...acc, ...status }), {})
        setUserStatus(statusMap)
    }
    //id from params
    //toggle chat id
    const [searchParams, setSearchParams] = useSearchParams()
    const idConversation = parseInt(searchParams.get('id'))

    useEffect(() => {
        if (conversations.length > 0) {
            const conversationMatched = conversations.find(obj => obj.id === idConversation)
            if (conversationMatched) {
                setConversation(conversationMatched)
                setSelectedItem(idConversation)
            }
        }

    }, [conversations])

    //formating
    function isPhoto(fileName) {
        const photoExtensions = ['bmp', 'jpg', 'jpeg', 'gif', 'png']
        const extension = fileName.split('.').pop().toLowerCase()
        return photoExtensions.includes(extension)
    }
    const formatTimestamp = (timestamp) => {
        if (currentTime) {
            const date = new Date(timestamp)
            const distance = formatDistanceToNow(date, { addSuffix: true })
            return distance.replace(/^il y a environ /, '').replace(/^il y a /, '').replace(/^moins d’une minute/, "maintenant")
        }
    }

    //socket
    useEffect(() => {
        socket.on('new_message_' + user.id, () => {
            getConversations()

        })
        return () => {
            socket.off('new_message_' + user.id)
        }
    }, [user])
    useEffect(() => {
        socket.on('new_file_' + user.id, () => {
            getConversations()
        })
        return () => {
            socket.off('new_file_' + user.id)
        }
    }, [user])
    useEffect(() => {
        socket.on('file_read_updated_' + user.id, () => {
            getConversations()
        })
        return () => {
            socket.off('file_read_updated_' + user.id)
        }
    }, [user])
    useEffect(() => {
        socket.on('message_read_updated_' + user.id, () => {
            getConversations()
        })
        return () => {
            socket.off('message_read_updated_' + user.id)
        }
    }, [user])
    //notification
    useEffect(() => {
        socket.on("new_notification_" + user.id, (notificationSave) => {
            if (notificationSave) {
                getConversations()
            }
        })
        return () => {
            socket.off("new_notification_" + user.id)
        }
    }, [user])
    //user status
    useEffect(() => {
        socket.on('user-status', () => {
            if (conversations.length > 0) {
                fetchAllUserStatuses()
            }
        })
        return () => {
            socket.off('user-status')
        }
    }, [user, conversations])

    // merge files and messages
    let mergedData = conversations.map(obj => ({
        ...obj,
        mergeMessageAndFiles: [...obj.messages, ...obj.file]
    }))
    mergedData.forEach(obj => {
        obj.mergeMessageAndFiles.sort((a, b) => {
            const createdAtA = new Date(a.createdAt)
            const createdAtB = new Date(b.createdAt)
            return createdAtB - createdAtA
        })
    })
    mergedData.sort((a, b) => {
        const latestMessageA = a.mergeMessageAndFiles[0]
        const latestMessageB = b.mergeMessageAndFiles[0]

        const createdAtA = latestMessageA ? new Date(latestMessageA.createdAt) : new Date(a.createdAt)
        const createdAtB = latestMessageB ? new Date(latestMessageB.createdAt) : new Date(b.createdAt)

        return createdAtB - createdAtA
    })

    const handleItemClick = (item, index) => {
        const searchParams = new URLSearchParams(location.search)
        searchParams.set("id", index)
        navigate(`${location.pathname}?${searchParams.toString()}`)
        setSelectedItem(index)
        setConversation(item)
    }
    return (
        <Fade right>
            <div className='inbox-wrapper'>
                <div className='inbox-list'>
                    <div className='inbox-list-title'> Messageries</div>
                    <div className='inbox-list-search'>
                        <InputGroup size="lg" className='inbox-list-search-bar' style={{}}>
                            <InputGroup.Text style={{ borderRight: "none", borderRadius: '25px 0px 0px 25px', backgroundColor: "#F0F2F5" }}>
                                <FontAwesomeIcon icon={faSearch} style={{ color: "#656969" }} />
                            </InputGroup.Text>
                            <Form.Control style={{ borderInline: "none", backgroundColor: "#F0F2F5" }}
                                placeholder="Chercher utilisateurs ou messages"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                            />
                            <InputGroup.Text style={{ borderLeft: "none", borderRadius: '0px 25px  25px  0px ', backgroundColor: "#F0F2F5", width: 'fit-content' }}>
                                <div className='search-chat-clear-filter' onClick={() => setSearchName('')}>
                                    {searchName !== "" && <FontAwesomeIcon icon={faXmark} size='lg' />}
                                </div>
                            </InputGroup.Text>
                        </InputGroup>
                    </div>
                    <div className='inbox-list-conversations'>
                        {
                            mergedData.filter(item => {
                                // Filtering based on message content or other user's name/firstname
                                const otherUser = item.participants.find(participant => participant.id !== user.id)
                                const otherUserName = `${otherUser.firstname} ${otherUser.lastname}`.toLowerCase()
                                const searchTerm = searchName.toLowerCase()
                                const nameMatches = otherUserName.includes(searchTerm)
                                const messageMatches = item.mergeMessageAndFiles.some(message =>
                                    message.content && message.content.toLowerCase().includes(searchTerm)
                                )

                                return nameMatches || messageMatches
                            }).map((item) => {
                                const isSelected = selectedItem === item.id
                                const hasMessagesOrFiles = item.mergeMessageAndFiles.length > 0
                                //counting matched message to search
                                let matchingMessageCount = 0
                                if (searchName !== '') {
                                    matchingMessageCount = item.mergeMessageAndFiles.reduce((count, message) => {
                                        if (message.content && message.content.toLowerCase().includes(searchName.toLowerCase())) {

                                            count++
                                        }
                                        return count
                                    }, 0)
                                }
                                // count unread messages
                                const filteredData = item.mergeMessageAndFiles.filter(obj => obj.read === 0 && obj.user.id !== user.id)
                                const countUnreadMessage = filteredData.length
                                const otherUser = item.participants.filter(participant => participant.id !== user.id)[0]
                                const isOnline = userStatus[otherUser.id]

                                return (
                                    <div
                                        className={`${isSelected ? "chat-box--list-chat-selected-item" : "chat-box--list-chat"}`}
                                        key={item.id}
                                        onClick={() => handleItemClick(item, item.id)}
                                        style={{ opacity: (countUnreadMessage > 0) ? 1 : 0.8, fontWeight: (countUnreadMessage > 0) ? 700 : 400 }}
                                    >

                                        <div style={{ display: 'flex', flexDirection: 'row', fontSize: 18, marginBottom: 10, justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div>
                                                    <Image src={otherUser && otherUser.photo ? env.URL + 'file/' + otherUser.photo : avatarDefault}
                                                        roundedCircle
                                                        className='profile-user-photo-small'
                                                        style={{ position: 'relative' }}
                                                    />
                                                    {isOnline &&
                                                        <div className='status-dot-online'><StatusDotOnline /></div>
                                                    }
                                                </div>
                                                <div className="chat-box--list-title">
                                                    {otherUser.firstname} {otherUser.lastname} {/* {isOnline ? ' (Online)' : ' (Offline)'} */}
                                                </div>
                                                {countUnreadMessage > 0 && (
                                                    <Badge
                                                        pill bg="danger" style={{ color: 'white', justifyItems: 'right' }}>
                                                        {countUnreadMessage}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: 'space-between' }}>
                                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '320px', paddingInline: 10, }}>
                                                {hasMessagesOrFiles ? (
                                                    // Display the last message or file
                                                    <>
                                                        {Object.values(item.mergeMessageAndFiles)[0].content ? (
                                                            // Display message
                                                            <>
                                                                {Object.values(item.mergeMessageAndFiles)[0].user.id === user.id
                                                                    ? 'Moi'
                                                                    : Object.values(item.mergeMessageAndFiles)[0].user.firstname}
                                                                : {Object.values(item.mergeMessageAndFiles)[0].content}
                                                            </>
                                                        ) : (
                                                            // Display file
                                                            <>
                                                                {Object.values(item.mergeMessageAndFiles)[0].user.id === user.id
                                                                    ? 'Vous avez '
                                                                    : Object.values(item.mergeMessageAndFiles)[0].user.firstname + ' a '}
                                                                envoyé {isPhoto(item.mergeMessageAndFiles[0].name) ? 'une photo' : 'un fichier'}
                                                            </>
                                                        )}
                                                    </>
                                                ) : (
                                                    // Display a default message when no messages or files
                                                    "Aucun message enregistré"
                                                )}

                                            </div>

                                            <div style={{ marginRight: 5 }}>
                                                <div style={{ display: 'flex' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', height: '100%', marginRight: 2 }}>·</div>
                                                    {hasMessagesOrFiles ? formatTimestamp(Object.values(item.mergeMessageAndFiles)[0].createdAt) : formatTimestamp(item.createdAt)}
                                                </div>

                                            </div>
                                        </div>

                                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px', paddingInline: 10, fontWeight: 'bold' }}>
                                            {matchingMessageCount > 0 && (
                                                <span className={isSelected ? "matching-message-count-selected" : "matching-message-count"}>
                                                    {matchingMessageCount} {matchingMessageCount > 1 ? 'messages correspondants' : 'message correspondant'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                {conversation ?
                    <ChatBox conversation={conversation} />
                    :
                    <NotSelectedChat />
                }

            </div>
        </Fade>

    )
}
export default Message
