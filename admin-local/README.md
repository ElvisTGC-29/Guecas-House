# Painel editorial local — Guecas House

O painel organiza ebooks, capas, postagens, autoria, políticas, arquivos de texto, auditoria, backups e publicação por Git. Ele escuta somente em `127.0.0.1`: não existe página administrativa pública e nenhum visitante do site consegue acessá-lo.

## Primeiro acesso

1. Na raiz do projeto, execute `iniciar-painel.bat`.
2. O navegador abrirá `http://127.0.0.1:8765/`.
3. Crie uma senha exclusiva com pelo menos 12 caracteres, incluindo letras e números.
4. A conta administrativa usa `guecashouse@gmail.com`.

O site local para conferência fica em `http://127.0.0.1:8766/`. Ao encerrar a janela do painel, os dois servidores locais são desligados.

## Recuperação por e-mail

O Gmail exige uma senha de app; a senha normal da conta não deve ser usada nem registrada no projeto.

1. Ative a verificação em duas etapas na conta Google.
2. Crie uma senha de app de 16 caracteres para o painel.
3. Abra **Conta e segurança** no painel.
4. Preencha o formulário guiado e confirme com a senha atual do painel.
5. Mantenha marcada a opção de envio de teste.

O arquivo `.env`, o banco de dados, os backups e as capas master estão excluídos do Git. Nunca envie esses arquivos ao GitHub nem compartilhe a senha de app em conversas.

## Recuperação local de emergência

Se o e-mail estiver indisponível, execute `redefinir-senha-painel.bat`. A redefinição ocorre no terminal e invalida todas as sessões abertas.

## Fluxo editorial recomendado

1. Escreva como rascunho.
2. Mude o status para revisão.
3. Confira título SEO, descrição, data real e referências.
4. Publique e abra a prévia local.
5. Em **Publicação e backups**, execute a auditoria.
6. Crie um backup e publique pelo Git somente depois da conferência.

Postagens públicas exigem data de publicação e pelo menos uma referência. O painel registra as ações importantes no histórico local e cria cópias de segurança antes de alterações sensíveis.

## Recursos do editor

- A área **Fanfics** mantém conteúdo, situação editorial, SEO e avisos de direitos separados dos ebooks.
- O editor de postagens funciona visualmente, com subtítulos, negrito, itálico, sublinhado, listas, citações e links.
- Os editores de HTML, CSS, JavaScript e JSON têm coloração local de sintaxe.
- O manual completo está disponível no menu do painel e em `output/pdf/manual-painel-editorial-guecas-house.pdf`.

## Atalho com a logo

Execute `instalar-atalho-painel.bat` uma única vez. Depois, clique com o botão direito no atalho **Painel Guecas House** e escolha **Fixar na barra de tarefas**. Para desligar o servidor local, execute `encerrar-painel.bat`.
