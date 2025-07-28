const sunnyInvoices = [
  {
    id: "INV001",
    employee: "Sunny",
    date: "2025-07-15",
    amount: "₹2500",
    description: "Team lunch reimbursement",
    status: "Pending",
    documentUrl: "bill1.jpg",
    reviewedBy: "-"
  },
  {
    id: "INV002",
    employee: "Sunny",
    date: "2025-07-16",
    amount: "₹1200",
    description: "Client meeting snacks",
    status: "Approved",
    documentUrl: "bill2.jpg",
    reviewedBy: "Admin1"
  },
  {
    id: "INV003",
    employee: "Sunny",
    date: "2025-07-17",
    amount: "₹3000",
    description: "Travel to onsite office",
    status: "Rejected",
    documentUrl: "bill3.jpg",
    reviewedBy: "Admin2"
  }
];

if (!localStorage.getItem("invoices_Sunny")) {
  localStorage.setItem("invoices_Sunny", JSON.stringify(sunnyInvoices));
}
