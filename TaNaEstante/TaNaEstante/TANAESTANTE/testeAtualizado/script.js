// LOGIN //

// --- Variables and constants ---
const genres = ["Terror", "Romance", "Aventura", "Fantasia", "Ficção Científica", "Biografia", "Poesia"];
let selectedGenre = null;

// --- General ---
document.addEventListener("DOMContentLoaded", () => {
  // Verifica se estamos na página de cadastro2 (gêneros)
  if (document.getElementById("genres-dynamic-container")) {
    setupGenres("genres-dynamic-container");
  }

  // Verifica se estamos na página cadastro1
  if (document.getElementById("nome") && document.getElementById("username")) {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      document.getElementById("nome").value = userData.nome || "";
      document.getElementById("username").value = userData.username || "";
      if (document.getElementById("generoFavorito")) {
        document.getElementById("generoFavorito").value = userData.generoFavorito || "";
      }
    }
  }

  // Adiciona evento de submit para o formulário de login
  const loginForm = document.querySelector(".formulario");
  if (loginForm && window.location.pathname.includes("login.html")) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      login();
    });
  }

  // Adiciona evento de submit para o formulário de cadastro1
  const cadastroForm = document.querySelector(".formulario");
  if (cadastroForm && window.location.pathname.includes("cadastro1.html")) {
    cadastroForm.addEventListener("submit", function(e) {
      e.preventDefault();
      continuarCadastro();
    });
  }
});

// --- Login Page ---
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("error-message");

  if (!errorMessage) return; // Se não tiver elemento de erro, sai da função

  errorMessage.textContent = "";

  if (!email || !password) {
    errorMessage.textContent = "Por favor, insira email e senha.";
    return;
  }

  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData || userData.email !== email || userData.senha !== password) {
    errorMessage.textContent = "Email ou senha incorretos.";
    return;
  }

  if (!userData.generoFavorito) {
    alert("Por favor, complete seu cadastro!");
    window.location.href = "cadastro2.html";
  } else {
    alert("Login efetuado com sucesso!");
    window.location.href = "main.html";
  }
}

function goToCadastro() {
  window.location.href = "cadastro1.html";
}

function togglePasswordVisibility(id, iconContainer) {
  const input = document.getElementById(id);
  const icon = iconContainer.querySelector('i');

  const isPasswordVisible = input.type === "text";

  if (icon.classList.contains("bi-eye-slash-fill")) {
    icon.classList.remove("bi-eye-slash-fill");
    icon.classList.add("bi-eye-fill");
  } else {
    icon.classList.remove= ("bi-eye-fill");
    icon.classList.add("bi-eye-slash-fill");
  }
}
}


// --- Cadastro1 Page ---
function validateUsername() {
  const username = document.getElementById("username").value.trim();
  const usernameError = document.getElementById("username-error");

  if (!usernameError) return;

  if (username.length > 50) {
    usernameError.textContent = "Username deve ter no máximo 50 caracteres.";
    usernameError.className = "input-error";
  } else {
    usernameError.textContent = "✓ Username válido.";
    usernameError.className = "input-ok";
  }
}

function validatePassword() {
  const senha = document.getElementById("senha").value.trim();
  const senhaError = document.getElementById("senha-error");

  if (!senhaError) return;

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{1,50}$/;
  if (!passwordRegex.test(senha)) {
    senhaError.textContent = "Senha deve conter letras, números e símbolos.";
    senhaError.className = "input-error";
  } else {
    senhaError.textContent = "✓ Senha válida.";
    senhaError.className = "input-ok";
  }
}

function continuarCadastro() {
  const nome = document.getElementById("nome").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const usernameError = document.getElementById("username-error");
  const senhaError = document.getElementById("senha-error");
  const errorMessage = document.getElementById("error-message");

  validateUsername();
  validatePassword();

  if (errorMessage) errorMessage.textContent = "";

  if (!nome || !username || !email || !senha) {
    if (errorMessage) errorMessage.textContent = "Preencha todos os campos.";
    return;
  }

  if ((usernameError && usernameError.className === "input-error") || 
      (senhaError && senhaError.className === "input-error")) {
    if (errorMessage) errorMessage.textContent = "Corrija os erros antes de continuar.";
    return;
  }

  const userData = { nome, username, email, senha };
  localStorage.setItem("userData", JSON.stringify(userData));
  window.location.href = "cadastro2.html";
}

// --- Cadastro2 Page ---
function setupGenres(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  let index = 0;
  let rows = [3, 2, 1];

  while (index < genres.length) {
    for (let row of rows) {
      const rowDiv = document.createElement("div");
      rowDiv.style.display = "flex";
      rowDiv.style.justifyContent = "center";
      rowDiv.style.gap = "10px";

      for (let i = 0; i < row && index < genres.length; i++, index++) {
        const button = document.createElement("button");
        button.className = "genre-button";
        button.textContent = genres[index];
        button.onclick = () => selectGenre(button);
        rowDiv.appendChild(button);
      }

      container.appendChild(rowDiv);
    }
  }
}

function selectGenre(button) {
  document.querySelectorAll(".genre-button").forEach(btn => btn.classList.remove("selected"));
  button.classList.add("selected");
  selectedGenre = button.innerText;
}

function finalizarCadastro() {
  if (!selectedGenre) {
    const genreError = document.getElementById("genre-error");
    if (genreError) genreError.textContent = "Escolha seu gênero favorito.";
    return;
  }

  const userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    userData.generoFavorito = selectedGenre;
    localStorage.setItem("userData", JSON.stringify(userData));

    alert("Cadastro finalizado com sucesso!");
    window.location.href = "main.html";
  }
}

function triggerImageUpload() {
  document.getElementById("profile-input").click();
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const profilePic = document.getElementById("profile-pic");
      if (profilePic) {
        profilePic.src = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
}

// PARTE DE GESSICAAA //
// MENU LATERAL //

let btnMenu = document.getElementById('btn-menu');
let menu = document.getElementById('menu-lateral');
let overlay = document.getElementById('overlay-topo');

btnMenu.addEventListener('click', () => {
    menu.classList.add('abrir-menu');
    overlay.style.display = 'block'; 
});

menu.addEventListener('click', () => {
    menu.classList.remove('abrir-menu');
    fecharMenu();
});

overlay.addEventListener('click', () => {
    menu.classList.remove('abrir-menu');
    fecharMenu();
});

function fecharMenu() {
    menu.classList.remove('abrir-menu');
    overlay.style.display = 'none';
}

overlay.addEventListener('click', () => {

    menu.classList.remove('abrir-menu');

    overlay.style.display = 'none';
});

// SENHA //

function mostrarSenha() {
    const senhaInput = document.getElementById('senha');
    const btnSenha = document.getElementById('btn-senha');
    
    if(senhaInput.type === 'password') {
        senhaInput.type = 'text';
        btnSenha.classList.remove('bxs-lock-alt');
        btnSenha.classList.add('bxs-lock-open-alt');
    } else {
        senhaInput.type = 'password';
        btnSenha.classList.remove('bxs-lock-open-alt');
        btnSenha.classList.add('bxs-lock-alt');
    }
}

// Livros //

document.querySelectorAll('.categoria-item').forEach(item => {
  item.addEventListener('click', function() {
      const categoriaSelecionada = this.textContent;
      console.log(`Filtrando por: ${categoriaSelecionada}`);
      // Aqui você pode adicionar sua lógica de filtragem
      
      // Opcional: Adicionar feedback visual
      document.querySelectorAll('.categoria-item').forEach(i => {
          i.classList.remove('ativo');
      });
      this.classList.add('ativo');
      document.querySelector('.botao-filtro').innerHTML = 
          `Categoria: ${categoriaSelecionada} <i class="bi bi-chevron-down"></i>`;
  });
});

// Fechar dropdown ao clicar fora (opcional)
document.addEventListener('click', function(e) {
  if (!e.target.closest('.filtro-categorias')) {
      document.querySelector('.dropdown-categorias').style.display = 'none';
  }
});

// NOVIDADES E RECOMENDAÇÕES //

document.addEventListener('DOMContentLoaded', function() {
    // Para cada carrossel na página
    document.querySelectorAll('.carrossel-container').forEach(container => {
        const carrossel = container.querySelector('.carrossel');
        const containerImagens = container.querySelector('.container-imagens');
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');
        const imgWidth = 180; // Largura da imagem + gap
        const visibleItems = Math.floor(carrossel.offsetWidth / imgWidth);
        let currentPosition = 0;

        // Botão próximo
        nextBtn.addEventListener('click', () => {
            const maxScroll = containerImagens.scrollWidth - carrossel.offsetWidth;
            currentPosition = Math.min(currentPosition + (imgWidth * visibleItems), maxScroll);
            carrossel.scrollTo({
                left: currentPosition,
                behavior: 'smooth'
            });
        });

        // Botão anterior
        prevBtn.addEventListener('click', () => {
            currentPosition = Math.max(currentPosition - (imgWidth * visibleItems), 0);
            carrossel.scrollTo({
                left: currentPosition,
                behavior: 'smooth'
            });
        });
    });
});