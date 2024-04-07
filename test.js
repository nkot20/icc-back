const pdf = require("pdf-creator-node");
const fs = require("fs");
// Read HTML Template
const html = fs.readFileSync("templates/Certificat/page.html", "utf8");
const QRCode = require('qrcode');

QRCode.toFile('./public/qrcode.png', 'Test coco', {
    errorCorrectionLevel: 'H',
    width: 150, // Largeur en pixels
    height: 150 // Hauteur en pixels
}, function(err) {
    if (err) throw err;
    console.log('QR code saved!');
});


function printCertificatTrainingImprint() {
    try {
        const options = {
            format: "A4",
            orientation: "portrait",
            border: "1mm",
            header: {
                height: "10mm",
            },
            footer: {
                height: "5mm",
            }
        };
        pdf
            .create(document, options)
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.error(error);
            });
    } catch (error) {
        throw error;
    }
}

//printCertificatTrainingImprint();