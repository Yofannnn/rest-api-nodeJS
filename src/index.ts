import express, { Application, Request, Response, NextFunction } from "express";
import { routes } from "./routes/index.route";
import bodyParser from "body-parser";
import cors from "cors";
import "./utils/connectDB";
import deserializedToken from "./middleware/deserializedToken";
import * as path from 'path'

const app: Application = express();
const port: Number = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Method", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.use(deserializedToken);

routes(app);

app.use(
  "/products/img-products",
  express.static(path.join(__dirname, "../public/img-products"))
);

app.listen(port, () => console.log(`port is listening at ${port}`));

module.exports = app
