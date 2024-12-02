// Load and display weekly progress
function loadWeeklyCalendar() {
  const completedTasks =
    JSON.parse(localStorage.getItem("completedTasks")) || [];
  const weeklyData = {};

  // Group tasks by day
  completedTasks.forEach((task) => {
    const date = new Date(task.timestamp).toLocaleDateString("en-US", {
      weekday: "long",
    });
    weeklyData[date] = (weeklyData[date] || 0) + 1;
  });

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const calendarBody = document.getElementById("weeklyCalendar");

  daysOfWeek.forEach((day) => {
    const row = document.createElement("tr");
    const dayCell = document.createElement("td");
    dayCell.textContent = day;

    const countCell = document.createElement("td");
    countCell.textContent = weeklyData[day] || 0;

    row.appendChild(dayCell);
    row.appendChild(countCell);
    calendarBody.appendChild(row);
  });
}

// Load and display task completion trends using Chart.js
function loadCompletionChart() {
  const completedTasks =
    JSON.parse(localStorage.getItem("completedTasks")) || [];
  const weeklyData = {};

  // Group tasks by day
  completedTasks.forEach((task) => {
    const date = new Date(task.timestamp).toLocaleDateString("en-US", {
      weekday: "long",
    });
    weeklyData[date] = (weeklyData[date] || 0) + 1;
  });

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const taskCounts = daysOfWeek.map((day) => weeklyData[day] || 0);

  const ctx = document.getElementById("completionChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: daysOfWeek,
      datasets: [
        {
          label: "Tasks Completed",
          data: taskCounts,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Load progress data on page load
window.onload = function () {
  loadWeeklyCalendar();
  loadCompletionChart();
};
