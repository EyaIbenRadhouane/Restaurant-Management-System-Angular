module.exports = app => {
    const router = require('express').Router();
    const platController      = require('../controllers/plat.controller');
    const categorieController = require('../controllers/categorie.controller');
    const commandeController  = require('../controllers/commande.controller');
    const authController      = require('../controllers/auth.controller');
    const upload = require('../middleware/upload');
    // Routes Auth
    router.post('/auth/register', authController.register);
    router.post('/auth/login',    authController.login);

    // Routes Catégories
    router.post('/categories', categorieController.create);
    router.get('/categories', categorieController.findAll);
    router.get('/categories/:id', categorieController.findOne);
    router.put('/categories/:id', categorieController.update);
    router.delete('/categories/:id', categorieController.delete);

    // Routes Plats
    router.post('/plats/upload', upload.single('image'), (req, res) => {
        if (!req.file) return res.status(400).json({ message: 'Aucun fichier reçu' });
        res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
    });
    router.post('/plats', platController.create);
    router.get('/plats', platController.findAll);
    router.get('/plats/search', platController.findByNom);
    router.get('/plats/:id', platController.findOne);
    router.put('/plats/:id', platController.update);
    router.delete('/plats/:id', platController.delete);

    // Routes Commandes
    router.post('/commandes', commandeController.create);
    router.get('/commandes', commandeController.findAll);
    router.get('/commandes/:id', commandeController.findOne);
    router.put('/commandes/:id', commandeController.update);
    router.delete('/commandes/:id', commandeController.delete);

    app.use('/api', router);
};