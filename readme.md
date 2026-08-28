# port_Scanner

Scanner de portas TCP simples e rápido, escrito em Rust. Varre todas as 65.535 portas de um endereço IP em lotes concorrentes, usando *threads* para acelerar a varredura.

## Como funciona

O programa recebe um endereço IP (ou `ip:porta` base) via linha de comando e tenta abrir uma conexão TCP em cada porta de 1 a 65.534. As portas são processadas em lotes de 500, cada uma em sua própria *thread*, com timeout de 500ms por tentativa de conexão. Quando uma porta responde, ela é reportada como aberta no terminal.

## Requisitos

- [Rust e Cargo](https://www.rust-lang.org/tools/install) instalados (edição 2024)

## Instalação

Clone o repositório e compile o projeto:

```bash
git clone https://github.com/Itaxao/port_Scanner.git
cd port_Scanner
cargo build --release
```

O binário compilado ficará em `target/release/port_Scanner`.

## Uso

```bash
cargo run -- <IP>
```

Ou, usando o binário já compilado:

```bash
./target/release/port_Scanner <IP>
```

### Exemplo

```bash
cargo run -- 192.168.0.1
```

Saída esperada (exemplo):

```
Endereço atual 192.168.0.1:22 está com a porta:  22 aberta!
Endereço atual 192.168.0.1:80 está com a porta:  80 aberta!
Endereço atual 192.168.0.1:443 está com a porta:  443 aberta!
```

## Dependências

- [`clap`](https://crates.io/crates/clap) — parsing de argumentos de linha de comando

## Roadmap / possíveis melhorias

- [ ] Permitir definir intervalo de portas customizado (ex: `--start` e `--end`)
- [ ] Permitir configurar o timeout via argumento
- [ ] Suporte a UDP
- [ ] Exportar resultado para arquivo (JSON/CSV)
- [ ] Barra de progresso durante a varredura
- [ ] Resolução de hostname além de IP
- [ ] Resolução de MacAdress além de IP e hostname

## Aviso

Este projeto é destinado a fins educacionais e testes em redes/máquinas de sua propriedade ou com autorização explícita. Escanear portas de terceiros sem permissão pode violar leis locais.