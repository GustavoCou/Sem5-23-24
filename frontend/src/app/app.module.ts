import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { UserSignUpComponent } from './user-signup/user-signup.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { LoginSignUpComponent } from './login-signup/login-signup.component';
import { AppComponent } from './app.component';
import { FloorComponent } from './floor/floor.component';
import { HomeComponent } from './home/home.component';
import { BuildingComponent } from './building/building.component';
import { ElevatorComponent } from './elevator/elevator.component';
import { RoomComponent } from './room/room.component';
import { BridgeComponent } from './bridge/bridge.component';
import { CreateElevatorComponent } from './elevator/create-elevator/create-elevator.component';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpRequestsService } from './services/http-requests.service';
import { HttpRequestsUsersService } from './services/http-requests-users.service';
import { HttpRequestsTaskService } from './services/http-requests-task.service';
import { HttpTaskARequestService } from './services/task_request.service';
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';


import { CreateBuildingComponent } from './building/create-building/create-building.component';
import { EditBuildingComponent } from './building/edit-building/edit-building.component';
import { ListBuildingComponent } from './building/list-building/list-building.component';

import { RobotComponent } from './robot/robot.component';
import { CreateRobotComponent } from './robot/create-robot/create-robot.component';
import { ListRobotComponent } from './robot/list-robot/list-robot.component';
import { AnaliseDadosComponent } from './analise-dados/analise-dados.component';
import { Visualizacao3DComponent } from './visualizacao-3-d/visualizacao-3-d.component';
import { AdministracaoSistemasComponent } from './administracao-sistemas/administracao-sistemas.component';
import { InformacaoComponent } from './informacao/informacao.component';
import { ListFloorsComponent } from './floor/list-floors/list-floors.component';
import { UploadFloorsMapComponent } from './floor/upload-floors-map/upload-floors-map.component';
import { ListBuildingMinMaxFloorComponent } from './building/list-building-min-max-floor/list-building-min-max-floor.component';
import { ListElevatorComponent } from './elevator/list-elevator/list-elevator.component';

import { ListFloorsBuildingComponent } from './elevator/list-floors-building/list-floors-building.component';

import { CreateBridgeComponent } from './bridge/create-bridge/create-bridge.component';
import { ListBridgesComponent } from './bridge/list-bridges/list-bridges.component';
import { CreateRoomComponent } from './room/create-room/create-room.component';
import { ListFloorsBridgeComponent } from './bridge/list-floors-bridge/list-floors-bridge.component';
import { EditBridgeComponent } from './bridge/edit-bridge/edit-bridge.component';

import { EditElevatorComponent } from './elevator/edit-elevator/edit-elevator.component';
import { RobotTypeComponent } from './robot-type/robot-type.component';
import { UsersComponent } from './users/users.component';
import { ExportDataFileComponent } from './users/export-data-file/export-data-file.component';
import { TaskComponent } from './task/task.component';
import { CreateTaskComponent } from './task/create-task/create-task.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ApproveRejectUserComponent } from './manage-users/approve-reject-user/approve-reject-user.component';
import { MenuUtenteComponent } from "./menus/menu-utente/menu-utente.component";
import { MenuGestorDeTarefasComponent } from "./menus/menu-gestor-de-tarefas/menu-gestor-de-tarefas.component";
//import {MenuGestorDeFrotaComponent} from "./menus/menu-gestor-de-frota/menu-gestor-de-frota.component";
import { MenuGestorDeCampusComponent } from "./menus/menu-gestor-de-campus/menu-gestor-de-campus.component";
import { MenuAdministradorComponent } from "./menus/menu-administrador/menu-administrador.component";
import { ListTaskNotApprovedComponent } from './task/list-task-not-approved/list-task-not-approved.component';
import { ConfirmCancelUserComponent } from './users/confirm-cancel-user/confirm-cancel-user.component';
import { JwtModule } from '@auth0/angular-jwt';
import { FilteredTaskListComponent } from './task/filtered-task-list/filtered-task-list.component';

import { StatusTaskApproveComponent } from './task/status-task-approve/status-task-approve.component';
import { ListTaskOrderComponent } from './task/list-task-order/list-task-order.component';



@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		FloorComponent,
		BuildingComponent,
		ElevatorComponent,
		RoomComponent,
		BridgeComponent,
		RobotComponent,
		CreateRobotComponent,
		ListRobotComponent,
		CreateElevatorComponent,
		LoginSignUpComponent,
		UserLoginComponent,
		UserSignUpComponent,
		CreateBuildingComponent,
		EditBuildingComponent,
		ListBuildingComponent,
		ListBuildingMinMaxFloorComponent,

		AnaliseDadosComponent,
		Visualizacao3DComponent,
		AdministracaoSistemasComponent,
		InformacaoComponent,

		ListFloorsComponent,
		UploadFloorsMapComponent,
		ListElevatorComponent,

		ListFloorsBuildingComponent,



		CreateBridgeComponent,
		ListBridgesComponent,
		CreateRoomComponent,
		ListFloorsBridgeComponent,
		EditBridgeComponent,
		EditElevatorComponent,
		RobotTypeComponent,
		UsersComponent,
		ExportDataFileComponent,
		TaskComponent,
		CreateTaskComponent,
		ManageUsersComponent,
		ApproveRejectUserComponent,
		MenuUtenteComponent,
		MenuGestorDeTarefasComponent,
		//MenuGestorDeFrotaComponent,
		MenuGestorDeCampusComponent,
		MenuAdministradorComponent,
		ListTaskNotApprovedComponent,
		StatusTaskApproveComponent,
		ListTaskOrderComponent,
		ConfirmCancelUserComponent,
		FilteredTaskListComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		NgxSpinnerModule,
		HttpClientModule,
		ToastModule,
		BrowserAnimationsModule,
		ReactiveFormsModule,
		ToastrModule.forRoot(),
		JwtModule.forRoot({
			config: {
				tokenGetter: () => {
					return localStorage.getItem("token");
				},
			},
		}),
	],
	providers: [HttpRequestsService, HttpTaskARequestService, HttpRequestsTaskService, MessageService, Location],
	bootstrap: [AppComponent],
})

export class AppModule { }
