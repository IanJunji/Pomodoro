// Animações e funcionalidades para a página principal
document.addEventListener("DOMContentLoaded", function () {
  // Referências aos elementos
  const themeToggleBtn = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;
  const buttonContainer = document.querySelector(".buttons-container");
  const buttons = document.querySelectorAll(".buttons-container button");

  // Função para garantir que os botões estejam visíveis
  function ensureVisibleButtons() {
    // Garantir que o container de botões esteja visível
    if (buttonContainer) {
      buttonContainer.style.display = "flex";
      buttonContainer.style.flexDirection = "column";
      buttonContainer.style.width = "100%";
      buttonContainer.style.zIndex = "100";
      buttonContainer.style.position = "relative";
      buttonContainer.style.opacity = "1";
      buttonContainer.style.visibility = "visible";
    }

    // Garantir que cada botão esteja visível
    buttons.forEach((button) => {
      button.style.display = "flex";
      button.style.opacity = "1";
      button.style.visibility = "visible";
      button.style.zIndex = "100";
      button.style.position = "relative";
      button.style.margin = "0 0 15px 0";
    });
  }

  // Estado do tema
  let isDarkTheme = localStorage.getItem("cronometroTheme") === "dark";

  // Função para garantir que o ícone seja visível
  function ensureVisibleIcon() {
    // Tenta obter o ícone
    const icon = themeToggleBtn.querySelector("i");

    if (!icon || window.getComputedStyle(icon).display === "none") {
      // Se o ícone não existe ou não está visível, usa um emoji como fallback
      if (isDarkTheme) {
        themeToggleBtn.innerHTML = "🌙"; // emoji da lua
      } else {
        themeToggleBtn.innerHTML = "☀️"; // emoji do sol
      }
    } else {
      // Se o ícone existe, garante que esteja visível
      icon.style.display = "block";
      icon.style.visibility = "visible";
      icon.style.color = isDarkTheme ? "#e0e0e0" : "#212529";
      icon.style.fontSize = "1.2rem";
    }
  }

  // Inicializa o tema com base na preferência salva
  function initTheme() {
    if (isDarkTheme) {
      htmlElement.classList.add("dark-theme");
      themeToggleBtn.innerHTML =
        '<i class="fas fa-moon"></i><span class="fallback-icon"></span>';
    } else {
      htmlElement.classList.remove("dark-theme");
      themeToggleBtn.innerHTML =
        '<i class="fas fa-sun"></i><span class="fallback-icon"></span>';
    }

    // Garante que o ícone está visível
    setTimeout(ensureVisibleIcon, 100);

    // Garante que os botões estão visíveis
    setTimeout(ensureVisibleButtons, 100);
  }

  // Alterna entre tema claro e escuro
  function toggleTheme() {
    isDarkTheme = !isDarkTheme;

    if (isDarkTheme) {
      htmlElement.classList.add("dark-theme");
      themeToggleBtn.innerHTML =
        '<i class="fas fa-moon"></i><span class="fallback-icon"></span>';
      localStorage.setItem("cronometroTheme", "dark");
    } else {
      htmlElement.classList.remove("dark-theme");
      themeToggleBtn.innerHTML =
        '<i class="fas fa-sun"></i><span class="fallback-icon"></span>';
      localStorage.setItem("cronometroTheme", "light");
    }

    // Garante que o ícone está visível após a troca
    setTimeout(ensureVisibleIcon, 100);

    // Garante que os botões estão visíveis após a troca
    setTimeout(ensureVisibleButtons, 100);
  }

  // Botão de alternar tema
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme);
  }

  // Inicializa o tema
  initTheme();

  // Força visibilidade dos botões agora
  ensureVisibleButtons();

  // Primeiro forçar os botões a serem visíveis antes da animação
  document.querySelectorAll(".buttons-container button").forEach((btn) => {
    btn.style.display = "flex";
    btn.style.opacity = "1";
    btn.style.visibility = "visible";
  });

  // Animação de entrada
  gsap.from(".cronometro", {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: "power3.out",
  });

  gsap.from("h1, p", {
    opacity: 0,
    y: -20,
    duration: 0.8,
    stagger: 0.2,
    delay: 0.3,
    ease: "power2.out",
  });

  // Modificando a animação dos botões para garantir que eles fiquem visíveis
  gsap.from(".buttons-container button", {
    opacity: 0.5, // Começa com opacidade 0.5 em vez de 0
    x: -20,
    duration: 0.6,
    stagger: 0.15,
    delay: 0.8,
    ease: "power2.out",
    onStart: function () {
      // Garantir que os botões estejam visíveis durante a animação
      document.querySelectorAll(".buttons-container button").forEach((btn) => {
        btn.style.opacity = "1";
        btn.style.visibility = "visible";
        btn.style.display = "flex";
      });
    },
  });

  // Configurando navegação direta para cada botão
  document
    .getElementById("btn-pomodoro")
    ?.addEventListener("click", function () {
      window.location.href = "Cronometro/pages/pomodoro.html";
    });

  document.getElementById("btn-normal")?.addEventListener("click", function () {
    window.location.href = "Cronometro/pages/timer-comum.html";
  });

  document.getElementById("btn-zen")?.addEventListener("click", function () {
    window.location.href = "Cronometro/pages/zen.html";
  });

  // Animações das formas dos botões no hover
  document.querySelectorAll("button").forEach((button) => {
    const shape = button.querySelector(".button-shape");

    if (shape) {
      button.addEventListener("mouseenter", function () {
        // Animação específica para cada tipo de botão
        if (button.classList.contains("botao-pomodoro")) {
          gsap.to(shape, {
            rotation: 180,
            scale: 1.2,
            duration: 0.5,
            ease: "back.out(1.7)",
          });
        } else if (button.classList.contains("botao-normal")) {
          gsap.to(shape, {
            rotation: 45,
            scale: 1.2,
            duration: 0.5,
            ease: "back.out(1.7)",
          });
        } else if (button.classList.contains("botao-zen")) {
          gsap.to(shape, {
            y: -5,
            scale: 1.2,
            yoyo: true,
            repeat: -1,
            duration: 1.5,
            ease: "sine.inOut",
          });
        }
      });

      button.addEventListener("mouseleave", function () {
        gsap.killTweensOf(shape);
        gsap.to(shape, {
          rotation: 0,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "power1.out",
        });
      });
    }
  });
});
