import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Plat } from '../../models/plat';
import { PlatService } from '../../services/plat.service';
import { CommandeService } from '../../services/commande.service';

interface LigneForm {
  plat: string;
  quantite: number;
  prixUnitaire: number;
}

@Component({
  selector: 'app-ajout-commande',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DecimalPipe],
  templateUrl: './ajout-commande.component.html'
})
export class AjoutCommandeComponent implements OnInit {

  plats: Plat[] = [];
  client: string = '';
  lignes: LigneForm[] = [];
  erreur: string = '';

  constructor(
    private platService: PlatService,
    private commandeService: CommandeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.platService.getAll().subscribe({
      next: (data) => {
        this.plats = data.filter(p => p.disponible);
      },
      error: (err) => console.error(err)
    });
    this.ajouterLigne();
  }

  getPlatId(plat: Plat): string {
    return ((plat as any).id || plat._id) as string;
  }

  ajouterLigne(): void {
    this.lignes.push({ plat: '', quantite: 1, prixUnitaire: 0 });
  }

  onPlatChange(index: number, platId: string): void {
    // ✅ Cherche par id OU _id
    const found = this.plats.find(p => this.getPlatId(p) === platId);
    if (found) this.lignes[index].prixUnitaire = found.prix;
  }

  supprimerLigne(i: number): void {
    if (this.lignes.length > 1) this.lignes.splice(i, 1);
  }

  get total(): number {
    return this.lignes.reduce((sum, l) => sum + l.quantite * l.prixUnitaire, 0);
  }

  formulaireValide(): boolean {
    return this.client.trim() !== '' &&
           this.lignes.length > 0 &&
           this.lignes.every(l => l.plat !== '' && l.quantite > 0);
  }

  soumettre(): void {
    if (!this.formulaireValide()) {
      this.erreur = '❌ Veuillez remplir tous les champs';
      return;
    }

    const payload = {
      client: this.client,
      plats: this.lignes.map(l => ({
        plat: l.plat,
        quantite: l.quantite
      }))
    };

    this.commandeService.create(payload as any).subscribe({
      next: () => this.router.navigate(['/commandes']),
      error: () => this.erreur = '❌ Erreur lors de la création'
    });
  }
}