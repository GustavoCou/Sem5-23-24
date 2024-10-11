import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import translate from 'translate';
import { Location } from '@angular/common';

@Component({
	selector: 'app-confirm-cancel-user',
	templateUrl: './confirm-cancel-user.component.html',
	styleUrls: ['./confirm-cancel-user.component.css']
})
export class ConfirmCancelUserComponent {
	constructor(
		private location: Location,
		private route: Router,
		private toastrSrv: ToastrService,
		private userService: UserService
	) { }

	public cancelUtente() {
		this.userService.cancelUtente().subscribe({
			next: (data) => {
				this.toastrSrv.success("A sua conta foi cancelada", "Sucesso");
				localStorage.removeItem("token");
				this.backToHome();
			},
			error: async (err) => {
				let errorPT = await translate(err, { to: "pt", engine: "deepl", key: "cc66253f-6378-08b8-d4f9-7b88f01e7adc:fx" });
				this.toastrSrv.error("Não foi possível cancelar a sua conta.</br>" + errorPT, "Erro", { enableHtml: true });
			},
		});
	}

	public goBack() {
		this.location.replaceState(this.location.path());
		window.location.reload();
	}

	private backToHome(): void {
		this.route.navigate(['/home']);
	}
}
