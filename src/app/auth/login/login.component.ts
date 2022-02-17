
import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/servicios/general.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResultAlerta } from 'src/app/interface/alerta';
import Swal from 'sweetalert2'
import { WebsocketService } from 'src/app/socket/websocket.service';
import { closeAlert, loadData } from 'src/app/function/cargando';
import { AreaService } from '../../servicios/area.service';
import { Area, ResultAreas } from 'src/app/interface/areas';
import { AlertaService } from 'src/app/servicios/alerta.service';
import { AlertNewInd } from 'src/app/interface/alertas';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css'
  ]
})
export class LoginComponent implements OnInit {

  listArea:Area[]=[];
  alertaForm: FormGroup;
  cargar:boolean=true;
  constructor(private areaService:AreaService, private alertaService:AlertaService, private generalService: GeneralService, private fb: FormBuilder, private wsService:WebsocketService) { 
    this.alertaForm = this.fb.group({
      personal:['', Validators.required],
      descripcion:['', Validators.required],
      area:['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.mostrarArea()
  }
  mostrarArea(){
    if (this.cargar === true) {
      loadData('Cargando.....','Espere, se estan cargando los datos')
    }
    this.areaService.getAreas("1").subscribe(
      (data:ResultAreas)=>{
        this.listArea = data.area;
        if (this.cargar===true) {
          closeAlert();
        }
        this.cargar=false
      }
    )
  }
  enviarAlerta(){
    const data = new FormData();
    data.append('cliente', this.alertaForm.get('personal')?.value);
    data.append('area', this.alertaForm.get('area')?.value)
    data.append('descripcion', this.alertaForm.get('descripcion')?.value);
    this.alertaService.postAlerta(data).subscribe(
      (data:AlertNewInd)=>{
        console.log(data);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Alerta enviado con exito, en breve lo atenderemos',
          showConfirmButton: false,
          timer: 1500
        })
        this.cancelar();
        this.wsService.emit('agregar-alerta');
      },
      (error)=>{
        console.log(error);
        
      }
    )
    
  }
  cancelar(){
    this.alertaForm.setValue({
      personal:'',
      descripcion:'',
      area:''
    })
  }
}
