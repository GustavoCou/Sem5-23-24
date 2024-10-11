import { Component, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { ToastrService } from 'ngx-toastr';



interface FormData {
  id: string;
  name?: string;
  description?: string;
  width?: number;
  depth?: number;
}

@Component({
  selector: 'app-edit-building',
  templateUrl: './edit-building.component.html',
  styleUrls: ['./edit-building.component.css']
})


export class EditBuildingComponent {


  formBuilding: FormGroup;

  isNameDisabled: boolean;
  isDescriptionDisabled: boolean;
  isWidthDisabled: boolean;
  isDepthDisabled: boolean;
  checksDisabled: boolean;

  constructor(private location: Location,
    private fb: FormBuilder,
    private http: HttpRequestsService,
    private toastrSrv: ToastrService
  ) {
    this.formBuilding = this.fb.group({
      id: ['', Validators.required],
      name: [''],
      description: [''],
      width: [''],
      depth: ['',],
    });
    this.isNameDisabled = true;
    this.isDescriptionDisabled = true;
    this.isWidthDisabled = true;
    this.isDepthDisabled = true;
    this.checksDisabled = false;

  }

  goBack() {
    this.location.replaceState(this.location.path());
    this.http.reload();
  }

  onSubmitForm() {

    if (!this.formBuilding.valid) {
      this.toastrSrv.error('Failed, Id is Obligatory.\n', 'Error');
    } else {
      const formValue = this.prepareData();


      this.http.putRequest('building/edit/', formValue).subscribe({
        next: (data) => {


          this.checksDisabled = true;
          this.readonlyAll();
          this.toastrSrv.success('Building Update successfully', 'Success');
          console.log('data fetched', data);
        },
        error: (err) => {
          this.toastrSrv.error('Failed to edit building.\n' + err.error, 'Error');
          console.error('Error:', err);

        },
      });

    }

  }

  prepareData() {



    const formData: FormData = {
      id: this.formBuilding.value.id.toString(),
    };

    if (!this.isNameDisabled && this.formBuilding.value.name) {
      formData['name'] = this.formBuilding.value.name.toString();
    }

    if (!this.isDescriptionDisabled && this.formBuilding.value.description) {
      formData['description'] = this.formBuilding.value.description.toString();
    }

    if (!this.isWidthDisabled && this.formBuilding.value.width) {
      formData['width'] = this.formBuilding.value.width;
    }

    if (!this.isDepthDisabled && this.formBuilding.value.depth) {
      formData['depth'] = this.formBuilding.value.depth;
    }

    // console.log(formData);


    return formData;
  }

  toggleReadonly(field: string) {
    switch (field) {
      case 'name':
        this.isNameDisabled = !this.isNameDisabled;
        break;
      case 'description':
        this.isDescriptionDisabled = !this.isDescriptionDisabled;
        break;
      case 'width':
        this.isWidthDisabled = !this.isWidthDisabled;
        break;
      case 'depth':
        this.isDepthDisabled = !this.isDepthDisabled;
        break;
    }
  }

  readonlyAll() {
    this.isNameDisabled = true;
    this.isDescriptionDisabled = true;
    this.isWidthDisabled = true;
    this.isDepthDisabled = true;

  }
}
