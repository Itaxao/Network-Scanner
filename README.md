# Network_Scanner

**Network_Scanner** é um projeto experimental de análise, descoberta e diagnóstico de redes desenvolvido principalmente em **Rust**, com interface desktop baseada em **Tauri + React**.

Embora o projeto tenha começado como um scanner de portas TCP, a proposta de longo prazo é construir uma ferramenta mais ampla capaz de observar diferentes aspectos de uma rede: hosts, endereços IP e MAC, portas, serviços, pacotes, rotas, interfaces, NAT, CGNAT e comportamento do tráfego.

O objetivo não é apenas criar uma interface para executar um port scan, mas implementar e estudar os mecanismos que existem por trás de ferramentas de diagnóstico e análise de redes.

> Este projeto está em desenvolvimento. Várias funcionalidades descritas neste documento representam objetivos futuros e ainda não estão implementadas.

---

## Visão do projeto

A ideia do Network_Scanner é evoluir gradualmente para uma suíte modular de análise de redes.

Em vez de trabalhar apenas com:

```text
IP -> portas abertas
```

a intenção é permitir uma análise semelhante a:

```text
Rede
│
├── Interfaces
│   ├── IPv4
│   ├── IPv6
│   ├── MAC
│   ├── Gateway
│   └── DNS
│
├── Descoberta
│   ├── Hosts da LAN
│   ├── ARP / NDP
│   ├── Hostnames
│   └── Latência
│
├── Port Scanner
│   ├── TCP
│   ├── UDP
│   ├── Intervalos customizados
│   └── Identificação de serviços
│
├── Packet Analysis
│   ├── Captura de pacotes
│   ├── Filtros
│   ├── TCP
│   ├── UDP
│   ├── ICMP
│   ├── ARP
│   └── DNS
│
├── NAT
│   ├── IP privado
│   ├── IP público
│   ├── Detecção de NAT
│   ├── Comportamento de mapeamento
│   └── CGNAT
│
├── Diagnóstico
│   ├── Rotas
│   ├── Gateway
│   ├── DNS
│   ├── Traceroute
│   └── Estatísticas
│
└── Frontend
    ├── Dashboard
    ├── Visualização em tempo real
    ├── Filtros
    ├── Histórico
    └── Exportação
```

A proposta é que cada uma dessas funcionalidades seja implementada como um módulo independente no backend em Rust e posteriormente integrada à interface gráfica através do Tauri.

---

# Estado atual

O projeto ainda está em uma fase inicial de desenvolvimento.

Atualmente existe um protótipo funcional do núcleo de **TCP Port Scanning** em Rust e a estrutura inicial da aplicação desktop utilizando **Tauri + React**.

### Backend

O scanner atual:

* utiliza `TcpStream` para realizar tentativas de conexão TCP;
* percorre um grande intervalo de portas;
* executa conexões de forma concorrente;
* divide as portas em lotes;
* utiliza threads nativas do Rust;
* aplica timeout individual às conexões;
* identifica portas que aceitam conexão.

O port scanner serve como primeiro módulo para posteriormente construir uma arquitetura de análise de rede mais completa.

### Frontend

A aplicação já possui a estrutura base utilizando:

* React;
* Vite;
* Tauri;
* backend nativo em Rust.

A integração completa entre o scanner e o frontend ainda faz parte da evolução atual do projeto.

A intenção é que a interface deixe de ser apenas uma tela para iniciar scans e passe a funcionar como um **dashboard de diagnóstico de rede**.

---

# Objetivos

O projeto possui alguns objetivos principais.

## Aprendizado

Implementar diretamente conceitos relacionados a:

* sockets;
* TCP/IP;
* UDP;
* modelo OSI;
* ARP;
* ICMP;
* DNS;
* IPv4;
* IPv6;
* roteamento;
* NAT;
* CGNAT;
* captura de pacotes;
* concorrência;
* programação assíncrona;
* comunicação IPC;
* sistemas operacionais.

## Engenharia

Explorar características do Rust relacionadas a:

* concorrência;
* gerenciamento seguro de memória;
* threads;
* I/O;
* sockets;
* programação assíncrona;
* baixo nível;
* integração com APIs do sistema operacional.

## Interface

Construir uma aplicação desktop que permita visualizar informações de rede sem depender exclusivamente de ferramentas CLI.

---

# Arquitetura planejada

A arquitetura deverá separar a lógica de rede da interface.

```text
┌─────────────────────────────────────┐
│             React UI                │
│                                     │
│ Dashboard / Scanner / Sniffer       │
│ Hosts / NAT / Interfaces / Logs     │
└──────────────────┬──────────────────┘
                   │
                   │ Tauri IPC
                   │
┌──────────────────▼──────────────────┐
│              Rust Core              │
│                                     │
│ scanner                             │
│ discovery                           │
│ resolver                            │
│ packet_capture                      │
│ service_detection                   │
│ nat                                 │
│ diagnostics                         │
│ exporter                            │
└──────────────────┬──────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
 OS Networking APIs      Network Interfaces
        │
        ▼
 TCP / UDP / ICMP / ARP / IP
```

Essa separação permitirá que o backend continue responsável por operações de rede e processamento intensivo enquanto o frontend se concentra na apresentação dos dados.

---

# Funcionalidades planejadas

## 1. TCP Port Scanner

O primeiro módulo do projeto.

O scanner tenta estabelecer conexões TCP com as portas do endereço informado e identifica quais delas estão aceitando conexões.

Exemplo:

```text
Target: 192.168.1.50

22/tcp     OPEN
80/tcp     OPEN
443/tcp    OPEN
8080/tcp   OPEN
```

### Objetivos

* [x] Implementar scanner TCP básico
* [x] Implementar conexões concorrentes
* [x] Processar portas em lotes
* [x] Implementar timeout de conexão
* [ ] Integrar scanner ao frontend Tauri
* [ ] Configurar porta inicial e final
* [ ] Permitir listas de portas específicas
* [ ] Configurar timeout pela interface
* [ ] Configurar nível de concorrência
* [ ] Cancelar scans em andamento
* [ ] Exibir progresso em tempo real
* [ ] Diferenciar estados como `open`, `closed` e `filtered`
* [ ] Criar benchmarks de desempenho

---

# 2. UDP Scanner

TCP e UDP possuem comportamentos bastante diferentes.

Em TCP, uma conexão pode ser utilizada para determinar diretamente se determinada porta está aceitando conexões.

UDP não possui handshake equivalente.

Por isso, a ausência de resposta não necessariamente significa que uma porta UDP está fechada.

O suporte a UDP exigirá uma estratégia própria envolvendo respostas do serviço, timeout e mensagens ICMP quando disponíveis.

### Roadmap

* [ ] Implementar probes UDP
* [ ] Detectar respostas UDP
* [ ] Processar mensagens ICMP relacionadas
* [ ] Identificar portas possivelmente abertas
* [ ] Criar probes específicos para protocolos conhecidos

---

# 3. Identificação de serviços

Encontrar uma porta aberta não significa necessariamente conhecer o serviço executado nela.

Por exemplo:

```text
22/tcp OPEN
```

pode indicar SSH, mas um administrador pode executar qualquer outro protocolo nessa porta.

O projeto deverá inicialmente possuir uma base de portas conhecidas e posteriormente realizar identificação ativa dos serviços.

### Planejado

* [ ] Mapeamento de portas conhecidas
* [ ] Banner grabbing
* [ ] Identificação de protocolos
* [ ] Detecção básica de versões
* [ ] Fingerprinting de serviços

Um resultado futuro poderia ser:

```text
PORT      STATE    SERVICE
22/tcp    open     ssh
53/udp    open     dns
80/tcp    open     http
443/tcp   open     https
```

As associações entre porta e serviço deverão ser tratadas como indicações, e não como confirmação absoluta.

---

# 4. Descoberta de dispositivos na rede local

Outro objetivo importante é permitir que o programa descubra os dispositivos presentes na mesma rede local.

Um exemplo seria transformar:

```text
192.168.1.0/24
```

em:

```text
192.168.1.1      Router
192.168.1.10     Desktop
192.168.1.15     Smartphone
192.168.1.20     Notebook
192.168.1.30     Unknown
```

Diferentes técnicas poderão ser estudadas.

### Planejado

* [ ] Descoberta através de ARP
* [ ] ICMP Echo
* [ ] TCP probes
* [ ] Descoberta passiva
* [ ] Resolução de hostname
* [ ] Detecção de gateway
* [ ] Medição de latência
* [ ] Identificação básica de fabricantes por MAC/OUI

---

# 5. Endereços MAC e camada de enlace

O projeto também deverá trabalhar com informações da camada de enlace.

Na mesma rede local será possível explorar protocolos como ARP para relacionar:

```text
IPv4
  |
  v
MAC
```

Exemplo:

```text
192.168.1.1
    |
    └── AA:BB:CC:DD:EE:FF
```

### Planejado

* [ ] Ler endereço MAC das interfaces locais
* [ ] Consultar tabela ARP
* [ ] Descobrir dispositivos via ARP
* [ ] Relacionar IP e MAC
* [ ] Identificar fabricante através do OUI
* [ ] Estudar NDP para IPv6

## Limitação importante

Endereços MAC não são roteados pela Internet.

Um endereço MAC pertence ao enlace local.

Por exemplo:

```text
PC
 |
Router
 |
Internet
 |
Server
```

o computador normalmente consegue observar o MAC do seu próximo salto local, como o roteador, mas não o endereço MAC físico do servidor remoto.

Por isso, a descoberta de MAC será principalmente uma funcionalidade de análise da **LAN**.

---

# 6. Packet Sniffer

Uma das expansões mais importantes planejadas é um módulo de captura e análise de pacotes.

O objetivo é permitir que a aplicação observe o tráfego que passa pelas interfaces de rede disponíveis no computador.

O módulo poderá mostrar informações como:

```text
Ethernet
   |
   └── IPv4
        |
        └── TCP
             |
             ├── Source IP
             ├── Destination IP
             ├── Source Port
             ├── Destination Port
             └── Flags
```

### Protocolos de interesse

* Ethernet
* ARP
* IPv4
* IPv6
* TCP
* UDP
* ICMP
* DNS

### Funcionalidades planejadas

* [ ] Listar interfaces disponíveis
* [ ] Selecionar interface para captura
* [ ] Capturar pacotes
* [ ] Exibir pacotes em tempo real
* [ ] Filtrar por protocolo
* [ ] Filtrar por IP
* [ ] Filtrar por porta
* [ ] Mostrar tamanho dos pacotes
* [ ] Mostrar origem e destino
* [ ] Mostrar flags TCP
* [ ] Estatísticas de protocolos
* [ ] Pausar e continuar captura
* [ ] Exportar capturas
* [ ] Inspecionar estruturas dos protocolos

O objetivo inicial não é reproduzir toda a capacidade de ferramentas especializadas como Wireshark, mas entender e implementar os fundamentos da captura e interpretação de tráfego.

---

# 7. Informações das interfaces de rede

Uma seção específica da aplicação deverá permitir inspecionar as interfaces do próprio computador.

Exemplo:

```text
Interface: enp5s0

IPv4:        192.168.1.15
Netmask:     255.255.255.0
Network:     192.168.1.0/24
MAC:         AA:BB:CC:DD:EE:FF
Gateway:     192.168.1.1
DNS:         192.168.1.1
State:       UP
```

### Planejado

* [ ] Interfaces disponíveis
* [ ] IPv4
* [ ] IPv6
* [ ] MAC
* [ ] Máscara de rede
* [ ] Prefixo CIDR
* [ ] Gateway padrão
* [ ] DNS configurado
* [ ] MTU
* [ ] Estado da interface
* [ ] Estatísticas RX/TX

---

# 8. Diagnóstico de NAT

NAT será outra área de estudo do projeto.

Uma máquina dentro de uma rede doméstica geralmente possui um endereço privado:

```text
192.168.1.50:50000
```

enquanto o roteador realiza uma tradução para um endereço externo:

```text
203.0.113.20:62000
```

de forma semelhante a:

```text
LAN

192.168.1.50:50000
        |
        v
+----------------+
|      NAT       |
+----------------+
        |
        v
203.0.113.20:62000

Internet
```

O objetivo será analisar quais informações dessa tradução podem ser observadas pelo próprio host.

### Possíveis funcionalidades

* [ ] Detectar endereço IP privado
* [ ] Detectar endereço IP público
* [ ] Comparar IP local e externo
* [ ] Utilizar STUN para descoberta de endereço externo
* [ ] Investigar comportamento do NAT
* [ ] Identificar mapeamentos observáveis
* [ ] Verificar suporte a UPnP
* [ ] Investigar NAT-PMP
* [ ] Investigar PCP
* [ ] Detectar possíveis cenários de Double NAT

---

# 9. CGNAT

O suporte relacionado a **Carrier-Grade NAT (CGNAT)** será tratado como uma funcionalidade de diagnóstico.

CGNAT ocorre quando múltiplos clientes de um provedor compartilham infraestrutura de tradução de endereços antes de acessar a Internet.

Um cenário pode ser semelhante a:

```text
Computador
    |
    | 192.168.1.20
    |
Roteador residencial
    |
    | endereço intermediário
    |
CGNAT da operadora
    |
    | IP público compartilhado
    |
Internet
```

O projeto poderá tentar identificar indícios desse cenário analisando:

* endereço da interface WAN quando disponível;
* endereço público observado externamente;
* faixas reservadas para Shared Address Space;
* número de traduções aparentes;
* traceroute;
* comportamento observado através de STUN;
* diferenças entre endereços locais e externos.

### Planejado

* [ ] Detectar indícios de CGNAT
* [ ] Identificar endereços na faixa `100.64.0.0/10`
* [ ] Comparar endereço WAN e endereço público
* [ ] Exibir possíveis cenários de Double NAT
* [ ] Realizar testes utilizando STUN
* [ ] Analisar comportamento de mapeamento
* [ ] Exibir visualmente a possível cadeia de NAT

## Limitações de NAT e CGNAT

O Network_Scanner não deverá afirmar que consegue simplesmente "reverter" qualquer NAT.

A tabela completa de tradução pertence ao dispositivo que executa o NAT.

Em uma rede residencial esse dispositivo normalmente é o roteador.

Em CGNAT, parte dessa infraestrutura pertence ao provedor.

Sem acesso administrativo ao equipamento, nem todas as associações entre:

```text
IP privado:porta
        <->
IP público:porta
```

podem ser descobertas.

A proposta do projeto é identificar e analisar aquilo que pode ser **observado ou inferido de forma legítima a partir do host local**, deixando explícitas as limitações de cada método.

---

# 10. Rotas e topologia

O projeto também poderá possuir ferramentas relacionadas ao caminho realizado pelos pacotes.

### Planejado

* [ ] Visualizar tabela de rotas
* [ ] Identificar gateway padrão
* [ ] Implementar traceroute
* [ ] Medir latência por hop
* [ ] Exibir perda de pacotes
* [ ] Detectar mudanças de rota
* [ ] Representar visualmente o caminho até determinado destino

Uma representação futura poderia ser:

```text
Local Host
192.168.1.20
      |
      v
Gateway
192.168.1.1
      |
      v
ISP
10.x.x.x
      |
      v
CGNAT
100.64.x.x
      |
      v
Internet
      |
      v
Destination
```

Essa visualização deverá representar apenas informações observáveis, sem assumir que todos os roteadores intermediários serão necessariamente identificáveis.

---

# 11. DNS e resolução de nomes

Outro módulo poderá ser dedicado ao sistema DNS.

### Planejado

* [ ] Resolver hostname para IPv4
* [ ] Resolver hostname para IPv6
* [ ] Reverse DNS
* [ ] Exibir servidores DNS configurados
* [ ] Consultar registros DNS
* [ ] Exibir tempo de resolução
* [ ] Criar histórico de consultas

---

# 12. Dashboard

O frontend deverá evoluir para um dashboard central de análise.

Uma estrutura possível:

```text
Network Scanner
│
├── Overview
├── Interfaces
├── Devices
├── Port Scanner
├── Service Scanner
├── Packet Capture
├── NAT / CGNAT
├── DNS
├── Routes
└── History
```

---

# Frontend

O frontend utiliza **React** executado dentro da aplicação desktop através do **Tauri**.

A escolha dessa arquitetura permite combinar:

```text
React
   |
   | Interface
   v
Tauri
   |
   | IPC
   v
Rust
   |
   | Networking
   v
Sistema Operacional
```

A intenção é manter toda a lógica de rede sensível e de maior desempenho no lado nativo.

O React ficará responsável principalmente por:

* entrada de parâmetros;
* visualização dos resultados;
* gráficos;
* tabelas;
* filtros;
* configuração;
* histórico;
* navegação entre módulos.

---

# Visualização em tempo real

Operações como scans e captura de pacotes podem produzir resultados continuamente.

Por isso, a aplicação deverá utilizar eventos IPC para permitir um fluxo semelhante a:

```text
Rust
 |
 | host-found
 | port-found
 | packet-captured
 | scan-progress
 | scan-finished
 |
 v
Tauri IPC
 |
 v
React
 |
 v
Interface atualizada
```

Isso evita que o frontend precise aguardar o término de uma operação longa para começar a apresentar informações.

---

# Resultados e exportação

Os resultados poderão futuramente ser armazenados ou exportados.

### Planejado

* [ ] JSON
* [ ] CSV
* [ ] PCAP para capturas compatíveis
* [ ] Histórico de scans
* [ ] Histórico de hosts
* [ ] Comparação entre scans
* [ ] Relatórios
* [ ] Filtros e busca

---

# Performance

Uma das áreas de estudo do projeto será o impacto de diferentes estratégias de concorrência.

O scanner atual utiliza threads e processamento em lotes.

Futuramente poderão ser comparadas abordagens como:

```text
Thread por conexão
        |
        v
Thread Pool
        |
        v
Async I/O
        |
        v
Event-driven networking
```

### Métricas

Benchmarks futuros deverão registrar pelo menos:

```text
CPU:
RAM:
Sistema operacional:
Interface:
Destino:
Latência:

Portas analisadas:
Timeout:
Concorrência:

Tempo total:
Uso máximo de CPU:
Uso máximo de memória:
```

Isso permitirá que afirmações de desempenho sejam baseadas em resultados reproduzíveis.

---

# Roadmap

## Fase 1 — Port Scanner

* [x] Scanner TCP inicial
* [x] Concorrência através de threads
* [x] Timeout de conexões
* [x] Processamento em lotes
* [x] Estrutura Tauri + React
* [ ] Integrar scanner ao Tauri
* [ ] Dashboard inicial
* [ ] Barra de progresso
* [ ] Configuração de portas
* [ ] Configuração de timeout
* [ ] Cancelamento de scan

## Fase 2 — Descoberta de rede

* [ ] Informações das interfaces
* [ ] IPv4 e IPv6
* [ ] Gateway
* [ ] MAC
* [ ] ARP
* [ ] Descoberta de hosts
* [ ] Hostnames
* [ ] Latência

## Fase 3 — Scanner avançado

* [ ] UDP
* [ ] Identificação de serviços
* [ ] Banner grabbing
* [ ] Fingerprinting
* [ ] Estados de portas
* [ ] Otimizações de concorrência

## Fase 4 — Packet Analysis

* [ ] Captura de pacotes
* [ ] Parser Ethernet
* [ ] Parser ARP
* [ ] Parser IPv4
* [ ] Parser IPv6
* [ ] Parser TCP
* [ ] Parser UDP
* [ ] Parser ICMP
* [ ] Parser DNS
* [ ] Filtros
* [ ] Estatísticas
* [ ] Exportação

## Fase 5 — Diagnóstico

* [ ] DNS tools
* [ ] Tabela de rotas
* [ ] Traceroute
* [ ] Estatísticas das interfaces
* [ ] Diagnóstico de conectividade

## Fase 6 — NAT e CGNAT

* [ ] IP público
* [ ] STUN
* [ ] Detecção de NAT
* [ ] Análise de comportamento
* [ ] Double NAT
* [ ] Indícios de CGNAT
* [ ] UPnP
* [ ] NAT-PMP / PCP
* [ ] Visualização da cadeia de tradução

## Fase 7 — Interface e dados

* [ ] Dashboard completo
* [ ] Histórico
* [ ] Gráficos
* [ ] Filtros
* [ ] JSON
* [ ] CSV
* [ ] PCAP
* [ ] Relatórios
* [ ] Comparação entre análises

---

# Tecnologias

## Atualmente

| Tecnologia | Uso                                  |
| ---------- | ------------------------------------ |
| Rust       | Backend e operações de rede          |
| Tauri      | Aplicação desktop e comunicação IPC  |
| React      | Interface gráfica                    |
| Vite       | Build e ambiente do frontend         |
| TCP/IP     | Base do scanner atual                |
| Nix        | Ambiente de desenvolvimento no NixOS |

## Tecnologias que poderão ser exploradas

Conforme novos módulos forem implementados, o projeto poderá utilizar APIs e bibliotecas relacionadas a:

* packet capture;
* raw sockets;
* interfaces de rede;
* async I/O;
* PCAP;
* ARP;
* ICMP;
* DNS;
* STUN.

As dependências serão escolhidas conforme cada funcionalidade for implementada, evitando adicionar bibliotecas apenas pelo roadmap.

---

# Requisitos

Para a versão atual:

* Node.js;
* npm;
* Rust;
* Cargo;
* dependências necessárias para compilação do Tauri.

O projeto utiliza Rust Edition 2024.

## NixOS

O repositório contém um `shell.nix` para fornecer o ambiente necessário ao desenvolvimento e às dependências gráficas utilizadas pelo Tauri.

---

# Instalação

Clone utilizando SSH:

```bash
git clone git@github.com:Itaxao/Network_Scanner.git
cd Network_Scanner
```

No NixOS:

```bash
nix-shell
```

Instale as dependências do frontend:

```bash
npm install
```

Execute em modo de desenvolvimento:

```bash
npm run tauri dev
```

---

# Permissões do sistema

Algumas funcionalidades futuras trabalham em níveis mais baixos da pilha de rede.

Recursos como:

* captura de pacotes;
* raw sockets;
* ICMP;
* algumas formas de descoberta de hosts;
* modo promíscuo;
* determinadas operações sobre interfaces;

podem exigir permissões adicionais do sistema operacional.

Dependendo da plataforma, isso poderá envolver privilégios administrativos ou capabilities específicas.

O projeto deverá solicitar apenas os privilégios necessários para cada funcionalidade e documentar claramente o motivo de cada permissão.

---

# Limitações técnicas

O projeto pretende trabalhar em diferentes camadas da rede, mas existem limites importantes.

## Informação depende da posição do scanner

O programa só consegue observar aquilo que está visível a partir da máquina onde está sendo executado.

Um scan externo e um scan dentro da LAN podem apresentar resultados completamente diferentes.

## Firewalls

Firewalls podem:

* bloquear pacotes;
* rejeitar conexões;
* ignorar conexões;
* limitar tráfego;
* esconder serviços.

## MAC

O MAC de dispositivos remotos através da Internet normalmente não é diretamente observável.

## NAT

Nem todos os mapeamentos NAT podem ser descobertos externamente.

## CGNAT

A infraestrutura interna de um provedor não fica automaticamente disponível para análise pelo cliente.

## Packet capture

Um sniffer executado em uma máquina não necessariamente consegue enxergar todo o tráfego da LAN.

Em redes modernas com switches, normalmente a máquina observa principalmente:

* seu próprio tráfego;
* broadcasts;
* multicasts;
* tráfego especificamente direcionado a ela.

---

# O que o projeto não pretende ser

O objetivo não é simplesmente recriar integralmente ferramentas como:

* Nmap;
* Wireshark;
* tcpdump;
* traceroute;
* iproute2.

Essas ferramentas são projetos maduros, especializados e desenvolvidos durante muitos anos.

O objetivo do Network_Scanner é estudar os mesmos fundamentos construindo uma implementação própria, modular e integrada.

Isso permite compreender melhor o que ocorre em cada etapa:

```text
Pacote
   ->
Interface
   ->
IP
   ->
Transporte
   ->
Socket
   ->
Aplicação
```

e transformar esse aprendizado em uma aplicação real.

---

# Segurança e uso responsável

Este software é destinado a:

* aprendizado;
* laboratórios;
* redes próprias;
* máquinas próprias;
* desenvolvimento;
* pesquisa;
* diagnóstico;
* ambientes onde exista autorização explícita.

Não utilize funcionalidades de scanning, captura ou análise contra sistemas, redes ou dispositivos para os quais você não possui autorização.

Operações de rede podem ser registradas por:

* firewalls;
* IDS;
* IPS;
* servidores;
* roteadores;
* sistemas de monitoramento;
* provedores.

A existência de uma funcionalidade no projeto não implica autorização para utilizá-la contra infraestrutura de terceiros.

O usuário é responsável por respeitar:

* legislação aplicável;
* contratos;
* políticas de rede;
* termos de serviço;
* limites da autorização recebida.

---

# Princípio do projeto

O Network_Scanner busca seguir uma ideia simples:

> Não apenas utilizar ferramentas de rede, mas entender como elas funcionam construindo seus fundamentos.

O port scanner é apenas o primeiro passo.

A intenção de longo prazo é criar uma aplicação capaz de acompanhar um pacote desde as interfaces locais até diferentes camadas da rede, permitindo estudar descoberta, comunicação, roteamento, tradução de endereços e análise de tráfego através de uma única interface.

---

# Contribuições

O projeto ainda está em desenvolvimento e poderá sofrer alterações significativas de arquitetura.

Sugestões relacionadas a:

* Rust;
* redes;
* performance;
* arquitetura;
* interface;
* protocolos;
* sistemas operacionais;
* documentação;

são bem-vindas.

---

# Licença

A licença do projeto será definida conforme o desenvolvimento evoluir.
