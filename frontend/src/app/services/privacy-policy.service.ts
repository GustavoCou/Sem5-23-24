import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class PrivacyPolicyService {

  private readonly PRIVACY_POLICY_URL = '/assets/privacy-policy.md';

  constructor(private http: HttpClient) { }

  getPrivacyPolicy() {
    return this.http.get(this.PRIVACY_POLICY_URL, { responseType: 'text' });
  }
}
