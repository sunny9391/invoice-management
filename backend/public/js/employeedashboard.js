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

const auth = JSON.parse(localStorage.getItem("authToken"));
console.log(auth);

if (!auth) {
  alert("Please login first.");
  window.location.href = "login.html";
}

const tbody = document.querySelector("tbody");
tbody.innerHTML = "";

fetch(`/api/employeeinvoices/${auth.fullName}`)
  .then((res) => {
    if (!res.ok) throw new Error("Failed to fetch invoices");
    return res.json();
  })
  .then((invoices) => {
    invoices.forEach((invoice) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${invoice.id}</td>
        <td>${invoice.date}</td>
        <td>${invoice.amount}</td>
        <td><span class="status ${invoice.status.toLowerCase()}">${invoice.status}</span></td>
        <td>${invoice.reviewedBy || '-'}</td>
      `;
      tbody.appendChild(row);
    });
  })
  .catch((err) => {
    console.error(err);
    alert("Could not load invoices from server.");
  });
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('authToken');  // if you use token-based auth
    window.location.href = '/index.html';  // or the page you want to redirect to
  });