import "dotenv/config";

const CONFIG = {
  db: process.env.DB,
  jwt_private: process.env.RSA_PRIVATE_KEY || "",
  jwt_public: process.env.RSA_PUBLIC_KEY || "",
};

export default CONFIG;
