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

textarea.addEventListener('input', ()=>{
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
});

const title = document.getElementById('title');
const addBtn = document.getElementsByClassName("add");

title.addEventListener("input", ()=>{

    if(title.value.length >= 1 ) {
        addBtn[0].style.background = "#58b8ac"; //88ccc4
        addBtn[0].style.filter = "none";
        addBtn[0].style.cursor = "pointer";
    }
    else {
        addBtn[0].style.background = "#88ccc4"; //58b8ac
        addBtn[0].style.filter = "brightness(0.8)";
        addBtn[0].style.cursor = "not-allowed";
    };

})

function addTask() {
    const cardtaks = document.getElementsByClassName("card");
    if (cardtaks[0].style.display === "none"){
        cardtaks[0].style.display = "block"; 
    }
    else {
        cardtaks[0].style.display = "none";
    }
}

function cancelTansk() {
    const cardtaks = document.getElementsByClassName("card");

    cardtaks[0  ].style.display = "none";
}

