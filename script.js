// -------------------- Data Storage --------------------
let students = JSON.parse(localStorage.getItem("students")) || [];
let laundryData = JSON.parse(localStorage.getItem("laundryData")) || [];

// -------------------- Student Registration --------------------
function registerStudent() {
  const user = document.getElementById("regUser").value;
  const pass = document.getElementById("regPass").value;
  const room = document.getElementById("regRoom").value;

  if (!user || !pass || !room) {
    alert("Please fill all fields!");
    return;
  }

  if (students.find(s => s.user === user)) {
    alert("Username already taken!");
    return;
  }

  students.push({ user, pass, room });
  localStorage.setItem("students", JSON.stringify(students));
  alert("Registration successful!");
  window.location.href = "student-login.html";
}

// -------------------- Student Login --------------------
function studentLogin() {
  const user = document.getElementById("studentUser").value;
  const pass = document.getElementById("studentPass").value;

  const student = students.find(s => s.user === user && s.pass === pass);

  if (student) {
    localStorage.setItem("currentStudent", JSON.stringify(student));
    window.location.href = "student.html";
  } else {
    alert("Invalid student login!");
  }
}

// -------------------- Student Dashboard: Check Status --------------------
function checkLaundryStatus() {
  const token = document.getElementById("studentToken").value;
  const statusDiv = document.getElementById("studentStatus");

  const record = laundryData.find(r => r.token == token);

  if (record) {
    let shelfInfo = "";
    if (record.status === "Completed") {
      shelfInfo = `<p><strong>Shelf #:</strong> ${record.shelf}</p>`;
      alert(`✅ Your laundry is ready! Collect from Shelf #${record.shelf}.`);
    } else {
      shelfInfo = `<p><strong>🕒 Shelf assignment pending...</strong></p>`;
    }

    statusDiv.innerHTML = `
      <p><strong>Token #:</strong> ${record.token}</p>
      <p><strong>Status:</strong> ${record.status}</p>
      ${shelfInfo}
    `;
  } else {
    statusDiv.innerHTML = "<p>No record found for this token.</p>";
  }
}


// -------------------- Admin Login --------------------
function adminLogin() {
  const user = document.getElementById("adminUser").value;
  const pass = document.getElementById("adminPass").value;

  if (user === "admin" && pass === "Laundry@2026") {
    window.location.href = "admin.html";
  } else {
    alert("Invalid admin login!");
  }
}

// -------------------- Admin Dashboard: Update Record --------------------
function updateLaundryRecord() {
  const token = document.getElementById("adminToken").value;
  const shelf = document.getElementById("shelfNumber").value;
  const status = document.getElementById("statusSelect").value;

  if (!token) {
    alert("Enter token number!");
    return;
  }

  let record = laundryData.find(r => r.token == token);
  if (record) {
    record.shelf = shelf;
    record.status = status;
  } else {
    record = { token, shelf, status };
    laundryData.push(record);
  }

  localStorage.setItem("laundryData", JSON.stringify(laundryData));
  displayRecords();
  alert(`✅ Record saved! Token #: ${token}`);
}

// -------------------- Display Records in Admin Dashboard --------------------
function displayRecords() {
  const list = document.getElementById("recordList");
  if (!list) return;
  list.innerHTML = "";

  laundryData.forEach(record => {
    const card = document.createElement("div");
    card.className = "record-card";

    let shelfInfo = "";
    if (record.status === "Completed") {
      shelfInfo = `<p><strong>Shelf #:</strong> ${record.shelf}</p>`;
    } else {
      shelfInfo = `<p><strong>🕒 Shelf assignment pending...</strong></p>`;
    }

    card.innerHTML = `
      <p><strong>Token #:</strong> ${record.token}</p>
      <p><strong>Status:</strong> ${record.status}</p>
      ${shelfInfo}
    `;
    list.appendChild(card);
  });
}


// -------------------- Auto-load on page --------------------
document.addEventListener("DOMContentLoaded", () => {
  displayRecords();
});
