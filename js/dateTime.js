function updateTimeAndDay() {
  const now = new Date();

  // Format time
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const amPm = hours >= 12 ? "PM" : "AM";
  const formattedTime = `${hours % 12 || 12} : ${minutes} : ${seconds} ${amPm}`;

  // Format day
  const options = { weekday: "long" };
  const formattedDay = now.toLocaleDateString("en-US", options);

  // Update the DOM
  document.getElementById("time").innerText = formattedTime;
  document.getElementById("day").innerText = formattedDay;
}

// Call the function immediately to set the date and time
updateTimeAndDay();

// Update the time every second
setInterval(updateTimeAndDay, 1000);
