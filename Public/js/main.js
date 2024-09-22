import { showAlert } from "./alert.js";

const tourContainer = document.querySelector(".tourContainer");
const loginButton = document.querySelector(".loginButton");
const signupButton = document.querySelector(".signupButton");
const logoutButton = document.querySelector(".logoutButton");
const updateProfileButton = document.querySelector(".updateProfileButton");
const updatePasswordButton = document.querySelector(".updatePasswordButton");
const sendResetLinkButton = document.querySelector(".sendResetLinkButton");
const resetPasswordButton = document.querySelector(".resetPasswordButton");
const createTourButton = document.querySelector(".createTourButton");
const bookingButton = document.querySelector(".bookingButton");

if (createTourButton) {
  createTourButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const formData = new FormData();
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const duration = document.getElementById("duration").value;
    const description = document.getElementById("description").value;
    const locations = document.getElementById("locations").value;
    const coverImage = document.getElementById("coverImage").files[0];
    const images = document.getElementById("images");

    for (let i = 0; i < images.files.length; i++) {
      formData.append("images", images.files[i]);
    }

    formData.append("name", name);
    formData.append("price", price);
    formData.append("duration", duration);
    formData.append("description", description);
    formData.append("locations", locations);
    formData.append("coverImage", coverImage);

    const res = await fetch("https://tour-app-zt4w.onrender.com/api/v1/tours", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (data.status == "success") {
      window.location.href = "https://tour-app-zt4w.onrender.com";
      showAlert("success", "Tour created successfully");
    } else {
      showAlert("error", data.message);
    }
  });
}

if (tourContainer) {
  tourContainer.addEventListener("click", async function (e) {
    e.preventDefault();
    const url = e.target.closest(".tour-card").dataset.url;

    if (e.target.id === "deleteButton") {
      try {
        const res = await fetch(`https://tour-app-zt4w.onrender.com/${url}`, {
          method: "DELETE",
        });

        showAlert("success", "Tour deleted successfully");
        window.location.href = "https://tour-app-zt4w.onrender.com/";
      } catch (err) {
        showAlert("error", err.message);
      }
    } else {
      const res = await fetch(`https://tour-app-zt4w.onrender.com/${url}`);
      const data = await res.json();

      if (data.status == "success") {
        window.location.href = `https://tour-app-zt4w.onrender.com/tours/${
          url.split("/")[3]
        }`;
      } else {
        showAlert("error", data.message);
      }
    }
  });
}

if (loginButton) {
  loginButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(
      "https://tour-app-zt4w.onrender.com/api/v1/users/login",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json();

    if (data.status == "success") {
      showAlert("success", "Logged in successfully");
      window.location.href = "https://tour-app-zt4w.onrender.com/";
    } else {
      showAlert("error", data.message);
    }
  });
}

if (signupButton) {
  signupButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const res = await fetch(
      "https://tour-app-zt4w.onrender.com/api/v1/users/signup",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      }
    );

    const data = await res.json();

    if (data.status == "success") {
      showAlert("success", "Signup successful");
      window.location.href = "https://tour-app-zt4w.onrender.com/";
    } else {
      showAlert("error", data.message);
    }
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const res = await fetch(
      "https://tour-app-zt4w.onrender.com/api/v1/users/logout"
    );
    const data = await res.json();

    if (data.status == "success") showAlert("success", "Logout successful");
    else showAlert("error", data.message);

    window.location.href = "https://tour-app-zt4w.onrender.com/";
  });
}

if (updateProfileButton) {
  updateProfileButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const formData = new FormData();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const photo = document.getElementById("photo").files[0];

    formData.append("name", name);
    formData.append("email", email);
    formData.append("photo", photo);

    const res = await fetch(
      "https://tour-app-zt4w.onrender.com/api/v1/users/updateMe",
      {
        method: "PATCH",
        body: formData,
      }
    );

    const data = await res.json();

    if (data.status == "success")
      showAlert("success", "Profile updated successfully");
    else showAlert("error", data.message);

    window.location.href = "https://tour-app-zt4w.onrender.com/profile";
  });
}

if (updatePasswordButton) {
  updatePasswordButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const currentPassword = document.getElementById("currentPassword").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const res = await fetch(
      "https://tour-app-zt4w.onrender.com/api/v1/users/updateMyPassword",
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ currentPassword, password, confirmPassword }),
      }
    );

    const data = await res.json();

    if (data.status == "success")
      showAlert("success", "Password updated successfully");
    else showAlert("error", data.message);

    window.location.href = "https://tour-app-zt4w.onrender.com/profile";
  });
}

if (sendResetLinkButton) {
  sendResetLinkButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;

    const res = await fetch(
      "https://tour-app-zt4w.onrender.com/api/v1/users/forgotPassword",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    if (data.status == "success") {
      showAlert("success", "An email sent to you with reset link");
      window.location.href = "https://tour-app-zt4w.onrender.com/login";
    } else {
      showAlert("error", data.message);
    }
  });
}

if (resetPasswordButton) {
  resetPasswordButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const token = window.location.pathname.split("/")[5];

    const res = await fetch(
      `https://tour-app-zt4w.onrender.com/api/v1/users/resetPassword/${token}`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ password, confirmPassword }),
      }
    );

    const data = await res.json();

    if (data.status == "success") {
      showAlert("success", "Password reset successful");
      window.location.href = "https://tour-app-zt4w.onrender.com/login";
    } else {
      showAlert("error", data.message);
    }
  });
}

if (bookingButton) {
  bookingButton.addEventListener("click", async function (e) {
    e.target.textContent = "Processing...";
    const { tourId } = e.target.dataset;

    const res = await fetch(
      `https://tour-app-zt4w.onrender.com/api/v1/bookings/checkout-session/${tourId}`
    );
    e.target.textContent = "Book Now";
    const data = await res.json();

    if (data.status == "success") {
      window.location = data.url;
    } else {
      showAlert("error", data.message);
    }
  });
}
