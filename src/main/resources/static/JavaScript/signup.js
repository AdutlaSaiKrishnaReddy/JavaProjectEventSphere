const form = document.getElementById("signupForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = {
    name: document.getElementById("signupName").value,
    email: document.getElementById("signupEmail").value,
    password: document.getElementById("signupPassword").value,
    role: document.getElementById("role").value
  };

  try {
    const res = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    alert("Signup successful! Please login.");
    window.location.href = "login.html";

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});


const passwordInput = document.getElementById("signupPassword");
const rulesBox = document.getElementById("passwordRules");

passwordInput.addEventListener("focus", () => {
  rulesBox.style.display = "block";
});

passwordInput.addEventListener("blur", () => {
  if (passwordInput.value === "") {
    rulesBox.style.display = "none";
  }
});

passwordInput.addEventListener("input", validatePassword);

function validatePassword() {
  const value = passwordInput.value;

  toggleRule("length", value.length >= 8);
  toggleRule("uppercase", /[A-Z]/.test(value));
  toggleRule("lowercase", /[a-z]/.test(value));
  toggleRule("number", /[0-9]/.test(value));
  toggleRule("special", /[@$!%*?&]/.test(value));
}

function toggleRule(id, valid) {
  const rule = document.getElementById(id);
  const icon = rule.querySelector("i");

  if (valid) {
    icon.className = "fa-solid fa-circle-check";
    icon.style.color = "green";
  } else {
    icon.className = "fa-solid fa-circle-xmark";
    icon.style.color = "red";
  }
}
