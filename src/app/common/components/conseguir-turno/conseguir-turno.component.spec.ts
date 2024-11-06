import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConseguirTurnoComponent } from './conseguir-turno.component';

describe('ConseguirTurnoComponent', () => {
  let component: ConseguirTurnoComponent;
  let fixture: ComponentFixture<ConseguirTurnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConseguirTurnoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConseguirTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
