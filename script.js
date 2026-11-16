const botaoMenu = document.querySelector(".botao-menu");
const menu = document.querySelector(".menu");
const linksMenu = document.querySelectorAll(".menu a");

function fecharMenu() {
  botaoMenu.classList.remove("aberto");
  menu.classList.remove("aberto");
  document.body.classList.remove("menu-aberto");
  botaoMenu.setAttribute("aria-expanded", "false");
}

botaoMenu.addEventListener("click", () => {
  const estaAberto = menu.classList.toggle("aberto");

  botaoMenu.classList.toggle("aberto", estaAberto);
  document.body.classList.toggle("menu-aberto", estaAberto);
  botaoMenu.setAttribute("aria-expanded", String(estaAberto));
});

linksMenu.forEach((link) => {
  link.addEventListener("click", fecharMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) {
    fecharMenu();
  }
});

// Carrossel
const carrossel = document.querySelector(".carrossel");
const slides = [...document.querySelectorAll(".slide")];
const indicadores = [...document.querySelectorAll(".indicador")];
const botaoAnterior = document.querySelector(".anterior");
const botaoProximo = document.querySelector(".proximo");

let indiceAtual = 0;
let temporizador;

function exibirSlide(indice) {
  indiceAtual = (indice + slides.length) % slides.length;

  slides.forEach((slide, indiceSlide) => {
    const ativo = indiceSlide === indiceAtual;

    slide.classList.toggle("ativo", ativo);
    slide.setAttribute("aria-hidden", String(!ativo));
  });

  indicadores.forEach((indicador, indiceIndicador) => {
    const ativo = indiceIndicador === indiceAtual;

    indicador.classList.toggle("ativo", ativo);
    indicador.setAttribute("aria-current", ativo ? "true" : "false");
  });
}

function iniciarCarrossel() {
  clearInterval(temporizador);

  temporizador = setInterval(() => {
    exibirSlide(indiceAtual + 1);
  }, 5000);
}

botaoAnterior.addEventListener("click", () => {
  exibirSlide(indiceAtual - 1);
  iniciarCarrossel();
});

botaoProximo.addEventListener("click", () => {
  exibirSlide(indiceAtual + 1);
  iniciarCarrossel();
});

indicadores.forEach((indicador, indice) => {
  indicador.addEventListener("click", () => {
    exibirSlide(indice);
    iniciarCarrossel();
  });
});

carrossel.addEventListener("mouseenter", () => {
  clearInterval(temporizador);
});

carrossel.addEventListener("mouseleave", iniciarCarrossel);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    clearInterval(temporizador);
  } else {
    iniciarCarrossel();
  }
});

exibirSlide(0);
iniciarCarrossel();

// Feedback armazenado localmente
const formularioFeedback = document.querySelector("#formulario-feedback");
const mensagemFormulario = document.querySelector("#mensagem-formulario");
const mediaAvaliacoes = document.querySelector("#media-avaliacoes");
const quantidadeAvaliacoes = document.querySelector(
  "#quantidade-avaliacoes"
);

const CHAVE_FEEDBACKS = "feedbacks-doce-encanto";

function obterFeedbacks() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_FEEDBACKS)) || [];
  } catch {
    return [];
  }
}

function atualizarResumo() {
  const feedbacks = obterFeedbacks();

  if (feedbacks.length === 0) {
    mediaAvaliacoes.textContent = "Ainda sem avaliações";
    quantidadeAvaliacoes.textContent =
      "Seja a primeira pessoa a avaliar.";
    return;
  }

  const soma = feedbacks.reduce(
    (total, feedback) => total + feedback.nota,
    0
  );

  const media = (soma / feedbacks.length).toFixed(1);
  const textoAvaliacoes =
    feedbacks.length === 1
      ? "1 avaliação salva neste navegador"
      : `${feedbacks.length} avaliações salvas neste navegador`;

  mediaAvaliacoes.textContent = `${media} de 5 estrelas`;
  quantidadeAvaliacoes.textContent = textoAvaliacoes;
}

formularioFeedback.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!formularioFeedback.checkValidity()) {
    formularioFeedback.reportValidity();
    return;
  }

  const dados = new FormData(formularioFeedback);

  const feedback = {
    nome: dados.get("nome").trim(),
    email: dados.get("email").trim(),
    nota: Number(dados.get("nota")),
    mensagem: dados.get("mensagem").trim(),
    data: new Date().toISOString()
  };

  const feedbacks = obterFeedbacks();
  feedbacks.push(feedback);

  localStorage.setItem(CHAVE_FEEDBACKS, JSON.stringify(feedbacks));

  formularioFeedback.reset();
  atualizarResumo();

  mensagemFormulario.textContent =
    "Feedback enviado e salvo com sucesso!";

  setTimeout(() => {
    mensagemFormulario.textContent = "";
  }, 5000);
});

atualizarResumo();

// Destaca a seção atual no menu
const secoes = [...document.querySelectorAll("main section[id]")];

const observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;

      linksMenu.forEach((link) => {
        const corresponde =
          link.getAttribute("href") === `#${entrada.target.id}`;

        link.classList.toggle("ativo", corresponde);
      });
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px"
  }
);

secoes.forEach((secao) => observador.observe(secao));

// Ano automático no rodapé
document.querySelector("#ano-atual").textContent =
  new Date().getFullYear();
