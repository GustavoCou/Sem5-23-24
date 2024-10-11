import { Component, OnInit } from '@angular/core';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RobotService } from '../../services/robot.service';

@Component({
  selector: 'app-list-robot',
  templateUrl: './list-robot.component.html',
  styleUrls: ['./list-robot.component.css']
})
export class ListRobotComponent {

  robotList: any[] = [];
  constructor(private location: Location,
    private http: HttpRequestsService,
    private toastrSrv: ToastrService,
    private robotService: RobotService
  ) {
    this.fetchRobotList();
  }

  goBack() {
    this.location.replaceState(this.location.path());
    window.location.reload();
  }


  fetchRobotList() {
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

  toggleInhibited(robot: any) {
    const newStatus = !robot.inhibited;
    this.robotService.updateRobotInhibitedStatus(robot.id, newStatus)
      .subscribe({
        next: () => {
          robot.inhibited = newStatus; // Update local state on success
        },
        error: (error: any) => console.error('Error updating status', error)
      });
  }

  hoveredRobot: any = null; // Property to hold data of hovered robot

  onMouseOver(robot: any) {
    this.hoveredRobot = robot;
  }

  onMouseLeave() {
    this.hoveredRobot = null;
  }

}