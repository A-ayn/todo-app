let todos = [];

window.onload = function () {
  loadTodos();
  renderTodos();
};

document.getElementById("todo-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("todo-input");
  const dateInput = document.getElementById("due-date");
  const detailInput = document.getElementById("todo-detail");
  const text = input.value.trim();
  const dueDate = dateInput.value;
  const detail = detailInput.value.trim();

  if (text) {
    todos.push({
      text: text,
      completed: false,
      dueDate: dueDate,
      detail: detail
    });
    saveTodos();
    renderTodos();
    input.value = "";
    dateInput.value = "";
    detailInput.value = "";
  }
});

function createTodoElement(todo, index) {
  const todoItem = document.createElement("li");
  if (todo.completed) {
    todoItem.classList.add("completed");
  }

  // ヘッダー(1行で表示)
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.alignItems = "center";
  header.style.justifyContent = "space-between";
  header.style.gap = "10px";
  header.style.width = "100%";

  header.classList.add("todo-header");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", function () {
    todo.completed = checkbox.checked;
    saveTodos();
    renderTodos();
  });

  const textSpan = document.createElement("span");
  textSpan.textContent = todo.text;
  if (todo.completed) {
    textSpan.style.textDecoration = "line-through";
  }

  const date = document.createElement("small");
  date.textContent = "期限: " + todo.dueDate;
  if (todo.dueDate && new Date(todo.dueDate) < new Date().setHours(0,0,0,0)) {
    date.style.color = "red";
    date.style.fontWeight = "bold";
  }

  const toggleDetailButton = document.createElement("button");
  toggleDetailButton.textContent = "🔽";
  toggleDetailButton.style.background = "none";
  toggleDetailButton.style.fontSize = "20px";
  toggleDetailButton.style.cursor = "pointer";
  toggleDetailButton.style.flexShrink = "0";

  // 詳細セクション(初期非表示)
  const detailSection = document.createElement("div");
  detailSection.style.display = "none"; // 最初は非表示
  detailSection.style.width = "100%";
  detailSection.style.marginTop = "0";

  const detailTextarea = document.createElement("textarea");
  detailTextarea.value = todo.detail || "";
  detailTextarea.placeholder = "詳細を入力...";
  detailTextarea.addEventListener("input", () => {
    todo.detail = detailTextarea.value;
    saveTodos();
  });

  // 編集ボタン
  const editButton = document.createElement("button");
  editButton.textContent = "編集";
  editButton.addEventListener("click", function () {
    const newText = prompt("タスクを編集:", todo.text);
    const newDate = prompt("期限を編集 (YYYY-MM-DD):", todo.dueDate);
    const newDetail = prompt("詳細を編集:", todo.detail);
    if (newText !== null) todo.text = newText.trim();
    if (newDate !== null) todo.dueDate = newDate.trim() || null;
    if (newDetail !== null) todo.detail = newDetail.trim();
    saveTodos();
    renderTodos();
  });

  // 削除ボタン
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "削除";
  deleteButton.addEventListener("click", function () {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
  });

  // ボタン配置調整
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(deleteButton);

  // トグル動作
  toggleDetailButton.addEventListener("click", function () {
    detailSection.style.display =
      detailSection.style.display === "none" ? "block" : "none";
    toggleDetailButton.textContent =
      detailSection.style.display === "none" ? "🔽" : "🔼";
  });

  header.appendChild(checkbox);
  header.appendChild(textSpan);
  header.appendChild(date);
  header.appendChild(toggleDetailButton);

  detailSection.appendChild(detailTextarea);
  detailSection.appendChild(buttonContainer);

  todoItem.appendChild(header);
  todoItem.appendChild(detailSection);

  return todoItem;
}

//　完了タスク非表示フラグ
let hideCompleted = false;

document.getElementById("toggle-completed").addEventListener("click", function () {
  hideCompleted = !hideCompleted;
  this.textContent = hideCompleted ? "完了タスクを表示する" : "完了タスクを隠す";
  renderTodos();
});

function renderTodos() {
  const list = document.getElementById("todo-list");
  list.innerHTML = "";

  // 期限順で並び替え（空の期限は最後）
  todos.sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  //　完了タスクの表示条件
  const filterTodos = todos.filter(todo => !hideCompleted || !todo.completed);
  filterTodos.forEach((todo, index) => {
    list.appendChild(createTodoElement(todo, index));
  });
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  const stored = localStorage.getItem("todos");
  if (stored) {
    todos = JSON.parse(stored);
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('service-worker.js')
    .then(function (registration) {
      console.log('ServiceWorker registration successful:', registration.scope);
    }, function (err) {
      console.log('ServiceWorker registration failed:', err);
    });
  });
}
