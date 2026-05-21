require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/restaurant';

mongoose.connect(DATABASE_URL).then(async () => {
  console.log('✅ Connecté à MongoDB');

  const User = require('./src/api/models/user.model')(mongoose);

  // Supprime l'ancien admin s'il existe
  await User.deleteMany({ username: 'admin' });

  const hash = await bcrypt.hash('admin123', 10);
  await User.create({ username: 'admin', password: hash, role: 'admin' });

  console.log('✅ Admin créé avec succès !');
  console.log('   username : admin');
  console.log('   password : admin123');
  process.exit(0);

}).catch(err => {
  console.error('❌ Erreur MongoDB :', err.message);
  process.exit(1);
});