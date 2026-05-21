const express = require('express');
const cors = require('cors');
require('dotenv').config();

const database = require('./src/database/db.config');

const app = express();
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connexion MongoDB
database.mongoose.connect(database.url)
    .then(() => {
        console.log('✅ connected to database');
    })
    .catch(err => {
        console.log('❌ Cannot connect to database:', err);
        process.exit();
    });

app.get('/', (req, res) => {
    res.send({ message: 'Hello, Restaurant API!' });
});
// Routes
require('./src/api/routes/routes')(app);

// Gestionnaire d'erreurs JSON global
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: err.message || 'Erreur serveur' });
});

app.listen(process.env.PORT, () => {
    console.log('🚀 listening on port', process.env.PORT);
});