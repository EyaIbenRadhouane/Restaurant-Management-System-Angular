import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutCommandeComponent } from './ajout-commande.component';

describe('AjoutCommandeComponent', () => {
  let component: AjoutCommandeComponent;
  let fixture: ComponentFixture<AjoutCommandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutCommandeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjoutCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
