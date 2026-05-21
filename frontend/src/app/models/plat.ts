import { Categorie } from "./categorie";
import { LigneCommande } from "./commande";

export class Plat {
  _id?: string;
  id?: string;
  nom: string;
  description: string;
  prix: number;
  categorie: string | Categorie;
  image?: string;
  disponible: boolean;

  constructor(nom: string, description: string,prix: number,categorie: string | Categorie,image?: string,disponible: boolean = true) {
    this.nom = nom;
    this.description = description;
    this.prix = prix;
    this.categorie = categorie;
    this.image = image;
    this.disponible = disponible;
  } 
}