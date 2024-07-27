import express from "express";
import dotenv from "dotenv";

// import routes from "./routes/routes";
import router from "./routes/routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.use("/whatsapp", router);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});