import express, { Application } from "express";
import { routes } from "./routes/index.route";
import bodyParser from "body-parser";
import cors from "cors";
import "./utils/connectDB";
import deserializedToken from "./middleware/deserializedToken";
import * as path from "path";
import cookieParser from "cookie-parser";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const app: Application = express();
const port: Number = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const corsOptions = {
  origin: process.env.ORIGIN_DOMAIN,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization,",
};
app.use(cors(corsOptions));

app.use(cookieParser());

app.use(deserializedToken);

routes(app);

app.use(
  "/products/img-products",
  express.static(path.join(__dirname, "../public/img-products"))
);

app.listen(port, () => console.log(`port is listening at ${port}`));

module.exports = app;
