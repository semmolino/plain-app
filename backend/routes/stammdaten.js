const express = require("express");

module.exports = (supabase) => {
  const router = express.Router();

  // Save PROJECT_STATUS
  router.post("/status", async (req, res) => {
    const name_short = req.body.name_short;

    if (!name_short || typeof name_short !== "string") {
      return res.status(400).json({ error: "name_short is required" });
    }

    const { data, error } = await supabase
      .from("PROJECT_STATUS")
      .insert([{ "NAME_SHORT": name_short }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ data });
  });

  // Save PROJECT_TYPE
  router.post("/typ", async (req, res) => {
    const name_short = req.body.name_short;

    if (!name_short || typeof name_short !== "string") {
      return res.status(400).json({ error: "name_short is required" });
    }

    const { data, error } = await supabase
      .from("PROJECT_TYPE")
      .insert([{ "NAME_SHORT": name_short }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ data });
  });

  return router;
};
