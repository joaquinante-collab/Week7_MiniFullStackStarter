const form = document.getElementById("userForm");
const userList = document.getElementById("userList");
const msg = document.getElementById("msg");

async function loadUsers() {
  const res = await fetch("/api/users");
  const users = await res.json();
  userList.innerHTML = users.map(u => `
    <div class="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <strong>${u.name}</strong><br>
        <small>${u.email}${u.age ? ` • Age ${u.age}` : ""}</small>
      </div>
      <button class="btn btn-sm btn-outline-danger" data-id="${u._id}">Delete</button>
    </div>
  `).join("");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    msg.innerHTML = `<div class="alert alert-success py-1">User added!</div>`;
    form.reset();
    loadUsers();
  } else {
    const err = await res.json();
    msg.innerHTML = `<div class="alert alert-danger py-1">Error: ${err.error}</div>`;
  }
});

userList.addEventListener("click", async (e) => {
  if (e.target.matches("button[data-id]")) {
    const id = e.target.getAttribute("data-id");
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });

    if (res.ok) {
      msg.innerHTML = `<div class="alert alert-warning py-1">User deleted</div>`;
      loadUsers();
    }
  }
});

loadUsers();