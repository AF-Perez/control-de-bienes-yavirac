export interface AuthRespuesta {
    user: {
        id: number,
        nombre: string,
        email: string,
        access_token: string,
        expires_in: number
    }
}
