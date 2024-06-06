import { faCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function StatusDotOffline() {
    return (
        <FontAwesomeIcon icon={faCircle} size='xs' style={{ color: 'rgb(163 163 163)' }} />
    )
}
export default StatusDotOffline