const screens = document.querySelectorAll(".screen");
function openScreen(id) {
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

const form = document.getElementById("financeForm");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");
const totalEl = document.getElementById("total");
const insight = document.getElementById("insight");

let records = JSON.parse(localStorage.getItem("financeRecords")) || [];

const chart = new Chart(document.getElementById("donutChart"), {
  type: "doughnut",
  data: {
    labels: ["Income", "Expenses"],
    datasets: [{
      data: [0, 0],
      backgroundColor: ["#38a169", "#e53e3e"]
    }]
  }
});

form.addEventListener("submit", e => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const amount = +document.getElementById("amount").value;
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;

  if (!title || amount <= 0 || !type || !category) {
    alert("⚠ Please enter valid data");
    return;
  }

  records.push({ id: Date.now(), title, amount, type, category });
  localStorage.setItem("financeRecords", JSON.stringify(records));
  render();
  form.reset();
  openScreen("homeScreen");
});

function render() {
  let income = 0, expense = 0;
  let incomeMap = {}, expenseMap = {};

  records.forEach(r => {
    if (r.type === "income") {
      income += r.amount;
      incomeMap[r.category] = (incomeMap[r.category] || 0) + r.amount;
    } else {
      expense += r.amount;
      expenseMap[r.category] = (expenseMap[r.category] || 0) + r.amount;
    }
  });

  incomeEl.textContent = income;
  expenseEl.textContent = expense;
  balanceEl.textContent = income - expense;
  totalEl.textContent = income + expense;

  document.getElementById("incomeCategories").textContent =
    formatCategories(incomeMap);

  document.getElementById("expenseCategories").textContent =
    formatCategories(expenseMap);

  chart.data.datasets[0].data = [income, expense];
  chart.update();

  aiInsight(income, expense);
}

function formatCategories(map) {
  const entries = Object.entries(map);
  if (entries.length === 0) return "(No records)";
  return "(" + entries.map(([c, a]) => `${c}: ₹${a}`).join(", ") + ")";
}

function aiInsight(income, expense) {
  if (income === 0) {
    insight.textContent = "Add income to receive AI insights.";
    return;
  }
  const ratio = expense / income;
  if (ratio > 0.8)
    insight.textContent = "⚠ High expenses. Reduce unnecessary spending.";
  else if (ratio > 0.6)
    insight.textContent = "💡 Moderate spending. Try saving more.";
  else
    insight.textContent = "✅ Excellent financial management.";
}

render();
