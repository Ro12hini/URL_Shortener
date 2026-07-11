const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { testConnection } = require("./config/db");
const urlRoutes = require("./routes/urlRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", urlRoutes);

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  await testConnection();
});
