import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-bridge',
  templateUrl: './bridge.component.html',
  styleUrls: ['./bridge.component.css']
})
export class BridgeComponent {
  showCreateBridge: boolean = false;
  showListBridge: boolean = false;
  showListFloorsBridge: boolean = false;
  showEditBridge: boolean = false;
  constructor(private route: Router) { }

  public resetOption() {
    this.showCreateBridge = false;
    this.showListBridge = false;
    this.showListFloorsBridge = false;
    this.showEditBridge = false;
  }

  backToMenu(): void {
    this.route.navigate(['/home']);
  }

}

