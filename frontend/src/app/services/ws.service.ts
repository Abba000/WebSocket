import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WsService {

  private socket: WebSocket;
  private subject: Subject<any> = new Subject();

  constructor() {
    this.socket = new WebSocket(environment.ws);
    this.socket.onmessage = (event) => {
      try {
        const rawData = event.data.replace('Nuevos datos recibidos: ', ''); // Elimina la cadena no deseada
        const data = JSON.parse(rawData);
        if (data.temperatura !== undefined && data.humedad !== undefined && data.timestamp !== undefined) {
          console.log("Datos del WebSocket:", data);
          this.subject.next(data);
        } else {
          console.error("Mensaje del WebSocket en un formato inesperado:", data);
        }
      } catch (error) {
        console.error("Error al analizar el mensaje JSON del WebSocket:", error);
        // Manejar el error de análisis JSON de acuerdo a tus necesidades
      }
    };
  }

  getSocketData(): Observable<any> {
    return this.subject.asObservable();
  }
}
