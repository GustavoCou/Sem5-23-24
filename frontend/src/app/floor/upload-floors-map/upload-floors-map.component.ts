import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import Building from 'src/app/dto/building';
import { BuildingService } from 'src/app/services/building.service';
import { Floor } from '../../dto/floor';
import { FloorService } from '../../services/floor.service';

@Component({
  selector: 'app-upload-floors-map',
  templateUrl: './upload-floors-map.component.html',
  styleUrls: ['./upload-floors-map.component.css']
})
export class UploadFloorsMapComponent {
  floors: Floor[] = [];
  buildings: Building[] = [];

  selectedBuildingId:any ="";
  selectedFloor: any="";


   formData = new FormData();

  constructor(private location: Location,  
    private toastrSrv: ToastrService, 
    private buildingService: BuildingService,
    private floorService: FloorService) {}

    ngOnInit() {
      this.loadBuildings();
    }
  
  goBack(){
    this.location.replaceState(this.location.path());
    window.location.reload();
  }

  loadBuildings() {
    this.selectedFloor=null;

    this.buildingService.getBuildings()
    .subscribe(buildings => {
        this.buildings = buildings;
      },
      error => {
        // Trate os erros adequadamente
        console.error('Erro ao carregar edifícios', error);
      });
      
  }


  
  loadFloors() {

    this.floorService.getFloorsByBuildingId(this.selectedBuildingId).subscribe(
      floors => {

          this.selectedFloor==null;
       
        this.floors = floors;
      },
      error => {
        console.error('Erro ao carregar pisos', error);
      }
    );
  }


    //  ficheiro JSON
    
    onFileSelected(event: any) {
    const file = event.target.files[0];
    
    if (file !=null) {
      
      if(file.type !== 'application/json'){
        
        this.toastrSrv.error('Deve carregar ficheiro .JSON', 'Erro no Ficheiro');
        this.formData.delete('file');

      }else if(this.formData.has("file")){
        this.formData.set('file', file);
      }else{
        this.formData.append('file',file);
      }
    
    }
    else{
      this.formData.delete('file');
    }
  }

  

  onSubmitForm() {

 
    if(this.formData.has("building")){
      this.formData.set('building', this.selectedBuildingId.toString());
    }else{
      this.formData.append('building', this.selectedBuildingId.toString());
    }
    
    if(this.formData.has("id")){
      this.formData.set('id', this.selectedFloor.toString());
    }else{
      this.formData.append('id',  this.selectedFloor.toString());
    }
 

    if(!this.allDateReady()){
      this.toastrSrv.error('Por favor, verifique os dados e tente novamente', ' Falha ao enviar o mapa');
    
    }else{
   
     
    this.floorService.uploadMap(this.formData).subscribe({
      next: (data) => {
      
        this.formData.set('building',"")
        this.formData.set('id',"");
        this.selectedBuildingId="";
        this.selectedFloor="";
      
        
        this.toastrSrv.success('Mapa enviado com sucesso',  'Sucesso');
        console.log('data fetched', data);
      },
      error: (err) => {
        this.toastrSrv.error(' Falha ao enviar o mapa.\n'+ err.error, 'Erro');
        console.error('Error:', err);

      },
    });
    }
  
   
  }

  private allDateReady(){
    if(this.formData.get('id') == ""  || this.formData.get('builiding') == "" ||  !this.formData.has('file'))
    return false;
  
    return true;
  }
  
}