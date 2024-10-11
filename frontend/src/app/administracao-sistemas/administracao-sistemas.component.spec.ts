import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracaoSistemasComponent } from './administracao-sistemas.component';

describe('AdministracaoSistemasComponent', () => {
  let component: AdministracaoSistemasComponent;
  let fixture: ComponentFixture<AdministracaoSistemasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdministracaoSistemasComponent]
    });
    fixture = TestBed.createComponent(AdministracaoSistemasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
