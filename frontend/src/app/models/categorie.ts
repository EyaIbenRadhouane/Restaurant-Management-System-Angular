export class Categorie {
  _id?: string;
  id?: string;
  nom: string;
  description?: string;

  constructor(nom: string, description?: string) {
    this.nom = nom;
    this.description = description;
  }
}