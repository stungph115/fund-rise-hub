import { faSearch, faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { useEffect, useState } from "react"
import { Button, Card, Form, Image, InputGroup } from "react-bootstrap"
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
    const [projectFound, setProjectFound] = useState([])
    /* console.log(projectFound) */

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
                    setIsLoading(false)

                }
            }).catch((err) => {
                console.log(err)
            })
            //show categories match
            //show project match
            const response = await axios.post(env.URL + 'projects/discover-advanced', {
                title: search,
                categoryId: "",
                subCategoryId: "",
                topFavorites: false,
                topComments: false,
                reach90Percent: false,
                expireSoon: false,
                topLatest: false,
                topPassedGoal: false
            })
            setProjectFound(response.data.projects);
            setIsLoading(false)


        } else {
            setShowSearchResult(false)
            setUserFound([])
            setCatFound([])
            setIsLoading(false)
        }



    }
    return (

        <div className='header-search-bar'>
            <Fade top>
                <InputGroup size="lg" className='header-search-bar-inner'>
                    <InputGroup.Text style={{ backgroundColor: 'white', borderRight: "none", cursor: "pointer" }} onClick={() => navigate('/discover')}>
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
                                {/*    <div className="header-search-result-item">
                                    <div className="header-search-result-item-title"> Catégories</div>
                                </div> */}
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
                                    {projectFound.length > 0 &&
                                        projectFound.slice(0, 3).map((project, id) => {
                                            return (
                                                <div key={id} >
                                                    <Card className="projec-header-search" onClick={() => (setSearch(""), setShowSearchResult(false), navigate('/project/' + project.id))}>
                                                        <Card.Body>
                                                            <Card.Title style={{ textAlign: 'left' }}>{project.title}</Card.Title>

                                                            <b>Créé par: </b>
                                                            <Image src={project.userCreator && project.userCreator.photo ? env.URL + 'file/' + project.userCreator.photo : avatarDefault}
                                                                roundedCircle
                                                                className="profile-user-photo-small"
                                                                style={{ transform: 'scale(0.8)' }}
                                                            />
                                                            {project.userCreator.firstname} {project.userCreator.lastname}

                                                        </Card.Body>

                                                    </Card>

                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </>
                        }
                        <Button variant="success"> voir tout</Button>
                    </div>
                </Fade>
            }
        </div >
    )
}
export default HeaderSearch