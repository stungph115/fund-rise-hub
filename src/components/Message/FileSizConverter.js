function FileSize(props) {
    const { size } = props

    const formatSize = (bytes) => {
        if (bytes >= 1024 * 1024) {
            return (bytes / (1024 * 1024)).toFixed(2) + ' Mo'
        } else if (bytes >= 1024) {
            return (bytes / 1024).toFixed(2) + ' Ko'
        } else {
            return bytes + ' octets'
        }
    }

    return <div>{formatSize(size)}</div>
}

export default FileSize