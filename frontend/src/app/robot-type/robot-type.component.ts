import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RobotType } from '../dto/robotType';
import { RobotTypeService } from '../services/robotType.service';

@Component({
  selector: 'app-robot-type',
  templateUrl: './robot-type.component.html',
  styleUrls: ['./robot-type.component.css']
})

export class RobotTypeComponent {
  showCreateRobotType: boolean = false;
  robotTypes: RobotType[] = [];

  constructor(private robotTypeService: RobotTypeService, private http: HttpClient, private route: Router, private toastrSrv: ToastrService) {}

  ngOnInit() {
  }
  
  public resetShow() {
    this.showCreateRobotType = false;
  }

  createRobotType(id: string, robotModel: string, brand: string, tasks: string): void {
    id = id.trim();
    robotModel = robotModel.trim();
    brand = brand.trim();
    tasks = tasks.trim();
  
    if (!id || !robotModel || !brand || !tasks) {
      this.toastrSrv.error('É necessário preencher todos os campos!', 'Erro');
      return;
    }
  
    const reg = /^[A-Za-z0-9\s-]+$/;
    if (!reg.test(id)) {
      this.toastrSrv.error('Tipo deve ser um código alfanumérico de 25 caracteres no máximo.', 'Erro');
      return;
    }
  
    if (robotModel && robotModel.length > 50) {
      this.toastrSrv.error('Modelo do robô não deve ter mais do que 50 caracteres', 'Erro');
      return;
    }
  
    if (brand && brand.length > 100) {
      this.toastrSrv.error('Marca do robô não deve ter mais do que 100 caracteres', 'Erro');
      return;
    }

    if (this.robotTypes.some((robotTypes) => robotTypes.id === id)) {
      this.toastrSrv.error('Tipo do robô já existe no sistema', 'Erro');
      return;
    }
  
    this.robotTypeService.createRobotType({
      id,
      robotModel,
      brand,
      tasks,
    } as RobotType, 'post')
      .subscribe(
        robotType => {
          this.robotTypes.push(robotType);
          this.toastrSrv.success('Tipo de Robô criado com sucesso!', 'Sucesso');
        },
        error => {
          this.toastrSrv.error(error, 'Erro');
        });
  }

  backToMenu(): void {
    this.route.navigate(['/home']);
  }
}
