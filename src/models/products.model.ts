import mongoose from "mongoose";

const productsSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      unique: true,
    },
    category: {
      type: String,
    },
    title: {
      type: String,
    },
    type: {
      type: String,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    recommendation: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const productsModel = mongoose.model("products", productsSchema);

export default productsModel;
