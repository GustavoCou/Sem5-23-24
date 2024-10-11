import { Component, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-create-robot',
  templateUrl: './create-robot.component.html',
  styleUrls: ['./create-robot.component.css']
})



export class CreateRobotComponent {


  formRobot: FormGroup;

  constructor(private location: Location,
    private fb: FormBuilder,
    private http: HttpRequestsService,
    private toastrSrv: ToastrService
  ) {
    this.formRobot = this.fb.group({
      id: ['', Validators.required],
      nickName: ['', Validators.required],
      description: ['', Validators.required],
      serialNumber: ['', Validators.required],
      robotTypeId: ['', Validators.required],
    });
  }

  goBack() {
    this.location.replaceState(this.location.path());
    window.location.reload();
  }

  onSubmitForm() {

    const formValue = this.prepareData();


    this.http.postRequest('robot/create/', formValue).subscribe({
      next: (data) => {

        this.toastrSrv.success('Robot created successfully', 'Success');
        console.log('data fetched', data);
      },
      error: (err) => {
        this.toastrSrv.error('Failed to create robot.\n' + err.error, 'Error');
        console.error('Error:', err);

      },
    });

  }

  prepareData() {


    const formData = {
      id: this.formRobot.value.id.toString(),
      nickName: this.formRobot.value.nickName.toString(),
      description: this.formRobot.value.description.toString(),
      serialNumber: this.formRobot.value.serialNumber.toString(),
      robotTypeId: this.formRobot.value.robotTypeId.toString(),
    };


    console.log(formData);

    return formData;
  }
}