import { faCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function StatusDotOnline() {
    return (
        <FontAwesomeIcon icon={faCircle} size='xs' style={{ color: '#00c500' }} />
    )
}
export default StatusDotOnline