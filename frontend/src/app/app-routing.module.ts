import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FloorComponent } from './floor/floor.component';
import { HomeComponent } from './home/home.component';
import { UserSignUpComponent } from './user-signup/user-signup.component';
import { LoginSignUpComponent } from './login-signup/login-signup.component';
import { BuildingComponent } from './building/building.component';
import { ElevatorComponent } from './elevator/elevator.component';
import { RoomComponent } from './room/room.component';
import { BridgeComponent } from './bridge/bridge.component';
import { RobotComponent } from './robot/robot.component';
import { AnaliseDadosComponent } from './analise-dados/analise-dados.component';
import { Visualizacao3DComponent } from './visualizacao-3-d/visualizacao-3-d.component';
import { AdministracaoSistemasComponent } from './administracao-sistemas/administracao-sistemas.component';
import { InformacaoComponent } from './informacao/informacao.component';
import { CreateBridgeComponent } from './bridge/create-bridge/create-bridge.component';
import { ListBridgesComponent } from './bridge/list-bridges/list-bridges.component';
import { ListFloorsBridgeComponent } from './bridge/list-floors-bridge/list-floors-bridge.component';
import { EditBridgeComponent } from './bridge/edit-bridge/edit-bridge.component';
import { RobotTypeComponent } from './robot-type/robot-type.component';
import { ExportDataFileComponent } from './users/export-data-file/export-data-file.component';
import { UsersComponent } from './users/users.component';
import { TaskComponent } from "./task/task.component";
import { UserLoginComponent } from "./user-login/user-login.component";
import { MenuUtenteComponent } from "./menus/menu-utente/menu-utente.component";
import { MenuGestorDeTarefasComponent } from "./menus/menu-gestor-de-tarefas/menu-gestor-de-tarefas.component";
//import {MenuGestorDeFrotaComponent} from "./menus/menu-gestor-de-frota/menu-gestor-de-frota.component";
import { MenuGestorDeCampusComponent } from "./menus/menu-gestor-de-campus/menu-gestor-de-campus.component";
import { MenuAdministradorComponent } from "./menus/menu-administrador/menu-administrador.component";
import { ApproveRejectUserComponent } from './manage-users/approve-reject-user/approve-reject-user.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ListTaskNotApprovedComponent } from './task/list-task-not-approved/list-task-not-approved.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: 'home', component: LoginSignUpComponent },
  { path: 'signup', component: UserSignUpComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'menu', component: HomeComponent },
  { path: 'floor', component: FloorComponent },
  { path: 'building', component: BuildingComponent },
  { path: 'elevator', component: ElevatorComponent },
  { path: 'room', component: RoomComponent },
  { path: 'bridge', component: BridgeComponent },
  { path: 'robot', component: RobotComponent },
  { path: 'users', component: UsersComponent },
  { path: 'analise-dados', component: AnaliseDadosComponent },
  { path: 'visualizacao-3-d', component: Visualizacao3DComponent },
  { path: 'administracao-sistemas', component: AdministracaoSistemasComponent },
  { path: 'informacao', component: InformacaoComponent },
  { path: 'create-bridge', component: CreateBridgeComponent },
  { path: 'list-bridges', component: ListBridgesComponent },
  { path: 'list-floors-bridge', component: ListFloorsBridgeComponent },
  { path: 'edit-bridge', component: EditBridgeComponent },
  { path: 'robot-type', component: RobotTypeComponent },
  { path: 'export-data-file', component: ExportDataFileComponent },
  { path: 'menu-utente', component: MenuUtenteComponent },
  { path: 'menu-gestor-de-tarefas', component: MenuGestorDeTarefasComponent },
  //{ path: 'menu-gestor-de-frota', component: MenuGestorDeFrotaComponent },
  { path: 'menu-gestor-de-campus', component: MenuGestorDeCampusComponent },
  { path: 'menu-administrador', component: MenuAdministradorComponent },
  { path: 'task', component: TaskComponent },
  { path: 'approve-reject-user', component: ApproveRejectUserComponent },
  { path: 'manage-users', component: ManageUsersComponent },
  { path: 'list-task-not-approved', component: ListTaskNotApprovedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
