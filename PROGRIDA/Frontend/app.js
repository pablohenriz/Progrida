// =============================================================================
// ESTADO GLOBAL DA APLICAÇÃO
// =============================================================================
const state = {
  tasks: [],          // { id, title, desc, done, sectionId, order }
  sections: [],       // { id, title, collapsed }
  taskParaExcluir: null,
};

// =============================================================================
// PERSISTÊNCIA (localStorage)
// =============================================================================
function salvarEstado() {
  try {
    localStorage.setItem("tasks", JSON.stringify(state.tasks));
    localStorage.setItem("sections", JSON.stringify(state.sections));
  } catch (_) { }
}

function carregarEstado() {
  try {
    state.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    state.sections = JSON.parse(localStorage.getItem("sections")) || [];
  } catch (_) {
    state.tasks = [];
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
// TOAST
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
    btn.style.filter = tem ? "none" : "brightness(0.9)";
    btn.style.cursor = tem ? "pointer" : "not-allowed";
    btn.style.opacity = tem ? "1" : "0.6";
    btn.disabled = !tem;
  }

  input.addEventListener("input", atualizar);
  atualizar();
}

// =============================================================================
// MODAL DE CONFIRMAÇÃO
// =============================================================================
function abrirModalExclusao(taskEl) {
  const overlay = document.getElementById("modal-overlay");
  const titulo = taskEl.querySelector(".task-title")?.innerText || "";

  document.getElementById("titleTaks").innerText = titulo;
  state.taskParaExcluir = taskEl;

  overlay.style.display = "flex";
  requestAnimationFrame(() => overlay.classList.add("active"));
}

function fecharModal() {
  const overlay = document.getElementById("modal-overlay");
  overlay.classList.remove("active");
  setTimeout(() => { overlay.style.display = "none"; }, 300);
  state.taskParaExcluir = null;
}

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

document.getElementById("modal-overlay").addEventListener("click", function (e) {
  if (e.target === this) fecharModal();
});

// =============================================================================
// CRIAR ELEMENTO DE TAREFA
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

  div.querySelector(".circle-check").addEventListener("change", function () {
    task.done = this.checked;
    div.classList.toggle("done", task.done);
    salvarEstado();

    enviarParaBancoDeDados(task);
  });

  div.querySelector(".clearTask").addEventListener("click", () => abrirModalExclusao(div));

  div.addEventListener("dragstart", e => {
    dragState.item = div;
    div.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
  });

  // FIX: persiste sectionId e ordem após soltar o elemento arrastado
  div.addEventListener("dragend", () => {
    div.classList.remove("dragging");

    if (dragState.item) {
      const container = div.parentElement;
      if (container) {
        const sectionWrapper = container.closest(".group-section");
        const t = state.tasks.find(t => t.id === div.dataset.id);
        if (t) {
          t.sectionId = sectionWrapper ? sectionWrapper.dataset.sectionId : null;
        }
        sincronizarOrdemNoEstado(container);
      }
      salvarEstado();
    }

    dragState.item = null;
  });

  return div;
}

// FIX: atualiza o campo `order` no state conforme posição visual no DOM
function sincronizarOrdemNoEstado(container) {
  [...container.querySelectorAll(".task")].forEach((el, i) => {
    const t = state.tasks.find(t => t.id === el.dataset.id);
    if (t) t.order = i;
  });
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
  document.getElementById("desc").value = "";
}

function addTask() {
  const titulo = document.getElementById("title").value.trim();
  const desc = document.getElementById("desc").value.trim();
  if (!titulo) return;

  const task = {
    id: gerarId(),
    title: titulo,
    desc,
    done: false,
    sectionId: null,
    order: state.tasks.length
  };
  state.tasks.push(task);
  salvarEstado();
  enviarParaBancoDeDados(task);

  document.getElementById("lista-tarefas").appendChild(criarTaskEl(task));
  registrarContainersDroppable();

  document.getElementById("title").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("cardTaksEdi").style.display = "none";
  showToast("Tarefa adicionada!");
}

async function enviarParaBancoDeDados(task) {
  try {
    const resposta = await fetch("http://localhost:5221/tasks", { // Substitua pela sua URL
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(task) // Transforma o objeto 'task' em JSON
    });

    if (resposta.ok) {
      console.log("Tarefa salva no servidor com sucesso!");
    } else {
      console.error("Erro ao salvar no servidor.");
      showToast("Erro ao sincronizar com o servidor", "error");
    }
  } catch (error) {
    console.error("Falha na conexão com o banco de dados:", error);
  }
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

// FIX: excluir seção e todas as suas tarefas
function excluirSecao(section, wrapper) {
  state.tasks = state.tasks.filter(t => t.sectionId !== section.id);
  state.sections = state.sections.filter(s => s.id !== section.id);
  wrapper.remove();
  salvarEstado();
  showToast("Seção excluída.");
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
      <div class="section-header-right section-options-btn" title="Excluir seção">✕</div>
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

  const lista = wrapper.querySelector(`#tasks-${section.id}`);
  const arrow = wrapper.querySelector(".arrow");
  const addTaskLink = wrapper.querySelector(".add-task-section-btn");
  const card = wrapper.querySelector(".section-card");
  const titleInput = wrapper.querySelector(".sec-title-input");
  const descInput = wrapper.querySelector(".sec-desc-input");
  const addBtn = wrapper.querySelector(".sec-add-btn");
  const cancelBtn = wrapper.querySelector(".sec-cancel-btn");

  // FIX: bind direto, sem onclick inline no HTML
  wrapper.querySelector(".section-options-btn").addEventListener("click", () => {
    if (confirm(`Excluir a seção "${section.title}" e todas as suas tarefas?`)) {
      excluirSecao(section, wrapper);
    }
  });

  if (section.collapsed) {
    lista.style.display = "none";
    addTaskLink.style.display = "none";
  }

  // Restaurar tarefas respeitando a ordem salva
  state.tasks
    .filter(t => t.sectionId === section.id)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .forEach(t => lista.appendChild(criarTaskEl(t)));

  arrow.addEventListener("click", () => {
    section.collapsed = !section.collapsed;
    arrow.classList.toggle("collapsed", section.collapsed);
    lista.style.display = section.collapsed ? "none" : "";
    addTaskLink.style.display = section.collapsed ? "none" : "flex";
    if (section.collapsed) card.style.display = "none";
    salvarEstado();
  });

  addTaskLink.addEventListener("click", () => {
    card.style.display = "flex";
    addTaskLink.style.display = "none";
    titleInput.focus();
  });

  cancelBtn.addEventListener("click", () => {
    card.style.display = "none";
    addTaskLink.style.display = "flex";
    titleInput.value = "";
    descInput.value = "";
    bindAddButton(titleInput, addBtn);
  });

  bindAddButton(titleInput, addBtn);
  titleInput.addEventListener("input", () => autoResize(titleInput));
  descInput.addEventListener("input", () => autoResize(descInput));

  addBtn.addEventListener("click", () => {
    const titulo = titleInput.value.trim();
    const desc = descInput.value.trim();
    if (!titulo) return;

    const task = { id: gerarId(), title: titulo, desc, done: false, sectionId: section.id, order: state.tasks.length };
    state.tasks.push(task);
    salvarEstado();

    lista.appendChild(criarTaskEl(task));
    registrarContainersDroppable();

    titleInput.value = "";
    descInput.value = "";
    card.style.display = "none";
    addTaskLink.style.display = "flex";
    showToast("Tarefa adicionada!");
  });

  registrarContainersDroppable();
}

// =============================================================================
// DRAG AND DROP
// =============================================================================
const dragState = { item: null };

function registrarContainersDroppable() {
  document.querySelectorAll("#lista-tarefas, .tasks-list-container").forEach(container => {
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
    const box = child.getBoundingClientRect();
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

document.addEventListener("click", e => {
  const sidebar = document.getElementById("sidebar");
  const openBtn = document.getElementById("openSidebarBtn");
  if (
    sidebar?.classList.contains("open") &&
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
  // FIX: capitaliza a primeira letra (pt-BR retorna tudo em minúsculas)
  const data = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long",
  });
  el.textContent = data.charAt(0).toUpperCase() + data.slice(1);
}

// =============================================================================
// INICIALIZAÇÃO
// =============================================================================
window.addEventListener("load", () => {
  carregarEstado();

  document.querySelectorAll(".task-input").forEach(el => {
    el.addEventListener("input", () => autoResize(el));
  });

  // FIX: removida a linha que sobrescrevia o ID do botão
  const titleMain = document.getElementById("title");
  const addMain = document.querySelector("#cardTaksEdi .add");
  if (titleMain && addMain) bindAddButton(titleMain, addMain);

  const listaPrincipal = document.getElementById("lista-tarefas");
  listaPrincipal.innerHTML = "";
  state.tasks
    .filter(t => t.sectionId === null)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .forEach(t => listaPrincipal.appendChild(criarTaskEl(t)));

  document.getElementById("main-sections-container").innerHTML = `
    <div class="add-name-task">
      <input type="text" class="add-name-input" id="sectionTitle" placeholder="Nomear esta seção">
      <div class="group-bottom-add-section">
        <button class="add-section-btn">Adicionar seção</button>
        <button class="cancel-section-btn">Cancelar</button>
      </div>
    </div>
  `;

  // FIX: bind direto, sem onclick inline
  document.querySelector(".add-section-btn").addEventListener("click", addSectionS);
  document.querySelector(".cancel-section-btn").addEventListener("click", cancelSection);

  const secTitleInput = document.getElementById("sectionTitle");
  const secAddBtn = document.querySelector(".add-section-btn");
  if (secTitleInput && secAddBtn) bindAddButton(secTitleInput, secAddBtn);

  state.sections.forEach(renderizarSecao);

  registrarContainersDroppable();
  setarDataHoje();
});