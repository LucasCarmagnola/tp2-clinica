import { Timestamp } from "@angular/fire/firestore"

export class Turno {

    fecha : string
    hora : string
    estado : 'pendiente'| 'realizado' | 'cancelado' | 'rechazado'
    medicoId : string
    nombreEspecialista : string
    especialidad : string
    idPaciente : string
    nombrePaciente : string
    evaluacion : string | null
    encuestaCompletada : boolean
    fotoPaciente : string


    constructor(fecha : string, hora:string, estado: 'pendiente'| 'realizado' | 'cancelado', medicoId:string, nombreEspecialista:string, especialidad:string,
        idPaciente:string, nombrePaciente:string, fotoPaciente : string
    ){

        this.fecha = fecha
        this.hora = hora
        this.estado = estado
        this.medicoId = medicoId
        this.nombreEspecialista = nombreEspecialista
        this.especialidad = especialidad
        this.idPaciente = idPaciente
        this.nombrePaciente = nombrePaciente
        this.evaluacion = null
        this.encuestaCompletada = false
        this.fotoPaciente = fotoPaciente
    }


}

export enum EstadoTurnos {
    Pendiente = "pendiente",
    Rechazado = "rechazado",
    Cancelado = "cancelado",
    Finalizado = "finalizado",
    Aceptado = 'aceptado'
}
