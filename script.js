/* ================================================================
   DADOS EDITÁVEIS DO SITE
   Altere este bloco para personalizar nomes, data, WhatsApp e presentes.
   No telefone, use apenas números: código do país + DDD + número.
   ================================================================ */
const configuracoes = {
  noivos: "Guilherme & Flávia",
  dataCasamento: "12 de dezembro de 2026",
  monograma: "G & F",
  telefoneWhatsApp: "5511999999999"
};

const presentes = [
  {
    nome: "Café da manhã dos recém-casados",
    descricao: "Para começar o primeiro dia dessa nova história com carinho e café quentinho.",
    valor: "R$ 80,00",
    icone: "☕",
    qrCode: "images/qrcodes/cafe-da-manha.png",
    pixCopiaECola: "COLE_AQUI_O_CODIGO_PIX_DO_CAFE_DA_MANHA"
  },
  {
    nome: "Jantar romântico",
    descricao: "Uma noite especial para brindar o amor e criar uma lembrança deliciosa a dois.",
    valor: "R$ 180,00",
    icone: "🥂",
    qrCode: "images/qrcodes/jantar-romantico.png",
    pixCopiaECola: "COLE_AQUI_O_CODIGO_PIX_DO_JANTAR_ROMANTICO"
  },
  {
    nome: "Passeio durante a lua de mel",
    descricao: "Para descobrirmos juntos um lugar novo e guardarmos paisagens na memória.",
    valor: "R$ 250,00",
    icone: "🌿",
    qrCode: "images/qrcodes/passeio-lua-de-mel.png",
    pixCopiaECola: "COLE_AQUI_O_CODIGO_PIX_DO_PASSEIO"
  },
  {
    nome: "Ajuda para o cantinho novo",
    descricao: "Um gesto de carinho para deixarmos nosso primeiro lar ainda mais aconchegante.",
    valor: "R$ 320,00",
    icone: "🏡",
    qrCode: "images/qrcodes/cantinho-novo.png",
    pixCopiaECola: "COLE_AQUI_O_CODIGO_PIX_DO_CANTINHO_NOVO"
  },
  {
    nome: "Uma aventura a dois",
    descricao: "Para vivermos uma experiência inesquecível e começarmos o casamento com novas histórias.",
    valor: "R$ 500,00",
    icone: "🧳",
    qrCode: "images/qrcodes/aventura-a-dois.png",
    pixCopiaECola: "COLE_AQUI_O_CODIGO_PIX_DA_AVENTURA"
  }
];

// Elementos da página
const listaPresentes = document.getElementById("lista-presentes");
const modal = document.getElementById("modal-presente");
const conteudoModal = modal.querySelector(".modal__conteudo");
const modalTitulo = document.getElementById("modal-titulo");
const modalValor = document.getElementById("modal-valor");
const imagemQrCode = document.getElementById("modal-qrcode");
const placeholderQrCode = document.getElementById("qrcode-placeholder");
const botaoCopiar = document.getElementById("botao-copiar");
const textoBotaoCopiar = document.getElementById("texto-botao-copiar");
const botaoWhatsApp = document.getElementById("botao-whatsapp");

let presenteSelecionado = null;
let elementoQueAbriuModal = null;
let temporizadorCopia = null;

function aplicarConfiguracoes() {
  document.getElementById("nomes-noivos").textContent = configuracoes.noivos;
  document.getElementById("data-casamento").textContent = configuracoes.dataCasamento;
  document.getElementById("monograma").textContent = configuracoes.monograma;
  document.getElementById("assinatura-noivos").textContent = configuracoes.noivos;
  document.title = `${configuracoes.noivos} | Lista de Presentes`;
}

function criarCartoes() {
  listaPresentes.innerHTML = presentes.map((presente, indice) => `
    <article class="cartao-presente">
      <div class="cartao-presente__icone" aria-hidden="true">${presente.icone}</div>
      <h3>${presente.nome}</h3>
      <p class="cartao-presente__descricao">${presente.descricao}</p>
      <div class="cartao-presente__rodape">
        <strong class="cartao-presente__valor">${presente.valor}</strong>
        <button class="botao" type="button" data-indice-presente="${indice}">Presentear</button>
      </div>
    </article>
  `).join("");
}

function exibirPlaceholderQrCode() {
  imagemQrCode.hidden = true;
  placeholderQrCode.hidden = false;
}

function abrirModal(indice, botaoClicado) {
  presenteSelecionado = presentes[indice];
  elementoQueAbriuModal = botaoClicado;
  modalTitulo.textContent = presenteSelecionado.nome;
  modalValor.textContent = presenteSelecionado.valor;
  imagemQrCode.alt = `QR Code do presente ${presenteSelecionado.nome}`;
  placeholderQrCode.hidden = true;
  imagemQrCode.hidden = false;
  imagemQrCode.src = presenteSelecionado.qrCode;

  textoBotaoCopiar.textContent = "Copiar código Pix";
  botaoCopiar.classList.remove("copiado");
  modal.classList.add("aberto");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-aberto");
  conteudoModal.focus();
}

function fecharModal() {
  if (!modal.classList.contains("aberto")) return;
  modal.classList.remove("aberto");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-aberto");
  imagemQrCode.removeAttribute("src");
  presenteSelecionado = null;
  if (elementoQueAbriuModal) elementoQueAbriuModal.focus();
}

async function copiarPix() {
  if (!presenteSelecionado) return;

  try {
    // Live Server usa um contexto seguro e permite a API moderna de clipboard.
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(presenteSelecionado.pixCopiaECola);
    } else {
      // Alternativa para navegadores que bloqueiam a API moderna.
      const campoTemporario = document.createElement("textarea");
      campoTemporario.value = presenteSelecionado.pixCopiaECola;
      campoTemporario.style.position = "fixed";
      campoTemporario.style.opacity = "0";
      document.body.appendChild(campoTemporario);
      campoTemporario.select();
      document.execCommand("copy");
      campoTemporario.remove();
    }

    clearTimeout(temporizadorCopia);
    textoBotaoCopiar.textContent = "Código Pix copiado!";
    botaoCopiar.classList.add("copiado");
    temporizadorCopia = setTimeout(() => {
      textoBotaoCopiar.textContent = "Copiar código Pix";
      botaoCopiar.classList.remove("copiado");
    }, 2200);
  } catch (erro) {
    textoBotaoCopiar.textContent = "Não foi possível copiar";
    setTimeout(() => { textoBotaoCopiar.textContent = "Copiar código Pix"; }, 2200);
  }
}

function abrirWhatsApp() {
  if (!presenteSelecionado) return;
  const mensagem = `Olá, noivos! 💛 Presenteei vocês com ${presenteSelecionado.nome.toLowerCase()}, no valor de ${presenteSelecionado.valor}. Que essa nova fase seja repleta de amor! `;
  const url = `https://wa.me/${configuracoes.telefoneWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

// Eventos
listaPresentes.addEventListener("click", (evento) => {
  const botao = evento.target.closest("[data-indice-presente]");
  if (botao) abrirModal(Number(botao.dataset.indicePresente), botao);
});

document.querySelectorAll("[data-fechar-modal]").forEach((elemento) => {
  elemento.addEventListener("click", fecharModal);
});

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") fecharModal();
});

imagemQrCode.addEventListener("error", exibirPlaceholderQrCode);
imagemQrCode.addEventListener("load", () => {
  imagemQrCode.hidden = false;
  placeholderQrCode.hidden = true;
});
botaoCopiar.addEventListener("click", copiarPix);
botaoWhatsApp.addEventListener("click", abrirWhatsApp);

aplicarConfiguracoes();
criarCartoes();
