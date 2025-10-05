const express = require("express");

module.exports = (supabase) => {
  const router = express.Router();

  router.get("/statuses", async (req, res) => {
    const { data, error } = await supabase
      .from("PROJECT_STATUS")
      .select("ID, NAME_SHORT");
    if (error) return res.status(500).json({ error: error.message });
    res.json({ data });
  });

  router.get("/types", async (req, res) => {
    const { data, error } = await supabase
      .from("PROJECT_TYPE")
      .select("ID, NAME_SHORT");
    if (error) return res.status(500).json({ error: error.message });
    res.json({ data });
  });

  router.get("/managers", async (req, res) => {
    const { data, error } = await supabase
      .from("EMPLOYEE")
      .select("ID, SHORT_NAME"); // uppercase names
    if (error) return res.status(500).json({ error: error.message });
    res.json({ data });
  });

  router.post("/", async (req, res) => {
    const b = req.body;
    if (!b.name_short || !b.name_long || !b.project_status_id || !b.project_type_id || !b.project_manager_id) {
      return res.status(400).json({ error: "Pflichtfelder fehlen" });
    }

    const { data, error } = await supabase
      .from("PROJECT")
      .insert([{
        "NAME_SHORT": b.name_short,
        "NAME_LONG": b.name_long,
        "PROJECT_STATUS_ID": b.project_status_id,
        "PROJECT_TYPE_ID": b.project_type_id,
        "PROJECT_MANAGER_ID": b.project_manager_id,
        "REVENUE": b.revenue,
        "EXTRAS": b.extras,
        "REVENUE_COMPLETION_PERCENT": b.revenue_completion_percent,
        "EXTRAS_COMPLETION_PERCENT": b.extras_completion_percent
      }]);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ data });
  });

  return router;
};
