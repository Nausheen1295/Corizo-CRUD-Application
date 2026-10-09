
const API_URL = "/api/students";

const form = document.getElementById("studentForm");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const table = document.getElementById("studentTable");
const searchInput = document.getElementById("searchInput");
const studentCount = document.getElementById("studentCount");
const alertBox = document.getElementById("alertBox");

let editingId = null;
let searchTimer;

function showAlert(message, type = "success") {
  alertBox.textContent = message;
  alertBox.className = `alert alert-${type}`;
}

function hideAlert() {
  alertBox.textContent = "";
  alertBox.className = "alert d-none";
}

function resetForm() {
  form.reset();
  editingId = null;
  formTitle.textContent = "Add New Student";
  submitBtn.textContent = "Add Student";
  cancelBtn.classList.add("d-none");
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

async function loadStudents(search = "") {
  table.innerHTML = `
    <tr><td colspan="4" class="text-center py-4">Loading...</td></tr>
  `;

  try {
    const url = search
      ? `${API_URL}?search=${encodeURIComponent(search)}`
      : API_URL;

    const students = await request(url);
    studentCount.textContent = students.length;

    if (students.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="4" class="text-center text-secondary empty-state">
            No students found. Add your first student using the form.
          </td>
        </tr>
      `;
      return;
    }

    table.replaceChildren();

    students.forEach((student) => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      const name = document.createElement("strong");
      name.textContent = student.name;
      nameCell.appendChild(name);

      const contactCell = document.createElement("td");
      const email = document.createElement("div");
      email.textContent = student.email;
      const phone = document.createElement("small");
      phone.className = "text-secondary";
      phone.textContent = student.phone;
      contactCell.append(email, phone);

      const courseCell = document.createElement("td");
      courseCell.textContent = student.course;

      const actionsCell = document.createElement("td");
      const actions = document.createElement("div");
      actions.className = "action-buttons";

      const editButton = document.createElement("button");
      editButton.className = "btn btn-sm btn-outline-primary";
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => editStudent(student));

      const deleteButton = document.createElement("button");
      deleteButton.className = "btn btn-sm btn-outline-danger";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteStudent(student._id));

      actions.append(editButton, deleteButton);
      actionsCell.appendChild(actions);
      row.append(nameCell, contactCell, courseCell, actionsCell);
      table.appendChild(row);
    });
  } catch (error) {
    studentCount.textContent = "—";
    table.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-danger py-4">
          Could not load students. Check your server and try refreshing.
        </td>
      </tr>
    `;
    showAlert(error.message, "danger");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideAlert();

  const student = {
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
    phone: form.elements.phone.value.trim(),
    course: form.elements.course.value.trim()
  };

  if (Object.values(student).some((value) => !value)) {
    showAlert("Please complete every field.", "warning");
    return;
  }

  submitBtn.disabled = true;

  try {
    const isEditing = Boolean(editingId);
    const url = isEditing ? `${API_URL}/${editingId}` : API_URL;

    const result = await request(url, {
      method: isEditing ? "PUT" : "POST",
      body: JSON.stringify(student)
    });

    showAlert(result.message);
    resetForm();
    searchInput.value = "";
    await loadStudents();
  } catch (error) {
    showAlert(error.message, "danger");
  } finally {
    submitBtn.disabled = false;
  }
});

function editStudent(student) {
  editingId = student._id;
  form.elements.name.value = student.name;
  form.elements.email.value = student.email;
  form.elements.phone.value = student.phone;
  form.elements.course.value = student.course;

  formTitle.textContent = "Update Student";
  submitBtn.textContent = "Save Changes";
  cancelBtn.classList.remove("d-none");

  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function deleteStudent(id) {
  if (!confirm("Are you sure you want to delete this student?")) {
    return;
  }

  hideAlert();

  try {
    const result = await request(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (editingId === id) {
      resetForm();
    }

    showAlert(result.message);
    await loadStudents(searchInput.value.trim());
  } catch (error) {
    showAlert(error.message, "danger");
  }
}

cancelBtn.addEventListener("click", resetForm);
document.getElementById("refreshBtn").addEventListener("click", () => {
  hideAlert();
  loadStudents(searchInput.value.trim());
});

searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    loadStudents(searchInput.value.trim());
  }, 250);
});

loadStudents();
