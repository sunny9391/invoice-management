document.addEventListener("DOMContentLoaded", () => {
  const auth = JSON.parse(localStorage.getItem("authToken"));
  const employeeName = auth?.fullName;

  if (!employeeName) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("requestedBy").value = employeeName;

  document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();

    const newInvoice = {
      employee: employeeName,
      date: document.getElementById("date").value,
      amount: document.getElementById("amount").value,
      description: document.getElementById("description").value,
      documentUrl: "uploaded_dummy.jpg" 
    };

    fetch("http://localhost:3000/api/addinvoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newInvoice)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to submit invoice");
        return res.json();
      })
      .then(() => {
        alert("Invoice submitted successfully!");
        window.location.href = "employeedashboard.html";
      })
      .catch((error) => {
        console.error(error);
        alert("Invoice submission failed!");
      });
  });
});
