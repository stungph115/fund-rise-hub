import { Button, Image, Modal } from "react-bootstrap"
import avatarDefault from '../../assets/default-avata.jpg';
import { env } from "../../env";
import { useSelector } from "react-redux";

function UnfollowAlert({ showUnfollowAlert, setShowUnfollowAlert, user, text, unfollowAnUser }) {
    const currentUser = useSelector((state) => state.userReducer)

    async function onClickUnfollow() {
        if (text === "Se désabonner") {
            unfollowAnUser(currentUser.id, user.id)
        } else if (text === 'Retirer') {
            unfollowAnUser(user.id, currentUser.id)
        }
        setShowUnfollowAlert(false)
    }

    if (user) {
        return (
            <Modal show={showUnfollowAlert} onHide={() => setShowUnfollowAlert(false)} centered>
                <Modal.Body>
                    <div style={{ display: 'flex', justifyContent: "center", alignItems: 'center' }}>
                        <h3>{text}</h3>
                        <div className='follower' style={{ paddingInline: 20 }}>
                            <Image
                                src={user.photo ? env.URL + 'file/' + user.photo : avatarDefault}
                                roundedCircle
                                className="profile-user-photo-small"
                            />

                            <div className='follower-name' style={{ cursor: 'default' }}> {user.firstname} {user.lastname}</div>
                        </div>
                        <h3>?</h3>
                    </div>
                    <div style={{ display: 'flex', justifyContent: "center", alignItems: 'center', marginTop: 20 }}>
                        <Button variant="success" onClick={() => onClickUnfollow()}>Valider</Button>
                        <div style={{ width: 10 }} />
                        <Button variant="danger" onClick={() => setShowUnfollowAlert(false)}>Annuler</Button>
                    </div>
                </Modal.Body>

            </Modal>
        )
    }

}
export default UnfollowAlert
