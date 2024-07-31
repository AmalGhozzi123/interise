const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));

const adminSchema = new mongoose.Schema({
  idAdmin: {type: String , required :true , auto:true},
  email: { type: String, required: true, unique: true },
  motdepasse: { type: String, required: true }
});

adminSchema.pre('save', async function(next) {
  if (!this.isModified('motdepasse')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.motdepasse = await bcrypt.hash(this.motdepasse, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const Admin = mongoose.model('Admin', adminSchema);

app.post('/api/loginAdmin', async (req, res) => {
  try {
    const { email, motdepasse } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: 'Email et/ou mot de passe incorrect' });
    }

    const passwordMatch = await bcrypt.compare(motdepasse, admin.motdepasse);
    if (passwordMatch) {
      const token = jwt.sign({ email: admin.email }, process.env.JWT_SECRET);  
      res.status(200).json({ message: 'Connexion réussie' });
    } else {
      res.status(401).json({ message: 'Identifiants incorrects' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'authentification' });
  }
});


const userSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: String,
  Tel: String,
  Societe: String,
  Site_web: String,
  motDePasse: String,
  date_demande: Date,
  payments: [{
    paymentRef: String,
    amount: Number,
    type_paiement: String,
    date_debut: { $date: Date },
    date_fin: { $date: Date }
  }]
});


userSchema.pre('save', async function(next) {
  if (!this.isModified('motDePasse')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema);

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({ motDePasse: { $exists: false },'payments.0': { $exists: false } });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/nouveaux-clients", async (req, res) => {
  try {
    const nouveauxClients = await User.find({ motDePasse: { $exists: false }, 'payments.0': { $exists: true } });
    res.json(nouveauxClients);
  } catch (error) {
    console.error("Error fetching nouveaux clients:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/clients", async (req, res) => {
  try {
    const clients = await User.find({ motDePasse: { $exists: true }, 'payments.0': { $exists: true } });
    res.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put('/api/nouveaux-clients/:id/password', async (req, res) => {
  const { motDePasse } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.motDePasse = motDePasse;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
