import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.css']
})
export class RoomComponent {

	showCreateRoom: boolean = false;

	constructor(private route: Router) { }

	public resetShow() {
		this.showCreateRoom = false;
	}

	backToMenu(): void {
		this.route.navigate(['/home']);
	}

}
