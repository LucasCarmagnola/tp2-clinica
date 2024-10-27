export class Usuario {
    uid: string;
    tipoUsuario : string;
    nombre: string;
    apellido : string;
    edad: number;
    dni : number;
    obraSocial : string;
    email: string;
  
    constructor(uid:string, tipoUsuario : string, nombre: string, apellido : string, edad : number, dni : number, obraSocial : string, email: string) {
      this.uid = uid;
      this.tipoUsuario = tipoUsuario
      this.nombre = nombre;
      this.apellido = apellido;
      this.edad = edad;
      this.dni =dni;
      this.obraSocial = obraSocial;
      this.email = email;
    }
}


export class paciente extends Usuario {
    imagenPerfil : string
    imagenPortada : string

    constructor(uid:string, tipoUsuario : string, nombre: string, apellido : string, edad : number, dni : number, obraSocial : string, 
        email: string, imagenPerfil : string, imagenPortada : string){
        
        super(uid, tipoUsuario, nombre, apellido, edad, dni, obraSocial, email)
        this.imagenPerfil = imagenPerfil
        this.imagenPortada = imagenPortada

    }
}

export class Especialista extends Usuario {

    especialidades : string[]
    imagenPerfil : string

    constructor(uid: string, tipoUsuario : string, nombre: string,  apellido : string, edad: number, dni: number, obraSocial: string,
        email: string, especialidades: string[], imagenPerfil : string){

        super(uid, tipoUsuario, nombre, apellido, edad, dni, obraSocial, email);
        this.especialidades = especialidades
        this.imagenPerfil = imagenPerfil
    }

}


