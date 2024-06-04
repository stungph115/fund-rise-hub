import { useEffect, useRef, useState } from 'react';
import '../../styles/Profile.css';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { env } from '../../env';
import avatarDefault from '../../assets/default-avata.jpg';
import { Button, Image, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Fade } from 'react-reveal';
import { formatMonthYear } from '../../utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faCreditCard, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import InputName from '../Input/InputName';
import InputEmail from '../Input/InputEmail';
import InputPhone from '../Input/InputPhone';
import { faAsterisk, faCamera, faCheck, faPlus, faSpinner, faUserPen, faUserPlus, faX, faMessage, faUserMinus, faBan, } from '@fortawesome/free-solid-svg-icons';
import AvatarEditor from 'react-avatar-editor';
import { toast } from 'react-toastify';
import InputPassword from '../Input/InputPassword';
import sha512 from 'js-sha512'

function Profile() {

    const [imageSrc, setImageSrc] = useState(null);
    const [editor, setEditor] = useState(null);

    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [currentUserInfo, setCurrentUserInfo] = useState(null)

    const idUser = useParams().userId
    useEffect(() => {
        getUserInfo(idUser)
    }, [idUser])
    const currentUser = useSelector((state) => state.userReducer)
    const [isMyProfile, setIsMyProfile] = useState(false)
    const [showForms, setShowForms] = useState(false)
    //forms
    const emailRef = useRef()
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState(null)

    const phoneRef = useRef()
    const [phone, setPhone] = useState("")
    const [phoneError, setPhoneError] = useState(null)

    const firstnameRef = useRef()
    const [firstname, setFirstname] = useState("")
    const [firstnameError, setFirstnameError] = useState(null)

    const lastnameRef = useRef()
    const [lastname, setLastname] = useState("")
    const [lastnameError, setLastnameError] = useState(null)

    const [showPasswordForm, setShowPasswordForm] = useState(false)

    const passwordRef = useRef()
    const [password, setPassword] = useState("")
    const [passwordError, setPasswordError] = useState(null)

    const oldPasswordRef = useRef()
    const [oldPassword, setOldPassword] = useState("")
    const [oldPasswordError, setOldPasswordError] = useState(null)

    //button switch
    const [switchValue, setSwitchValue] = useState(1)
    useEffect(() => {
        getUserInfo(idUser)
    }, [])

    useEffect(() => {
        if (currentUser && user && currentUser.id === user.id) {
            setIsMyProfile(true)
        } else {
            setIsMyProfile(false)
        }
    }, [currentUser, user])

    useEffect(() => {
        getCurrentUserInfo()
    }, [currentUser])

    function getUserInfo(id) {
        axios.get(env.URL + 'user/' + id).then((res) => {
            setUser(res.data)
        }).catch((err) => {
            console.log(err);
        });
    }
    function getCurrentUserInfo() {
        axios.get(env.URL + 'user/' + currentUser.id).then((res) => {
            setCurrentUserInfo(res.data)
        }).catch((err) => {
            console.log(err);
        });
    }
    const handleFileUpload = () => {
        if (!editor || !imageSrc) {
            return
        }

        const canvas = editor.getImageScaledToCanvas()
        const croppedImageData = canvas.toDataURL()
        // Convert the data URL to a Blob
        const byteString = atob(croppedImageData.split(',')[1]);
        const mimeString = croppedImageData.split(',')[0].split(':')[1].split(';')[0];
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([arrayBuffer], { type: mimeString });
        const file = new File([blob], 'cropped_image.jpg', { type: mimeString, lastModified: Date.now() });

        const formData = new FormData();
        formData.append('file', file);
        axios.post(env.URL + 'file/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => {
                axios.patch(env.URL + 'user/' + currentUser.id, {
                    photo: response.data
                }).then((res) => {
                    getUserInfo(idUser)
                    toast.success("Photo profil changé", { autoClose: 5000, toastId: 'unauthorized' })
                }).catch((err) => { console.log(err) })
            })
            .catch((error) => {
                toast.error("Erreur changement photo profil : " + error, { autoClose: 5000, toastId: 'unauthorized' })
                console.error('Error uploading file: ', error);
            });
        setImageSrc(null)
    };
    const handleAvatarChange = () => {
        if (isMyProfile) {
            document.getElementById("file-upload").click();
        }
    };
    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            setImageSrc(reader.result);
        };
        reader.readAsDataURL(file);
    };
    function updateUserInfo() {
        axios.patch(env.URL + 'user/' + currentUser.id, {
            email: email === '' ? null : email,
            phone: phone === '' ? null : phone,
            firstname: firstname === '' ? null : firstname,
            lastname: lastname === '' ? null : lastname
        }).then((res) => {
            setEmail("")
            setPhone("")
            setFirstname("")
            setLastname("")
            getUserInfo(idUser)
            setShowForms(false)
            toast.success("Profil changé avec succès", { autoClose: 5000, toastId: 'unauthorized' })
        }).catch((err) => { console.log(err) })

    }
    function changePassword() {
        axios.post(env.URL + 'user/change-password', {
            newPassword: sha512(password).slice(10, 40),
            oldPassword: sha512(oldPassword).slice(10, 40),
            id: currentUser.id
        }).then((res) => {
            setOldPassword('')
            setPassword('')
            setShowPasswordForm(false)
            toast.success("Mot de passe changé avec succès", { autoClose: 5000, toastId: 'unauthorized' })
        }).catch((err) => {
            if (err.response.data === "PASSWORD_IS_OLD_PASSWORD") {
                toast.error("Le nouveau mot de passe ne peut pas être le même que l'ancien mot de passe", { autoClose: 5000, toastId: 'unauthorized' })
            }
            if (err.response.data === "User not found") {
                toast.error("Utilisateur est introuvable", { autoClose: 5000, toastId: 'unauthorized' })
            }
            if (err.response.data === "PASSWORD_NOT_MATCHED") {
                toast.error("Mot de passe actuel est incorrect", { autoClose: 5000, toastId: 'unauthorized' })
            } else {
                toast.error("Erreur du serveur", { autoClose: 5000, toastId: 'unauthorized' })
            }
        })
    }

    //follow
    const [isFollowed, setIsFollowed] = useState(false)
    useEffect(() => {
        if (currentUserInfo && currentUserInfo.follower.some(obj => obj.following.id === user.id)) {
            setIsFollowed(true)
        } else {
            setIsFollowed(false)
        }
    }, [user, currentUserInfo])

    function followAnUser() {
        console.log('idFollower: ', currentUser.id + ' - ' +
            'idFollowing: ', user.id)
        axios.post(env.URL + 'follow', {
            idFollower: currentUser.id,
            idFollowing: user.id
        }).then((res) => {
            getUserInfo(idUser)
            getCurrentUserInfo()
        }).catch((err) => {
            console.log(err)
        })
    }
    function unfollowAnUser() {
        axios.post(env.URL + 'follow/unfollow', {
            followerId: currentUser.id,
            followingId: user.id
        }).then((res) => {
            getUserInfo(idUser)
            getCurrentUserInfo()
        }).catch((err) => {
            console.log(err)
        })
    }
    const [showFollowers, setShowFollowers] = useState(false)
    const [showFollowings, setShowFollowings] = useState(false)

    //create conversation if not existe then go to message
    async function createConversation() {
        if (currentUser.id && user && user.id && user.id !== currentUser.id) {
            axios.get(env.URL + `conversation/check/${currentUser.id}/${user.id}`).then((res) => {
                if (!res.data.exists) {
                    axios.post(env.URL + 'conversation', {
                        user1Id: currentUser.id,
                        user2Id: user.id
                    }).then((res) => {
                        console.log(res)
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }
    return (
        <>
            {user &&
                <Fade right>
                    <div className="profile-wrapper">
                        <div className='profile-top'>
                            <div className='profile-right'>
                                {!imageSrc ? <label htmlFor="file-upload">
                                    <Image
                                        src={user && user.photo ? env.URL + 'file/' + user.photo : avatarDefault}
                                        roundedCircle
                                        className="profile-user-photo"
                                        style={{ cursor: isMyProfile ? 'pointer' : "default" }}
                                    />
                                </label>
                                    :
                                    <AvatarEditor
                                        ref={(ref) => setEditor(ref)}
                                        image={imageSrc}
                                        width={250}
                                        height={250}
                                        border={50}
                                        color={[255, 255, 255, 0.6]} // RGBA
                                        scale={1}
                                        borderRadius={125}
                                    />
                                }
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleImageSelect}
                                    disabled={!isMyProfile}
                                />

                                {isMyProfile && (!imageSrc ?
                                    <div className='button-change-avatar' onClick={handleAvatarChange} >
                                        Modifier photo profil <FontAwesomeIcon icon={faCamera} style={{ marginLeft: 5 }} />
                                    </div> :
                                    <div className='profile-form-buttons'>
                                        <div style={{ color: "green", cursor: 'pointer' }} className='profile-forms-button' onClick={handleFileUpload} ><FontAwesomeIcon icon={faCheck} /></div>
                                        <div style={{ color: "red", cursor: 'pointer' }} className='profile-forms-button' onClick={() => setImageSrc(null)}><FontAwesomeIcon icon={faX} /></div>
                                    </div>)
                                }

                            </div>
                            <div className='profile-left'>
                                {!showForms ?
                                    <div className='profile-use-info'>
                                        <h1>{user.firstname} {user.lastname}</h1>

                                        <div className='profile-moreinfo'>
                                            <p style={{ marginRight: 10 }}>0 projets soutenus  . </p>
                                            <p>Inscription : {formatMonthYear(user.createdAt)}</p>
                                        </div>
                                        <div style={{ width: 'fit-content' }}>
                                            <div className='profile-info-contact'><strong style={{ marginRight: 10 }}>Adresse mail : </strong><div>{user.email}</div> </div>
                                            <div className='profile-info-contact'><strong>Nº téléphone : </strong> <div>{user.phone}</div></div>
                                        </div>
                                        {isMyProfile &&
                                            <div style={{ display: 'flex' }}>
                                                <div className='button-follower' style={{ marginRight: 10 }} onClick={() => setShowFollowings(true)}>{currentUserInfo && currentUserInfo.follower && currentUserInfo.follower.length && currentUserInfo.follower.length} abonnements</div>
                                                .
                                                <div className='button-follower' style={{ marginLeft: 10 }} onClick={() => setShowFollowers(true)}> {currentUserInfo && currentUserInfo.following && currentUserInfo.following.length && currentUserInfo.following.length} abonnés</div>
                                            </div>
                                        }
                                        {!isMyProfile &&
                                            <div style={{ display: 'flex'/* , justifyContent: 'space-between'  */ }}>
                                                {isFollowed ?
                                                    <div className='button-follow' onClick={() => unfollowAnUser()}>
                                                        Désabonner <FontAwesomeIcon icon={faUserMinus} />
                                                    </div>
                                                    :
                                                    <div className='button-follow' onClick={() => followAnUser()}>
                                                        Abonner <FontAwesomeIcon icon={faUserPlus} />
                                                    </div>
                                                }

                                                <div className='button-follow' style={{ marginLeft: 5 }} onClick={() => createConversation()}>
                                                    Message <FontAwesomeIcon icon={faMessage} />
                                                </div>
                                            </div>

                                        }
                                    </div>
                                    :
                                    <>
                                        <InputName
                                            ref={firstnameRef}
                                            name={firstname} setName={setFirstname}
                                            nameError={firstnameError} setNameError={setFirstnameError}
                                            placeholder={"Prénom"}
                                        />
                                        <InputName
                                            ref={lastnameRef}
                                            name={lastname} setName={setLastname}
                                            nameError={lastnameError} setNameError={setLastnameError}
                                            placeholder={"Nom"}
                                        />
                                        <InputEmail
                                            ref={emailRef}
                                            email={email} setEmail={setEmail}
                                            emailError={emailError} setEmailError={setEmailError}
                                            placeholder={"E-mail"}
                                        />
                                        <InputPhone
                                            ref={phoneRef}
                                            phone={phone} setPhone={setPhone}
                                            phoneError={phoneError} setPhoneError={setPhoneError}
                                            placeholder={"Numéro téléphone"}
                                        />
                                        <div className='profile-form-buttons'>
                                            <div style={{ color: "green", cursor: 'pointer' }} className='profile-forms-button' onClick={() => updateUserInfo()}><FontAwesomeIcon icon={faCheck} /></div>
                                            <div style={{ color: "red", cursor: 'pointer' }} className='profile-forms-button' onClick={() => setShowForms(false)}><FontAwesomeIcon icon={faX} /></div>
                                        </div>

                                    </>
                                }
                                {isMyProfile && !showForms &&
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div className='button-change-avatar' onClick={() => setShowForms(true)} >
                                            Modifier mes infos <FontAwesomeIcon icon={faUserPen} style={{ marginLeft: 5 }} />
                                        </div>
                                        <div className='button-change-avatar' onClick={() => setShowPasswordForm(true)} style={{ marginLeft: 5 }}>
                                            Changer mot de passe <FontAwesomeIcon icon={faAsterisk} style={{ marginLeft: 5 }} />
                                        </div>
                                        <div className='button-change-avatar' onClick={() => navigate('/payment')} style={{ marginLeft: 5 }}>
                                            Infos des paiements <FontAwesomeIcon icon={faCreditCard} style={{ marginLeft: 5 }} />
                                        </div>
                                    </div>

                                }
                            </div>
                        </div>
                        <div className='profile-bottom'>
                            <div className='profile-bottom-switch'>
                                <div className={switchValue === 1 ? 'profile-switch-button chosen' : 'profile-switch-button'} onClick={() => setSwitchValue(1)}>Projets créés (0) </div>
                                <div className={switchValue === 2 ? 'profile-switch-button chosen' : 'profile-switch-button'} onClick={() => setSwitchValue(2)}>Projets soutenus (0) </div>
                            </div>
                            <div className='profile-bottom-content'>
                                content
                            </div>
                        </div>
                    </div>
                    <Modal size='lg' show={showPasswordForm} onHide={() => setShowPasswordForm(false)} centered>
                        <Modal.Header closeButton className="px-4">
                            <Modal.Title className="ms-auto">Changement de mot de passe</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="d-flex justify-content-center align-items-center" >
                            <div>
                                <InputPassword
                                    ref={oldPasswordRef}
                                    password={oldPassword} setPassword={setOldPassword}
                                    passwordError={oldPasswordError} setPasswordError={setOldPasswordError}
                                    placeholder={"Mot de passe actuel"}
                                />
                                <InputPassword
                                    ref={passwordRef}
                                    password={password} setPassword={setPassword}
                                    passwordError={passwordError} setPasswordError={setPasswordError}
                                    placeholder={"Nouveau mot de passe"}
                                />
                            </div>
                        </Modal.Body>
                        <Modal.Footer className="d-flex justify-content-center" >
                            <Button variant='success' onClick={() => changePassword()}>Valider</Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal size='sm' show={showFollowings} onHide={() => setShowFollowings(false)} centered>
                        <Modal.Body className="d-flex justify-content-center align-items-center" >
                            <div>
                                {currentUserInfo && currentUserInfo.follower.map(item => (
                                    <div key={item.id} className='follower'>
                                        <Image
                                            src={item.following.photo ? env.URL + 'file/' + item.following.photo : avatarDefault}
                                            roundedCircle
                                            className="profile-user-photo-small"
                                        />

                                        <div className='follower-name' onClick={() => {
                                            navigate("/profile/" + item.following.id)
                                            setShowFollowings(false)
                                        }}> {item.following.firstname} {item.following.lastname}</div>
                                        <div className='follow-remove'><FontAwesomeIcon icon={faBan} /></div>
                                    </div>
                                ))}
                            </div>
                        </Modal.Body>
                    </Modal>
                    <Modal size='sm' show={showFollowers} onHide={() => setShowFollowers(false)} centered>
                        <Modal.Body className="d-flex justify-content-center align-items-center" >
                            <div>
                                {currentUserInfo && currentUserInfo.following.map(item => (
                                    <div key={item.id} className='follower'>
                                        <Image
                                            src={item.photo ? env.URL + 'file/' + item.photo : avatarDefault}
                                            roundedCircle
                                            className="profile-user-photo-small"
                                        />
                                        <div className='follower-name' onClick={() => {
                                            navigate("/profile/" + item.following.id)
                                            setShowFollowers(false)
                                        }}> {item.follower.firstname} {item.follower.lastname}</div>
                                        <div className='follow-remove'><FontAwesomeIcon icon={faBan} /></div>
                                    </div>
                                ))}
                            </div>
                        </Modal.Body>
                    </Modal>
                </Fade >

            }
        </>
    );
}

export default Profile