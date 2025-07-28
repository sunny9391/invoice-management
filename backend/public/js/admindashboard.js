
const heading = document.getElementById('typewriter');
const text = heading.textContent;
heading.textContent = '';
let i = 0;

function typeWriter() {
  if (i < text.length) {
    heading.textContent += text.charAt(i);
    i++;
    setTimeout(typeWriter, 50);
  }
}
typeWriter();

const tableBody = document.querySelector("tbody");
const tabs = document.querySelectorAll(".tab");
const searchInput = document.getElementById("searchInput");

let currentTab = document.querySelector(".tab.now")?.textContent.trim() || "Pending";
let invoices = [];

window.addEventListener("DOMContentLoaded", () => {
  fetchInvoices();
});

function fetchInvoices() {
  fetch("/api/employeeinvoices")
    .then(res => res.json())
    .then(data => {
      invoices = data;
      renderTable(currentTab, searchInput.value);
    })
    .catch(err => {
      console.error("Failed to fetch invoices", err);
      alert("Failed to load invoices.");
    });
}

function renderTable(status, filterText = "") {
  tableBody.innerHTML = "";

  invoices
    .filter(invoice =>
      invoice.status === status &&
      invoice.employee.toLowerCase().includes(filterText.toLowerCase())
    )
    .forEach(invoice => {
      const tr = document.createElement("tr");

      let actionButtons = "";
      if (status === "Pending") {
        actionButtons = `
          <button class="btn approve" data-id="${invoice._id}">Approve</button>
          <button class="btn reject" data-id="${invoice._id}">Reject</button>
        `;
      }

      tr.innerHTML = `
        <td><a href="fullinvoiceforadmin.html?id=${invoice._id}">${invoice.id}</a></td>
        <td>${invoice.employee}</td>
        <td>${invoice.date}</td>
        <td>${invoice.amount}</td>
        <td>${invoice.description}</td>
        <td><span class="status ${invoice.status.toLowerCase()}">${invoice.status}</span></td>
        <td class="action-btns">${actionButtons}</td>
      `;

      tableBody.appendChild(tr);
    });

  attachActionListeners();
}

function attachActionListeners() {
  document.querySelectorAll(".btn.approve").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      updateInvoiceStatus(id, "Approved");
    });
  });

  document.querySelectorAll(".btn.reject").forEach(btn => {
    btn.addEventListener("click", () => {
      console.log(btn.dataset);
      const id = btn.dataset.id;

      updateInvoiceStatus(id, "Rejected");
    });
  });
}

function updateInvoiceStatus(_id, newStatus) {
  console.log(`Updating invoice ${_id} to ${newStatus}`);
  fetch(`http://localhost:3000/api/employeeinvoices/byid/${_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: newStatus }),
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    })
    .then(() => {
      fetchInvoices();
    })
    .catch(err => {
      console.error("Error updating invoice status:", err);
      alert("Could not update invoice status.");
    });
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("now"));
    tab.classList.add("now");
    currentTab = tab.textContent.trim();
    renderTable(currentTab, searchInput.value);
  });
});

searchInput.addEventListener("input", () => {
  renderTable(currentTab, searchInput.value);
});
