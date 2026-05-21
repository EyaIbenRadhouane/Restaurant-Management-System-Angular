require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL).then(async () => {
  console.log('✅ Connecté');
  
  // Supprime tous les index problématiques de la collection users
  await mongoose.connection.db.collection('users').dropIndexes();
  console.log('✅ Index supprimés');

  // Supprime tous les anciens users
  await mongoose.connection.db.collection('users').deleteMany({});
  console.log('✅ Collection users nettoyée');

  process.exit(0);
}).catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});