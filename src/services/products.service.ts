import productsModel from "../models/products.model";
import { productsType } from "../types/products.types";

export const getProductsFromDB = async () => {
  return await productsModel.find();
};

export const getProductByID = async (id: String) => {
  return await productsModel.findOne({ product_id: id });
};

export const newProduct = async (payload: productsType) => {
  return await productsModel.create(payload);
};

export const updateProductByID = async (id: String, payload: productsType) => {
  return await productsModel.findOneAndUpdate(
    { product_id: id },
    { $set: payload },
    { new: true }
  );
};

export const deleteProductByID = async (id: String) => {
  return await productsModel.findOneAndDelete({ product_id: id });
};
