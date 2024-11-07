import { Timestamp } from "@angular/fire/firestore"

export class Turno {

    id : string
    fecha : Timestamp
    hora : string
    estado : string
    idEspecialista : string
    nombreEspecialista : string
    especialidad : string
    idPaciente : string
    nombrePaciente : string


    constructor(id : string, fecha : Timestamp, hora:string, estado:string, idEspecialista:string, nombreEspecialista:string, especialidad:string,
        idPaciente:string, nombrePaciente:string
    ){
        this.id = id
        this.fecha = fecha
        this.hora = hora
        this.estado = estado
        this.idEspecialista = idEspecialista
        this.nombreEspecialista = nombreEspecialista
        this.especialidad = especialidad
        this.idPaciente = idPaciente
        this.nombrePaciente = nombrePaciente
    }


}
