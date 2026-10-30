const ImageKit = require("@imagekit/nodejs");

let client;

const getImageKitClient = () => {
    if (!client) {
        client = new ImageKit({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY
        });
    }

    return client;
};

module.exports = getImageKitClient;