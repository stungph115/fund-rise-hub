import { faCircleXmark, faFaceLaughBeam, faFaceSmile, faFileCirclePlus, faFileLines, faInfo, faInfoCircle, faPaperPlane, faPaperclip, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Image, Modal } from "react-bootstrap"
import { useSelector } from "react-redux"
import { env } from "../../env"
import avatarDefault from '../../assets/default-avata.jpg'
import { useEffect, useRef, useState } from "react"
import EmojiPicker from "emoji-picker-react"
import { toast } from "react-toastify"
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from "react-router-dom"

function ChatBox({ conversation }) {
    const navigate = useNavigate()
    //current user
    const user = useSelector((state) => state.userReducer)
    console.log(conversation)
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

    function scrollBottomOfChat() {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
        }
    }
    useEffect(() => {
        scrollBottomOfChat()
    }, [conversation])

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

    function sendChat() {
        console.log("send")
    }
    //render null
    if (!conversation || (conversation && conversation.length === 0)) {
        const containerStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#3a536c',
            fontWeight: 600,
            fontSize: 32,
            width: "100%"
        }
        return (
            <div style={containerStyle}>
                <div > Aucune conversation sélectionnée</div>
            </div>
        )
    } else {
        const otherUser = conversation.participants.filter(participant => participant.id !== user.id)[0]

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
                            <div>hors ligne</div>
                        </div>
                    </div>
                    {/* setting */}
                    <div className="inbox-chatbox-button-info">
                        <FontAwesomeIcon icon={faInfoCircle} size="xl" />
                    </div>
                </div>

                {/* chat body (messages bla bla) */}
                <div className="inbox-chatbox-body" ref={chatBodyRef}>lalala</div>
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
}
export default ChatBox