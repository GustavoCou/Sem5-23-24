import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpRequestsService } from '../services/http-requests.service';
import { PathingService } from '../services/pathing.service';

@Component({
	selector: 'app-analise-dados',
	templateUrl: './analise-dados.component.html',
	styleUrls: ['./analise-dados.component.css'],
})
export class AnaliseDadosComponent {
	bestPath: any;

	constructor(
		private route: Router,
		private http: HttpRequestsService,
		private toastrSrv: ToastrService,
		private pathing: PathingService
	) { }

	ngOnInit() { }

	onClickSubmit(data: any) {

		this.pathing.melhorCaminhoPisos(data.origin_floor, data.target_floor).subscribe({
			next: (data) => {
				this.toastrSrv.success("Sucesso", "Sucesso");
				console.log(data);
				this.bestPath = data
			},
			error: async (err) => {
				/* let errorPT = await translate(err, { to: "pt", engine: "deepl", key: "cc66253f-6378-08b8-d4f9-7b88f01e7adc:fx" });
				this.toastrSrv.error("Criação de sala falhou.</br>" + errorPT, "Erro", { enableHtml: true }); */
			},
		});
	}

	backToMenu(): void {
		this.route.navigate(['/home']);
	}
}
