document.addEventListener("DOMContentLoaded", displayTasks);
document.getElementById("add-task").addEventListener("click", addTask);

// Retrieve tasks from local storage
function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

// Display tasks on the page
function displayTasks() {
    let tasks = getTasksFromLocalStorage();
    let taskList = document.getElementById("task-list");
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        appendTask(task.text, index, task.completed);
    });
    toggleEmptyMessage();
}

// Append a task to the task list
function appendTask(text, index, completed) {
    let taskList = document.getElementById("task-list");
    let taskLi = document.createElement("li");
    taskLi.className = "task-container";
    taskLi.id = `task-${index}`;
    taskLi.style.transition = "all 0.3s ease";
    taskLi.style.display = "flex";
    taskLi.style.alignItems = "center";
    taskLi.style.padding = "0.5rem";
    taskLi.style.borderRadius = "10px";
    taskLi.style.boxShadow = "0px 2px 5px rgba(0, 0, 0, 0.1)";
    taskLi.style.marginBottom = "1em";

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `check-${index}`;
    checkbox.className = "task-checkbox";
    checkbox.checked = completed;
    checkbox.addEventListener("change", () => toggleTaskCompletion(index));

    let taskText = document.createElement("span");
    taskText.id = `task-text-${index}`;
    taskText.textContent = text;
    taskText.className = "task-label";
    if (completed) {
        taskText.style.textDecoration = "line-through";
        taskText.style.color = "#aaa";
    }

    let editInput = document.createElement("input");
    editInput.id = `edit-input-${index}`;
    editInput.type = "text";
    editInput.value = text;
    editInput.className = "editInput";
    editInput.style.display = "none";

    let btnContainer = document.createElement("div");
    btnContainer.className = "button-container";
    Object.assign(btnContainer.style, {
        display: "flex",
        gap: "5px",
        marginLeft: "auto",
    });

    let editBtn = createIconButton('<i class="fa-solid fa-pen"></i>', `editBtn-${index}`, "edit-button", "#f1c40f", () => enterEditMode(index));
    editBtn.className = "editBtn";
    let saveBtn = createIconButton("Save", `saveBtn-${index}`, "save-button", "#2ecc71", () => saveTask(index), true);
    let cancelBtn = createIconButton("Cancel", `cancelBtn-${index}`, "cancel-button", "#95a5a6", () => cancelEdit(index), true);
    let deleteBtn = createIconButton("✖", `deleteBtn-${index}`, "delete-button", "#e74c3c", () => removeTask(index));

    btnContainer.append(editBtn, saveBtn, cancelBtn, deleteBtn);
    taskLi.append(checkbox, taskText, editInput, btnContainer);
    taskList.appendChild(taskLi);

    setTimeout(() => {
        taskLi.classList.add("animate");
    }, 100);
}

// Toggle the completion status of a task
function toggleTaskCompletion(index) {
    let tasks = getTasksFromLocalStorage();
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
}

// Enter edit mode for a task
function enterEditMode(index) {
    document.getElementById(`task-text-${index}`).style.display = "none";
    document.getElementById(`edit-input-${index}`).style.display = "inline-block";
    document.getElementById(`deleteBtn-${index}`).style.display = "none";
    document.getElementById(`editBtn-${index}`).style.display = "none";
    document.getElementById(`saveBtn-${index}`).style.display = "inline-block";
    document.getElementById(`cancelBtn-${index}`).style.display = "inline-block";
    document.getElementById(`check-${index}`).style.display = "none";
}

// Save the edited task
function saveTask(index) {
    let editInput = document.getElementById(`edit-input-${index}`);
    let tasks = getTasksFromLocalStorage();
    tasks[index].text = editInput.value;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
}

// Cancel the edit mode
function cancelEdit(index) {
    document.getElementById(`task-text-${index}`).style.display = "inline";
    document.getElementById(`edit-input-${index}`).style.display = "none";
    document.getElementById(`deleteBtn-${index}`).style.display = "inline-block";
    document.getElementById(`editBtn-${index}`).style.display = "inline-block";
    document.getElementById(`saveBtn-${index}`).style.display = "none";
    document.getElementById(`cancelBtn-${index}`).style.display = "none";
    document.getElementById(`check-${index}`).style.display = "inline-block";
}

// Remove a task from the list
function removeTask(index) {
    let tasks = getTasksFromLocalStorage();
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
    updateTaskCount();
}

// Create an icon button
function createIconButton(icon, id, className, color, onClick, hidden = false) {
    let button = document.createElement("button");
    button.id = id;
    button.classList.add(className);
    button.innerHTML = `<span style="font-size:12px;">${icon}</span>`;
    Object.assign(button.style, {
        borderRadius: "5px",
        fontSize: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        color: "#fff",
        fontWeight: "bold",
        backgroundColor: color,
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
    });
    button.onclick = onClick;
    if (hidden) button.style.display = "none";
    return button;
}

// Clear all tasks from the list
document.getElementById("clear-btn").addEventListener("click", clearAllTasks);
document.querySelector(".search-input").addEventListener("input", searchTasks);

// Search tasks based on input
function searchTasks() {
    let searchValue = document.querySelector(".search-input").value.toLowerCase();
    let tasks = document.querySelectorAll("#task-list li");
    tasks.forEach(task => {
        let taskText = task.textContent.toLowerCase();
        task.style.display = taskText.includes(searchValue) ? "flex" : "none";
    });
}

// Filter tasks based on status
document.getElementById("status-select").addEventListener("change", filterTasks);

function filterTasks() {
    let filterValue = document.getElementById("status-select").value;
    let tasks = getTasksFromLocalStorage();
    let taskList = document.getElementById("task-list");
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        if (filterValue === "all" || 
            (filterValue === "active" && !task.completed) || 
            (filterValue === "completed" && task.completed)) {
            appendTask(task.text, index, task.completed);
        }
    });
    toggleEmptyMessage();
}

// Update the task count
function updateTaskCount() {
    let tasks = getTasksFromLocalStorage();
    let activeTasks = tasks.filter(task => !task.completed).length; 
    let taskCount = document.getElementById("task-count");
    if (tasks.length === 0) {
        taskCount.style.display = "none"; 
    } else {
        taskCount.style.display = "inline";
        taskCount.innerHTML = `${activeTasks} item${activeTasks !== 1 ? 's' : ''} left`; 
    }
}

// Add a new task to the list
function addTask() {
    let taskInput = document.getElementById("new-task").value.trim();
    if (taskInput) {
        let tasks = getTasksFromLocalStorage();
        tasks.push({ text: taskInput, completed: false });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        document.getElementById("new-task").value = "";
        appendTask(taskInput, tasks.length - 1, false);
        toggleEmptyMessage();
        updateTaskCount(); 
    }
}

// Clear all tasks from local storage and the list
function clearAllTasks() {
    localStorage.removeItem("tasks");
    document.getElementById("task-list").innerHTML = "";
    toggleEmptyMessage();
    updateTaskCount();
}

// Toggle the display of the empty message
function toggleEmptyMessage() {
    let tasks = getTasksFromLocalStorage();
    let emptyMessage = document.getElementById("empty-message");
    let taskList = document.getElementById("task-list");
    let filterButtons = document.querySelector(".filter-buttons");
    let hr = document.getElementById("task-hr");
    emptyMessage.style.display = tasks.length === 0 ? "block" : "none";
    taskList.style.display = tasks.length === 0 ? "none" : "block";
    hr.style.display = tasks.length === 0 ? "none" : "block";
    filterButtons.style.display = tasks.length === 0 ? "none" : "flex";
}

// Update the active filter button
function updateActiveFilter(filterValue) {
    filterButtons.forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-filter") === filterValue);
    });
}

// Add event listener for Enter key to add task
const taskInput = document.getElementById("new-task");
const addTaskBtn = document.getElementById("add-task");

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addTaskBtn.click();
    }
});
// Change the color of the add task button when input is not empty
taskInput.addEventListener("input", function () {
    if (taskInput.value.trim() !== "") {
        addTaskBtn.style.backgroundColor = "#2ecc71"; // Green color
    } else {
        addTaskBtn.style.backgroundColor = ""; // Default color
    }
});


