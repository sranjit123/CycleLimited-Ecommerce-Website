const eyeButton=document.getElementById("eye-btn");
const passwordInput= document.getElementById("password");
const eyeIcon =document.querySelector(".fa-eye");
eyeButton.addEventListener("click", ()=>{
  const showPassword= passwordInput.type==='password';
  passwordInput.type = showPassword? 'text':'password';
  eyeIcon.classList.toggle("fa-eye");
  eyeIcon.classList.toggle("fa-eye-slash");
});



const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const firstNameError = document.getElementById("firstNameError");
  const lastNameError = document.getElementById("lastNameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const registerMessage = document.getElementById("registerMessage");

  firstNameInput.addEventListener("input", function () {
    firstNameError.textContent = "";
    firstNameInput.classList.remove("input-error");
  });

  lastNameInput.addEventListener("input", function () {
    lastNameError.textContent = "";
    lastNameInput.classList.remove("input-error");
  });

  emailInput.addEventListener("input", function () {
    emailError.textContent = "";
    emailInput.classList.remove("input-error");
  });

  passwordInput.addEventListener("input", function () {
    passwordError.textContent = "";
    passwordInput.classList.remove("input-error");
  });

  firstNameError.textContent = "";
  lastNameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  registerMessage.textContent = "";

  firstNameInput.classList.remove("input-error");
  lastNameInput.classList.remove("input-error");
  emailInput.classList.remove("input-error");
  passwordInput.classList.remove("input-error");

  let isValid = true;

  if (firstName === "") {
    firstNameError.textContent = "First Name is required";
    firstNameInput.classList.add("input-error");
    isValid = false;
  }

  if (lastName === "") {
    lastNameError.textContent = "Last name is required";
    lastNameInput.classList.add("input-error");
    isValid = false;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (email === "") {
    emailError.textContent = "Email is required";
    emailInput.classList.add("input-error");
    isValid = false;
  } else if (!emailRegex.test(email)) {
    emailError.textContent = "Valid email is required";
    emailInput.classList.add("input-error");
    isValid = false;
  }

  if (password === "") {
    passwordError.textContent = "Password is required";
    passwordInput.classList.add("input-error");
    isValid = false;
  } else if (password.length < 4) {
    passwordError.textContent = "Password should be of at least 4 characters";
    passwordInput.classList.add("input-error");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const existingUser = users.find(function (user) {
    return user.email === email;
  });

  if (existingUser) {
    emailError.textContent = "Email is already registered";
    emailInput.classList.add("input-error");
    return;
  }

  const newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  registerMessage.textContent = "User registered successfully";
  registerForm.reset();

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  registerMessage.textContent = "User registered successfully! Redirecting...";
  registerForm.reset();

  setTimeout(function () {
    window.location.href = "login.html";
  }, 1500);
});
