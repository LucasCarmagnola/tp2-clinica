export class Usuario {
    uid: string;
    tipoUsuario : string;
    nombre: string;
    apellido : string;
    edad: number;
    dni : number;
    email: string;
  
    constructor(uid:string, tipoUsuario : string, nombre: string, apellido : string, edad : number, dni : number, email: string) {
      this.uid = uid;
      this.tipoUsuario = tipoUsuario
      this.nombre = nombre;
      this.apellido = apellido;
      this.edad = edad;
      this.dni =dni;
      this.email = email;
    }
}


export class Paciente extends Usuario {
    imagenPerfil : string
    imagenPortada : string
    obraSocial : string

    constructor(uid:string, tipoUsuario : string, nombre: string, apellido : string, edad : number, dni : number, obraSocial : string, 
        email: string){
        
        super(uid, tipoUsuario, nombre, apellido, edad, dni, email)
        this.obraSocial = obraSocial
        this.imagenPerfil = 'gs://clinica-tp2.appspot.com/imagenesDePerfil/default-perfil.png'
        this.imagenPortada = 'gs://clinica-tp2.appspot.com/imagenesDePortada/default-portada.jpg'

    }
}

export class Especialista extends Usuario {

    especialidades : string[]
    isActive : boolean
    imagenPerfil : string

    constructor(uid: string, tipoUsuario : string, nombre: string,  apellido : string, edad: number, dni: number,
        email: string, especialidades: string[]){

        super(uid, tipoUsuario, nombre, apellido, edad, dni, email);
        this.especialidades = especialidades
        this.isActive = false
        this.imagenPerfil = 'gs://clinica-tp2.appspot.com/imagenesDePerfil/default-perfil.png'
    }

}


