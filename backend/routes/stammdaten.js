const express = require("express");

module.exports = (supabase) => {
  const router = express.Router();

  // Save PROJECT_STATUS
  router.post("/status", async (req, res) => {
    const NAME_SHORT = req.body.NAME_SHORT;

    if (!NAME_SHORT || typeof NAME_SHORT !== "string") {
      return res.status(400).json({ error: "NAME_SHORT is required" });
    }

    const { data, error } = await supabase
      .from("PROJECT_STATUS")
      .insert([{ "NAME_SHORT": NAME_SHORT }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ data });
  });

  // Save PROJECT_TYPE
  router.post("/typ", async (req, res) => {
    const NAME_SHORT = req.body.NAME_SHORT;

    if (!NAME_SHORT || typeof NAME_SHORT !== "string") {
      return res.status(400).json({ error: "NAME_SHORT is required" });
    }

    const { data, error } = await supabase
      .from("PROJECT_TYPE")
      .insert([{ "NAME_SHORT": NAME_SHORT }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ data });
  });

  return router;
};
