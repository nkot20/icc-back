const pdf = require("pdf-creator-node");
const fs = require("fs");
// Read HTML Template
const template = fs.readFileSync("templates/Certificat/page.html", "utf8");
const QRCode = require('qrcode');
const mustache = require("mustache");

QRCode.toFile('./public/qrcode.png', 'Test coco', {
    errorCorrectionLevel: 'H',
    width: 150, // Largeur en pixels
    height: 150 // Hauteur en pixels
}, function(err) {
    if (err) throw err;
    console.log('QR code saved!');
});


function printCertificatTrainingImprint(datas) {
    try {

        const html = mustache.render(template, datas);
        let document = {
            html: html,
            data: {
                user: datas,
            },
            path: "./public/certificats/formation/test.pdf",
            type: "",
        };
        const options = {
            format: "A4",
            orientation: "portrait",
            border: "1mm",
            header: {
                height: "5mm",
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

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function addYearsToDate(date, yearsToAdd) {
    const newDate = new Date(date); // Crée une copie de la date d'origine
    newDate.setFullYear(newDate.getFullYear() + yearsToAdd); // Ajoute le nombre d'années spécifié
    return newDate;
}
printCertificatTrainingImprint({
    date: formatDate(new Date()),
    dateExpiration: formatDate(addYearsToDate(new Date(),1)),
    lastname: "NKOT-A-NZOK ",
    firstname: "ETIENNE",
    formation: "Formation en entrepreneuriat",
    points: Math.floor(187.2555),
    qrcode: 'http://localhost:4002/qrcode/660d25b29a9135d349467bb8_6612c6cf292f7856070a4e49.png',
    logoentetegauche: 'http://localhost:4002/logos/accelerate-africa.PNG',
    logoentetedroit: 'http://localhost:4002/logos/wellbin.PNG',
    diamantlogo: 'http://localhost:4002/logos/diamant_logo.jpg',
    humanbetlogo: 'http://localhost:4002/logos/humanbet_logo.jpg',
    mmlogo: 'http://localhost:4002/logos/mm_logo.jpg',
    signature1: 'http://localhost:4002/logos/signaturebossou.PNG',
    signature2: 'http://localhost:4002/logos/signaturemondo.PNG',
});