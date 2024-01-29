const admin = require("firebase-admin");
require("dotenv").config();

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
  }),
  storageBucket: process.env.STORAGE_BUCKET, // Your Firebase Storage bucket
});

const bucket = admin.storage().bucket();
const uploadMedia = async (media) => {
  try {
    // Check if media is an array with at least one item
    if (!Array.isArray(media) || media.length === 0) {
      throw new Error("Media array is empty or not provided.");
    }

    // Check the structure of the first media object
    const firstMedia = media[0];
    if (
      !firstMedia.originalname ||
      !firstMedia.buffer ||
      !firstMedia.mimetype
    ) {
      throw new Error("Invalid media object structure.");
    }

    const mediaName = firstMedia.originalname;
    const uniqueFileName = `${Date.now()}_${mediaName}`;
    const file = bucket.file(uniqueFileName);

    await file.save(firstMedia.buffer, {
      metadata: {
        contentType: firstMedia.mimetype,
      },
      public: true,
    });

    const url = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
    return url;
  } catch (error) {
    console.error("Error uploading media:", error.message);
    throw error;
  }
};

module.exports = uploadMedia;
