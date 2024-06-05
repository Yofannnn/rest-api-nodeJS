import { Request, Response } from "express";
import {
  getProductByID,
  getProductsFromDB,
  updateProductByID,
  deleteProductByID,
} from "../services/products.service";
import {
  createProductsValidation,
  updateProductValidation,
} from "../validation/product.validation";
import { newProduct } from "../services/products.service";
import { v4 as uuidv4 } from "uuid";

export const getProducts = async (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;

  if (id) {
    try {
      const dataByID = await getProductByID(id);
      return res
        .status(200)
        .send({ status: true, statusCode: 200, data: dataByID });
    } catch (err: any) {
      return res
        .status(404)
        .send({ status: false, statusCode: 404, message: err.message });
    }
  }
  try {
    const dataAllProducts = await getProductsFromDB();
    return res
      .status(200)
      .send({ status: true, statusCode: 200, data: dataAllProducts });
  } catch (err: any) {
    return res
      .status(404)
      .send({ status: false, statusCode: 404, message: err.message });
  }
};

export const createNewProduct = async (req: Request, res: Response) => {
  req.body.product_id = uuidv4();
  const { error, value } = createProductsValidation(req.body);
  if (error) {
    return res.status(422).send({
      status: false,
      statusCode: 422,
      message: error.details[0].message,
    });
  }
  try {
    await newProduct(value);
    return res.status(201).send({
      status: true,
      statusCode: 201,
      message: "Success to create new Product",
    });
  } catch (err: any) {
    return res.status(403).send({
      status: false,
      statusCode: 403,
      message: err.message,
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;
  const { error, value } = updateProductValidation(req.body);
  if (error) {
    return res.status(422).send({
      status: false,
      statusCode: 422,
      message: error.details[0].message,
    });
  }
  try {
    const result = await updateProductByID(id, value);
    if (!result) {
      throw new Error("Product not found");
    }
    return res.status(201).send({
      status: true,
      statusCode: 201,
      message: "Success to update data product",
    });
  } catch (err: any) {
    return res.status(422).send({
      status: false,
      statusCode: 422,
      message: err.message,
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;
  try {
    const result = await deleteProductByID(id);
    if (!result) {
      throw new Error("Product not found");
    }
    return res.status(201).send({
      status: true,
      statusCode: 201,
      message: `Product with id:${id} success to delete`,
    });
  } catch (err: any) {
    return res.status(404).send({
      status: false,
      statusCode: 404,
      message: err.message,
    });
  }
};
