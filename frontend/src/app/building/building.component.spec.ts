import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingComponent } from './building.component';

describe('BuildingComponent', () => {
  let component: BuildingComponent;
  let fixture: ComponentFixture<BuildingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuildingComponent]
    });
    fixture = TestBed.createComponent(BuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
});
