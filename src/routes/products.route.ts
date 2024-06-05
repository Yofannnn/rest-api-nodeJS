import { Router } from "express";
import {
  getProducts,
  createNewProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller";
import { requireAdmin } from "../middleware/auth";

export const ProductsRouter: Router = Router();

ProductsRouter.get("/", getProducts);
ProductsRouter.get("/:id", getProducts);
ProductsRouter.post("/", requireAdmin, createNewProduct);
ProductsRouter.put("/:id", requireAdmin, updateProduct);
ProductsRouter.delete("/:id", requireAdmin, deleteProduct);
