# Network_Scanner 🌐

Scanner de portas TCP de altíssima performance com interface gráfica. Desenvolvido com motor nativo em Rust para garantir varreduras concorrentes ultrarrápidas, aliado a um painel moderno e reativo construído com React e Tailwind CSS via framework Tauri.

## ⚙️ Arquitetura

O projeto divide as responsabilidades para maximizar performance e fluidez visual:
*   **Backend (Motor de Rede):** Escrito em Rust (`src-tauri`). Executa a tentativa de conexões TCP em lotes simultâneos (de 1 a 65.535), aproveitando o controle de memória e concorrência da linguagem.
*   **Frontend (Interface Gráfica):** Escrito em React e Tailwind CSS (`src`). Comunica-se com o motor nativo via eventos IPC (Inter-Process Communication) para exibir barras de progresso e resultados em tempo real sem congelar a tela.

## 🛠️ Requisitos de Desenvolvimento

- [Node.js e npm](https://nodejs.org/)
- [Rust e Cargo](https://www.rust-lang.org/tools/install)
- **NixOS (Ambiente Declarativo):** O projeto utiliza um arquivo `shell.nix` para compilar as dependências de interface gráfica (WebKitGTK, librsvg, glib) de forma isolada e reprodutível.

## 🚀 Como Executar Localmente

1. Clone o repositório:
```bash
git clone [https://github.com/Itaxao/Network_Scanner.git](https://github.com/Itaxao/Network_Scanner.git)
cd Network_Scanner
