require("dotenv").config();
const express = require("express");
const cors = require("cors");



const enrollmentRoutes = require("./.gitignore/routes/enrollment");
const adminRoutes = require("./.gitignore/routes/admin");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/enroll", enrollmentRoutes);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});