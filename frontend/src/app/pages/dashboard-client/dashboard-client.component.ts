import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Plat } from '../../models/plat';
import { Categorie } from '../../models/categorie';
import { PlatService } from '../../services/plat.service';
import { CategorieService } from '../../services/categorie.service';
import { CommandeService } from '../../services/commande.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

interface Panier { plat: Plat; quantite: number; }

@Component({
  selector: 'app-dashboard-client',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard-client.component.html'
})
export class DashboardClientComponent implements OnInit {

  plats: Plat[] = [];
  platsFiltres: Plat[] = [];
  categories: Categorie[] = [];
  panier: Panier[] = [];
  mesCommandes: any[] = [];
  message: string = '';
  erreur: string = '';
  vue: 'menu' | 'commandes' = 'menu';
  apiUrl: string = environment.apiUrl;
  categorieSelectionnee: string = '';

  constructor(
    private platService: PlatService,
    private categorieService: CategorieService,
    private commandeService: CommandeService,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerCategories();
    this.chargerPlats();
    this.chargerMesCommandes();
  }

  chargerCategories(): void {
    this.categorieService.getAll().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error(err)
    });
  }

  chargerPlats(): void {
    this.platService.getAll().subscribe({
      next: (data) => {
        this.plats = data.filter(p => p.disponible);
        this.filtrer();
      }
    });
  }

  filtrer(): void {
    if (this.categorieSelectionnee) {
      this.platsFiltres = this.plats.filter(p => {
        const catId = (p.categorie as any)?.id || (p.categorie as any)?._id || p.categorie;
        return catId === this.categorieSelectionnee;
      });
    } else {
      this.platsFiltres = this.plats;
    }
  }

  getId(obj: any): string {
    // Priorité : _id (MongoDB) > id > ''
    const id = obj?._id || obj?.id;
    return String(id || '').trim();
  }

  ajouterAuPanier(plat: Plat): void {
    const platId = this.getId(plat);
    console.log('Ajout plat:', plat.nom, 'ID:', platId);
    
    // Chercher un article existant avec le même ID
    let existant = this.panier.find(p => {
      const id = this.getId(p.plat);
      console.log('  Comparaison avec:', p.plat.nom, 'ID:', id, 'Match:', id === platId);
      return id === platId;
    });

    if (existant) {
      console.log('  Article existant trouvé, quantité avant:', existant.quantite);
      existant.quantite += 1;
      console.log('  Quantité après:', existant.quantite);
    } else {
      console.log('  Nouvel article ajouté');
      this.panier.push({ plat, quantite: 1 });
    }
    
    this.message = `✅ ${plat.nom} ajouté au panier`;
    setTimeout(() => this.message = '', 2000);
  }

  retirerDuPanier(index: number): void {
    this.panier.splice(index, 1);
  }

  get total(): number {
    return this.panier.reduce((s, p) => s + p.plat.prix * p.quantite, 0);
  }

  passerCommande(): void {
    if (this.panier.length === 0) return;
    const payload = {
      client: this.auth.getUsername()!,
      plats: this.panier.map(p => ({ plat: this.getId(p.plat), quantite: p.quantite }))
    };
    this.commandeService.create(payload as any).subscribe({
      next: () => {
        this.message = '✅ Commande passée avec succès !';
        this.panier = [];
        this.chargerMesCommandes();
        this.vue = 'commandes';
        setTimeout(() => this.message = '', 3000);
      },
      error: () => this.erreur = '❌ Erreur lors de la commande'
    });
  }

  chargerMesCommandes(): void {
    this.commandeService.getAll().subscribe({
      next: (data) => {
        this.mesCommandes = data.filter(
          (c: any) => c.client === this.auth.getUsername()
        );
      }
    });
  }

  supprimerCommande(cmd: any): void {
    if (cmd.statut !== 'en attente') {
      this.erreur = '❌ Impossible de supprimer une commande qui n\'est pas en attente';
      setTimeout(() => this.erreur = '', 3000);
      return;
    }
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      this.commandeService.delete(this.getId(cmd)).subscribe({
        next: () => {
          this.message = '✅ Commande supprimée';
          this.chargerMesCommandes();
          setTimeout(() => this.message = '', 2000);
        },
        error: () => {
          this.erreur = '❌ Erreur lors de la suppression';
          setTimeout(() => this.erreur = '', 3000);
        }
      });
    }
  }

  getBadgeClass(statut: string): string {
    switch (statut) {
      case 'confirmée': return 'bg-primary';
      case 'livrée':    return 'bg-success';
      case 'annulée':   return 'bg-danger';
      default:          return 'bg-warning text-dark';
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}