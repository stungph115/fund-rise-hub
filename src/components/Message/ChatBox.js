import { faCircleXmark, faFaceLaughBeam, faFaceSmile, faFileCirclePlus, faFileLines, faInfo, faInfoCircle, faPaperPlane, faPaperclip, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Image, Modal } from "react-bootstrap"
import { useSelector } from "react-redux"
import { env } from "../../env"
import avatarDefault from '../../assets/default-avata.jpg'
import { useEffect, useRef, useState } from "react"
import EmojiPicker from "emoji-picker-react"

function ChatBox({ conversation }) {
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


    function sendChat() { }
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



        // emoji picker
        const handleDocumentClick = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) && emojiPickerIconRef.current && !emojiPickerIconRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        }
        // emoji mouse hovered
        const [hovered, setHovered] = useState(false)
        const handleMouseEnter = () => {
            setHovered(true)
        }
        const handleMouseLeave = () => {
            setHovered(false)
        }


        return (
            <div className="inbox-chatbox">
                {/* chat header(avatar and name and button info)  */}
                <div className="inbox-chatbox-header">
                    {/* avatar and name */}
                    <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                        <div>
                            <Image src={otherUser && otherUser.photo ? env.URL + 'file/' + otherUser.photo : avatarDefault}
                                roundedCircle
                                style={{ height: '6vh', marginInline: 20 }}
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


                {/* chat footer (inputs, button send) */}
                <div className="inbox-chatbox-footer">
                    {selectedFiles.length === 0 && <div className='more-input' onClick={() => inputFileRef.current.click()}><FontAwesomeIcon icon={faPaperclip} size='lg' style={{ color: 'white' }} className='attachement' /></div>}
                    <div className='more-input' ref={emojiPickerIconRef} style={{ marginRight: 5 }} onClick={() => setShowEmojiPicker(prevState => !prevState)}><FontAwesomeIcon icon={hovered ? faFaceLaughBeam : faFaceSmile} size='lg' style={{ color: 'white' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} /></div>
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

                    <Button className='button-send-chat' onClick={() => sendChat()} disabled={isLoading || (message.trim() === '' && selectedFiles.length === 0) || conversation.chatStatus === 1 ? true : false}>
                        {isLoading ?
                            <FontAwesomeIcon icon={faSpinner} size='xl' />
                            :
                            <FontAwesomeIcon icon={faPaperPlane} size='xl' />
                        }
                    </Button>
                </div >
            </div>
        )
    }
}
export default ChatBox