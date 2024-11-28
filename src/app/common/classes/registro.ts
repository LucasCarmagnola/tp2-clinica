export class Registro {
    email: string
    fecha : any

    constructor(email : string){
        this.email = email
        this.fecha = new Date().valueOf()
    }
}
