const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const nodemailer = require('nodemailer');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});


const abonnementSchema = new mongoose.Schema({
  paymentRef: { type: String, required: true },
  amount: { type: Number, required: true },
  type_paiement: { type: String },
  date_debut: { type: Date, default: Date.now },
  date_fin: { type: Date }
}, { versionKey: false });

const userSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: String,
  Tel: String,
  Societe: String,
  Site_web: String,
  date_demande: { type: Date, default: Date.now },
  abonnements: [abonnementSchema] 
}, { versionKey: false });

const User = mongoose.model('User', userSchema);

app.post("/api/register", async (req, res) => {
  try {
    const { nom, prenom, email, Tel, Societe, Site_web } = req.body;
    if (!nom || !prenom || !email || !Tel || !Societe || !Site_web) {
      return res.status(400).json({ message: "Veuillez fournir toutes les informations nécessaires." });
    }
    const user = new User({ 
      nom, 
      prenom, 
      email, 
      Tel, 
      Societe, 
      Site_web,
      date_demande: new Date() 
    });
    await user.save();

    const mailOptions = {
      from: email,
      replyTo: email,
      to: process.env.EMAIL_USERNAME,
      subject: '🔔 Nouvelle demande de démonstration',
      html: `
        <div style="background-color: #fff; border: 1px solid #ddd; padding: 20px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1); border-radius: 8px; max-width: 600px; margin: auto; text-align: center; font-family: Georgia, serif; color: #333;">
          <p style="font-size: 18px; line-height: 1.4;">Cette demande de démonstration a été soumise par :</p>
          <ul style="list-style-type: none; padding: 0;">
            <li style="margin-bottom: 10px;">
              <span style="display: inline-block; width: 20px; text-align: center;">🧑</span> ${nom} ${prenom}
            </li>
            <li style="margin-bottom: 10px;">
              <span style="display: inline-block; width: 20px; text-align: center;">✉️</span> <a href="mailto:${email}" style="color: #1a0dab; text-decoration: none;">${email}</a>
            </li>
            <li style="margin-bottom: 10px;">
              <span style="display: inline-block; width: 20px; text-align: center;">📞</span> ${Tel}
            </li>
            <li style="margin-bottom: 10px;">
              <span style="display: inline-block; width: 20px; text-align: center;">🏢</span> ${Societe}
            </li>
            <li style="margin-bottom: 10px;">
              <span style="display: inline-block; width: 20px; text-align: center;">🌐</span> <a href="${Site_web}" style="color: #1a0dab; text-decoration: none;">${Site_web}</a>
            </li>
          </ul>
          <p style="font-size: 18px; line-height: 1.4;">Veuillez répondre directement à ce mail pour contacter la personne.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).send("L'inscription a été réussie et les données ont été envoyées.");
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    if (error.code === 11000) { 
      res.status(400).json({ message: "Cette adresse email a déjà été utilisée !" });
    } else {
      res.status(500).json({ message: "Erreur lors de l'inscription : " + error.message });
    }
  }
});

app.post("/payments/init-payment", async (req, res) => {
  try {
    const { email, amount } = req.body;
    console.log("Received amount:", amount); 

    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({ message: "Vous devez envoyer une demande de démo avant de procéder au paiement." });
    }
    const orderId = `ORDER-${Date.now()}`;

    const requestData = {
      receiverWalletId: process.env.KONNECT_WALLET_ID,
      token: "TND",
      amount: amount,
      type: "immediate",
      description: `Paiement de la commande ${orderId}`,
      acceptedPaymentMethods: ["wallet", "bank_card", "e-DINAR"],
      lifespan: 10,
      checkoutForm: true,
      addPaymentFeesToAmount: true,
      email: email,
      orderId: orderId,
      webhook: `${process.env.SERVER_URL}/api/notification_payment`,
      silentWebhook: true,
      successUrl: `${process.env.CLIENT_URL}/payment-success`,
      failUrl: `${process.env.CLIENT_URL}/payment-failure`,
      theme: "light"
    };

    const response = await axios.post('https://api.preprod.konnect.network/api/v2/payments/init-payment', requestData, {
      headers: {
        'x-api-key': process.env.KONNECT_API_KEY
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Erreur lors de l'initialisation du paiement :", error);
    res.status(500).json({ message: "Erreur lors de l'initialisation du paiement", error: error.message });
  }
});


app.get("/api/notification_payment", async (req, res) => {
  try {
    const paymentRef = req.query.payment_ref;
    if (!paymentRef) {
      return res.status(400).json({ message: "payment_ref non spécifié" });
    }

    const response = await axios.get(`https://api.preprod.konnect.network/api/v2/payments/${paymentRef}`, {
      headers: {
        'x-api-key': process.env.KONNECT_API_KEY
      }
    });

    const paymentData = response.data.payment;
    console.log("Received payment data:", paymentData);

    if (!paymentData) {
      throw new Error("Les données de paiement sont introuvables.");
    }

    let userEmail = paymentData.transactions[0].extSenderInfo.email; 
    if (!userEmail) {
      throw new Error("L'e-mail de l'utilisateur est manquant dans les données de paiement.");
    }

    let existingUser = await User.findOne({ email: userEmail });

    if (!existingUser) {
      console.warn("Utilisateur non trouvé dans la base de données pour l'e-mail :", userEmail);
      existingUser = new User({ email: userEmail, abonnements: [] });
    }

    let typePaiement;
    let joursExpiration;

    const receivedAmount = paymentData.amount;

    switch (receivedAmount) {
      case 299000:
        typePaiement = 'mensuel';
        joursExpiration = 30;
        break;
      case 666000:
        typePaiement = 'semestriel';
        joursExpiration = 180;
        break;
      case 999000:
        typePaiement = 'annuel';
        joursExpiration = 365;
        break;
      default:
        throw new Error("Montant de paiement invalide : " + receivedAmount);
    }

    const dateFin = new Date(Date.now() + joursExpiration * 24 * 60 * 60 * 1000);

    if (!existingUser.abonnements) {
      existingUser.abonnements = [];
    }

    existingUser.abonnements.push({
      paymentRef: paymentData.id,
      amount: paymentData.amount,
      type_paiement: typePaiement,
      date_fin: dateFin
    });

    await existingUser.save();

    const htmlResponse = `
      <html>
      <head>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
            font-family: Georgia, serif;
          }

          .container {
            background-color: #91D8EA;
            color: #1B155A;
            border: 1px solid #91D8EA;
            padding: 20px;
            border-radius: 5px;
            max-width: 600px;
            text-align: center;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            border : 3px solid 1B155A;
          }

          .container p {
            margin-bottom: 10px;
          }

          .container p:last-child {
            margin-bottom: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <p style="font-size: 18px; margin-bottom: 15px;">
            Paiement effectué avec succès pour un abonnement ${
              typePaiement === 'semestriel' ? "semestriel" :
              typePaiement === 'mensuel' ? "mensuel" :
              typePaiement === 'annuel' ? "annuel" : null
            } 🎉
          </p>
          <p>Montant payé : ${paymentData.amount / 1000} TND</p>
          <p>Merci d'avoir choisi notre service !</p>
          <p>Restez connecté jusqu'à ce qu'un administrateur vous fournisse un mot de passe par e-mail</p>
        </div>
      </body>
      </html>
    `;

    res.status(200).send(htmlResponse);
  } catch (error) {
    console.error("Erreur lors de la réception de la notification de paiement :", error);
    res.status(500).json({ message: "Erreur lors de la réception de la notification de paiement", error: error.message });
  }
});


  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
  });