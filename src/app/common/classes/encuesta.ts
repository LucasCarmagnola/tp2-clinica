export class Encuesta {

    idEspecialista : string
    nombreEspecialista : string
    idPaciente : string
    nombrePaciente : string
    idTurno : string
    calidadAtencion : string
    comentario: string
    tiempoEspera :string
    tratoMedico : string

    constructor(
        idEspecialista: string,
        nombreEspecialista : string,
        idPaciente: string,
        nombrePaciente : string,
        idTurno: string,
        calidadAtencion: string,
        comentario: string,
        tiempoEspera: string,
        tratoMedico: string
    ) {
        this.idEspecialista = idEspecialista;
        this.nombreEspecialista = nombreEspecialista
        this.idPaciente = idPaciente;
        this.nombrePaciente = nombrePaciente
        this.idTurno = idTurno;
        this.calidadAtencion = calidadAtencion;
        this.comentario = comentario;
        this.tiempoEspera = tiempoEspera;
        this.tratoMedico = tratoMedico;
    }

}
