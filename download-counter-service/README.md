# Contador de downloads

Serviço próprio da Guecas House para guardar apenas o total agregado de downloads.

- Não lê nem armazena IP ou navegador.
- Não usa cookies ou identificadores pessoais.
- Aceita incrementos somente a partir dos domínios oficiais.
- O banco mantém apenas `slug` e `total`.

Implantação: Cloudflare Pages Functions com uma base D1 vinculada como `DOWNLOADS_DB` e domínio `api.guecashouse.com.br`.
