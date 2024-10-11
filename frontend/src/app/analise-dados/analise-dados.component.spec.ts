import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnaliseDadosComponent } from './analise-dados.component';

describe('AnaliseDadosComponent', () => {
  let component: AnaliseDadosComponent;
  let fixture: ComponentFixture<AnaliseDadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnaliseDadosComponent]
    });
    fixture = TestBed.createComponent(AnaliseDadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
