import { Component, OnInit } from '@angular/core';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-building',
  templateUrl: './list-building.component.html',
  styleUrls: ['./list-building.component.css']
})
export class ListBuildingComponent {

  buildingList: any[]= [];
  constructor(private location: Location,  
              private http: HttpRequestsService,
              private toastrSrv: ToastrService 
    ){
      this.fetchBuildingList(); 
  }

goBack(){
  this.location.replaceState(this.location.path());
  this.http.reload();
}


fetchBuildingList() {
  this.http.getRequest('building/list/').subscribe({
    next: (data : any[]) => {
    
    let lengthData= data.length  
    for(let i=0; i<lengthData;i++){
        this.buildingList.push(data.pop());
    }
          console.log('data fetched', data);
    },
    error: (err) => {

      this.toastrSrv.error('Failed to List building.\n'+ err.error, 'Error');
      console.error('Error:', err);

    },
});
}

}