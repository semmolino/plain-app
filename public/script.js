const API_BASE = "https://plain-app.onrender.com/api";

// Utility to show/hide views
function showView(viewId) {
  document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));
  document.getElementById(viewId)?.classList.remove("hidden");
}

// Nav
document.getElementById("btn-stammdaten").addEventListener("click", () => {
  showView("view-stammdaten");
});
document.getElementById("btn-mitarbeiter").addEventListener("click", () => {
  loadGeschlechter();
  showView("view-mitarbeiter");
});
document.getElementById("btn-projekte").addEventListener("click", () => {
  loadProjektDropdowns();
  showView("view-projekte");
});
document.querySelectorAll(".btn-back").forEach(btn => {
  btn.addEventListener("click", () => showView("main-menu"));
});

// --- STAMMDATEN ---
document.getElementById("btn-save-status").addEventListener("click", async () => {
  const name = document.getElementById("input-status").value.trim();
  const msg = document.getElementById("msg-stammdaten");
  if (!name) return showMessage(msg, "Bitte Name eingeben", "error");

  try {
    const res = await fetch(`${API_BASE}/stammdaten/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name_short: name })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    showMessage(msg, "Status gespeichert ✅", "success");
    document.getElementById("input-status").value = "";
  } catch (err) {
    showMessage(msg, "Fehler: " + err.message, "error");
  }
});

document.getElementById("btn-save-typ").addEventListener("click", async () => {
  const name = document.getElementById("input-typ").value.trim();
  const msg = document.getElementById("msg-stammdaten");
  if (!name) return showMessage(msg, "Bitte Name eingeben", "error");

  try {
    const res = await fetch(`${API_BASE}/stammdaten/typ`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name_short: name })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    showMessage(msg, "Typ gespeichert ✅", "success");
    document.getElementById("input-typ").value = "";
  } catch (err) {
    showMessage(msg, "Fehler: " + err.message, "error");
  }
});

// --- MITARBEITER ---
async function loadGeschlechter() {
  const sel = document.getElementById("select-geschlecht");
  sel.innerHTML = `<option value="">Bitte wählen …</option>`;
  try {
    const res = await fetch(`${API_BASE}/mitarbeiter/genders`);
    const json = await res.json();
    json.data.forEach(g => {
      const opt = document.createElement("option");
      opt.value = g.ID;
      opt.textContent = g.GENDER;
      sel.appendChild(opt);
    });
  } catch (err) {
    console.error("Fehler beim Laden der Geschlechter", err);
  }
}

document.getElementById("btn-save-mitarbeiter").addEventListener("click", async () => {
  const msg = document.getElementById("msg-mitarbeiter");

  const payload = {
    short_name: document.getElementById("input-username").value.trim(),
    title: document.getElementById("input-titel").value.trim(),
    first_name: document.getElementById("input-vorname").value.trim(),
    last_name: document.getElementById("input-nachname").value.trim(),
    password: document.getElementById("input-passwort").value,
    email: document.getElementById("input-email").value.trim(),
    mobile: document.getElementById("input-mobil").value.trim(),
    personnel_number: document.getElementById("input-personalnummer").value.trim(),
    gender_id: document.getElementById("select-geschlecht").value
  };

  if (!payload.short_name || !payload.first_name || !payload.last_name || !payload.gender_id) {
    return showMessage(msg, "Bitte alle Pflichtfelder ausfüllen", "error");
  }

  try {
    const res = await fetch(`${API_BASE}/mitarbeiter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    showMessage(msg, "Mitarbeiter gespeichert ✅", "success");

    ["input-username", "input-titel", "input-vorname", "input-nachname",
     "input-passwort", "input-email", "input-mobil", "input-personalnummer"]
      .forEach(id => document.getElementById(id).value = "");
    document.getElementById("select-geschlecht").value = "";
  } catch (err) {
    showMessage(msg, "Fehler: " + err.message, "error");
  }
});

async function loadMitarbeiterList() {
  const tblBody = document.querySelector("#tbl-mitarbeiter tbody");
  tblBody.innerHTML = "";
  const msg = document.getElementById("msg-mitarbeiter-liste");

  try {
    const res = await fetch(`${API_BASE}/mitarbeiter`);
    if (!res.ok) {
      console.error("Fehler beim Laden Mitarbeiter:", res.status, await res.text());
      showMessage(msg, "Fehler beim Laden Mitarbeiter", "error");
      return;
    }
    const json = await res.json();
    if (!json.data) {
      console.error("Kein Datenfeld:", json);
      showMessage(msg, "Keine Daten erhalten", "error");
      return;
    }
    json.data.forEach(emp => {
      const tr = document.createElement("tr");

      // Short name
      const tdShort = document.createElement("td");
      const inpShort = document.createElement("input");
      inpShort.value = emp.SHORT_NAME || "";
      tdShort.appendChild(inpShort);
      tr.appendChild(tdShort);

      // Titel (salutation) will be edited in form mode
      const tdTitle = document.createElement("td");
      tdTitle.textContent = emp.TITLE || "";
      tr.appendChild(tdTitle);

      // First name
      const tdVor = document.createElement("td");
      const inpVor = document.createElement("input");
      inpVor.value = emp.FIRST_NAME || "";
      tdVor.appendChild(inpVor);
      tr.appendChild(tdVor);

      // Last name
      const tdNach = document.createElement("td");
      const inpNach = document.createElement("input");
      inpNach.value = emp.LAST_NAME || "";
      tdNach.appendChild(inpNach);
      tr.appendChild(tdNach);

      // Email
      const tdEmail = document.createElement("td");
      const inpEmail = document.createElement("input");
      inpEmail.value = emp.EMAIL || "";
      tdEmail.appendChild(inpEmail);
      tr.appendChild(tdEmail);

      // Mobile
      const tdMobil = document.createElement("td");
      const inpMobil = document.createElement("input");
      inpMobil.value = emp.MOBILE || "";
      tdMobil.appendChild(inpMobil);
      tr.appendChild(tdMobil);

      // Personnel Number
      const tdPers = document.createElement("td");
      const inpPers = document.createElement("input");
      inpPers.value = emp.PERSONNEL_NUMBER || "";
      tdPers.appendChild(inpPers);
      tr.appendChild(tdPers);

      // Gender (display name)
      const tdGender = document.createElement("td");
      tdGender.textContent = emp.GENDER?.GENDER || "";  
      tr.appendChild(tdGender);

      // Actions
      const tdAct = document.createElement("td");
      const btnEdit = document.createElement("button");
      btnEdit.textContent = "Edit";
      btnEdit.addEventListener("click", () => openEditEmployee(emp, tr));
      const btnDel = document.createElement("button");
      btnDel.textContent = "Delete";
      btnDel.addEventListener("click", () => deleteEmployee(emp.ID));
      tdAct.appendChild(btnEdit);
      tdAct.appendChild(btnDel);
      tr.appendChild(tdAct);

      tblBody.appendChild(tr);
    });
  } catch (err) {
    console.error("Exception beim Laden Mitarbeiter:", err);
    showMessage(msg, "Fehler beim Laden Mitarbeiter", "error");
  }
}

function openEditEmployee(emp, tableRow) {
  // Replace the TITLE and GENDER cells with form controls
  const cells = tableRow.children;

  // TITLE cell is at index 1
  const tdTitle = cells[1];
  const selectTitle = document.createElement("input");
  selectTitle.value = emp.TITLE || "";
  tdTitle.textContent = "";
  tdTitle.appendChild(selectTitle);

  // GENDER cell is at index 7
  const tdGender = cells[7];
  const sel = document.createElement("select");
  // load genders for the select
  fetch(`${API_BASE}/mitarbeiter/genders`)
    .then(r => r.json())
    .then(j => {
      j.data.forEach(g => {
        const opt = document.createElement("option");
        opt.value = g.ID;
        opt.textContent = g.GENDER;
        if (g.ID === emp.GENDER_ID) opt.selected = true;
        sel.appendChild(opt);
      });
    })
    .catch(e => console.error("Fehler beim Laden Genders:", e));
  tdGender.textContent = "";
  tdGender.appendChild(sel);

  // Replace Edit button with Save button in actions
  const tdAct = cells[cells.length - 1];
  tdAct.innerHTML = ""; // clear
  const btnSave = document.createElement("button");
  btnSave.textContent = "Save";
  btnSave.addEventListener("click", () => {
    saveEmployeeEdits(emp.ID, tableRow);
  });
  tdAct.appendChild(btnSave);
}

async function saveEmployeeEdits(empId, tableRow) {
  const msg = document.getElementById("msg-mitarbeiter-liste");
  // Collect values from row inputs/select
  const cells = tableRow.children;
  const updated = {
    SHORT_NAME: cells[0].querySelector("input").value.trim(),
    TITLE: cells[1].querySelector("input").value.trim(),
    FIRST_NAME: cells[2].querySelector("input").value.trim(),
    LAST_NAME: cells[3].querySelector("input").value.trim(),
    EMAIL: cells[4].querySelector("input").value.trim(),
    MOBILE: cells[5].querySelector("input").value.trim(),
    PERSONNEL_NUMBER: cells[6].querySelector("input").value.trim(),
    GENDER_ID: cells[7].querySelector("select").value
  };

  // Validate required
  if (!updated.SHORT_NAME || !updated.FIRST_NAME || !updated.LAST_NAME || !updated.GENDER_ID) {
    showMessage(msg, "Bitte alle Pflichtfelder ausfüllen", "error");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/mitarbeiter/${empId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });
    const j = await res.json();
    if (!res.ok) throw new Error(j.error);
    showMessage(msg, "Mitarbeiter aktualisiert ✅", "success");
    // reload list
    loadMitarbeiterList();
  } catch (err) {
    console.error("Fehler bei Update:", err);
    showMessage(msg, "Fehler: " + err.message, "error");
  }
}

async function deleteEmployee(empId) {
  const msg = document.getElementById("msg-mitarbeiter-liste");
  if (!confirm("Wirklich löschen?")) return;
  try {
    const res = await fetch(`${API_BASE}/mitarbeiter/${empId}`, {
      method: "DELETE"
    });
    const j = await res.json();
    if (!res.ok) throw new Error(j.error);
    showMessage(msg, "Mitarbeiter gelöscht ✅", "success");
    loadMitarbeiterList();
  } catch (err) {
    console.error("Fehler bei Löschen:", err);
    showMessage(msg, "Fehler: " + err.message, "error");
  }
}

// --- PROJEKTE ---
async function loadProjektDropdowns() {
  await Promise.all([
    loadDropdown("projektstatus", "projekte/statuses", "ID", "NAME_SHORT"),
    loadDropdown("projekttyp", "projekte/types", "ID", "NAME_SHORT"),
    loadDropdown("projektleiter", "projekte/managers", "ID", "SHORT_NAME")
  ]);
}

async function loadDropdown(fieldSuffix, endpoint, valField, labelField) {
  const sel = document.getElementById(`select-${fieldSuffix}`);
  sel.innerHTML = `<option value="">Bitte wählen …</option>`;
  try {
    const res = await fetch(`${API_BASE}/${endpoint}`);
    const json = await res.json();
    json.data.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item[valField];
      opt.textContent = item[labelField];
      sel.appendChild(opt);
    });
  } catch (err) {
    console.error(`Fehler bei ${fieldSuffix}`, err);
  }
}

document.getElementById("btn-save-projekt").addEventListener("click", async () => {
  const msg = document.getElementById("msg-projekt");
  const payload = {
    name_short: document.getElementById("input-projektnr").value.trim(),
    name_long: document.getElementById("input-projektname").value.trim(),
    project_status_id: document.getElementById("select-projektstatus").value,
    project_type_id: document.getElementById("select-projekttyp").value,
    project_manager_id: document.getElementById("select-projektleiter").value,
    revenue: parseFloat(document.getElementById("input-honorar").value) || 0,
    extras: parseFloat(document.getElementById("input-nebenkosten").value) || 0,
    revenue_completion_percent: parseFloat(document.getElementById("input-percent-honorar").value) || 0,
    extras_completion_percent: parseFloat(document.getElementById("input-percent-nebenkosten").value) || 0
  };

  if (!payload.name_short || !payload.name_long || !payload.project_status_id ||
      !payload.project_type_id || !payload.project_manager_id) {
    return showMessage(msg, "Bitte alle Pflichtfelder ausfüllen", "error");
  }

  try {
    const res = await fetch(`${API_BASE}/projekte`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    showMessage(msg, "Projekt gespeichert ✅", "success");

    ["input-projektnr", "input-projektname", "input-honorar", "input-nebenkosten",
     "input-percent-honorar", "input-percent-nebenkosten"]
      .forEach(id => document.getElementById(id).value = "");
    ["select-projektstatus", "select-projekttyp", "select-projektleiter"]
      .forEach(id => document.getElementById(id).value = "");
  } catch (err) {
    showMessage(msg, "Fehler: " + err.message, "error");
  }
});

// Show messages
function showMessage(el, text, type) {
  el.textContent = text;
  el.className = `message ${type}`;
  el.style.display = "block";
  setTimeout(() => (el.style.display = "none"), 4000);
}

document.addEventListener("DOMContentLoaded", () => {
  showView("main-menu");
 
});

document.getElementById("btn-open-mitarbeiter-liste").addEventListener("click", () => {
  showView("view-mitarbeiter-liste");
  loadMitarbeiterList();
});
