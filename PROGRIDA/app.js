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












function addSectionS() {
  const input = document.getElementById('sectionTitle');
  const title = input.value.trim();
  const container = document.getElementById('main-sections-container');

  if (title === "") return;

  // Geramos um ID único para esta seção específica
  const sectionId = "section-" + Date.now();

  const sectionHTML = `
    <div class="group-section" id="${sectionId}">
      <div class="section-header">
        <div class="section-header-left">
          <button class="arrow" onclick="toggleSectionVisibility(this)">▼</button>
          <h3 class="section-title-text">${title}</h3>
        </div>
        <div class="section-header-right">•••</div>
      </div>

      <div class="tasks-list-container"></div>

      <a class="add-taks" onclick="createNewTaskRow(this)"><span>+</span> Adicionar tarefa</a>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', sectionHTML);
  
  // Limpa o campo e fecha o card de criação
  input.value = "";
  cancelSection();
  initDragAndDrop(); // Atualiza o sistema de arrastar para a nova seção
}












let estaAberto = true;

function clicArrow() {
  const arrow = document.getElementsByClassName("arrow");
  const add = document.getElementById("addt1");
  const listTask1 = document.getElementById("lista-tarefas1");


  if (estaAberto) {
    arrow[0].style.transform = "rotate(0deg)";
    add.style.display = "flex";
    listTask1.style.display = "flex";
    estaAberto = false;
  } else {
    arrow[0].style.transform = "rotate(-90deg)";
    add.style.display = "none";
    listTask1.style.display = "none";
    estaAberto = true;
  }
}







//adicionar uma task
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












const card = document.getElementById('cardTaksEdi1');
const titleInput1 = document.getElementById('title1');
const addBtn1 = document.getElementById('add1');

// O evento correto é 'input' para detectar digitação
titleInput1.addEventListener("input", () => {
  const temTexto = titleInput1.value.trim().length > 0;

  if (temTexto) {
    addBtn1.style.backgroundColor = "var(--accent-strong)";
    addBtn1.style.filter = "none";
    addBtn1.style.cursor = "pointer";
    addBtn1.style.opacity = "1";
    addBtn1.disabled = false;
  } else {
    // Corrigido: Propriedades escritas sem quebras de linha
    addBtn1.style.backgroundColor = "var(--accent)";
    addBtn1.style.filter = "brightness(0.9)";
    addBtn1.style.cursor = "not-allowed";
    addBtn1.style.opacity = "0.6";
    addBtn1.disabled = true;
  }
});









let estaAberto2 = true;

function cancelTansk1() {
  const cardtaks = document.getElementById("cardTaksEdi1");
  const arrow = document.getElementsByClassName("arrow");
  const add = document.getElementById("addt1");


  if (estaAberto2) {
    cardtaks.style.display = "none";
    arrow[0].style.transform = "rotate(-90deg)";
    add.style.display = "flex";

  } else {
    cardtaks.style.display = "flex";
    arrow[0].style.transform = "rotate(0deg)";
  }

}








function addTask1() {
  const inputTitle = document.getElementById("title1").value;
  const inputDesc = document.getElementById("desc1").value;

  adicionarTarefa(inputTitle, inputDesc);

  console.log("O que voce digitou foi ", inputTitle, " e a descrição foi ", inputDesc);

  document.getElementById('title1').value = "";
  document.getElementById('desc1').value = "";
  alert("tarefa salva")
}












function adicionarTarefa(titulo, descricao) {
  const lista = document.getElementById('lista-tarefas1');
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

  const cardtaks = document.getElementById("cardTaksEdi1");
  const add = document.getElementById("addt1");
  cardtaks.style.display = "none";
  add.style.display = "flex";

}






let draggedItem1 = null;

function initDragAndDrop() {
  // Seleciona todas as tarefas, não importa em qual lista elas estejam
  const tasks = document.querySelectorAll('.task');
  const containers = document.querySelectorAll('#lista-tarefas, #lista-tarefas1');

  tasks.forEach(task => {
    task.addEventListener('dragstart', (e) => {
      draggedItem = task; // Use a variável global draggedItem
      task.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    task.addEventListener('dragend', () => {
      task.classList.remove('dragging');
      draggedItem = null;
    });
  });

  containers.forEach(container => {
    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(container, e.clientY);
      if (afterElement == null) {
        container.appendChild(draggedItem);
      } else {
        container.insertBefore(draggedItem, afterElement);
      }
    });
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