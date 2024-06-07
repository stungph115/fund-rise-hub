import { faSearch, faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { useEffect, useState } from "react"
import { Form, Image, InputGroup } from "react-bootstrap"
import { Fade } from "react-reveal"
import { env } from "../../env"
import avatarDefault from '../../assets/default-avata.jpg'
import { useNavigate } from "react-router"

function HeaderSearch({ categories }) {
    const [search, setSearch] = useState("")
    const [userFound, setUserFound] = useState([])
    const [catFound, setCatFound] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [showSearchResult, setShowSearchResult] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        searching()
    }, [search])

    async function searching() {

        setIsLoading(true)
        if (search !== "") {
            setShowSearchResult(true)
            //show  user match
            axios.get(env.URL + 'user/list/' + search).then((res) => {
                if (res.data && res.data.length > 0) {
                    setUserFound(res.data)
                }
            }).catch((err) => {
                console.log(err)
            })
            //show categories match
            //show project match

        } else {
            setShowSearchResult(false)
            setUserFound([])
            setCatFound([])
        }
        setTimeout(() => {
            setIsLoading(false)
        }, 100);


    }
    return (

        <div className='header-search-bar'>
            <Fade top>
                <InputGroup size="lg" className='header-search-bar-inner'>
                    <InputGroup.Text style={{ backgroundColor: 'white', borderRight: "none" }}>
                        <FontAwesomeIcon icon={faSearch} />
                    </InputGroup.Text>
                    <Form.Control
                        style={{ borderLeft: "none" }}
                        placeholder="Chercher projets, créateurs ou catégories"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />
                </InputGroup>
            </Fade>
            {showSearchResult &&
                <Fade >
                    <div className="header-search-result" >
                        {isLoading ?
                            <FontAwesomeIcon icon={faSpinner} pulse style={{ color: 'gray', width: '100%', marginTop: '50px' }} size='xl' />
                            :
                            <>
                                <FontAwesomeIcon icon={faXmark} className="header-search-close" onClick={() => (setSearch(""), setShowSearchResult(false))} />
                                <div className="header-search-result-item">
                                    <div className="header-search-result-item-title"> Catégories</div>
                                </div>
                                <div className="header-search-result-item">
                                    {userFound.length > 0 &&
                                        <div>
                                            <div className="header-search-result-item-title"> Créateurs</div>
                                            <div className="header-search-result-item-list">
                                                {userFound.map((item, i) => {
                                                    return (
                                                        <div className="header-search-result-item-list-item" key={i} onClick={() => (setSearch(""), setShowSearchResult(false), navigate('/profile/' + item.id))}>
                                                            <Image src={item && item.photo ? env.URL + 'file/' + item.photo : avatarDefault}
                                                                roundedCircle
                                                                className='profile-user-photo-small'
                                                            />
                                                            <span> {item.firstname} {item.lastname}</span>

                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                    }
                                </div>
                                <div className="header-search-result-item">
                                    <div className="header-search-result-item-title"> Projets</div>
                                </div>
                            </>
                        }
                    </div>
                </Fade>
            }
        </div >
    )
}
export default HeaderSearch