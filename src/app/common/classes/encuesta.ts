export class Encuesta {

    idEspecialista : string
    idPaciente : string
    idTurno : string
    calidadAtencion : string
    comentario: string
    tiempoEspera :string
    tratoMedico : string

    constructor(
        idEspecialista: string,
        idPaciente: string,
        idTurno: string,
        calidadAtencion: string,
        comentario: string,
        tiempoEspera: string,
        tratoMedico: string
    ) {
        this.idEspecialista = idEspecialista;
        this.idPaciente = idPaciente;
        this.idTurno = idTurno;
        this.calidadAtencion = calidadAtencion;
        this.comentario = comentario;
        this.tiempoEspera = tiempoEspera;
        this.tratoMedico = tratoMedico;
    }

}
