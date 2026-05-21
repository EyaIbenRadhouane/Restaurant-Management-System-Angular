import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Plat } from '../../models/plat';
import { Categorie } from '../../models/categorie';
import { PlatService } from '../../services/plat.service';
import { CategorieService } from '../../services/categorie.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-liste-plats',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './liste-plats.component.html'
})
export class ListePlatsComponent implements OnInit {

  plats: Plat[] = [];
  platsFiltres: Plat[] = [];
  categories: Categorie[] = [];
  recherche: string = '';
  categorieSelectionnee: string = '';
  message: string = '';
  apiUrl: string = environment.apiUrl;

  constructor(
    private platService: PlatService,
    private categorieService: CategorieService
  ) {}

  ngOnInit(): void {
    this.chargerCategories();
    this.chargerPlats();
  }

  getId(plat: Plat): string {
    return ((plat as any).id || plat._id) as string;
  }

  chargerPlats(): void {
    this.platService.getAll().subscribe({
      next: (data) => { this.plats = data; this.platsFiltres = data; },
      error: (err) => console.error(err)
    });
  }

  chargerCategories(): void {
    this.categorieService.getAll().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error(err)
    });
  }

  filtrer(): void {
    this.platsFiltres = this.plats.filter(p => {
      const nomMatch = p.nom.toLowerCase().includes(this.recherche.toLowerCase());
      const catId = (p.categorie as any)?.id || (p.categorie as any)?._id || p.categorie;
      const catMatch = this.categorieSelectionnee
        ? catId === this.categorieSelectionnee
        : true;
      return nomMatch && catMatch;
    });
  }

  reinitialiser(): void {
    this.recherche = '';
    this.categorieSelectionnee = '';
    this.platsFiltres = this.plats;
  }

  supprimer(plat: Plat): void {
    if (confirm('Supprimer ce plat ?')) {
      this.platService.delete(this.getId(plat)).subscribe({
        next: () => {
          this.message = '✅ Plat supprimé avec succès';
          this.chargerPlats();
          setTimeout(() => this.message = '', 3000);
        },
        error: () => this.message = '❌ Erreur lors de la suppression'
      });
    }
  }

  getNomCategorie(categorie: any): string {
    if (!categorie) return '—';
    if (typeof categorie === 'object') return categorie.nom;
    const found = this.categories.find(c => (c as any).id === categorie || c._id === categorie);
    return found ? found.nom : '—';
  }
}