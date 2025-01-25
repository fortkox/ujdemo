const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Email konfiguráció
const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    auth: {
        user: "apikey", // Mindig ezt használd felhasználónévként
        pass: "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", // A generált API kulcs
    },
});


// Foglalás fogadása
app.post("/book", (req, res) => {
    const { date, email } = req.body;

    if (!date || !email) {
        return res.status(400).send("Dátum és email megadása kötelező!");
    }

    // Email a tulajdonosnak
    const ownerMailOptions = {
        from: "ceszty@gmail.com",
        to: "levi.tothlevente@gmail.com", // Tulajdonos email-címe
        subject: "Új időpontfoglalás",
        text: `Új foglalás érkezett:\n\nIdőpont: ${date}\nFoglaló email-címe: ${email}`,
    };

    // Email a foglalónak
    const userMailOptions = {
        from: "ceszty@gmail.com",
        to: email,
        subject: "Foglalás visszaigazolása",
        text: `Köszönjük, hogy időpontot foglaltál!\n\nRészletek:\nIdőpont: ${date}\n\nÜdvözlettel,\nKárpitos és Szőnyeges Szolgáltatások`,
    };

    // Email-ek küldése
    Promise.all([
        transporter.sendMail(ownerMailOptions),
        transporter.sendMail(userMailOptions),
    ])
        .then(() => {
            res.status(200).send("Foglalás sikeresen rögzítve!");
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Nem sikerült az email küldése.");
        });
});

// Szerver indítása
app.listen(PORT, () => {
    console.log(`Szerver fut a ${PORT} porton.`);
});
