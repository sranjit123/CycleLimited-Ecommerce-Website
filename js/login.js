const eyeButton=document.getElementById("eye-btn");
const passwordInput= document.getElementById("password");
const eyeIcon =document.querySelector(".fa-eye");
eyeButton.addEventListener("click", ()=>{
  const showPassword= passwordInput.type==='password';
  passwordInput.type = showPassword? 'text':'password';
  eyeIcon.classList.toggle("fa-eye");
  eyeIcon.classList.toggle("fa-eye-slash");
});



const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const emailMessage = document.getElementById("emailMessage");
  const passwordMessage = document.getElementById("passwordMessage");

  emailInput.addEventListener("input", function () {
    emailMessage.textContent = "";
    emailInput.classList.remove("input-error");
  });

  passwordInput.addEventListener("input", function () {
    passwordMessage.textContent = "";
    passwordInput.classList.remove("input-error");
  });

  emailMessage.textContent = "";
  passwordMessage.textContent = "";

  emailInput.classList.remove("input-error");
  passwordInput.classList.remove("input-error");

  let isValid = true;

  if (email === "") {
    emailMessage.textContent = "Email is required";
    emailInput.classList.add("input-error");
    isValid = false;
  }
  if (password === "") {
    passwordMessage.textContent = "Password is required";
    passwordInput.classList.add("input-error");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(function (user) {
    return user.email === email;
  });

  if (!user) {
    emailMessage.textContent = "Invalid email";
    emailInput.classList.add("input-error");
    return;
  }
  if (user.password !== password) {
    passwordMessage.textContent = "Invalid  password";
    passwordInput.classList.add("input-error");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
  // alert("Logged In Successfully");
  loginForm.reset();
  window.location.href = "index.html";
});

