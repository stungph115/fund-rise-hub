import { useEffect, useState } from 'react';
import '../../styles/Profile.css';
import { useParams } from 'react-router';
import axios from 'axios';
import { env } from '../../env';
import avatarDefault from '../../assets/default-avata.jpg';
import { Image } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Fade } from 'react-reveal';

function Profile() {
    const [user, setUser] = useState(null)
    const idUser = useParams().userId
    const currentUser = useSelector((state) => state.userReducer)
    const [isMyProfile, setIsMyProfile] = useState(false)
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

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        // You can now send this file to your backend
        const formData = new FormData();
        formData.append('file', file);

        axios.post(env.URL + 'file/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => {
                // Handle success
                axios.patch(env.URL + 'user/' + currentUser.id, {
                    photo: response.data
                }).then((res) => {
                    getUserInfo(idUser)
                }).catch((err) => { console.log(err) })
            })
            .catch((error) => {
                console.error('Error uploading file: ', error);
                // Handle error
            });
    };

    return (
        <>
            {user &&
                <Fade right>
                    <div className="profile-wrapper">
                        <label htmlFor="file-upload">
                            <Image
                                src={user && user.photo ? env.URL + 'file/' + user.photo : avatarDefault}
                                roundedCircle
                                className="profil-user-photo"
                            />
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                            disabled={!isMyProfile}
                        />
                        <h1>{user.firstname} {user.lastname}</h1>
                        <p>Email: {user.email}</p>
                        <p>tel: {user.phone}</p>

                    </div>
                </Fade>

            }
        </>
    );
}

export default Profile;
