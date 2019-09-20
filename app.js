const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || "3000";
// Middlewares
app.use(cors());
app.use(express.json());

// Imported ROUTES
app.use("/api/blog", require("./routes/blog"));
app.use("/api/user", require("./routes/user"));

// ROUTES
app.get("/api/", (req, res) => {
  res.json({
    message: "api's are working"
  });
});

// DB Connection
mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("connected to database...!");
  })
  .catch(err => {
    console.log("connection failed " + err);
  });
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

// Listening port
app.listen(port, () => {
  console.log("server is listening at port: " + port);
});
