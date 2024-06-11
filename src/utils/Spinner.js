import { Spinner } from "react-bootstrap"

function SpinnerGreen() {
    return (
        <div className="spinner-container">
            <Spinner animation="border" role="status" className="bigger-spinner">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </div>
    )
}
export default SpinnerGreen