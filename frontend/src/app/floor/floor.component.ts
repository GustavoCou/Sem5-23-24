import { Component } from '@angular/core';
import { Floor } from '../dto/floor';
import { FloorService } from '../services/floor.service';
import Building from '../dto/building';
import { BuildingService } from '../services/building.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.css']
})

export class FloorComponent {
  floors: Floor[] = [];
  buildings: Building[] = [];
  showCreateForm = false;
  showUpdateForm = false;
  showUpdateMapForm  = false;
  showListFloor = false;
  isBuildingSelectionDisabled: boolean = true;

  selectedFloorId: string = '';
  selectedFloorDescription: string = '';
  selectedFloorWidth: string = '';
  selectedFloorDepth: string = '';
  selectedFloorBuilding: string = '';

  constructor(private floorService: FloorService, private buildingService: BuildingService, private http: HttpClient, private route: Router, private toastrSrv: ToastrService) {}

  ngOnInit() {
    this.loadBuildings();
    this.loadFloors();
  }

  onFloorSelectChange() {
    // Find the selected floor based on the ID
    const selectedFloor = this.floors.find((floor) => floor.id === this.selectedFloorId);

    // Update the bound properties with the selected floor's details
    if (selectedFloor) {
      this.selectedFloorDescription = selectedFloor.floorDescription!;
      this.selectedFloorWidth = selectedFloor.floorSize.width.toString();
      this.selectedFloorDepth = selectedFloor.floorSize.depth.toString();
      this.selectedFloorBuilding = selectedFloor.building;
      this.isBuildingSelectionDisabled = true;
    }
  }

  loadBuildings() {
    this.buildingService.getBuildings()
    .subscribe(buildings => {
        this.buildings = buildings;
      },
      error => {
        console.error('Erro ao carregar edifícios', error);
      });
  }

  loadFloors() {
    this.floorService.getFloors().subscribe(
      floors => {
        this.floors = floors;
      },
      error => {
        console.error('Erro ao carregar pisos', error);
      }
    );
  }

  backToMenu(): void {
    this.route.navigate(['/home']);
  }
  
  createFloor(id: string, floorDescription : string, floorSize : { widthStr: string, depthStr: string}, building: string): void {
    id = id.trim();
    /* coalescência nula (??), que retorna o valor à esquerda quando não é nulo ou indefinido, caso contrário, retorna o valor à direita */
    floorDescription = floorDescription?.trim() || ' ';
    const width = Number(floorSize.widthStr);
    const depth = Number(floorSize.depthStr);
    building = building.trim();
    
    if (!id || !floorSize.widthStr || !floorSize.depthStr || !building) {
      this.toastrSrv.error('É necessário preencher todos os campos, excepto a descrição do piso que é opcional!', 'Erro');
      return;
    }

    const reg = /^[A-Za-z0-9\s-]+$/;
    if (!reg.test(id)) {
      this.toastrSrv.error('ID deve ser um código alfanumérico de 10 caracteres no máximo.', 'Erro');
      return;
    }

    if (floorDescription && floorDescription.length > 250) {
      this.toastrSrv.error('Descrição do piso não deve ter mais do que 250 caracteres', 'Erro');
      return;
    }

    if (width < 0 || width > 10) {
      this.toastrSrv.error('A largura do piso deve estar entre 0 e 10.', 'Erro');
      return;
    }

    if (depth < 0 || depth > 10) {
      this.toastrSrv.error('A profundidade do piso deve estar entre 0 e 10.', 'Erro');
      return;
    }

    // Verificar se o building existe no sistema
    if (!this.buildings.some((b) => b.id === building)) {
      console.log('Edifício não existe no sistema');
      this.toastrSrv.error('Edifício não existe no sistema', 'Erro');
      return;
    }

    // Verificar se o id do floor já existe no sistema
    if (this.floors.some((floor) => floor.id === id)) {
      this.toastrSrv.error('ID do piso já existe no sistema', 'Erro');
      return;
    }

    this.floorService.createFloor({
      id,
      floorDescription,
      floorSize: { width, depth },
      building,
    } as Floor, 'post')
    .subscribe(
      floor => {
        this.floors.push(floor);
        this.toastrSrv.success('Piso criado com sucesso!', 'Sucesso');
      },
      error => {
        this.toastrSrv.error(error, 'Erro');
      });
  }

  updateFloor(id: string, floorDescription: string, floorSize: { widthStr: string, depthStr: string }, building: string): void {
    id = id.trim();
    /* coalescência nula (??), que retorna o valor à esquerda quando não é nulo ou indefinido, caso contrário, retorna o valor à direita */
    floorDescription = floorDescription?.trim() || ' ';
    const width = Number(floorSize.widthStr);
    const depth = Number(floorSize.depthStr);
    building = building.trim();

    if (!id || !floorSize.widthStr || !floorSize.depthStr || !building) {
      this.toastrSrv.error('É necessário preencher todos os campos, excepto a descrição do piso que é opcional!', 'Erro');
      return;
    }

    const reg = /^[A-Za-z0-9\s-]+$/;
    if (!reg.test(id)) {
      this.toastrSrv.error('ID deve ser um código alfanumérico de 10 caracteres no máximo.', 'Erro');
      return;
    }

    if (floorDescription && floorDescription.length > 250) {
      this.toastrSrv.error('Descrição do piso não deve ter mais do que 250 caracteres', 'Erro');
      return;
    }

    if (width < 0 || width > 10) {
      this.toastrSrv.error('A largura do piso deve estar entre 0 e 10.', 'Erro');
      return;
    }

    if (depth < 0 || depth > 10) {
      this.toastrSrv.error('A profundidade do piso deve estar entre 0 e 10.', 'Erro');
      return;
    }

    // Check if the building exists in the system
    if (!this.buildings.some((b) => b.id === building)) {
      console.log('Edifício não existe no sistema');
      this.toastrSrv.error('Edifício não existe no sistema', 'Erro');
      return;
    }

    // Buscar a lista atualizada de pisos
    this.floorService.getFloors().subscribe(
      floors => {
        console.log('Lista de Pisos:', floors);
        // Find the floor by ID
        const floorToUpdate = floors.find((floor) => floor.id === id);

      console.log('Piso encontrado:', floorToUpdate);

      // If the floor is not found, show an alert
      if (!floorToUpdate) {
        console.log('ID do piso não encontrado no sistema');
        this.toastrSrv.error('ID do piso não encontrado no sistema', 'Erro');
        return;
      }

      // Update the floor properties
      if (floorDescription !== null) {
        floorToUpdate.floorDescription = floorDescription;
      } else {
        // Se floorDescription for nulo, mantenha como está
        floorToUpdate.floorDescription = floorToUpdate.floorDescription || null;
      }
      floorToUpdate.floorSize = { width, depth };

      // Call the FloorService to update the floor on the backend
      this.floorService.updateFloor({
        id,
        floorDescription,
        floorSize: { width, depth },
        building,
      } as Floor, 'patch')
        .subscribe(
          updatedFloor => {
            // If the update is successful, update the local floors array
            const index = this.floors.findIndex((floor) => floor.id === updatedFloor.id);
            this.floors[index] = updatedFloor;
            this.toastrSrv.success('Piso atualizado com sucesso!', 'Sucesso');
          },
          error => {
            // Exibe a mensagem de erro no frontend
            this.toastrSrv.error(error, 'Erro'); 
        });
      });
  } 
}
