export class Registro {
    email: string
    fecha : Date

    constructor(email : string){
        this.email = email
        this.fecha = new Date()
    }
}
