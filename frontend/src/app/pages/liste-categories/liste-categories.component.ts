import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Categorie } from '../../models/categorie';
import { CategorieService } from '../../services/categorie.service';

@Component({
  selector: 'app-liste-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './liste-categories.component.html'
})
export class ListeCategoriesComponent implements OnInit {

  categories: Categorie[] = [];
  nouvelleCategorie: string = '';
  categorieEnEdition: Categorie | null = null;
  nomEdition: string = '';
  message: string = '';
  erreur: string = '';

  constructor(private categorieService: CategorieService) {}

  ngOnInit(): void {
    this.charger();
  }

  // ✅ Helper : retourne l'id que ce soit "id" ou "_id"
  getId(cat: Categorie): string {
    return (cat.id || cat._id) as string;
  }

  charger(): void {
    this.categorieService.getAll().subscribe({
      next: (data) => { this.categories = data; this.erreur = ''; },
      error: () => this.erreur = '❌ Erreur de chargement'
    });
  }

  ajouter(): void {
    if (!this.nouvelleCategorie.trim()) return;
    this.categorieService.create({ nom: this.nouvelleCategorie }).subscribe({
      next: () => {
        this.message = '✅ Catégorie ajoutée';
        this.nouvelleCategorie = '';
        this.erreur = '';
        this.charger();
        setTimeout(() => this.message = '', 3000);
      },
      error: () => this.erreur = '❌ Erreur lors de l\'ajout'
    });
  }

  editer(cat: Categorie): void {
    this.categorieEnEdition = cat;
    this.nomEdition = cat.nom;
  }

  annulerEdition(): void {
    this.categorieEnEdition = null;
    this.nomEdition = '';
  }

  sauvegarder(): void {
    if (!this.categorieEnEdition || !this.nomEdition.trim()) return;
    const id = this.getId(this.categorieEnEdition);  // ✅ fix
    this.categorieService.update(id, { nom: this.nomEdition }).subscribe({
      next: () => {
        this.message = '✅ Catégorie modifiée';
        this.erreur = '';
        this.annulerEdition();
        this.charger();
        setTimeout(() => this.message = '', 3000);
      },
      error: () => this.erreur = '❌ Erreur lors de la modification'
    });
  }

  supprimer(cat: Categorie): void {
    if (confirm('Supprimer cette catégorie ?')) {
      const id = this.getId(cat);  // ✅ fix
      this.categorieService.delete(id).subscribe({
        next: () => {
          this.message = '✅ Catégorie supprimée';
          this.erreur = '';
          this.charger();
          setTimeout(() => this.message = '', 3000);
        },
        error: () => this.erreur = '❌ Erreur lors de la suppression'
      });
    }
  }
}