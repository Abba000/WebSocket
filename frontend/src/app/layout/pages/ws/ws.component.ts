import { Component } from '@angular/core';
import { WsService } from 'src/app/services/ws.service';

@Component({
  selector: 'app-ws',
  templateUrl: './ws.component.html',
  styleUrls: ['./ws.component.css']
})
export class WsComponent {
  datos: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Fecha';
  yAxisLabel: string = 'Valores';
  multi: any[] = [];

  constructor(private wsService: WsService) {}

  ngOnInit(): void {
    this.wsService.getSocketData().subscribe(data => {
      const timestamp = data.timestamp;
      const temperatura = data.temperatura;
      const humedad = data.humedad;
      console.log(data);
      console.log("Fecha:", timestamp);
      console.log("Temperatura:", temperatura);
      console.log("Humedad:", humedad);
  
      // Buscar la serie existente correspondiente
      const temperaturaSerie = this.multi.find(item => item.name === 'Temperatura');
      const humedadSerie = this.multi.find(item => item.name === 'Humedad');
  
      // Agregar el nuevo punto a la serie existente o crear la serie si no existe
      if (temperaturaSerie) {
        temperaturaSerie.series.push({ name: timestamp, value: temperatura });
      } else {
        this.multi.push({
          "name": "Temperatura",
          "series": [{ "name": timestamp, "value": temperatura }]
        });
      }
  
      if (humedadSerie) {
        humedadSerie.series.push({ name: timestamp, value: humedad });
      } else {
        this.multi.push({
          "name": "Humedad",
          "series": [{ "name": timestamp, "value": humedad }]
        });
      }
  
      // Ordenar los puntos por timestamp (si es necesario)
      this.multi.forEach(item => {
        item.series.sort((a: { name: number; }, b: { name: number; }) => a.name - b.name);
      });
  
      // Actualizar el array para reflejar los cambios
      this.multi = [...this.multi];
    });
  }
  

  onSelect(event: any) {
    console.log(event);
  }
}
