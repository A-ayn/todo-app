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

  // タスク期限を設定
  const date = document.createElement("small");
  if (todo.dueDate) {
    const dueDateObj = new Date(todo.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.textContent = "期限: " + todo.dueDate;
    if (dueDateObj < today) {
      date.style.color = "red";
      date.style.fontWeight = "bold";
    }
  }

  // タスク詳細を入力
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

    if (newText !== null) {
      todo.text = newText.trim();
    }

    if (newDate !== null) {
      todo.dueDate = newDate.trim() || null;
    }

    if (newDetail !== null) {
      todo.detail = newDetail.trim();
    }

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

  todoItem.appendChild(checkbox);
  todoItem.appendChild(textSpan);
  todoItem.appendChild(date);
  todoItem.appendChild(detailTextarea);
  todoItem.appendChild(editButton);
  todoItem.appendChild(deleteButton);

  return todoItem;
}

function renderTodos() {
  const list = document.getElementById("todo-list");
  list.innerHTML = "";

  // 期限順で並び替え（空の期限は最後）
  todos.sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  todos.forEach((todo, index) => {
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