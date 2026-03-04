// const STORAGE_KEY = 'tarefas_app_v1';

// const state = {
//   tasks: [],
//   activeList: 'today',
//   search: '',
//   selectedTaskId: null
// };

// const elements = {
//   todayDate: document.getElementById('todayDate'),
//   listTitle: document.getElementById('listTitle'),
//   breadcrumb: document.getElementById('breadcrumb'),
//   menuLists: document.getElementById('menuLists'),
//   tasksContainer: document.getElementById('tasksContainer'),
//   searchInput: document.getElementById('searchInput'),
//   newTaskInput: document.getElementById('newTaskInput'),
//   newTaskDate: document.getElementById('newTaskDate'),
//   newTaskBtn: document.getElementById('newTaskBtn'),
//   addTaskSidebar: document.getElementById('addTaskSidebar'),
//   detailsForm: document.getElementById('detailsForm'),
//   emptyDetails: document.getElementById('emptyDetails'),
//   detailTitle: document.getElementById('detailTitle'),
//   detailDate: document.getElementById('detailDate'),
//   detailNotes: document.getElementById('detailNotes'),
//   detailImportant: document.getElementById('detailImportant'),
//   deleteTaskBtn: document.getElementById('deleteTaskBtn'),
//   sidebar: document.getElementById('sidebar'),
//   openSidebarBtn: document.getElementById('openSidebarBtn'),
//   toggleSidebarBtn: document.getElementById('toggleSidebarBtn')
// };

// const listLabels = {
//   today: 'Meu Dia',
//   soon: 'Em breve',
//   important: 'Importante',
//   completed: 'Concluidas',
//   all: 'Tarefas'
// };

// function save() {
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
// }

// function load() {
//   try {
//     const raw = localStorage.getItem(STORAGE_KEY);
//     state.tasks = raw ? JSON.parse(raw) : [];
//   } catch {
//     state.tasks = [];
//   }
// }

// function formatDateHuman(date) {
//   if (!date) return 'Sem data';
//   return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(`${date}T00:00:00`));
// }

// function isToday(date) {
//   if (!date) return false;
//   const today = new Date();
//   const d = new Date(`${date}T00:00:00`);
//   return d.toDateString() === today.toDateString();
// }

// function isSoon(date) {
//   if (!date) return false;
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const nextWeek = new Date(today);
//   nextWeek.setDate(today.getDate() + 7);
//   const d = new Date(`${date}T00:00:00`);
//   return d >= today && d <= nextWeek;
// }

// function getFilteredTasks() {
//   return state.tasks
//     .filter((task) => {
//       if (state.activeList === 'today') return !task.completed && isToday(task.dueDate);
//       if (state.activeList === 'soon') return !task.completed && isSoon(task.dueDate);
//       if (state.activeList === 'important') return !task.completed && task.important;
//       if (state.activeList === 'completed') return task.completed;
//       return !task.completed;
//     })
//     .filter((task) => {
//       const term = state.search.trim().toLowerCase();
//       if (!term) return true;
//       return `${task.title} ${task.notes || ''}`.toLowerCase().includes(term);
//     })
//     .sort((a, b) => Number(a.completed) - Number(b.completed));
// }

// function updateHeader() {
//   const title = listLabels[state.activeList] || 'Tarefas';
//   elements.listTitle.textContent = title;
//   elements.breadcrumb.textContent = `${title} /`;

//   const date = new Intl.DateTimeFormat('pt-BR', {
//     weekday: 'long',
//     day: '2-digit',
//     month: 'long'
//   }).format(new Date());
//   elements.todayDate.textContent = date;
// }

// function renderTasks() {
//   const tasks = getFilteredTasks();

//   if (!tasks.length) {
//     elements.tasksContainer.innerHTML = '<div class="empty">Nenhuma tarefa aqui. Adicione uma nova tarefa.</div>';
//     return;
//   }

//   elements.tasksContainer.innerHTML = tasks
//     .map((task) => {
//       const selectedClass = task.id === state.selectedTaskId ? 'active' : '';
//       const doneClass = task.completed ? 'done' : '';
//       return `
//         <article class="task ${selectedClass} ${doneClass}" data-id="${task.id}">
//           <input type="checkbox" data-action="toggle" ${task.completed ? 'checked' : ''} />
//           <div data-action="select">
//             <p class="task-title">${task.title}</p>
//             <p class="task-meta">${formatDateHuman(task.dueDate)}${task.notes ? ' • ' + task.notes.slice(0, 40) : ''}</p>
//           </div>
//           <div class="task-right">
//             ${task.important ? '<span class="badge">Importante</span>' : ''}
//             <button class="icon-btn" data-action="star" type="button" title="Importante">★</button>
//           </div>
//         </article>
//       `;
//     })
//     .join('');
// }

// function renderDetails() {
//   const task = state.tasks.find((item) => item.id === state.selectedTaskId);

//   if (!task) {
//     elements.detailsForm.classList.add('hidden');
//     elements.emptyDetails.classList.remove('hidden');
//     return;
//   }

//   elements.emptyDetails.classList.add('hidden');
//   elements.detailsForm.classList.remove('hidden');
//   elements.detailTitle.value = task.title;
//   elements.detailDate.value = task.dueDate || '';
//   elements.detailNotes.value = task.notes || '';
//   elements.detailImportant.checked = !!task.important;
// }

// function renderMenuActive() {
//   const buttons = elements.menuLists.querySelectorAll('.menu-item');
//   buttons.forEach((button) => {
//     button.classList.toggle('active', button.dataset.list === state.activeList);
//   });
// }

// function render() {
//   updateHeader();
//   renderMenuActive();
//   renderTasks();
//   renderDetails();
// }

// function addTask(title, dueDate = '') {
//   const clean = title.trim();
//   if (!clean) return;

//   state.tasks.unshift({
//     id: crypto.randomUUID(),
//     title: clean,
//     dueDate,
//     notes: '',
//     important: false,
//     completed: false,
//     createdAt: Date.now()
//   });

//   save();
//   render();
// }

// function setList(listName) {
//   state.activeList = listName;
//   state.selectedTaskId = null;
//   render();
// }

// elements.menuLists.addEventListener('click', (event) => {
//   const button = event.target.closest('.menu-item');
//   if (!button) return;
//   setList(button.dataset.list);
// });

// elements.newTaskBtn.addEventListener('click', () => {
//   addTask(elements.newTaskInput.value, elements.newTaskDate.value);
//   elements.newTaskInput.value = '';
//   elements.newTaskDate.value = '';
//   elements.newTaskInput.focus();
// });

// elements.newTaskInput.addEventListener('keydown', (event) => {
//   if (event.key === 'Enter') {
//     event.preventDefault();
//     elements.newTaskBtn.click();
//   }
// });

// elements.addTaskSidebar.addEventListener('click', () => {
//   elements.newTaskInput.focus();
// });

// elements.searchInput.addEventListener('input', (event) => {
//   state.search = event.target.value;
//   render();
// });

// elements.tasksContainer.addEventListener('click', (event) => {
//   const taskEl = event.target.closest('.task');
//   if (!taskEl) return;

//   const id = taskEl.dataset.id;
//   const task = state.tasks.find((item) => item.id === id);
//   if (!task) return;

//   const action = event.target.dataset.action;
//   if (action === 'toggle') {
//     task.completed = !task.completed;
//   } else if (action === 'star') {
//     task.important = !task.important;
//   } else {
//     state.selectedTaskId = id;
//   }

//   save();
//   render();
// });

// elements.detailsForm.addEventListener('submit', (event) => {
//   event.preventDefault();
//   const task = state.tasks.find((item) => item.id === state.selectedTaskId);
//   if (!task) return;

//   task.title = elements.detailTitle.value.trim() || task.title;
//   task.dueDate = elements.detailDate.value;
//   task.notes = elements.detailNotes.value.trim();
//   task.important = elements.detailImportant.checked;

//   save();
//   render();
// });

// elements.deleteTaskBtn.addEventListener('click', () => {
//   if (!state.selectedTaskId) return;
//   state.tasks = state.tasks.filter((item) => item.id !== state.selectedTaskId);
//   state.selectedTaskId = null;
//   save();
//   render();
// });

// elements.openSidebarBtn.addEventListener('click', () => {
//   elements.sidebar.classList.add('open');
// });

// elements.toggleSidebarBtn.addEventListener('click', () => {
//   elements.sidebar.classList.toggle('open');
// });

// load();
// render();


const textarea = document.querySelector('.task-input');

textarea.addEventListener('input', () => {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
});

const titleInput = document.getElementById('title');
const addBtn = document.querySelector('.add'); // Seleciona o botão de adicionar

titleInput.addEventListener("input", () => {
  // Verifica se existe texto real (removendo espaços vazios)
  const temTexto = titleInput.value.trim().length > 0;

  if (temTexto) {
    // ESTADO ATIVO: Cor forte e clicável
    addBtn.style.backgroundColor = "var(--accent-strong)"; 
    addBtn.style.filter = "none";
    addBtn.style.cursor = "pointer";
    addBtn.style.opacity = "1";
    addBtn.disabled = false; // Habilita o clique
  } else {
    // ESTADO DESATIVADO: Cor clara e bloqueado
    addBtn.style.backgroundColor = "var(--accent)"; 
    addBtn.style.filter = "brightness(0.9)";
    addBtn.style.cursor = "not-allowed";
    addBtn.style.opacity = "0.6"; // Fica mais "apagado"
    addBtn.disabled = true; // Desabilita o clique
  }
});

function addCardTask() {
  const cardtaks = document.getElementsByClassName("card");
  if (cardtaks[0].style.display === "none") {
    cardtaks[0].style.display = "block";
  }
  else {
    cardtaks[0].style.display = "none";
  }
}



function addTask() {
  const add = document.getElementsByClassName("add");
  const inputTitle = document.getElementById("title").value;
  const inputDesc = document.getElementById("desc").value;

  adicionarTarefa(inputTitle, inputDesc);

  console.log("O que voce digitou foi ", inputTitle, " e a descrição foi ", inputDesc);

  document.getElementById('title').value = "";
  document.getElementById('desc').value = "";
  alert("tarefa salva")
}

function adicionarTarefa(titulo, descricao) {
  const lista = document.getElementById('lista-tarefas');
  const id = Date.now(); // Gerando um ID temporário para controle

  const novaTarefaHTML = `
    <div class="task" draggable="true" data-id="${id}">
      <div class="task-left">
        <input type="checkbox" class="circle-check">
      </div>
      <div class="task-content">
        <p class="task-title">${titulo}</p>
        <p class="task-meta">${descricao}</p>
      </div>
      <button class="clearTask" onclick="clearTaskButton(this)">x</button>
    </div>
  `;

  lista.insertAdjacentHTML('beforeend', novaTarefaHTML);
  
  // Após adicionar, precisamos reatribuir os eventos de drag aos novos elementos
  initDragAndDrop(); 
  
  const cardtaks = document.getElementsByClassName("card");
  cardtaks[0].style.display = "none";
}

function cancelTansk() {
  const cardtaks = document.getElementsByClassName("card");

  cardtaks[0].style.display = "none";
}

function clearTaskButton(botaoClicado) {
  const overlay = document.getElementById("modal-overlay");
  const prompt = document.querySelector(".prompt-Confirm");
  const spanTituloModal = document.getElementById("titleTaks");

  // 1. Acha o container da task que contém esse botão
  const elementoTask = botaoClicado.closest('.task');
  
  // 2. Pega o texto do título dentro desse container
  const tituloDaTask = elementoTask.querySelector('.task-title').innerText;

  if (overlay) {
    overlay.style.display = "flex";
    prompt.style.display = "flex";
    
    // 3. Coloca o título no span do modal   
    spanTituloModal.innerText = tituloDaTask;

    // Opcional: Salvar qual elemento deve ser excluído para usar depois no botão "Excluir"
    window.taskParaExcluir = elementoTask;
  }
}
const overlay = document.getElementById("modal-overlay");

overlay.addEventListener("click", () => {
  overlay.style.display = "none";
});

function clearPrompt() {
  if (window.taskParaExcluir) {
    window.taskParaExcluir.remove(); 
    window.taskParaExcluir = null;   
  }
  cancelPrompt(); 
}

let draggedItem = null;

function initDragAndDrop() {
  const tasks = document.querySelectorAll('.task');
  const container = document.getElementById('lista-tarefas');

  tasks.forEach(task => {
    // Início do arrasto
    task.addEventListener('dragstart', (e) => {
      draggedItem = task;
      task.classList.add('dragging'); // Classe para efeito visual
      e.dataTransfer.effectAllowed = 'move';
    });

    // Fim do arrasto
    task.addEventListener('dragend', () => {
      draggedItem = null;
      task.classList.remove('dragging');
      // Aqui você poderia chamar sua função save() se quiser persistir a nova ordem
    });
  });

  // Lógica do container para aceitar o item
  container.addEventListener('dragover', (e) => {
    e.preventDefault(); // Necessário para permitir o drop
    const afterElement = getDragAfterElement(container, e.clientY);
    if (afterElement == null) {
      container.appendChild(draggedItem);
    } else {
      container.insertBefore(draggedItem, afterElement);
    }
  });
}


// Função auxiliar para calcular a posição do mouse entre os itens
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Inicializa na primeira carga
window.addEventListener('load', () => {
    initDragAndDrop();
});



function addSection() {
  const cardtaks = document.getElementsByClassName("add-name-task");
  if (cardtaks[0].style.display === "none") {
    cardtaks[0].style.display = "block";
  }
  else {
    cardtaks[0].style.display = "none";
  }
}


function cancelSection() {
  const cardtaks = document.getElementsByClassName("add-name-task");
  const sectionInput = document.getElementById('sectionTitle');
  cardtaks[0].style.display = "none";

  document.getElementById('sectionTitle').value = "";
}


const sectionInput = document.getElementById('sectionTitle');
const sectionAddBtn = document.getElementsByClassName('add-section-btn'); // Seleciona o botão de adicionar

sectionInput.addEventListener("input", () => {
  // Verifica se existe texto real (removendo espaços vazios)
  const temTexto = sectionInput.value.trim().length > 0;

  if (temTexto) {
    // ESTADO ATIVO: Cor forte e clicável
    sectionAddBtn[0].style.backgroundColor = "var(--accent-strong)"; 
    sectionAddBtn[0].style.filter = "none";
    sectionAddBtn[0].style.cursor = "pointer";
    sectionAddBtn[0].style.opacity = "1";
    sectionAddBtn[0].disabled = false; // Habilita o clique
  } else {
    // ESTADO DESATIVADO: Cor clara e bloqueado
    sectionAddBtn[0].style.backgroundColor = "var(--accent)"; 
    sectionAddBtn[0].style.filter = "brightness(0.9)";
    sectionAddBtn[0].style.cursor = "not-allowed";
    sectionAddBtn[0].style.opacity = "0.6"; // Fica mais "apagado"
    sectionAddBtn[0].disabled = true; // Desabilita o clique
  }
});


// Função apenas para abrir/fechar o card de input (Troque o nome no seu HTML se preferir)
function openSectionCard() {
  const cardSection = document.querySelector(".add-name-task");
  cardSection.style.display = cardSection.style.display === "none" ? "block" : "none";
  document.getElementById('sectionTitle').focus();
}

// NOVA FUNÇÃO: Para criar a seção visualmente na lista
function confirmAddSection() {
  const input = document.getElementById('sectionTitle');
  const title = input.value.trim();
  const lista = document.getElementById('lista-tarefas');

  if (title === "") return;

  const sectionHTML = `
    <div class="section-header" draggable="true">
      <div class="section-header-left">
        <span class="arrow">▼</span>
        <h3 class="section-title-text">${title}</h3>
      </div>
      <div class="section-header-right">•••</div>
    </div>
  `;

  // Insere a seção na lista
  lista.insertAdjacentHTML('beforeend', sectionHTML);
  
  // Reativa o Drag and Drop para incluir a nova seção se quiser movê-la
  initDragAndDrop();

  // Limpa e fecha
  cancelSection();
}

let estaAberto = true;


function clicArrow() {
  const arrow = document.getElementsByClassName("arrow");
  const add = document.getElementById("addt1");


  if(estaAberto) {
    arrow[0].style.transform = "rotate(0deg)"; 
    add.style.display = "flex";
    estaAberto = false ;
  } else {
    arrow[0].style.transform = "rotate(-90deg)"; 
    add.style.display = "none";
    estaAberto = true ;
  }
}

function addCardTask1() {
  const cardtaks = document.getElementById("cardTaksEdi1");
  const add = document.getElementById("addt1");
  if (cardtaks.style.display === "none") {
    cardtaks.style.display = "block";
    add.style.display = "none";
  }
  else {
    cardtaks.style.display = "none";
  }
}


const card = document.querySelector('#cardTaksEdi1');
const titleInput1 = card.querySelector('#title'); 
const addBtn1 = card.querySelector('.add');
const cardtaks = document.getElementById("cardTaksEdi1");

titleInput1.addEventListener("input", () => {
  // Use a variável correta: titleInput1
  const temTexto = titleInput1.value.trim().length > 0;

  if (temTexto) {
    addBtn1.style.backgroundColor = "var(--accent-strong)"; 
    addBtn1.style.filter = "none";
    addBtn1.style.cursor = "pointer";
    addBtn1.style.opacity = "1";
    addBtn1.disabled = false;
  } else {
    addBtn1.style.backgroundColor = "var(--accent)"; 
    addBtn1.style.fil
    ter = "brightness(0.9)";
    addBtn1.style.cur
    sor = "not-allowed";
    addBtn1.style.opa
    city = "0.6";
    addBtn1.disabled = true;
  }
});

function cancelTansk1() {
  const cardtaks = document.getElementById("#cardTaksEdi1");

  cardtaks.style.display = "none";
}




//Adicionar tarefa no backend
// const titleInput = document.getElementById('title');
// const descInput = document.getElementById('desc');
// const addTaskBtn = document.querySelector('.add');

// async function adicionarNoBackend() {
//     const tarefaTexto = titleInput.value.trim();

//     if (tarefaTexto.length === 0) {
//         alert('Por favor, insira um título para a tarefa.');
//         return;
//     }

//     try {
//         const resposta = await fetch('http://localhost:5000/api/tarefa', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(tarefaTexto)
//         });

//         if (resposta.ok) {
//             const dados = await resposta.json();
//             console.log(dados.mensagem);

//             titleInput.value= "";
//             alert("tarefa salva no backend com sucesso!");

//         } else {
//             alert('Erro ao salvar a tarefa no backend.');
//         }
//     } catch (erro) {
//         console.error("Não foi possivel conectar o backend:", erro);
//         alert("O servidor C# está ligado? Verifique o terminal.");
//     }
// }

// addTaskBtn.addEventListener("click", adicionarNoBackend);

// async function carregarTarefas() {
//     try {
//         const resposta = await fetch('http://localhost:5000/api/tarefa');
//         if (!resposta.ok) return;

//         const tarefas = await resposta.json();
//         const container = document.getElementById('tasksContainer');

//         if (container && tarefas.length > 0) {
//             container.innerHTML = "";
//             tarefas.forEach(t => {
//                 container.innerHTML += `
//                     <article class="task">
//                         <p class="task-title">${t}</p>
//                     </article>
//                 `;
//             });
//         }
//     } catch (erro) {
//         console.error("Erro ao carregar do backend:", erro);
//     }
// }

// // Chame a função apenas aqui
// window.addEventListener('load', carregarTarefas);