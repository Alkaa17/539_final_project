// Function to get the current timestamp with date and time
function getCurrentTimestamp() {
  const now = new Date();

  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const year = now.getFullYear();
  const date = `${month}/${day}/${year}`;

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const amPm = hours >= 12 ? "PM" : "AM";
  const time = `${hours % 12 || 12}:${minutes}:${seconds} ${amPm}`;

  return `${date} at ${time}`;
}

// Save tasks to localStorage
function saveTasks() {
  const toDoTasks = [];
  const doneTasks = [];

  // Save To-Do List tasks
  document.querySelectorAll("#myUL li").forEach((item) => {
    toDoTasks.push({
      title: item.querySelector(".task-title").textContent,
      dueDate: item.getAttribute("data-due-date"),
      priority: Array.from(item.classList).find((cls) =>
        ["red", "orange", "yellow"].includes(cls)
      ),
    });
  });

  // Save Done List tasks
  document.querySelectorAll("#doneUL li").forEach((item) => {
    doneTasks.push({
      title: item.querySelector(".task-title")
        ? item.querySelector(".task-title").textContent
        : item.textContent.split(" (")[0].trim(),
      dueDate: item.getAttribute("data-due-date"),
      priority: Array.from(item.classList).find((cls) =>
        ["red", "orange", "yellow"].includes(cls)
      ),
      timestamp: item.getAttribute("data-timestamp"),
    });
  });

  localStorage.setItem("toDoTasks", JSON.stringify(toDoTasks));
  localStorage.setItem("doneTasks", JSON.stringify(doneTasks));
}

// Load tasks from localStorage
function loadTasks() {
  const toDoTasks = JSON.parse(localStorage.getItem("toDoTasks")) || [];
  const doneTasks = JSON.parse(localStorage.getItem("doneTasks")) || [];

  // Load To-Do List tasks
  toDoTasks.forEach((task) => {
    const li = createTaskElement(task.title, task.dueDate, task.priority);
    document.getElementById("myUL").appendChild(li);
  });

  // Load Done List tasks
  doneTasks.forEach((task) => {
    const li = document.createElement("li");
    li.setAttribute("data-due-date", task.dueDate);
    li.setAttribute("data-timestamp", task.timestamp);
    li.classList.add(task.priority);

    const titleSpan = document.createElement("span");
    titleSpan.className = "task-title";
    titleSpan.textContent = `${task.title} (Due: ${task.dueDate}) `;
    li.appendChild(titleSpan);

    const timestamp = document.createElement("span");
    timestamp.className = "timestamp";
    timestamp.textContent = ` (Completed on: ${task.timestamp})`;
    li.appendChild(timestamp);

    addDropdownMenu(li);
    li.style.backgroundColor = "#28a745";

    document.getElementById("doneUL").appendChild(li);
  });

  sortTasksByDueDate();
}

// Create a new task element
function createTaskElement(title, dueDate, priority) {
  const li = document.createElement("li");
  li.setAttribute("data-due-date", dueDate);
  li.classList.add(priority);

  const titleSpan = document.createElement("span");
  titleSpan.className = "task-title";
  titleSpan.textContent = title;
  li.appendChild(titleSpan);

  const dateSpan = document.createElement("span");
  dateSpan.className = "task-date";
  dateSpan.textContent = ` (Due: ${dueDate})`;
  li.appendChild(dateSpan);

  addButtons(li);
  return li;
}

// Add buttons to the task
function addButtons(item) {
  const doneButton = document.createElement("button");
  doneButton.textContent = "Done";
  doneButton.className = "done-btn";
  doneButton.onclick = function () {
    markAsDone(item);
  };
  item.appendChild(doneButton);

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.className = "edit-btn";
  editButton.onclick = function () {
    editTask(item);
  };
  item.appendChild(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "delete-btn";
  deleteButton.onclick = function () {
    item.remove();
    saveTasks();
  };
  item.appendChild(deleteButton);
}

// Add a new task to the To-Do List
function newElement() {
  const taskInput = document.getElementById("myInput");
  const dueDateInput = document.getElementById("dueDate");
  const priorityInput = document.getElementById("priority");

  const taskText = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;

  if (!taskText || !dueDate) {
    alert("Please enter both task title and due date!");
    return;
  }

  const li = createTaskElement(taskText, dueDate, priority);
  document.getElementById("myUL").appendChild(li);

  taskInput.value = "";
  dueDateInput.value = "";
  priorityInput.value = "red";

  sortTasksByDueDate();
  saveTasks();
}

function markAsDone(item) {
  const doneList = document.getElementById("doneUL");
  const doneItem = document.createElement("li");

  const taskTitle = item.querySelector(".task-title")
    ? item.querySelector(".task-title").textContent
    : item.textContent.split(" (")[0].trim();
  const taskDate = item.getAttribute("data-due-date");

  const priority = Array.from(item.classList).find((cls) =>
    ["red", "orange", "yellow"].includes(cls)
  );
  doneItem.classList.add(priority);

  doneItem.setAttribute("data-due-date", taskDate);
  doneItem.setAttribute("data-timestamp", getCurrentTimestamp());

  doneItem.textContent = `${taskTitle} (Due: ${taskDate})`;

  const timestamp = document.createElement("span");
  timestamp.className = "timestamp";
  timestamp.textContent = ` (Completed on: ${getCurrentTimestamp()})`;
  doneItem.appendChild(timestamp);

  addDropdownMenu(doneItem);

  doneItem.style.backgroundColor = "#28a745";
  doneList.appendChild(doneItem);

  // Trigger confetti and play audio
  triggerConfetti();
  playCelebrationAudio();

  item.remove();
  saveTasks();
}

// Function to trigger confetti
function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

// Function to play celebration audio
function playCelebrationAudio() {
  const audio = document.getElementById("celebrationAudio");

  // Play the audio
  audio.currentTime = 0; // Start from the beginning
  audio.play();

  // Stop after 3 seconds
  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0; // Reset to the beginning
  }, 4000); // 3000 ms = 3 seconds
}

// Add dropdown menu to a Done List item
function addDropdownMenu(item) {
  const dropdown = document.createElement("div");
  dropdown.className = "dropdown";

  const button = document.createElement("button");
  button.className = "dropdown-btn";
  button.textContent = "⋮";

  const menu = document.createElement("div");
  menu.className = "dropdown-content";

  const putBack = document.createElement("button");
  putBack.textContent = "Put Back";
  putBack.onclick = function () {
    putTaskBack(item);
  };
  menu.appendChild(putBack);

  const edit = document.createElement("button");
  edit.textContent = "Edit";
  edit.onclick = function () {
    editTask(item);
  };
  menu.appendChild(edit);

  const deleteTask = document.createElement("button");
  deleteTask.textContent = "Delete";
  deleteTask.onclick = function () {
    item.remove();
    saveTasks();
  };
  menu.appendChild(deleteTask);

  dropdown.appendChild(button);
  dropdown.appendChild(menu);
  item.appendChild(dropdown);
}

// Put task back into To-Do List
function putTaskBack(item) {
  const taskTitle = item.textContent.split(" (")[0].trim();
  const taskDate = item.getAttribute("data-due-date");
  const priority = Array.from(item.classList).find((cls) =>
    ["red", "orange", "yellow"].includes(cls)
  );

  const li = createTaskElement(taskTitle, taskDate, priority);
  document.getElementById("myUL").appendChild(li);

  item.remove();
  saveTasks();
}

// Edit task
function editTask(item) {
  const taskTitle = item.querySelector(".task-title")
    ? item.querySelector(".task-title").textContent
    : item.textContent.split(" (")[0].trim();
  const taskDate = item.getAttribute("data-due-date");
  const priority = Array.from(item.classList).find((cls) =>
    ["red", "orange", "yellow"].includes(cls)
  );

  document.getElementById("myInput").value = taskTitle;
  document.getElementById("dueDate").value = taskDate;
  document.getElementById("priority").value = priority;

  item.remove();
  saveTasks();
}

// Sort tasks by due date
function sortTasksByDueDate() {
  const list = document.getElementById("myUL");
  const tasks = Array.from(list.getElementsByTagName("li"));

  tasks.sort((a, b) => {
    const dateA = new Date(a.getAttribute("data-due-date"));
    const dateB = new Date(b.getAttribute("data-due-date"));
    return dateA - dateB; // Ascending order
  });

  tasks.forEach((task) => list.appendChild(task));
}

// Load tasks on page load
window.onload = function () {
  loadTasks();
};

let currentMusicIframe = null;
let isPlaying = false;

function startMusic() {
  const musicOptions = document.getElementById("musicOptions");
  const selectedMusic = musicOptions.value;
  const playPauseButton = document.getElementById("playPauseButton");
  const musicPlayerContainer = document.getElementById("musicPlayerContainer");

  if (!selectedMusic) {
    alert("Please select a type of music to play!");
    return;
  }

  if (currentMusicIframe) {
    musicPlayerContainer.removeChild(currentMusicIframe);
  }

  currentMusicIframe = document.createElement("iframe");
  currentMusicIframe.style.display = "none"; // Hide the video
  currentMusicIframe.src = `${selectedMusic}?autoplay=1`;
  currentMusicIframe.allow = "autoplay";
  musicPlayerContainer.appendChild(currentMusicIframe);
  playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
  isPlaying = true;
}

function togglePlayPause() {
  const playPauseButton = document.getElementById("playPauseButton");

  if (isPlaying) {
    currentMusicIframe.src = currentMusicIframe.src.replace(
      "autoplay=1",
      "autoplay=0"
    );
    playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
  } else {
    currentMusicIframe.src = currentMusicIframe.src.replace(
      "autoplay=0",
      "autoplay=1"
    );
    playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
  }

  isPlaying = !isPlaying;
}

// Toggle between dark and light themes
function toggleTheme() {
  const body = document.body;
  const themeToggleBtn = document.getElementById("themeToggle");

  // Check the current theme
  const currentTheme = body.getAttribute("data-theme") || "light";

  // Switch between themes
  const newTheme = currentTheme === "light" ? "dark" : "light";
  body.setAttribute("data-theme", newTheme);
  themeToggleBtn.checked = newTheme === "dark";
  localStorage.setItem("theme", newTheme);
}

// Load the saved theme on page load
function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.setAttribute("data-theme", savedTheme);

  const themeToggleBtn = document.getElementById("themeToggle");
  themeToggleBtn.checked = savedTheme === "dark";
}

// Initialize theme on page load
window.onload = function () {
  loadTheme();
  loadTasks();
};

// Add event listener to the theme toggle button
document.getElementById("themeToggle").addEventListener("change", toggleTheme);

// Toggle the music player dropdown
document.querySelector(".music-toggle").addEventListener("click", function () {
  const musicDropdown = document.querySelector(".music-dropdown");
  musicDropdown.classList.toggle("active");
});
