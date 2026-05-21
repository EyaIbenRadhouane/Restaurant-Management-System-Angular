const db = require('../../database/db.config');
const Commande = db.commandes;
const Plat = db.plats;

// Créer une commande
exports.create = (req, res) => {
    const { client, plats } = req.body;
    if (!client || !plats || plats.length === 0) {
        return res.status(400).send({ message: 'Client et plats sont obligatoires' });
    }

    // Calculer le total
    const platIds = plats.map(p => p.plat);
    Plat.find({ _id: { $in: platIds } })
        .then(platsData => {
            let total = 0;
            plats.forEach(item => {
                const platTrouve = platsData.find(p => p._id.toString() === item.plat);
                if (platTrouve) total += platTrouve.prix * item.quantite;
            });

            const nouvelleCommande = new Commande({ client, plats, total });
            return nouvelleCommande.save();
        })
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send({ message: err.message }));
};

// Lire toutes les commandes
exports.findAll = (req, res) => {
    Commande.find().populate('plats.plat')
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message }));
};

// Lire une commande par ID
exports.findOne = (req, res) => {
    Commande.findById(req.params.id).populate('plats.plat')
        .then(data => {
            if (!data) return res.status(404).send({ message: 'Commande non trouvée' });
            res.send(data);
        })
        .catch(err => res.status(500).send({ message: err.message }));
};

// Modifier le statut d'une commande
exports.update = (req, res) => {
    Commande.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) return res.status(404).send({ message: 'Commande non trouvée' });
            res.send({ message: 'Commande mise à jour avec succès' });
        })
        .catch(err => res.status(500).send({ message: err.message }));
};

// Supprimer une commande
exports.delete = (req, res) => {
    Commande.findByIdAndDelete(req.params.id)
        .then(data => {
            if (!data) return res.status(404).send({ message: 'Commande non trouvée' });
            res.send({ message: 'Commande supprimée avec succès' });
        })
        .catch(err => res.status(500).send({ message: err.message }));
};