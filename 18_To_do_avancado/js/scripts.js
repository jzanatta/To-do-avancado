// faltai
// erro da imagem cortada em telas grandes

// Seleção dos elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

// Funções
const saveTodo = (text, done, save = 1) => {
    // Criando tarefa
    const todo = document.createElement("div");
    todo.classList.add("todo");
      

    // Criando elemento tarefa hr
    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    // Criando elemento tarefa buttons
    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);
  
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(deleteBtn);

    // utilizando dados da localStorage
    if (done) {
        todo.classList.add("done");
    }
    
    if (save) {
        saveTodoLocalStorage({ text, done});
    }

    // Adicionando o todo em #todo-list
    todoList.appendChild(todo);

    // Limpando o campo de add tarefa 
    todoInput.value = "";
    // Foca novamente no campo de add tarefa
    // todoInput.focus();
}

const toggleForms = () =>{ 
    //add ou remove a classe hide
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
}

const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo");
  
    todos.forEach((todo) => {
      let todoTitle = todo.querySelector("h3");
  
      if (todoTitle.innerText === oldInputValue) {
        todoTitle.innerText = text;
  
        // Utilizando dados da localStorage
        updateTodoLocalStorage(oldInputValue, text);
      }
    });
};

const getSearchedTodos = (search) => {
    const todos = document.querySelectorAll(".todo");
  
    todos.forEach((todo) => {
      const todoTitle = todo.querySelector("h3").innerText.toLowerCase();
  
      todo.style.display = "flex";
  
      console.log(todoTitle);
  
      if (!todoTitle.includes(search)) {
        todo.style.display = "none";
      }
    });
};

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");
  
    switch (filterValue) {
      case "all":
        todos.forEach((todo) => (todo.style.display = "flex"));
  
        break;
  
      case "done":
        todos.forEach((todo) =>
          todo.classList.contains("done")
            ? (todo.style.display = "flex")
            : (todo.style.display = "none")
        );
  
        break;
  
      case "todo":
        todos.forEach((todo) =>
          !todo.classList.contains("done")
            ? (todo.style.display = "flex")
            : (todo.style.display = "none")
        );
  
        break;
  
      default:
        break;editForm
    }
};

// Eventos
todoForm.addEventListener("submit", (e) => {
// click no add tarefa
    e.preventDefault();

    const inputValue = todoInput.value;

    if (inputValue){
        // save to do
        saveTodo(inputValue);
    }
});

document.addEventListener("click", (e) => {
// click nos botões de cada tarefa
const targetEl = e.target;
const parentEl = targetEl.closest("div");
let todoTitle;

    if(parentEl && parentEl.querySelector("h3")){
        todoTitle = parentEl.querySelector("h3").innerText || "";
    }
    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");
    
        updateTodoStatusLocalStorage(todoTitle);
    }
    
    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
    
        // Utilizando dados da localStorage
        removeTodoLocalStorage(todoTitle);
    }

    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();
    
        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }
});

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms();
});

editForm.addEventListener("submit", (e) => {
    //atualizar descrição depois da atualização
    e.preventDefault();

    const editInputValue = editInput.value;
  
    if (editInputValue) {
      updateTodo(editInputValue);
    }
  
    toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;
  
    getSearchedTodos(search);
});
  
eraseBtn.addEventListener("click", (e) => {
    e.preventDefault();
  
    searchInput.value = "";
  
    searchInput.dispatchEvent(new Event("keyup"));
    //dispatchEvent dispara um evento simulado
});

filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value;
  
    filterTodos(filterValue);
});

// Local Storage
const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
  
    return todos;
};
  
const loadTodos = () => {
    const todos = getTodosLocalStorage();
  
    todos.forEach((todo) => {
      saveTodo(todo.text, todo.done, 0);
    });
};

const saveTodoLocalStorage = (todo) => {
    // todos os dados da ls
    const todos = getTodosLocalStorage();
    
    // add novo todo no arr
    todos.push(todo);

    // salvar tudo na ls
    localStorage.setItem("todos", JSON.stringify(todos));
}

const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
  
    const filteredTodos = todos.filter((todo) => todo.text != todoText);
  
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
  
    todos.map((todo) => {
        if(todo.text === todoText) todo.done = !todo.done;
    });
  
    localStorage.setItem("todos", JSON.stringify(todos));
};
  
const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();
  
    todos.map((todo) =>
      todo.text === todoOldText ? (todo.text = todoNewText) : null
    );
  
    localStorage.setItem("todos", JSON.stringify(todos));
};

loadTodos();