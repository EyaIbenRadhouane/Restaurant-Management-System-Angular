const db = require('../../database/db.config');
const Categorie = db.categories;

// Créer une catégorie
exports.create = (req, res) => {
    const { nom, description } = req.body;
    if (!nom) {
        return res.status(400).send({ message: 'Le nom est obligatoire' });
    }
    const nouvelleCategorie = new Categorie({ nom, description });
    nouvelleCategorie.save()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send({ message: err.message }));
};

// Lire toutes les catégories
exports.findAll = (req, res) => {
    Categorie.find()
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message }));
};

// Lire une catégorie par ID
exports.findOne = (req, res) => {
    Categorie.findById(req.params.id)
        .then(data => {
            if (!data) return res.status(404).send({ message: 'Catégorie non trouvée' });
            res.send(data);
        })
        .catch(err => res.status(500).send({ message: err.message }));
};

// Modifier une catégorie
exports.update = (req, res) => {
    const id = req.params.id;
    Categorie.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) return res.status(404).send({ message: 'Catégorie non trouvée' });
            res.send({ message: 'Catégorie mise à jour avec succès' });
        })
        .catch(err => res.status(500).send({ message: err.message }));
};

// Supprimer une catégorie
exports.delete = (req, res) => {
    Categorie.findByIdAndDelete(req.params.id)
        .then(data => {
            if (!data) return res.status(404).send({ message: 'Catégorie non trouvée' });
            res.send({ message: 'Catégorie supprimée avec succès' });
        })
        .catch(err => res.status(500).send({ message: err.message }));
};