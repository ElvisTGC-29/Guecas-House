// MENU MOBILE LATERAL
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-links");
  if (!toggle || !nav) return;

  const navClose = nav.querySelector(".nav-close");

  function openMenu() {
    nav.classList.add("open");
    toggle.classList.add("open");
    document.body.classList.add("no-scroll");
  }

  function closeMenu() {
    nav.classList.remove("open");
    toggle.classList.remove("open");
    document.body.classList.remove("no-scroll");
  }

  toggle.addEventListener("click", () => {
    if (nav.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (navClose) {
    navClose.addEventListener("click", closeMenu);
  }

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
});

// Caminhos dos PDFs de prévia
const previas = {
  peso: "arquivos/previas/previa-o-peso-invisivel.pdf",
  corpo: "arquivos/previas/previa-corpo-nao-desliga.pdf",
  vigilia: "arquivos/previas/previa-preco-vigilia.pdf"
};

// Links reais de compra na Kiwify
const linksCompra = {
  peso: "https://pay.kiwify.com.br/SEU_LINK_PESO",
  corpo: "https://pay.kiwify.com.br/SEU_LINK_CORPO",
  vigilia: "https://pay.kiwify.com.br/SEU_LINK_VIGILIA"
};

function abrirPreview(id) {
  const modal = document.getElementById("previewModal");
  const embed = document.getElementById("previewPagina");
  const btn = document.getElementById("previewComprar");

  embed.src = previas[id];
  btn.href = linksCompra[id];

  modal.classList.add("open");
}

function fecharPreview() {
  const modal = document.getElementById("previewModal");
  modal.classList.remove("open");
}

// Formulário de contato - Envio via Formspree + redirecionamento
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contatoForm');
  if (!form) return; // se não estiver na página de contato, ignora

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // impede o envio padrão

    const data = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/movyeedk', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // redireciona para a página de sucesso
        window.location.href = 'contato-sucesso.html';
      } else {
        alert('Houve um problema ao enviar sua mensagem. Tente novamente em instantes.');
      }
    } catch (error) {
      alert('Não foi possível enviar agora. Verifique sua conexão e tente de novo.');
      console.error(error);
    }
  });
});
