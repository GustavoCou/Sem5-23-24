import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { requestTaskModel } from 'src/app/model/requestTaskModel';
import { Location } from '@angular/common';
import { TaskSearchCriteria } from 'src/app/utils/types';
import { TaskService } from 'src/app/services/task.service';
import translate from 'translate';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import Robot from 'src/app/dto/robot';
import { UserModel } from 'src/app/model/userModel';
import { UserService } from 'src/app/services/user.service';

@Component({
	selector: 'app-filtered-task-list',
	templateUrl: './filtered-task-list.component.html',
	styleUrls: ['./filtered-task-list.component.css']
})
export class FilteredTaskListComponent {
	taskRequestList: requestTaskModel[] = [];
	robotList: Robot[] = [];
	userList: UserModel[] = [];
	status: string | null = "Approved";
	robotType: string | null = null;
	userId: string | null = null;

	constructor(
		private location: Location,
		private toastrSrv: ToastrService,
		private taskService: TaskService,
		private http: HttpRequestsService,
		private userService: UserService
	) { }

	ngOnInit() {
		this.loadRobots();
		this.loadUsers();

		console.log(this.userList);
	}

	loadRobots() {
		this.http.getRequest('robot/list/').subscribe({
			next: (data: any[]) => {

				let lengthData = data.length
				for (let i = 0; i < lengthData; i++) {
					this.robotList.push(data.pop());
				}
				console.log('data fetched', data);
			},
			error: (err) => {

				this.toastrSrv.error('Failed to create robot.\n' + err.error, 'Error');
				console.error('Error:', err);

			},
		});
	}

	loadUsers() {
		this.userService.getAllUsers().subscribe({
			next: (data) => {
				for (let i = 0; i < data.length; i++) {
					this.userList.push(data[i]);
				}
			},
			error: async (err) => {
				let errorPT = await translate(err, { to: "pt", engine: "deepl", key: "cc66253f-6378-08b8-d4f9-7b88f01e7adc:fx" });
				this.toastrSrv.error("Erro ao retribuir lista de requisições.</br>" + errorPT, "Erro", { enableHtml: true });
			},
		});
	}

	public getFilteredTaskRequests(criteria: TaskSearchCriteria) {
		this.taskRequestList = [];

		console.log(criteria);
		this.taskService.getTaskRequestList(criteria).subscribe({
			next: (data) => {
				console.log(data.taskRequestDto.length);
				for (let i = 0; i < data.taskRequestDto.length; i++) {
					console.log('data fetched', data.taskRequestDto[i]);
					this.taskRequestList.push(data.taskRequestDto[i]);
				}
			},
			error: async (err) => {
				let errorPT = await translate(err, { to: "pt", engine: "deepl", key: "cc66253f-6378-08b8-d4f9-7b88f01e7adc:fx" });
				this.toastrSrv.error("Erro ao retribuir lista de requisições.</br>" + errorPT, "Erro", { enableHtml: true });
			},
		});
	}

	public searchCriteria() {
		if (this.status !== null)
			this.getFilteredTaskRequests({ status: this.status });
		if (this.robotType !== null)
			this.getFilteredTaskRequests({ robotType: this.robotType });
		if (this.userId !== null)
			this.getFilteredTaskRequests({ userId: this.userId });
	}

	public goBack() {
		this.location.replaceState(this.location.path());
		window.location.reload();
	}
}
