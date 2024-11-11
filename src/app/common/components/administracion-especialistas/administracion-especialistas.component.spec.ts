import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionEspecialistasComponent } from './administracion-especialistas.component';

describe('AdministracionEspecialistasComponent', () => {
  let component: AdministracionEspecialistasComponent;
  let fixture: ComponentFixture<AdministracionEspecialistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministracionEspecialistasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministracionEspecialistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
