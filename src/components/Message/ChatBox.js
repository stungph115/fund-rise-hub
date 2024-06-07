import { faCircleXmark, faEye, faFaceLaughBeam, faFaceSmile, faFileCirclePlus, faFileLines, faInfo, faInfoCircle, faPaperPlane, faPaperclip, faSpinner, faTriangleExclamation, faCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Badge, Button, Image, Modal, OverlayTrigger, Tooltip } from "react-bootstrap"
import { useSelector } from "react-redux"
import { env } from "../../env"
import avatarDefault from '../../assets/default-avata.jpg'
import { useEffect, useRef, useState } from "react"
import EmojiPicker from "emoji-picker-react"
import { toast } from "react-toastify"
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from "react-router-dom"
import { isSameDay, formatDistanceToNow } from 'date-fns'
import FileSize from "./FileSizConverter"
import CustomNotification from "../Alert/CustomNotification"
import axios from "axios"
import { Buffer } from 'buffer'
import StatusDotOnline from "../StatusDot/StatusDotOnline"
import StatusDotOffline from "../StatusDot/StatusDotOfline"
import { socket } from "../../utils/socket"

function ChatBox({ conversation }) {
    const navigate = useNavigate()
    //current user
    const user = useSelector((state) => state.userReducer)
    //chat footer
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState([])
    const [message, setMessage] = useState("")
    const [textOverflowed, setTextOverflowed] = useState(false)
    const [lastestReadMessage, setLastestReadMessage] = useState(0)
    const inputRef = useRef(null)
    const inputFileRef = useRef(null)
    const emojiPickerRef = useRef(null)
    const emojiPickerIconRef = useRef(null)
    const [isLoading, setIsLoading] = useState(false)
    //file input
    function handleFileInputChange(event) {
        const filesToAdd = Array.from(event.target.files).filter((file) => file.size <= 28 * 1024 * 1024).map((file) => ({
            id: uuidv4(),
            file: file
        }))

        const oversizedFiles = Array.from(event.target.files).filter((file) => file.size > 28 * 1024 * 1024);

        if (oversizedFiles.length > 0) {
            const fileNames = oversizedFiles.map((file) => file.name).join(', ');
            toast.error(`Les fichiers suivants dépassent la limite de taille de 28 Mo: ${fileNames}`, {
                autoClose: 5000
            })
        }

        setSelectedFiles((prevFiles) => [...prevFiles, ...filesToAdd])
    }
    function handleFileRemove(fileId) {
        setSelectedFiles((prevFiles) =>
            prevFiles.filter((file) => file.id !== fileId)
        )
        // Reset the file input value to allow selecting the same file again
        inputFileRef.current.value = null

    }
    const cursorPositionRef = useRef(0)
    //scroll to bottom body chat
    const chatBodyRef = useRef(null)
    //merge file and messages
    let mergedData = []
    if (conversation && conversation.messages && conversation.file) {
        mergedData = [...conversation.messages, ...conversation.file].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        )
    } else {
        mergedData = conversation
    }

    function scrollBottomOfChat() {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
        }
    }
    useEffect(() => {
        scrollBottomOfChat()
    }, [mergedData])

    //image modal
    const [modalUrl, setModalUrl] = useState(null)
    useEffect(() => {
        const images = chatBodyRef.current ? chatBodyRef.current.getElementsByTagName('img') : []
        for (let i = 0; i < images.length; ++i) {
            images[i].addEventListener('click', openImageInModal)
        }

        return () => {
            for (let i = 0; i < images.length; ++i) {
                images[i].removeEventListener('click', openImageInModal)
            }
        }
    }, [conversation])
    const openImageInModal = (e) => {
        setModalUrl(e.target.src)
    }
    //swap input type
    useEffect(() => {
        const isTextOverflowing = message.length > 100
        if (isTextOverflowing) {
            setTextOverflowed(true)
        } else {
            setTextOverflowed(false)
        }
    }, [message])

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
            inputRef.current.selectionStart = cursorPositionRef.current
            inputRef.current.selectionEnd = cursorPositionRef.current
        }

    }, [textOverflowed])
    // emoji picker
    const handleDocumentClick = (event) => {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) && emojiPickerIconRef.current && !emojiPickerIconRef.current.contains(event.target)) {
            setShowEmojiPicker(false);
        }
    }
    useEffect(() => {
        document.addEventListener('mousedown', handleDocumentClick);
        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
        }
    }, [])

    // emoji mouse hovered
    const [hovered, setHovered] = useState(false)
    const handleMouseEnter = () => {
        setHovered(true)
    }
    const handleMouseLeave = () => {
        setHovered(false)
    }
    const handleEmojiClick = (emojiData) => {
        const currentMessage = message
        const updatedMessage = `${currentMessage} ${String.fromCodePoint(
            parseInt(emojiData.unified, 16)
        )}`
        setMessage(updatedMessage)
    }
    //chat body

    function sendChat() {
        setIsLoading(true)
        if (message.trim() !== '') {
            axios.post(env.URL + 'message', {
                conversationId: conversation.id,
                userId: user.id,
                message: message.trim()
            }).then((response) => {
                if (response.status === 201) {
                    setMessage('')
                    if (inputRef.current) {
                        inputRef.current.value = ''
                    }
                    setIsLoading(false)
                }
            }).catch((error) => {
                const toastId = toast.loading("Envoie message...")
                setIsLoading(false)
                toast.update(toastId, { render: error.response.data, type: 'error', isLoading: false, autoClose: 2000 })
            })

        }
        if (selectedFiles.length > 0) {
            selectedFiles.forEach(async (file) => {
                const bufferArray = await file.file.arrayBuffer()
                const blob = Buffer.from(bufferArray)
                const extension = file.file.name.split('.').pop().toLocaleLowerCase()
                const extensionAllowed = ['txt', 'rtf', 'doc', 'docx', 'odt', 'csv', 'xls', 'xlsx', 'xlsm', 'ods', 'ppt', 'pptx', 'odp',
                    'svg', 'odg', 'pdf', 'bmp', 'jpg', 'jpeg', 'gif', 'png', 'wma', 'wmv', 'mp3', 'mpg', 'mp4', 'avi', 'mkv', 'xml']
                if (extensionAllowed.includes(extension)) {
                    axios.post(env.URL + 'file-chat', {
                        name: file.file.name,
                        userId: user.id,
                        conversationId: conversation.id,
                        size: file.file.size,
                        blob,
                    }).then((response) => {
                        if (response.data === 'FILE_CREATED') {
                            setSelectedFiles([])
                        }
                        setIsLoading(false)
                    }).catch((error) => {
                        const toastId = toast.loading("Envoie message...")
                        setIsLoading(false)
                        toast.update(toastId, { render: error.response.data, type: 'error', isLoading: false, autoClose: 2000 })
                    })
                } else {
                    toast(
                        <CustomNotification
                            mainText={(
                                <>
                                    <span style={{ fontSize: 14 }}>Fichier: <strong>{file.file.name}</strong></span><br />
                                    <span style={{ fontSize: 16 }}>L'extension <strong>{extension}</strong> n'est pas autorisé</span>
                                </>
                            )}
                        />,
                        { autoClose: 5000, type: 'error' }
                    )
                    setIsLoading(false)
                }
            })
        }
    }
    //set read
    useEffect(() => {
        setReadStatus()
    }, [conversation])

    function setReadStatus() {
        mergedData.forEach((item) => {
            if (item.user.id !== user.id) {
                if (item.name && item.read === 0) {
                    axios.patch(env.URL + "file-chat/" + item.id).then((response) => {
                        if (response.data.message === 'FILE_READ_UPDATED') {
                            console.log("file readUpdated")
                        }
                    }).catch((error) => {
                        console.log("error :\n" + JSON.stringify(error) + "\n\n")

                    })
                } else if (item.content && item.read === 0) {
                    axios.patch(env.URL + "message/" + item.id).then((response) => {
                        if (response.data.message === 'MESSAGE_READ_UPDATED') {
                            console.log("message readUpdated")
                        }
                    }).catch((error) => {
                        console.log("error :\n" + JSON.stringify(error) + "\n\n")
                    })
                }
            }
        })
    }

    //check the lastest read message

    function findLastestReadMessage() {
        let latestTimestamp = null
        for (const item of mergedData) {
            // Check if the user ID matches the current user and read is 1
            if (item.user.id === user.id && item.read === 1) {
                const itemTimestamp = new Date(item.createdAt).getTime()
                // Check if this item has a later timestamp than the current latest
                if (latestTimestamp === null || itemTimestamp > latestTimestamp) {
                    setLastestReadMessage(item.id)
                    latestTimestamp = itemTimestamp
                }
            }
        }
    }
    useEffect(() => {
        findLastestReadMessage()
    }, [mergedData])


    const shouldShowTimestamp = (previousMessage, currentMessage) => {
        if (!previousMessage) {
            return true // Display timestamp for the first message
        }

        const previousTimestamp = new Date(previousMessage.createdAt)
        const currentTimestamp = new Date(currentMessage.createdAt)

        // Display timestamp if messages are on different days
        if (!isSameDay(previousTimestamp, currentTimestamp)) {
            return true
        }

        // Display timestamp if there is a significant time gap between messages
        const timeDifference = currentTimestamp - previousTimestamp
        const significantTimeGap = 10 * 60 * 1000 // Adjust as needed (in milliseconds)
        return timeDifference >= significantTimeGap
    }
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
            const distance = formatDistanceToNow(date, { addSuffix: true })
            return distance.replace(/^il y a environ /, '').replace(/^il y a /, '')
        }
    }
    function shouldShowName(previousMessage, currentMessage) {
        if (!previousMessage || !currentMessage) {
            return false
        }
        if (!previousMessage.user && currentMessage.user) {
            return true
        }
        if (previousMessage.user && currentMessage.user) {
            return previousMessage.user.id !== currentMessage.user.id
        }
        return false
    }

    function isImageFile(fileName) {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
        const extension = fileName.split('.').pop().toLowerCase()
        return imageExtensions.includes(extension)
    }

    //render null

    const otherUser = conversation.participants.filter(participant => participant.id !== user.id)[0]
    const [otherUserOnline, setOtherUserStatusOnline] = useState(false)
    useEffect(() => {
        getStatusUser()
    }, [conversation])
    //socket user status
    useEffect(() => {
        socket.on('user-status', () => {
            if (conversation) {
                getStatusUser()
            }
        })
        return () => {
            socket.off('user-status')
        }
    }, [otherUser, conversation])

    function getStatusUser() {
        console.log("getstatus")
        axios.get(env.URL + 'user/status/' + otherUser.id).then((res) => {
            if (res.data && res.data.active) {
                setOtherUserStatusOnline(res.data.active)
            } else {
                setOtherUserStatusOnline(false)
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <div className="inbox-chatbox">
            {/* chat header(avatar and name and button info)  */}
            <div className="inbox-chatbox-header">
                {/* avatar and name */}
                <div className="inbox-chatbow-header-user" onClick={() => navigate('/profile/' + otherUser.id)}>
                    <div>
                        <Image src={otherUser && otherUser.photo ? env.URL + 'file/' + otherUser.photo : avatarDefault}
                            roundedCircle
                            style={{ height: '6vh', marginRight: 20 }}
                        />
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: 22 }}>{otherUser.firstname} {otherUser.lastname}</div>
                        {otherUserOnline ?
                            <div style={{ display: 'flex', alignItems: 'center' }}>en ligne <div style={{ marginLeft: 5 }} /> <StatusDotOnline /></div>
                            :
                            <div style={{ display: 'flex', alignItems: 'center' }}>hors ligne <div style={{ marginLeft: 5 }} /> <StatusDotOffline /></div>
                        }

                    </div>
                </div>
                {/* setting */}
                <div className="inbox-chatbox-button-info">
                    <FontAwesomeIcon icon={faInfoCircle} size="xl" />
                </div>
            </div>

            {/* chat body (messages bla bla) */}
            <div className="inbox-chatbox-body" ref={chatBodyRef}>
                {mergedData.map((item, index) => {
                    const previousMessage = mergedData[index - 1]
                    const showTimestamp = shouldShowTimestamp(previousMessage, item)
                    const containsOnlyEmoji = /^[\uD800-\uDBFF][\uDC00-\uDFFF]+$/g.test(item.content)
                    return (
                        <div
                            key={index}
                            className={`message ${(item.user.email === user.email ? 'current-user' : 'other-user')}`}
                        >
                            {showTimestamp && (
                                <div className="message-date-timestamp" style={{ marginBottom: 10, textAlign: "center", fontSize: 14, color: "#888" }}>
                                    {formatTimestamp(item.createdAt)}
                                </div>
                            )}

                            {(
                                <>
                                    {item.content ? (
                                        <>
                                            <OverlayTrigger
                                                placement="left"
                                                overlay={
                                                    <Tooltip className={'tooltip-timestamp'}>
                                                        {new Date(item.createdAt).toLocaleString()}
                                                    </Tooltip>
                                                }
                                            >
                                                {containsOnlyEmoji ?
                                                    <div className={`message-content only-emoji`} style={{ fontSize: 50 }} >{item.content}</div>
                                                    :
                                                    <div className={`message-content`} dangerouslySetInnerHTML={{ __html: item.content }} style={{ fontSize: 18, padding: 5, paddingInline: 15, borderRadius: 25 }} />

                                                }

                                            </OverlayTrigger>
                                            {(lastestReadMessage !== 0 && item.id === lastestReadMessage) ? <div className="message-date"><FontAwesomeIcon icon={faEye} /></div> : <></>}
                                        </>
                                    ) : (
                                        <>
                                            <>
                                                {isImageFile(item.name) ? (
                                                    <>
                                                        <OverlayTrigger
                                                            placement="left"
                                                            overlay={
                                                                <Tooltip className={'tooltip-timestamp'}>
                                                                    {new Date(item.createdAt).toLocaleString()}
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <img
                                                                className="message-content-photo"
                                                                src={`${env.URL}file-chat/${item.name}`}
                                                                onError={(e) => {
                                                                    e.target.onerror = null; // Prevent infinite loop in case of repeated errors
                                                                    e.target.style.display = 'none'; // Hide the image
                                                                    e.target.nextSibling.style.display = 'block'; // Show the "photo not found" message
                                                                }}
                                                                style={{ cursor: 'pointer' }}
                                                            />
                                                        </OverlayTrigger>
                                                    </>

                                                ) : (
                                                    <>
                                                        <OverlayTrigger
                                                            placement="left"
                                                            overlay={
                                                                <Tooltip className={'tooltip-timestamp'}>
                                                                    {new Date(item.createdAt).toLocaleString()}
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <div className="message-content" style={{ fontSize: 18, padding: 5, paddingInline: 15, borderRadius: 25, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                                                                <div style={{ marginRight: 10 }}><FontAwesomeIcon icon={faFileLines} size="lg" /></div>
                                                                <div>
                                                                    <a href={`${env.URL}file-chat/${item.name}`} className="file-download-link" target="_blank" rel="noopener noreferrer">
                                                                        {item.name}
                                                                    </a>
                                                                    <div style={{ fontSize: 12 }}><FileSize size={item.size} /></div>
                                                                </div>
                                                            </div>
                                                        </OverlayTrigger>
                                                        {(lastestReadMessage !== 0 && item.id === lastestReadMessage) ? <div className="message-date"><FontAwesomeIcon icon={faEye} /></div> : <></>}
                                                    </>
                                                )}

                                                {isImageFile(item.name) && (
                                                    <>
                                                        <OverlayTrigger
                                                            placement="left"
                                                            overlay={
                                                                <Tooltip className={'tooltip-timestamp'}>
                                                                    {new Date(item.createdAt).toLocaleString()}
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <div className="message-content-error" style={{ padding: 2, paddingInline: 10, borderRadius: 10, display: 'none' }}>
                                                                <FontAwesomeIcon icon={faTriangleExclamation} /> Photo introuvable
                                                            </div>
                                                        </OverlayTrigger>
                                                        {(lastestReadMessage !== 0 && item.id === lastestReadMessage) ? <div className="message-date"><FontAwesomeIcon icon={faEye} /></div> : <></>}
                                                    </>


                                                )}
                                            </>
                                        </>
                                    )}
                                </>
                            )}


                        </div >
                    )
                })}
            </div>
            {
                showEmojiPicker && <div className='emoji-picker' ref={emojiPickerRef}><EmojiPicker onEmojiClick={handleEmojiClick} /></div>
            }

            <input
                type="file"
                onChange={handleFileInputChange}
                multiple
                style={{ display: 'none' }}
                ref={inputFileRef} />

            {/* chat footer (inputs, button send) */}
            <div className="inbox-chatbox-footer">
                {selectedFiles.length === 0 && <div className='more-input' onClick={() => inputFileRef.current.click()}><FontAwesomeIcon icon={faPaperclip} size='lg' style={{ color: '#4FCD94' }} className='attachement' /></div>}
                <div className='more-input' ref={emojiPickerIconRef} style={{ marginRight: 5 }} onClick={() => setShowEmojiPicker(prevState => !prevState)}><FontAwesomeIcon icon={hovered ? faFaceLaughBeam : faFaceSmile} size='lg' style={{ color: '#4FCD94' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} /></div>
                <div className='input-main'>
                    {selectedFiles.length > 0 && (
                        <div className="file-preview" style={{ display: 'flex' }}>
                            <div className="add-more-files" onClick={() => inputFileRef.current.click()}><FontAwesomeIcon icon={faFileCirclePlus} size="2xl" /></div>
                            {selectedFiles.map((file) => (
                                <div key={file.id} className="file-preview-item" style={{ display: 'inline-block', marginRight: '20px', position: "relative", maxHeight: 50, maxWidth: 150 }}>
                                    {file.file.type.includes('image') ? (
                                        <div className="file-preview-img">
                                            <img src={URL.createObjectURL(file.file)} alt="Preview" width={50} height={50} style={{ borderRadius: '25%', objectFit: 'cover' }} />
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#e0e0e0', padding: 5, borderRadius: 10, height: 50 }}>
                                            <div style={{ marginRight: 5 }}>
                                                <FontAwesomeIcon icon={faFileLines} />
                                            </div>
                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.file.name}</span>
                                        </div>
                                    )}
                                    <div onClick={() => handleFileRemove(file.id)} style={{
                                        borderRadius: '50%', cursor: "pointer", zIndex: 1, position: "absolute", top: "-10px", right: "-10px",
                                    }}
                                        className="remove-file-icon">
                                        <FontAwesomeIcon icon={faCircleXmark} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {textOverflowed ?
                        <textarea
                            value={message}
                            placeholder="Saisissez votre message..."
                            onChange={(e) => (setMessage(e.target.value), cursorPositionRef.current = e.target.selectionStart)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && message !== '') {
                                    sendChat()
                                }
                            }}
                            ref={inputRef}
                            rows={4}
                            className={selectedFiles.length > 0 ? "textarea-with-file" : "textarea"}
                        ></textarea>
                        :
                        <input
                            type="text"
                            value={message}
                            placeholder="Sasisez votre message..."
                            onChange={(e) => (setMessage(e.target.value), cursorPositionRef.current = e.target.selectionStart)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && message !== '') {
                                    sendChat()
                                }
                            }}
                            ref={inputRef}
                            className={selectedFiles.length > 0 ? "input-text-with-file" : "input-text"}
                        />

                    }

                </div>
                <Modal size='xl' show={modalUrl !== null} onHide={() => setModalUrl(null)}>
                    <img src={modalUrl} />
                </Modal>

                <button className='button-send-chat' onClick={() => sendChat()} disabled={isLoading || (message.trim() === '' && selectedFiles.length === 0) || conversation.chatStatus === 1 ? true : false}>
                    {isLoading ?
                        <FontAwesomeIcon icon={faSpinner} size='xl' />
                        :
                        <FontAwesomeIcon icon={faPaperPlane} size='xl' />
                    }
                </button>
            </div >
        </div>
    )

}
export default ChatBox