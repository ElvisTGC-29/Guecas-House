// ========= PROTEÇÃO DE IMAGENS =========
// Dificulta salvar, arrastar ou abrir em outra aba as capas e artes do site.
//
// IMPORTANTE: isto é um impedimento contra o usuário comum, não segurança
// real. Quem abrir as ferramentas de desenvolvedor, olhar o código-fonte ou
// digitar a URL do arquivo direto no navegador continua conseguindo baixar.
// Proteção de verdade exige marca d'água na imagem ou servir os arquivos por
// um servidor com token de acesso — nada disso é possível só com HTML/CSS/JS
// num site estático como o GitHub Pages.

document.addEventListener('DOMContentLoaded', () => {
  // 1. Bloqueia o menu do botão direito sobre imagens e vídeos
  //    (é por ele que se acessa "Salvar imagem como" e "Abrir imagem em
  //    nova guia"). Fora de mídia, o menu continua funcionando normalmente.
  document.addEventListener('contextmenu', (event) => {
    const alvo = event.target;
    const ehMidia =
      alvo.tagName === 'IMG' ||
      alvo.tagName === 'VIDEO' ||
      alvo.tagName === 'CANVAS' ||
      alvo.closest('.book-card-cover, .detail-cover-card, .banner-slide, .hero-card-cover, .download-cover');

    if (ehMidia) {
      event.preventDefault();
    }
  });

  // 2. Bloqueia arrastar a imagem para a área de trabalho ou outra aba
  document.addEventListener('dragstart', (event) => {
    if (event.target.tagName === 'IMG' || event.target.tagName === 'VIDEO') {
      event.preventDefault();
    }
  });

  // 3. Bloqueia atalhos de salvar a página inteira (que levaria as imagens
  //    junto). Não bloqueia copiar/colar: isso atrapalharia quem quer copiar
  //    o e-mail de contato ou preencher o formulário.
  document.addEventListener('keydown', (event) => {
    const digitando =
      event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA';
    if (digitando) return;

    const tecla = event.key.toLowerCase();
    const comModificador = event.ctrlKey || event.metaKey;

    // Ctrl/Cmd + S (salvar página)
    if (comModificador && tecla === 's') {
      event.preventDefault();
    }
  });
});
