# 🎗️ Outubro Rosa 2026 - Conscientização e Prevenção

Aplicação web estática responsiva com foco em navegação mobile, desenvolvida para a campanha de conscientização e combate ao câncer de mama (**Outubro Rosa**).

---

## 📱 Funcionalidades

- **Apresentação em Sequência (1 -> 2 -> 3)**:
  1. **1. Faça o Autoexame!**: Orientações e sinais de alerta.
  2. **2. Fatores de Risco**: Idade, histórico familiar, genética, hábitos e saúde.
  3. **3. Apoie e Informe!**: Importância do apoio coletivo e da mamografia anual preventiva.
- **Navegação por Gestos (Touch Swipe & Drag)**:
  - Arraste a tela para os lados no celular (ou com o mouse no computador) para avançar ou retroceder.
  - Resistência elástica nas extremidades (*rubber-banding*).
- **Botões Flutuantes Inferiores**:
  - Botão **Anterior** (desabilita no primeiro slide).
  - Indicadores interativos de página (**Dots** e contador numérico).
  - Botão **Avançar** (transforma-se em **Reiniciar** no último slide).
- **Design Moderno e Responsivo**:
  - Estilização *Mobile-First* com preenchimento de viewport (`100dvh`).
  - Efeito *Glassmorphism* (blur translúcido), fundo ambiental suave e sem cortes nas imagens.
  - No computador, exibe uma moldura elegante de smartphone.
- **Navegação por Teclado**:
  - Suporte a setas (`←` e `→`), Barra de Espaço, `Home` e `End`.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessibilidade (ARIA).
- **CSS3**: Layout Flexbox, animações de transição suave e variáveis customizadas.
- **JavaScript (Vanilla)**: Motor leve de gestos *touch* e gerenciamento de estado sem dependências externas.

---

## 🚀 Como Executar Localmente

Como é um projeto puramente estático, basta abrir o arquivo `index.html` em qualquer navegador:

1. Clone o repositório:
   ```bash
   git clone https://github.com/msv-stihl/outubrorosa2026.git
   ```
2. Abra o arquivo `index.html` no seu navegador de preferência.
