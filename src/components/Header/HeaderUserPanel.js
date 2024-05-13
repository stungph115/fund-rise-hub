import React, { useState } from 'react';
import { Image } from 'react-bootstrap';
import { removeStoreUser } from '../../store/actions/userAction'
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie'
import axios from 'axios';
import { env } from '../../env';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCreditCard, faEnvelope, faHeart, faUser } from '@fortawesome/free-regular-svg-icons';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import setAuthToken from '../../utils/axiosConfig';
function HeaderUserPanel({ currentUser, toggleMenu }) {
    const navigate = useNavigate()

    //logout
    const dispatch = useDispatch()
    const removeInfoUser = () => dispatch(removeStoreUser())
    const logout = () => {
        toggleMenu()
        axios.post(env.URL + 'user/signOut').then(response => {
            removeInfoUser()
            setAuthToken(null)
            navigate('/')
        }).catch(error => {
            console.error(error)
            removeInfoUser()
            setAuthToken(null)
            navigate('/')
        })
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
                    <div className='menu-header-item'>
                        <FontAwesomeIcon size='lg' icon={faEnvelope} className='menu-header-icon' />Messages
                    </div>
                </div>
                <div>

                    <div className='menu-header-item'>
                        <FontAwesomeIcon size='lg' icon={faHeart} className='menu-header-icon' />Favorites
                    </div>
                    <div className='menu-header-item'>
                        <FontAwesomeIcon size='lg' icon={faCreditCard} className='menu-header-icon' />Paiements
                    </div>
                    <div className='menu-header-item'>
                        <FontAwesomeIcon size='lg' icon={faBriefcase} className='menu-header-icon' />Mes projects
                    </div>
                </div>
            </div >

            <div className='logout'>
                <div className='logout-button' onClick={logout}>Déconnexion</div>
            </div>
        </>
    );
}

export default HeaderUserPanel;
