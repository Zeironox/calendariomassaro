const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Configura il trasporto email Gmail con password per app
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "wassimatifi.28@gmail.com",
    pass: "pxyebwgemwnrbfrq"
  }
});

// Endpoint per inviare email conferma prenotazione
app.post("/send-email", async (req, res) => {
  try {
    const { nome, email, data, ora, annullaToken } = req.body;

    if (!nome || !email || !data || !ora || !annullaToken) {
      return res.status(400).send("Dati mancanti");
    }

    const annullaLink = `https://calendario-gomme.web.app/annulla.html?token=${encodeURIComponent(annullaToken)}`;

    const mailOptions = {
      from: '"Calendario Gomme" <wassimatifi.28@gmail.com>',
      to: email,
      subject: "Conferma Prenotazione",
      html: `
        <p>Ciao <strong>${nome}</strong>,</p>
        <p>Hai prenotato per il <strong>${data}</strong> alle <strong>${ora}</strong>.</p>
        <p>Se vuoi annullare l'appuntamento, clicca qui:</p>
        <p><a href="${annullaLink}">Annulla la prenotazione</a></p>
        <hr>
        <p>Questo messaggio è stato inviato dal sito <strong>Calendario Gomme</strong>.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).send("Email inviata");
  } catch (error) {
    console.error("Errore invio email:", error);
    return res.status(500).send("Errore interno");
  }
});

exports.api = functions.https.onRequest(app);
