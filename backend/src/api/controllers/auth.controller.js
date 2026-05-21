const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../database/db.config');
const User = db.users;

const SECRET = process.env.JWT_SECRET || 'restaurant_secret_key';

// Inscription
exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password)
    return res.status(400).send({ message: 'Username et password obligatoires' });

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash, role: role || 'client' });
    await user.save();
    res.status(201).send({ message: 'Utilisateur créé avec succès' });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).send({ message: 'Username déjà utilisé' });
    res.status(500).send({ message: err.message });
  }
};

// Connexion
exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).send({ message: 'Username et password obligatoires' });

  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(404).send({ message: 'Utilisateur non trouvé' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).send({ message: 'Mot de passe incorrect' });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      SECRET,
      { expiresIn: '24h' }
    );

    res.send({ token, username: user.username, role: user.role });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};