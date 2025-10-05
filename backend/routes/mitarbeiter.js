const express = require("express");

module.exports = (supabase) => {
  const router = express.Router();

  // GET /api/mitarbeiter — list employees (with gender name)
  router.get("/", async (req, res) => {
    // Join GENDER to get the gender name (if your schema supports foreign key join)
    const { data, error } = await supabase
      .from("EMPLOYEE")
      .select(`
        ID,
        SHORT_NAME,
        TITLE,
        FIRST_NAME,
        LAST_NAME,
        EMAIL,
        MOBILE,
        PERSONNEL_NUMBER,
        GENDER_ID,
        GENDER: GENDER (GENDER)  -- Supabase foreign key join
      `);
    if (error) {
      console.error("Error fetching employees:", error.message);
      return res.status(500).json({ error: error.message });
    }
    res.json({ data });
  });

  // PUT /api/mitarbeiter/:id — update an employee
  router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    // You may want to enforce required fields if needed
    if (!body.SHORT_NAME || !body.FIRST_NAME || !body.LAST_NAME || !body.GENDER_ID) {
      return res.status(400).json({ error: "Pflichtfelder fehlen" });
    }

    // Build the update object
    const updateObj = {
      "SHORT_NAME": body.SHORT_NAME,
      "TITLE": body.TITLE,
      "FIRST_NAME": body.FIRST_NAME,
      "LAST_NAME": body.LAST_NAME,
      "PASSWORD": body.PASSWORD,
      "EMAIL": body.EMAIL,
      "MOBILE": body.MOBILE,
      "PERSONNEL_NUMBER": body.PERSONNEL_NUMBER,
      "GENDER_ID": body.GENDER_ID
    };

    const { data, error } = await supabase
      .from("EMPLOYEE")
      .update(updateObj)
      .eq("ID", id);

    if (error) {
      console.error("Error updating employee:", error.message);
      return res.status(500).json({ error: error.message });
    }
    res.json({ data });
  });

  // DELETE /api/mitarbeiter/:id — delete an employee
  router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const { data, error } = await supabase
      .from("EMPLOYEE")
      .delete()
      .eq("ID", id);

    if (error) {
      console.error("Error deleting employee:", error.message);
      return res.status(500).json({ error: error.message });
    }
    res.json({ data });
  });

  // (Existing GET /genders and POST / will remain)
  router.get("/genders", async (req, res) => {
    const { data, error } = await supabase
      .from("GENDER")
      .select("ID, GENDER");
    if (error) {
      console.error("Error loading GENDER:", error.message);
      return res.status(500).json({ error: error.message });
    }
    res.json({ data });
  });

  router.post("/", async (req, res) => {
    const b = req.body;
    if (!b.short_name || !b.first_name || !b.last_name || !b.gender_id) {
      return res.status(400).json({ error: "Pflichtfelder fehlen" });
    }
    const { data, error } = await supabase
      .from("EMPLOYEE")
      .insert([{
        "SHORT_NAME": b.short_name,
        "TITLE": b.title,
        "FIRST_NAME": b.first_name,
        "LAST_NAME": b.last_name,
        "PASSWORD": b.password,
        "EMAIL": b.email,
        "MOBILE": b.mobile,
        "PERSONNEL_NUMBER": b.personnel_number,
        "GENDER_ID": b.gender_id
      }]);
    if (error) {
      console.error("Error inserting EMPLOYEE:", error.message);
      return res.status(500).json({ error: error.message });
    }
    res.json({ data });
  });

  return router;
};
