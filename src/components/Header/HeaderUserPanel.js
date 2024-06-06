import React, { useState } from 'react';
import { Badge, Image } from 'react-bootstrap';
import { removeStoreUser } from '../../store/actions/userAction'
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { env } from '../../env';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCreditCard, faEnvelope, faHeart, faUser } from '@fortawesome/free-regular-svg-icons';
import { faBriefcase, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import setAuthToken from '../../utils/axiosConfig';
import { toast } from 'react-toastify';
function HeaderUserPanel({ currentUser, toggleMenu, unreadMessageCount }) {
    const navigate = useNavigate()

    //logout
    const dispatch = useDispatch()
    const removeInfoUser = () => dispatch(removeStoreUser())
    const logout = () => {
        toggleMenu()
        axios.post(env.URL + 'user/signOut', { userId: currentUser.id }).then(response => {
            removeInfoUser()
            setAuthToken(null)
            navigate('/')

        }).catch(error => {
            console.error(error)
            removeInfoUser()
            setAuthToken(null)
            navigate('/')
        })
        toast.info("Déconnecté", { autoClose: 5000, toastId: 'unauthorized' })

    }
    return (
        <>
            <div className='menu-header-title'>Bonjour, {currentUser.firstname}</div>

            <div style={{ display: "flex", justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                    <div className='menu-header-item' onClick={() => {
                        navigate('/profile/' + currentUser.id)
                        toggleMenu()
                    }}>
                        <FontAwesomeIcon size='lg' icon={faUser} className='menu-header-icon' />Mon profil
                    </div>
                    <div className='menu-header-item'>
                        <FontAwesomeIcon size='lg' icon={faBell} className='menu-header-icon' />Notifications

                    </div>
                    <div className='menu-header-item' style={{ display: 'flex', alignItems: "center" }} onClick={() => {
                        navigate('/message')
                        toggleMenu()
                    }}>
                        <FontAwesomeIcon size='lg' icon={faEnvelope} className='menu-header-icon' />Messages
                        {unreadMessageCount > 0 && (
                            <Badge pill bg="danger" style={{ color: 'white', marginLeft: 5 }}>
                                {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                            </Badge>
                        )}

                    </div>
                </div>
                <div>

                    <div className='menu-header-item'>
                        <FontAwesomeIcon size='lg' icon={faHeart} className='menu-header-icon' />Favorites
                    </div>
                    <div className='menu-header-item' onClick={() => {
                        navigate('/payment')
                        toggleMenu()
                    }}>
                        <FontAwesomeIcon size='lg' icon={faCreditCard} className='menu-header-icon' />Paiements
                    </div>
                    <div className='menu-header-item'>
                        <FontAwesomeIcon size='lg' icon={faBriefcase} className='menu-header-icon' />Mes projects
                    </div>
                </div>
            </div >

            <div className='logout'>
                <div className='logout-button' onClick={logout}> <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: 10 }} /> Déconnexion</div>
            </div>
        </>
    );
}

export default HeaderUserPanel;
