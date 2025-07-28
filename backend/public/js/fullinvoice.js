const params = new URLSearchParams(window.location.search);
const invoiceId = params.get("id");

fetch(`api/employeeinvoices/byid/${invoiceId}`)
  .then(res => {
    if (!res.ok) {
      throw new Error("Invoice not found");
    }
    return res.json();
  })
  .then(invoice => {
    document.getElementById("invoice-id").textContent += invoice.id;
    document.getElementById("employee-name").textContent = invoice.employee;
    document.getElementById("invoice-date").textContent = invoice.date;
    document.getElementById("invoice-amount").textContent = invoice.amount;
    document.getElementById("invoice-description").textContent = invoice.description;
    document.getElementById("invoice-status").textContent = invoice.status;
    document.getElementById("doc-link").href = invoice.documentUrl;
    document.getElementById("doc-preview").src = invoice.documentUrl;

   
    window.invoiceObjectId = invoice._id;
     if (invoice.status !== "Pending") {
      document.querySelector(".approve").style.display = "none";
      document.querySelector(".reject").style.display = "none";
    }
  })
  .catch(error => {
    document.querySelector("main").innerHTML = `<p style="text-align:center; padding:40px;">Invoice not found</p>`;
  });
