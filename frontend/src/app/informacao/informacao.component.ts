import { Component, OnInit } from '@angular/core';
import { PrivacyPolicyService } from '../services/privacy-policy.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-informacao',
  templateUrl: './informacao.component.html',
  styleUrls: ['./informacao.component.css']
})

export class InformacaoComponent {
  // modificador ! para informar ao TypeScript que a propriedade será definitivamente atribuída
  policyContent !: string;
  contentVisible: string = '';

  constructor(private policyService: PrivacyPolicyService, private route: Router) { }

  /*ngOnInit(): void {
    this.policyService.getPrivacyPolicy().subscribe(
      data => this.policyContent = data,
      error => console.error('Error fetching privacy policy:', error)
    );
  }*/

  toggleContent(topic: string) {
    if (this.contentVisible === topic) {
      this.contentVisible = '';
    } else {
      this.contentVisible = topic;
    }
  }

  backToMenu(): void {
    this.route.navigate(['/home']);
  }
}
