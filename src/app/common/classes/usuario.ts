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
    horariosDisponibles : string[]
    horariosOcupados : string [] = []

    constructor(uid: string, tipoUsuario : string, nombre: string,  apellido : string, edad: number, dni: number,
        email: string, especialidades: string[]){

        super(uid, tipoUsuario, nombre, apellido, edad, dni, email);
        this.especialidades = especialidades
        this.isActive = false
        this.imagenPerfil = 'gs://clinica-tp2.appspot.com/imagenesDePerfil/default-perfil.png'
        this.horariosDisponibles = [
            "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
            "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
            "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
            "17:00", "17:30", "18:00", "18:30"
          ];
    }

}

export class Administrador extends Usuario {
    imagenPerfil : string

    constructor(uid: string, nombre: string,  apellido : string, edad: number, dni: number,
        email: string){

        super(uid, 'administrador', nombre, apellido, edad, dni, email);
        this.imagenPerfil = 'gs://clinica-tp2.appspot.com/imagenesDePerfil/default-perfil.png'
    }
}


