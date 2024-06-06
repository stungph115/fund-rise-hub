import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const CustomNotification = ({ header, icon, mainText }) => {
    return (
        <div >
            {header && <div style={{ fontSize: '18px', fontWeight: 600, color: '#3A536C' }}>{header}</div>}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {icon && <div
                    style={{
                        flex: '20%',
                        marginRight: '10px'
                    }}
                >
                    <div style={{
                        backgroundColor: '#1877f2',
                        borderRadius: '50%',
                        height: '50px',
                        width: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <FontAwesomeIcon icon={icon} style={{
                            color: '#fff', height: '25px',
                            width: '25px',

                        }} />
                    </div>
                </div>}
                <div style={{ flex: icon ? '80%' : '100%' }}>
                    <p style={{ textAlign: 'left' }}>{mainText}</p>
                </div>
            </div>

        </div>
    )
}
export default CustomNotification