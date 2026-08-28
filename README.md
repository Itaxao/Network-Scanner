```markdown
# Network_Scanner

Scanner de portas TCP de altíssima performance com interface gráfica. Varre todas as 65.535 portas de um endereço IP em lotes concorrentes, usando *threads* nativas em Rust no backend para acelerar a varredura, enquanto exibe os resultados em um painel moderno em React.

## Como funciona

O programa recebe um endereço IP (ou hostname) através de um campo de texto na interface gráfica. O motor nativo processa as conexões em lotes, com timeout isolado por tentativa. Quando uma porta responde, o Rust envia o resultado em tempo real de volta para o frontend (via ponte IPC do Tauri), atualizando dinamicamente a tabela visual e a barra de progresso.

## Requisitos

- [Node.js e npm](https://nodejs.org/) instalados
- [Rust e Cargo](https://www.rust-lang.org/tools/install) (edição 2024)
- **NixOS:** O projeto inclui um arquivo `shell.nix` configurado com as dependências do WebKitGTK e ferramentas de compilação gráfica.

## Instalação e Uso

Clone o repositório e ative o ambiente de compilação:

```bash
git clone [https://github.com/Itaxao/Network_Scanner.git](https://github.com/Itaxao/Network_Scanner.git)
cd Network_Scanner
nix-shell

```

Instale as dependências do frontend e execute a aplicação em modo de desenvolvimento:

```bash
npm install
npm run tauri dev

```

## Roadmap / possíveis melhorias

* [x] Migração de CLI pura para Interface Gráfica Reativa (Tauri + React)
* [x] Implementação de barra de progresso concorrente
* [ ] Permitir definir intervalo de portas customizado na tela (ex: porta inicial e final)
* [ ] Permitir configurar o timeout de conexão via slider ou input
* [ ] Identificação de serviços rodando nas portas (*Banner Grabbing*)
* [ ] Suporte a protocolo UDP
* [ ] Exportar resultado da tabela para arquivo (JSON/CSV)
* [ ] Resolução de hostname além de IP
* [ ] Resolução de endereço MAC

## Aviso

Este projeto é destinado a fins educacionais e testes em redes/máquinas de sua propriedade ou com autorização explícita. Escanear portas de terceiros sem permissão pode violar leis locais.

```

```
