const db = require('../../database/db.config');
const Plat = db.plats;

// Créer un plat
exports.create = (req, res) => {
    const { nom, description, prix, categorie, image } = req.body;
    if (!nom || !prix || !categorie) {
        return res.status(400).send({ message: 'Nom, prix et catégorie sont obligatoires' });
    }
    const nouveauPlat = new Plat({ nom, description, prix, categorie, image });
    nouveauPlat.save()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send({ message: err.message }));
};

// Lire tous les plats
exports.findAll = (req, res) => {
    Plat.find().populate('categorie')
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message }));
};

// Rechercher par nom
exports.findByNom = (req, res) => {
    const nom = req.query.nom;
    const condition = nom ? { nom: { $regex: nom, $options: 'i' } } : {};
    Plat.find(condition).populate('categorie')
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message }));
};

// Lire un plat par ID
exports.findOne = (req, res) => {
    Plat.findById(req.params.id).populate('categorie')
        .then(data => {
            if (!data) return res.status(404).send({ message: 'Plat non trouvé' });
            res.send(data);
        })
        .catch(err => res.status(500).send({ message: err.message }));
};

// Modifier un plat
exports.update = (req, res) => {
    const id = req.params.id;
    Plat.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) return res.status(404).send({ message: 'Plat non trouvé' });
            res.send({ message: 'Plat mis à jour avec succès' });
        })
        .catch(err => res.status(500).send({ message: err.message }));
};

// Supprimer un plat
exports.delete = (req, res) => {
    Plat.findByIdAndDelete(req.params.id)
        .then(data => {
            if (!data) return res.status(404).send({ message: 'Plat non trouvé' });
            res.send({ message: 'Plat supprimé avec succès' });
        })
        .catch(err => res.status(500).send({ message: err.message }));
};