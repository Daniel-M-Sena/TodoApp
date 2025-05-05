const modal = document.getElementById("taskModal"); 
const abrir = document.getElementById("openModal"); 
const cancelar = document.getElementById("cancelar");
const adicionar = document.getElementById("adicionar");
const tituloInput = document.getElementById("titulo");
const descricaoInput = document.getElementById("descricao");
const dataInput = document.getElementById("data");
const modalTitle = document.querySelector("#taskModal h3");
let editandoTarefa = null; // armazenar a tarefa em edição

// Abrir modal para nova tarefa
abrir.onclick = () => {
  resetarModal();
  modal.style.display = "flex";
};

// Fechar modal
cancelar.onclick = () => {
  resetarModal();
  modal.style.display = "none";
};

// Resetar modal
function resetarModal() {
  tituloInput.value = "";
  descricaoInput.value = "";
  dataInput.value = "";
  modalTitle.textContent = "Nova Tarefa";
  adicionar.textContent = "✓ Adicionar";
  editandoTarefa = null;
}

// Adicionar ou salvar tarefa
adicionar.onclick = () => {
  const titulo = tituloInput.value.trim();
  const descricao = descricaoInput.value.trim();
  const data = dataInput.value;

  if (!titulo) {
    alert("Digite um título para a tarefa.");
    return;
  }

  if (editandoTarefa) {
    // Modo edição
    editandoTarefa.querySelector("h4").textContent = titulo;
    editandoTarefa.querySelector("p").textContent = descricao || "Sem descrição";
    editandoTarefa.querySelectorAll("p")[1].innerHTML = `<strong>Vencimento:</strong> ${data || "Não definido"}`;
  } else {
    // Modo adicionar nova
    const noTask = document.querySelector(".no-task");
    const ilustracao = document.querySelector(".illustration");
    if (noTask) noTask.style.display = "none";
    if (ilustracao) ilustracao.style.display = "none";

    const lista = document.getElementById("listaTarefas");
    const novaTarefa = document.createElement("div");
    novaTarefa.classList.add("task-card");

    novaTarefa.innerHTML = `
      <div class="task-info">
        <h4>${titulo}</h4>
        <p>${descricao || "Sem descrição"}</p>
        <p><strong>Vencimento:</strong> ${data || "Não definido"}</p>
      </div>
      <div class="task-actions">
        <button class="btn-editar" title="Editar">
          <img src="edit.png" alt="Editar">
        </button>
        <button class="btn-remover" title="Remover">
          <img src="delete.png" alt="Remover">
        </button>
        <span class="status-indicator" title="Status da tarefa" style="background-color: red;"></span>
      </div>
    `;

    lista.appendChild(novaTarefa);

    const statusIndicator = novaTarefa.querySelector(".status-indicator");
    statusIndicator.onclick = () => {
      const currentColor = statusIndicator.style.backgroundColor;
      const taskInfo = novaTarefa.querySelector(".task-info");

      if (currentColor === "red") {
        statusIndicator.style.backgroundColor = "blue";
        taskInfo.classList.remove("tarefa-concluida");
      } else if (currentColor === "blue") {
        statusIndicator.style.backgroundColor = "green";
        taskInfo.classList.add("tarefa-concluida");
      } else {
        statusIndicator.style.backgroundColor = "red";
        taskInfo.classList.remove("tarefa-concluida");
      }
    };
  }

  modal.style.display = "none";
  resetarModal();
};



// Excluir tarefa
let tarefaParaExcluir = null;
document.addEventListener("click", function (e) {
  if (e.target.closest(".btn-remover")) {
    tarefaParaExcluir = e.target.closest(".task-card");
    document.getElementById("confirmDelete").classList.remove("hidden");
  }

  if (e.target.closest(".btn-editar")) {
    editandoTarefa = e.target.closest(".task-card");
    const taskInfo = editandoTarefa.querySelector(".task-info");
    const titulo = taskInfo.querySelector("h4").textContent;
    const descricao = taskInfo.querySelectorAll("p")[0].textContent;
    const dataTexto = taskInfo.querySelectorAll("p")[1].textContent.replace("Vencimento:", "").trim();

    tituloInput.value = titulo;
    descricaoInput.value = descricao === "Sem descrição" ? "" : descricao;
    dataInput.value = dataTexto !== "Não definido" ? dataTexto : "";

    modalTitle.textContent = "Editar Tarefa";
    adicionar.textContent = "✓ Salvar";
    modal.style.display = "flex";
  }
});

document.getElementById("cancelarBtn").onclick = function () {
  tarefaParaExcluir = null;
  document.getElementById("confirmDelete").classList.add("hidden");
};

document.getElementById("confirmarBtn").onclick = function () {
  if (tarefaParaExcluir) {
    tarefaParaExcluir.remove();
    tarefaParaExcluir = null;
  }

  const lista = document.getElementById("listaTarefas");
  const tarefasRestantes = lista.querySelectorAll(".task-card");

  if (tarefasRestantes.length === 0) {
    document.querySelector(".no-task").style.display = "block";
    document.querySelector(".illustration").style.display = "block";
  }

  document.getElementById("confirmDelete").classList.add("hidden");
};



// Filtrar tarefas
const filterBtn = document.getElementById("filterButton");
const filterDropdown = document.getElementById("filterDropdown");

filterBtn.addEventListener("click", () => {
  filterDropdown.classList.toggle("hidden");
});

filterDropdown.querySelectorAll("div").forEach(option => {
  option.addEventListener("click", () => {
    const selectedStatus = option.dataset.status;
    filterDropdown.classList.add("hidden");

    document.querySelectorAll(".task-card").forEach(task => {
      const bolinha = task.querySelector(".status-indicator");
      const cor = bolinha.style.backgroundColor;

      if (
        selectedStatus === "all" ||
        (selectedStatus === "red" && cor === "red") ||
        (selectedStatus === "blue" && cor === "blue") ||
        (selectedStatus === "green" && cor === "green")
      ) {
        task.style.display = "flex";
      } else {
        task.style.display = "none";
      }
    });
  });
});
