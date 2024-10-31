import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private fs: Firestore, private storage: Storage) { }


  async subir(imagen: Blob, uid : string, carpeta: string, parametroAModificar : string) {
    const col = collection(this.fs, 'usuarios');
    const documento = doc(col, uid);

    const storageRef = ref(this.storage, carpeta + '/' + uid);
    await uploadBytes(storageRef, imagen);
    const url = await getDownloadURL(storageRef);

    const userDoc = await getDoc(documento)
    if(userDoc.exists()){
      const usuario = userDoc.data()
      usuario[`${parametroAModificar}`] = url
      
      await updateDoc(documento, {...usuario})
      console.log('Imagen actualizada correctamente en la base de datos.')
    }else{
      console.log("El documento del usuario no existe.");
    }
  }

  subirImagenPerfil(imagen : Blob, uid : string, parametroAModificar : string){
    this.subir(imagen, uid, 'imagenesDePerfil', parametroAModificar)
  }

  subirImagenPortada(imagen : Blob, uid : string, parametroAModificar : string){
    this.subir(imagen, uid, 'imagenesDePortada', parametroAModificar)
  }


}
