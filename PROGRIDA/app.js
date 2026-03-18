// =============================================================================
// ESTADO GLOBAL DA APLICAÇÃO
// =============================================================================
const state = {
  tasks: [],          // { id, title, desc, done, sectionId: null }
  sections: [],       // { id, title, collapsed }
  taskParaExcluir: null,
};

// =============================================================================
// PERSISTÊNCIA (localStorage)
// =============================================================================
function salvarEstado() {
  try {
    localStorage.setItem("tasks",    JSON.stringify(state.tasks));
    localStorage.setItem("sections", JSON.stringify(state.sections));
  } catch (_) {}
}

function carregarEstado() {
  try {
    state.tasks    = JSON.parse(localStorage.getItem("tasks"))    || [];
    state.sections = JSON.parse(localStorage.getItem("sections")) || [];
  } catch (_) {
    state.tasks    = [];
    state.sections = [];
  }
}

// =============================================================================
// UTILITÁRIOS
// =============================================================================
function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function autoResize(el) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
}

// =============================================================================
// TOAST — substitui alert()
// =============================================================================
function showToast(msg, tipo = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.cssText = [
      "position:fixed", "bottom:24px", "right:24px",
      "display:flex", "flex-direction:column", "gap:8px", "z-index:99999"
    ].join(";");
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.textContent = msg;
  toast.style.cssText = [
    `background:${tipo === "error" ? "#df6b6b" : "var(--accent-strong)"}`,
    "color:#fff", "padding:10px 18px", "border-radius:8px",
    "font-size:14px", "font-weight:600",
    "box-shadow:0 4px 16px rgba(0,0,0,.4)",
    "transition:opacity .3s ease",
  ].join(";");

  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = "0"; }, 2000);
  setTimeout(() => toast.remove(), 2350);
}

// =============================================================================
// ATIVAR / DESATIVAR BOTÃO CONFORME INPUT
// =============================================================================
function bindAddButton(input, btn) {
  if (!input || !btn) return;

  function atualizar() {
    const tem = input.value.trim().length > 0;
    btn.style.backgroundColor = tem ? "var(--accent-strong)" : "var(--accent)";
    btn.style.filter          = tem ? "none" : "brightness(0.9)";
    btn.style.cursor          = tem ? "pointer" : "not-allowed";
    btn.style.opacity         = tem ? "1" : "0.6";
    btn.disabled              = !tem;
  }

  input.addEventListener("input", atualizar);
  atualizar();
}

// =============================================================================
// MODAL DE CONFIRMAÇÃO
// =============================================================================
function abrirModalExclusao(taskEl) {
  const overlay = document.getElementById("modal-overlay");
  const titulo  = taskEl.querySelector(".task-title")?.innerText || "";

  document.getElementById("titleTaks").innerText = titulo;
  state.taskParaExcluir = taskEl;

  overlay.style.display = "flex";
  // Pequeno delay para a transição de entrada funcionar
  requestAnimationFrame(() => overlay.classList.add("active"));
}

function fecharModal() {
  const overlay = document.getElementById("modal-overlay");
  overlay.classList.remove("active");
  setTimeout(() => { overlay.style.display = "none"; }, 300);
  state.taskParaExcluir = null;
}

// Expõe para o HTML (onclick="cancelPrompt()")
function cancelPrompt() { fecharModal(); }

function clearPrompt() {
  if (state.taskParaExcluir) {
    const id = state.taskParaExcluir.dataset.id;
    state.tasks = state.tasks.filter(t => t.id !== id);
    state.taskParaExcluir.remove();
    salvarEstado();
    showToast("Tarefa excluída.");
  }
  fecharModal();
}

// Fechar clicando no fundo escuro
document.getElementById("modal-overlay").addEventListener("click", function (e) {
  if (e.target === this) fecharModal();
});

// =============================================================================
// CRIAR ELEMENTO DE TAREFA — única fonte da verdade
// =============================================================================
function criarTaskEl(task) {
  const div = document.createElement("div");
  div.className = `task${task.done ? " done" : ""}`;
  div.setAttribute("draggable", "true");
  div.dataset.id = task.id;

  div.innerHTML = `
    <div class="task-left">
      <input type="checkbox" class="circle-check" ${task.done ? "checked" : ""}>
    </div>
    <div class="task-content">
      <p class="task-title">${escapeHTML(task.title)}</p>
      ${task.desc ? `<p class="task-meta">${escapeHTML(task.desc)}</p>` : ""}
    </div>
    <button class="clearTask" title="Excluir">✕</button>
  `;

  // Checkbox
  div.querySelector(".circle-check").addEventListener("change", function () {
    task.done = this.checked;
    div.classList.toggle("done", task.done);
    salvarEstado();
  });

  // Botão excluir
  div.querySelector(".clearTask").addEventListener("click", () => abrirModalExclusao(div));

  // Drag
  div.addEventListener("dragstart", e => {
    dragState.item = div;
    div.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
  });
  div.addEventListener("dragend", () => {
    div.classList.remove("dragging");
    dragState.item = null;
  });

  return div;
}

// =============================================================================
// LISTA PRINCIPAL (sem seção)
// =============================================================================
function addCardTask() {
  const card = document.getElementById("cardTaksEdi");
  const aberto = card.style.display === "flex";
  card.style.display = aberto ? "none" : "flex";
  if (!aberto) document.getElementById("title").focus();
}

function cancelTansk() {
  document.getElementById("cardTaksEdi").style.display = "none";
  document.getElementById("title").value = "";
  document.getElementById("desc").value  = "";
}

function addTask() {
  const titulo = document.getElementById("title").value.trim();
  const desc   = document.getElementById("desc").value.trim();
  if (!titulo) return;

  const task = { id: gerarId(), title: titulo, desc, done: false, sectionId: null };
  state.tasks.push(task);
  salvarEstado();

  document.getElementById("lista-tarefas").appendChild(criarTaskEl(task));
  registrarContainersDroppable();

  document.getElementById("title").value = "";
  document.getElementById("desc").value  = "";
  document.getElementById("cardTaksEdi").style.display = "none";
  showToast("Tarefa adicionada!");
}

// =============================================================================
// SEÇÕES DINÂMICAS
// =============================================================================
function addSection() {
  const card = document.querySelector(".add-name-task");
  card.classList.toggle("active");
  if (card.classList.contains("active")) {
    document.getElementById("sectionTitle").focus();
  }
}

function cancelSection() {
  document.querySelector(".add-name-task").classList.remove("active");
  document.getElementById("sectionTitle").value = "";
}

function addSectionS() {
  const input = document.getElementById("sectionTitle");
  const titulo = input.value.trim();
  if (!titulo) return;

  const section = { id: gerarId(), title: titulo, collapsed: false };
  state.sections.push(section);
  salvarEstado();

  renderizarSecao(section);

  input.value = "";
  cancelSection();
  showToast(`Seção "${titulo}" criada!`);
}

function renderizarSecao(section) {
  const container = document.getElementById("main-sections-container");

  const wrapper = document.createElement("div");
  wrapper.className = "group-section";
  wrapper.dataset.sectionId = section.id;

  wrapper.innerHTML = `
    <div class="section-header">
      <div class="section-header-left">
        <button class="arrow${section.collapsed ? " collapsed" : ""}" title="Expandir / Recolher">▼</button>
        <h3 class="section-title-text">${escapeHTML(section.title)}</h3>
      </div>
      <div class="section-header-right" title="Opções">•••</div>
    </div>
    <div class="tasks-list-container" id="tasks-${section.id}"></div>
    <a class="add-taks add-task-section-btn"><span>+</span> Adicionar tarefa</a>
    <div class="card section-card" style="display:none;">
      <div class="top">
        <div class="title-desc">
          <textarea class="task-input sec-title-input" placeholder="Nome da tarefa"></textarea>
          <textarea class="task-input sec-desc-input"  placeholder="Descrição"></textarea>
        </div>
      </div>
      <div class="row-bottom">
        <div class="actions">
          <button class="cancel sec-cancel-btn">Cancelar</button>
          <button class="add sec-add-btn" disabled>Adicionar tarefa</button>
        </div>
      </div>
    </div>
  `;

  container.appendChild(wrapper);

  const lista       = wrapper.querySelector(`#tasks-${section.id}`);
  const arrow       = wrapper.querySelector(".arrow");
  const addTaskLink = wrapper.querySelector(".add-task-section-btn");
  const card        = wrapper.querySelector(".section-card");
  const titleInput  = wrapper.querySelector(".sec-title-input");
  const descInput   = wrapper.querySelector(".sec-desc-input");
  const addBtn      = wrapper.querySelector(".sec-add-btn");
  const cancelBtn   = wrapper.querySelector(".sec-cancel-btn");

  // Restaurar estado de colapso
  if (section.collapsed) {
    lista.style.display       = "none";
    addTaskLink.style.display = "none";
  }

  // Restaurar tarefas salvas desta seção
  state.tasks
    .filter(t => t.sectionId === section.id)
    .forEach(t => lista.appendChild(criarTaskEl(t)));

  // Toggle colapso
  arrow.addEventListener("click", () => {
    section.collapsed = !section.collapsed;
    arrow.classList.toggle("collapsed", section.collapsed);
    lista.style.display       = section.collapsed ? "none" : "";
    addTaskLink.style.display = section.collapsed ? "none" : "flex";
    if (section.collapsed) card.style.display = "none";
    salvarEstado();
  });

  // Abrir card de nova tarefa
  addTaskLink.addEventListener("click", () => {
    card.style.display = "flex";
    addTaskLink.style.display = "none";
    titleInput.focus();
  });

  // Cancelar
  cancelBtn.addEventListener("click", () => {
    card.style.display        = "none";
    addTaskLink.style.display = "flex";
    titleInput.value = "";
    descInput.value  = "";
    bindAddButton(titleInput, addBtn); // reset visual
  });

  // Ativar botão ao digitar
  bindAddButton(titleInput, addBtn);
  titleInput.addEventListener("input", () => autoResize(titleInput));
  descInput.addEventListener("input",  () => autoResize(descInput));

  // Adicionar tarefa na seção
  addBtn.addEventListener("click", () => {
    const titulo = titleInput.value.trim();
    const desc   = descInput.value.trim();
    if (!titulo) return;

    const task = { id: gerarId(), title: titulo, desc, done: false, sectionId: section.id };
    state.tasks.push(task);
    salvarEstado();

    lista.appendChild(criarTaskEl(task));
    registrarContainersDroppable();

    titleInput.value = "";
    descInput.value  = "";
    card.style.display        = "none";
    addTaskLink.style.display = "flex";
    showToast("Tarefa adicionada!");
  });

  // Registrar lista como droppable
  registrarContainersDroppable();
}

// =============================================================================
// DRAG AND DROP — implementação única e centralizada
// =============================================================================
const dragState = { item: null };

function registrarContainersDroppable() {
  document.querySelectorAll("#lista-tarefas, .tasks-list-container").forEach(container => {
    // Evita registrar duas vezes usando data attribute
    if (container.dataset.dropRegistered) return;
    container.dataset.dropRegistered = "true";

    container.addEventListener("dragover", e => {
      e.preventDefault();
      if (!dragState.item) return;
      const after = getDragAfterElement(container, e.clientY);
      if (after == null) container.appendChild(dragState.item);
      else container.insertBefore(dragState.item, after);
    });
  });
}

function getDragAfterElement(container, y) {
  const els = [...container.querySelectorAll(".task:not(.dragging)")];
  return els.reduce((closest, child) => {
    const box    = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    return offset < 0 && offset > closest.offset
      ? { offset, element: child }
      : closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// =============================================================================
// SIDEBAR (mobile)
// =============================================================================
document.getElementById("openSidebarBtn")?.addEventListener("click", () => {
  document.getElementById("sidebar").classList.add("open");
});

document.getElementById("toggleSidebarBtn")?.addEventListener("click", () => {
  document.getElementById("sidebar").classList.remove("open");
});

// Fechar sidebar ao clicar fora (mobile)
document.addEventListener("click", e => {
  const sidebar = document.getElementById("sidebar");
  const openBtn = document.getElementById("openSidebarBtn");
  if (
    sidebar.classList.contains("open") &&
    !sidebar.contains(e.target) &&
    e.target !== openBtn
  ) {
    sidebar.classList.remove("open");
  }
});

// =============================================================================
// DATA DE HOJE
// =============================================================================
function setarDataHoje() {
  const el = document.getElementById("todayDate");
  if (!el) return;
  el.textContent = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long",
  });
}

// =============================================================================
// INICIALIZAÇÃO
// =============================================================================
window.addEventListener("load", () => {
  carregarEstado();

  // Auto-resize nos textareas do form principal
  document.querySelectorAll(".task-input").forEach(el => {
    el.addEventListener("input", () => autoResize(el));
  });

  // Ativar botão principal
  const titleMain = document.getElementById("title");
  const addMain   = document.querySelector("#cardTaksEdi .add");
  if (titleMain && addMain) {
    addMain.id = "mainAddBtn"; // garante ID
    bindAddButton(titleMain, addMain);
  }

  // Ativar botão de seção
  const secTitleInput = document.getElementById("sectionTitle");
  const secAddBtn     = document.querySelector(".add-section-btn");
  if (secTitleInput && secAddBtn) bindAddButton(secTitleInput, secAddBtn);

  // Renderizar tarefas salvas na lista principal
  const listaPrincipal = document.getElementById("lista-tarefas");
  // Limpa o item de exemplo estático do HTML
  listaPrincipal.innerHTML = "";
  state.tasks
    .filter(t => t.sectionId === null)
    .forEach(t => listaPrincipal.appendChild(criarTaskEl(t)));

  // Renderizar seções salvas
  // Limpa seção de exemplo estática do HTML
  document.getElementById("main-sections-container").innerHTML = `
    <div class="add-name-task">
      <input type="text" class="add-name-input" id="sectionTitle" placeholder="Nomear esta seção">
      <div class="group-bottom-add-section">
        <button class="add-section-btn" onclick="addSectionS()">Adicionar seção</button>
        <button class="cancel-section-btn" onclick="cancelSection()">Cancelar</button>
      </div>
    </div>
  `;

  // Re-bind após recriar o HTML
  const secTitleInput2 = document.getElementById("sectionTitle");
  const secAddBtn2     = document.querySelector(".add-section-btn");
  if (secTitleInput2 && secAddBtn2) bindAddButton(secTitleInput2, secAddBtn2);

  state.sections.forEach(renderizarSecao);

  registrarContainersDroppable();
  setarDataHoje();
});