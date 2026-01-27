import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticoComponent } from './critico.component';

describe('CriticoComponent', () => {
  let component: CriticoComponent;
  let fixture: ComponentFixture<CriticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriticoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CriticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
