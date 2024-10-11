import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.css']
})
export class UsersComponent {
	showExportData: boolean = false;
	showConfirmation: boolean = false;

	constructor(private route: Router) { }

	public resetOption() {
		this.showExportData = false;
		this.showConfirmation = false;
	}

	backToMenu(): void {
		this.route.navigate(['/home']);
	}

}
