import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Commande } from '../../models/commande';
import { CommandeService } from '../../services/commande.service';

@Component({
  selector: 'app-liste-commandes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './liste-commandes.component.html'
})
export class ListeCommandesComponent implements OnInit {

  commandes: Commande[] = [];
  statuts = ['en attente', 'confirmée', 'livrée', 'annulée'];
  message: string = '';

  constructor(private commandeService: CommandeService) {}

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.commandeService.getAll().subscribe({
      next: (data) => this.commandes = data,
      error: (err) => console.error(err)
    });
  }

  // ✅ Récupère l'id que ce soit "id" ou "_id"
  getId(cmd: any): string {
    return cmd.id || cmd._id;
  }

  changerStatut(cmd: any, statut: string): void {
    this.commandeService.updateStatut(this.getId(cmd), statut).subscribe({
      next: () => {
        this.message = '✅ Statut mis à jour';
        this.charger();
        setTimeout(() => this.message = '', 3000);
      },
      error: () => this.message = '❌ Erreur lors de la mise à jour'
    });
  }

  supprimer(cmd: any): void {
    if (confirm('Supprimer cette commande ?')) {
      this.commandeService.delete(this.getId(cmd)).subscribe({
        next: () => {
          this.message = '✅ Commande supprimée';
          this.charger();
          setTimeout(() => this.message = '', 3000);
        },
        error: () => this.message = '❌ Erreur lors de la suppression'
      });
    }
  }

  getBadgeClass(statut: string | undefined): string {
    switch (statut) {
      case 'confirmée': return 'bg-primary';
      case 'livrée':    return 'bg-success';
      case 'annulée':   return 'bg-danger';
      default:          return 'bg-warning text-dark';
    }
  }

  // ✅ Retourne le nom du plat depuis l'objet populé
  getNomPlat(ligne: any): string {
    if (!ligne?.plat) return '—';
    return typeof ligne.plat === 'object' ? ligne.plat.nom : ligne.plat;
  }

  // ✅ Calcule le sous-total depuis le prix du plat populé
  getSousTotal(ligne: any): number {
    const prix = typeof ligne.plat === 'object' ? ligne.plat.prix : 0;
    return prix * ligne.quantite;
  }
}