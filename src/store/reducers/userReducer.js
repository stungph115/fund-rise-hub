const initialState = {
    id: null,
    email: null,
    firstname: null,
    lastname: null,
    role: null,
    photo: null,
    tokenJWT: null
}

const userReducer = (state = initialState, action) => {

    switch (action.type) {
        case 'USER_SAVE':
            return {
                ...state,
                id: action.data.id,
                email: action.data.email,
                firstname: action.data.firstname,
                lastname: action.data.lastname,
                role: action.data.role,
                photo: action.data.photo,
                tokenJWT: action.data.tokenJWT
            }
        case 'USER_REMOVE':
            return {
                ...state,
                id: null,
                email: null,
                firstname: null,
                lastname: null,
                photo: null,
                role: null,
                tokenJWT: null,
            }
        default:
            return state
    }

}

export default userReducer
