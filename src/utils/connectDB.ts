import mongoose from "mongoose";
import CONFIG from "../config/environment";

mongoose.connect(`${CONFIG.db}`);