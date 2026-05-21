import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutPlatComponent } from './ajout-plat.component';

describe('AjoutPlatComponent', () => {
  let component: AjoutPlatComponent;
  let fixture: ComponentFixture<AjoutPlatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutPlatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjoutPlatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
