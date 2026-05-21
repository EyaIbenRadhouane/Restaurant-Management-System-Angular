import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PlatService } from '../../services/plat.service';
import { CategorieService } from '../../services/categorie.service';
import { Categorie } from '../../models/categorie';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-ajout-plat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './ajout-plat.component.html'
})
export class AjoutPlatComponent implements OnInit {

  form!: FormGroup;
  categories: Categorie[] = [];
  erreur: string = '';
  submitted: boolean = false;
  apiUrl: string = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private platService: PlatService,
    private categorieService: CategorieService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nom:         ['', [Validators.required, Validators.minLength(2)]],
      description: ['', Validators.required],
      prix:        [0,  [Validators.required, Validators.min(0.01)]],
      categorie:   ['', Validators.required],
      disponible:  [true],
      image:       ['']
    });

    this.categorieService.getAll().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error(err)
    });
  }

  get f() { return this.form.controls; }

  soumettre(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    this.platService.create(this.form.value).subscribe({
      next: () => this.router.navigate(['/plats']),
      error: () => this.erreur = '❌ Erreur lors de l\'ajout du plat'
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      this.http.post(this.apiUrl + '/api/plats/upload', formData).subscribe({
        next: (res: any) => this.form.patchValue({ image: res.imageUrl }),
        error: (err) => {
          const message = typeof err.error === 'string' ? err.error : err?.error?.message;
          this.erreur = message || '❌ Erreur lors de l\'upload de l\'image';
        }
      });
    }
  }
}