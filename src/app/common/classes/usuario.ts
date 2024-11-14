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
        this.imagenPerfil = 'https://firebasestorage.googleapis.com/v0/b/clinica-tp2.appspot.com/o/imagenesDePerfil%2Fdefault-perfil.png?alt=media&token=268a0f9f-ac50-4912-a12d-aee990ce56a7'
        this.imagenPortada = 'https://firebasestorage.googleapis.com/v0/b/clinica-tp2.appspot.com/o/imagenesDePortada%2Fdefault-portada.jpg?alt=media&token=9191d183-3b0e-4afd-9445-0663f30eb95c'

    }
}

export class Especialista extends Usuario {

    especialidades : string[]
    isActive : boolean
    imagenPerfil : string
    disponibilidad : null


    constructor(uid: string, tipoUsuario : string, nombre: string,  apellido : string, edad: number, dni: number,
        email: string, especialidades: string[]){

        super(uid, tipoUsuario, nombre, apellido, edad, dni, email);
        this.especialidades = especialidades
        this.isActive = false
        this.imagenPerfil = 'https://firebasestorage.googleapis.com/v0/b/clinica-tp2.appspot.com/o/imagenesDePerfil%2Fdefault-perfil.png?alt=media&token=268a0f9f-ac50-4912-a12d-aee990ce56a7'
        this.disponibilidad = null
    }

}

export class Administrador extends Usuario {
    imagenPerfil : string
    isActive : boolean

    constructor(uid: string, nombre: string,  apellido : string, edad: number, dni: number,
        email: string){

        super(uid, 'administrador', nombre, apellido, edad, dni, email);
        this.imagenPerfil = 'https://firebasestorage.googleapis.com/v0/b/clinica-tp2.appspot.com/o/imagenesDePerfil%2Fdefault-perfil.png?alt=media&token=268a0f9f-ac50-4912-a12d-aee990ce56a7'
        this.isActive = true
    }
}


