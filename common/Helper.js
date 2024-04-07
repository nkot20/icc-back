const bcrypt = require('bcryptjs');
const base64Img = require('base64-img');
const config = require('../config/config.js');
//Required package
const pdf = require("pdf-creator-node");
const fs = require("fs");
// Read HTML Template
const template = fs.readFileSync("./templates/Certificat/page.html", "utf8");
const QRCode = require('qrcode');
const mustache = require('mustache');

module.exports = class Helper {
  static async apiSuccessResponse(data, message = '') {
    return {
      success: true,
      data,
      message,
    };
  }

  static async apiErrorResponse(data, message = '') {
    return {
      success: false,
      data,
      message,
    };
  }

  static async passwordCompare(oldPassword, newPassword) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const match = await bcrypt.compare(newPassword, oldPassword);
      resolve(match);
    });
  }

  static async passwordHashValue(password) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      bcrypt.hash(password, config.saltRounds, async (err, hash) => {
        if (err) {
          reject(err);
        } else {
          console.log('err');
          resolve(hash);
        }
      });
    });
  }

  static async generateCode() {
    try {
      const uniqueCode = `_${Math.random().toString(36).substr(2, 9)}`;
      return uniqueCode;
    } catch (error) {
      console.log(`Could not fetch Admin Email ${error}`);
      throw error;
    }
  }

  static async imageUpload(image, directory, imageName, imageType) {
    const aPromise = new Promise((resolve, reject) => {
      try {
        base64Img.img(
          image,
          directory,
          imageName,
          async (err) => {
            if (err) {
              console.log('profile image upload error ', err);
              reject(err);
            } else {
              const uploadedImageName = `${imageName}.${imageType}`;
              resolve(uploadedImageName);
            }
          },
        );
      } catch (error) {
        reject(error);
      }
    });
    return aPromise;
  }

  static async deleteFile(filepath) {
    return new Promise((resolve, reject) => {
      try {
        fs.stat(filepath, (err, stats) => {
          console.log(stats);// here we got all information of file in stats variable

          if (err) {
            reject('file deleted error');
            return console.error(err);
          }

          fs.unlink(filepath, (err) => {
            if (err) {
              reject('file deleted error');
              return console.log(err);
            }
            console.log('file deleted successfully');
            resolve('file deleted successfully');
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static async paginator(items, currentPage, perPageItems) {
    const page = currentPage || 1;
    const perPage = perPageItems || 4;
    const offset = (page - 1) * perPage;

    const paginatedItems = items.slice(offset).slice(0, perPageItems);
    const totalPages = Math.ceil(items.length / perPage);

    return {
      page,
      per_page: perPage,
      pre_page: page - 1 ? page - 1 : null,
      next_page: (totalPages > page) ? page + 1 : null,
      total: items.length,
      total_pages: totalPages,
      data: paginatedItems,
      totalDocs: items.length,
    };
  }

  static printCertificatTrainingImprint(datas, idQuiz, idUsager) {
    try {
      const html = mustache.render(template, datas);
      let document = {
        html: html,
        data: {
          user: datas,
        },
        path: "./public/certificats/formation/"+idQuiz+"_"+idUsager+".pdf",
        type: "",
      };
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

  static generateQrCode(datas, idUsager, idQuiz) {
    QRCode.toFile('./public/qrcode/'+idQuiz+'_'+idUsager+'.png', JSON.stringify(datas), {
      errorCorrectionLevel: 'H',
      width: 150,
      height: 150
    }, function(err) {
      if (err) throw err;
      console.log('QR code saved!');
    });
  }
};
