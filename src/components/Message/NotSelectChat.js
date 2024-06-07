function NotSelectedChat() {
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#3a536c',
        fontWeight: 600,
        fontSize: 32,
        width: "100%"
    };
    return (
        <div style={containerStyle}>
            <div>Aucune conversation sélectionnée</div>
        </div>
    );

}
export default NotSelectedChat