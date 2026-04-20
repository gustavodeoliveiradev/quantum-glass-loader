# Quantum Glass Loader 🚀

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-blue.svg)](https://gustavodeoliveiradev.github.io/quantum-glass-loader/)
[![Progress](https://img.shields.io/badge/progress-7%20days%20challenge-orange.svg)]()

> Um loader moderno e interativo com **glassmorphism**, progressão **não-linear** e micro-interações fluidas. Desenvolvido como projeto de 7 dias para aprender boas práticas de frontend modular.

<p align="center">
  <img src="https://img.shields.io/badge/theme-dark%20%7C%20light-00d4ff" alt="Theme Support">
  <img src="https://img.shields.io/badge/accessibility-ARIA%20%7C%20Keyboard-7b2cbf" alt="Accessibility">
  <img src="https://img.shields.io/badge/performance-GPU%20Accelerated-00ff88" alt="Performance">
</p>

---

## 🎨 Preview

| Tema Escuro | Tema Claro |
|:-----------:|:----------:|
| ![Dark Theme](assets/preview-dark.png) | ![Light Theme](assets/preview-light.png) |

> 🌓 **Toggle de tema** no canto superior direito ou pressione `T`

---

## ✨ Features

- **🎨 Glassmorphism 2.0** — Efeito de vidro fosco com `backdrop-filter` e gradientes dinâmicos
- **🌓 Tema Dark/Light** — Toggle animado com persistência em `localStorage` e detecção do sistema
- **📊 Progresso Realista** — Simulação de rede com velocidades variáveis (não é linear!)
- **🎯 Micro-interações** — Pausar, simular erro, reiniciar com animações suaves
- **🎉 Partículas** — Explosão de confete ao completar com física realista
- **⌨️ Acessibilidade** — Navegação por teclado, ARIA labels, `prefers-reduced-motion`
- **📱 Responsivo** — Adaptativo para mobile e desktop

---

## 🎮 Controles

| Ação | Mouse | Teclado |
|------|-------|---------|
| Pausar/Continuar | Botão "Pausar" | `ESC` |
| Simular Erro | Botão "Simular Erro" | — |
| Reiniciar | Botão "Reiniciar" | `R` |
| Alternar Tema | Toggle no canto superior direito | `T` |

---

## 🏗️ Arquitetura Modular

```
quantum-loader/
├── index.html              # Estrutura semântica
├── css/
│   ├── base.css            # Variáveis de tema, reset, utilitários
│   ├── theme-toggle.css    # Switch dark/light animado
│   ├── glass-container.css # Efeito vidro + estados visuais
│   ├── progress-ring.css   # SVG circular com glow
│   ├── typography.css      # Textos + efeito digitação
│   └── controls.css        # Botões + interações
└── js/
    ├── config.js           # Constantes centralizadas
    ├── state.js            # Gerenciamento de estado
    ├── theme-manager.js    # Sistema de temas (localStorage + sistema)
    ├── particles.js        # Sistema de confete (Canvas API)
    ├── ui-updater.js       # Atualizações DOM centralizadas
    ├── progress.js         # Lógica de animação não-linear
    └── main.js             # Orquestrador
```

---

## 🚀 Como Usar

### Local
```bash
git clone https://github.com/gustavodeoliveiradev/quantum-glass-loader.git
cd quantum-glass-loader
# Abrir index.html no navegador ou usar servidor local
npx serve .
```

### GitHub Pages
🔗 **Acesse:** [gustavodeoliveiradev.github.io/quantum-glass-loader/](https://gustavodeoliveiradev.github.io/quantum-glass-loader/)

---

## 📅 Cronograma de Desenvolvimento (7 Dias)

| Dia | Foco | Status | Commit |
|-----|------|--------|--------|
| **Dia 1** | Estrutura modular + Design System + Glassmorphism | ✅ Completo | `feat: initial Quantum Glass Loader implementation` |
| **Dia 2** | Tema Dark/Light toggle + Persistência + Detecção SO | ✅ Completo | `feat: add dark/light theme toggle system` |
| **Dia 3** | Conexão com API real (fetch progress) | 🔜 Em breve | — |
| **Dia 4** | Animações avançadas + Web Audio API | 🔜 Em breve | — |
| **Dia 5** | Testes de performance (Lighthouse) | 🔜 Em breve | — |
| **Dia 6** | PWA + Offline support | 🔜 Em breve | — |
| **Dia 7** | Documentação final + Polish + Deploy | 🔜 Em breve | — |

> 🔄 **Atualizações diárias durante a semana!** Cada dia terá um novo commit com features e melhorias.

---

## 🛠️ Tecnologias

- **HTML5** Semântico + ARIA
- **CSS3** — Grid, Flexbox, Custom Properties, Backdrop Filter, SVG Filters
- **JavaScript ES6+** — Módulos, Classes, RequestAnimationFrame, localStorage API
- **SVG** — Gradientes, Filters (`feGaussianBlur`), `stroke-dasharray` animation
- **Canvas API** — Sistema de partículas com física

---

## 🎯 Objetivo de Aprendizado

Este projeto foi criado para praticar:
- ✅ Separação de responsabilidades (SOC)
- ✅ Arquitetura modular frontend
- ✅ Animações performáticas (GPU accelerated)
- ✅ Acessibilidade web (a11y)
- ✅ Git workflow com commits semânticos
- ✅ Design system com variáveis CSS
- ✅ Persistência de preferências do usuário

---

## 🤝 Agradecimentos

Agradeço ao **App Launcher** pela motivação:

> *"Glassmorphism loaders are underrated. Day 1 energy is elite."*

---

## 📄 Licença

[MIT License](LICENSE) — sinta-se livre para usar e modificar!

---

<p align="center">
  Feito com 💙 e muito café durante 7 dias de coding<br>
  <a href="https://gustavodeoliveiradev.github.io/quantum-glass-loader/">🚀 Ver ao vivo</a>
</p>
