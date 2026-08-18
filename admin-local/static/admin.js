(() => {
  "use strict";

  const toolbarItems = [
    ["↶", "Desfazer", "undo"], ["↷", "Refazer", "redo"],
    ["P", "Parágrafo", "formatBlock", "p"], ["T2", "Título 2", "formatBlock", "h2"],
    ["T3", "Título 3", "formatBlock", "h3"], ["N", "Negrito", "bold"],
    ["I", "Itálico", "italic"], ["S", "Sublinhado", "underline"],
    ["• Lista", "Lista com marcadores", "insertUnorderedList"],
    ["1. Lista", "Lista numerada", "insertOrderedList"],
    ["❝", "Citação", "formatBlock", "blockquote"], ["—", "Linha divisória", "insertHorizontalRule"],
    ["Link", "Inserir link", "createLink"], ["Sem link", "Remover link", "unlink"],
    ["Limpar", "Remover formatação", "removeFormat"]
  ];

  function countText(editor, counter) {
    const text = (editor.innerText || "").trim();
    const words = text ? text.split(/\s+/).length : 0;
    counter.textContent = `${words} ${words === 1 ? "palavra" : "palavras"} • ${text.length} caracteres`;
  }

  document.querySelectorAll("[data-rich-editor]").forEach((wrap) => {
    const toolbar = wrap.querySelector(".rich-toolbar");
    const editor = wrap.querySelector(".rich-editor");
    const source = wrap.querySelector(".rich-source");
    const counter = wrap.querySelector(".editor-counter");
    toolbarItems.forEach(([label, title, command, value]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.title = title;
      button.setAttribute("aria-label", title);
      button.addEventListener("mousedown", (event) => {
        event.preventDefault();
        editor.focus();
        let chosen = value || null;
        if (command === "createLink") {
          chosen = window.prompt("Cole o endereço completo do link:", "https://");
          if (!chosen || !/^https?:\/\//i.test(chosen)) return;
        }
        document.execCommand(command, false, chosen);
        source.value = editor.innerHTML;
        countText(editor, counter);
      });
      toolbar.appendChild(button);
    });
    const sync = () => {
      source.value = editor.innerHTML;
      countText(editor, counter);
    };
    editor.addEventListener("input", sync);
    editor.addEventListener("blur", sync);
    editor.closest("form")?.addEventListener("submit", sync);
    countText(editor, counter);
  });

  const escapeHtml = (value) => value.replace(/[&<>]/g, (char) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;"}[char]));

  function highlightCode(source, language) {
    const pattern = language === "html" || language === "xml"
      ? /<!--[\s\S]*?-->|<\/?[A-Za-z][^>]*>|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b/g
      : /\/\*[\s\S]*?\*\/|\/\/[^\n]*|#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:true|false|null|def|class|return|if|else|for|while|function|const|let|var|import|from|try|except|with|async|await)\b|\b\d+(?:\.\d+)?\b/g;
    let result = "", last = 0;
    for (const match of source.matchAll(pattern)) {
      result += escapeHtml(source.slice(last, match.index));
      const token = match[0];
      let kind = "number";
      if (/^(?:\/\*|\/\/|#|<!--)/.test(token)) kind = "comment";
      else if (/^["']/.test(token)) kind = "string";
      else if (/^</.test(token)) kind = "tag";
      else if (/^(?:true|false|null|def|class|return|if|else|for|while|function|const|let|var|import|from|try|except|with|async|await)$/.test(token)) kind = "keyword";
      result += `<span class="tok-${kind}">${escapeHtml(token)}</span>`;
      last = match.index + token.length;
    }
    return result + escapeHtml(source.slice(last)) + "\n";
  }

  document.querySelectorAll("textarea.code-source").forEach((textarea) => {
    const shell = document.createElement("div");
    shell.className = "code-editor-shell";
    const highlight = document.createElement("pre");
    highlight.className = "code-highlight";
    highlight.setAttribute("aria-hidden", "true");
    textarea.parentNode.insertBefore(shell, textarea);
    shell.append(highlight, textarea);
    const language = textarea.dataset.language || "text";
    const sync = () => { highlight.innerHTML = highlightCode(textarea.value, language); };
    textarea.addEventListener("input", sync);
    textarea.addEventListener("scroll", () => {
      highlight.scrollTop = textarea.scrollTop;
      highlight.scrollLeft = textarea.scrollLeft;
    });
    textarea.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      event.preventDefault();
      const start = textarea.selectionStart;
      textarea.setRangeText("  ", start, textarea.selectionEnd, "end");
      sync();
    });
    sync();
  });
})();
