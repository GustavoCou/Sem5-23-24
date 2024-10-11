import { Component, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-create-building',
  templateUrl: './create-building.component.html',
  styleUrls: ['./create-building.component.css']
})



export class CreateBuildingComponent {


  formBuilding: FormGroup;

  constructor(private location: Location, 
    private fb: FormBuilder,
    private http: HttpRequestsService,
    private toastrSrv: ToastrService
    ) {
    this.formBuilding = this.fb.group({
        id: ['', Validators.required],
        name: ['',],
        description: ['',],
        width: ['', Validators.required],
        depth: ['', Validators.required],
      });
  }

 goBack(){
  this.location.replaceState(this.location.path());
  this.http.reload();
}

onSubmitForm() {
 
  if (!this.formBuilding.valid) {
    this.toastrSrv.error('Failed, Id, width, depth  is Obligatory.\n', 'Error');
    
  } else {
      const formValue = this.prepareData();

     
      this.http.postRequest('building/create/', formValue).subscribe({
        next: (data) => {

          this.toastrSrv.success('Building created successfully', 'Success');
          console.log('data fetched', data);
        },
        error: (err) => {
          this.toastrSrv.error('Failed to create building.\n'+ err.error, 'Error');
          console.error('Error:', err);

        },
      });
  }
}

prepareData() {


  const formData = {
    id: this.formBuilding.value.id.toString(),
    name: this.formBuilding.value.name.toString(),
    description: this.formBuilding.value.description.toString(),
    width: this.formBuilding.value.width,
    depth: this.formBuilding.value.depth,
  };

  // Hacer algo con el objeto formData, por ejemplo, enviarlo a través de una API
  console.log(formData);

  return formData;
}
}