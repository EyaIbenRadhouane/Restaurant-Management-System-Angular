import { Plat } from "./plat";

export class LigneCommande {
  plat: string | Plat;
  quantite: number;
  prixUnitaire: number;

  constructor(plat: string | Plat, quantite: number, prixUnitaire: number) {
    this.plat = plat;
    this.quantite = quantite;
    this.prixUnitaire = prixUnitaire;
  }
}

export class Commande {
  _id?: string;
  client: string;
  lignes: LigneCommande[];
  total?: number;
  statut?: 'en attente' | 'confirmée' | 'livrée' | 'annulée';
  createdAt?: Date;

  constructor(client: string, lignes: LigneCommande[]) {
    this.client = client;
    this.lignes = lignes;
  }
}