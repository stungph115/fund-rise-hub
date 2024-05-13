import { io } from 'socket.io-client'
import { env } from '../env'

export const socket = io(env.URL_SOCKET, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
})
