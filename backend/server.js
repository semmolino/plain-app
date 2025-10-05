require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const supabase = require("./supabaseClient");

// 🧠 Import and use all routes:
const stammdatenRoutes = require("./routes/stammdaten")(supabase);
const mitarbeiterRoutes = require("./routes/mitarbeiter")(supabase);
const projekteRoutes = require("./routes/projekte")(supabase);

app.use("/api/stammdaten", stammdatenRoutes);
app.use("/api/mitarbeiter", mitarbeiterRoutes);
app.use("/api/projekte", projekteRoutes);

app.get("/", (req, res) => {
  res.send("Backend läuft ✅");
});

app.listen(port, () => {
  console.log(`✅ Backend läuft auf http://localhost:${port}`);
});


app.get("/test/genders", async (req, res) => {
  const { data, error } = await supabase
    .from("GENDER")
    .select("ID, GENDER");

  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});

