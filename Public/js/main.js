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

    const res = await fetch("/api/v1/tours/", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.status == "success") {
      window.location.href = "/";
    } else {
      console.log(data);
    }
  });
}

if (tourContainer) {
  tourContainer.addEventListener("click", async function (e) {
    e.preventDefault();
    const url = e.target.closest(".tour-card").dataset.url;

    if (e.target.id === "deleteButton") {
      console.log("delete button clicked!");
      await fetch(`http://localhost:5000${url}`, {
        method: "DELETE",
      });
      window.location.href = "/";
    } else {
      const res = await fetch(`http://localhost:5000${url}`);
      const data = await res.json();
      window.location.href = `http://localhost:5000/tours/${url.split("/")[4]}`;
    }
  });
}

if (loginButton) {
  loginButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/v1/users/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.status == "success") {
      console.log(data);
      window.location.href = "/";
    } else {
      console.log("data", data);
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

    const res = await fetch("/api/v1/users/signup", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });

    const data = await res.json();

    if (data.status == "success") {
      window.location.href = "/";
    } else {
      console.log(data);
    }
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const res = await fetch("/api/v1/users/logout");
    const data = await res.json();
    window.location.href = "/";
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

    const res = await fetch("/api/v1/users/updateMe", {
      method: "PATCH",
      body: formData,
    });

    const data = await res.json();
    window.location.href = "/profile";
  });
}

if (updatePasswordButton) {
  updatePasswordButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const currentPassword = document.getElementById("currentPassword").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const res = await fetch("/api/v1/users/updateMyPassword", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ currentPassword, password, confirmPassword }),
    });

    const data = await res.json();
    window.location.href = "/profile";
  });
}

if (sendResetLinkButton) {
  sendResetLinkButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;

    const res = await fetch("/api/v1/users/forgotPassword", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (data.status == "success") {
      window.location.href = "/login";
    } else {
      console.log(data);
    }
  });
}

if (resetPasswordButton) {
  console.log(resetPasswordButton, "reseting...");
  resetPasswordButton.addEventListener("click", async function (e) {
    e.preventDefault();

    console.log("reset password");
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const token = window.location.pathname.split("/")[5];

    const res = await fetch(`/api/v1/users/resetPassword/${token}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ password, confirmPassword }),
    });

    const data = await res.json();
    if (data.status == "success") {
      window.location.href = "/login";
    } else {
      console.log(data);
    }
  });
}

if (bookingButton) {
  bookingButton.addEventListener("click", async function (e) {
    e.target.textContent = "Processing...";
    const { tourId } = e.target.dataset;

    // 1) Get checkout session from API
    const res = await fetch(`/api/v1/bookings/checkout-session/${tourId}`);
    e.target.textContent = "Book Now";
    const data = await res.json();

    if (data.status == "success") {
      window.location = data.url;
    } else {
      console.log(data);
    }
  });
}
