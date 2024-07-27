// Controllers Imports
import waControllers from "../controllers/waControllers.js";
import express from "express";
const router = express.Router();

router
    .get("/", waControllers.verifyToken)
    .post("/", waControllers.recivedMessage);


export default router;