// Animações minimalistas para o tema escuro
document.addEventListener("DOMContentLoaded", function () {
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

  gsap.from(".buttons-container button", {
    opacity: 0,
    x: -20,
    duration: 0.6,
    stagger: 0.15,
    delay: 0.8,
    ease: "power2.out",
  });

  // Adicionando funcionalidade temporária aos botões
  const buttons = {
    "btn-pomodoro": "Modo Pomodoro",
    "btn-normal": "Modo Normal",
    "btn-zen": "Modo Zen",
  };

  Object.keys(buttons).forEach((id) => {
    document.getElementById(id).addEventListener("click", function () {
      alert(`${buttons[id]} selecionado! Será implementado em breve.`);
    });
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

// Ao final do arquivo, adicionar:

// Verificação de depuração para botões
console.log("Verificando botões...");

// Garantir que os botões estejam visíveis
document.querySelectorAll("button").forEach((button) => {
  console.log("Botão encontrado:", button.id);

  // Forçar estilo inline para garantir visibilidade
  button.style.display = "flex";
  button.style.opacity = "1";
  button.style.position = "relative";
  button.style.zIndex = "10";

  // Adicionar borda temporária para depuração
  button.style.border = "1px solid red";
});

// Verificar estrutura do DOM
console.log("Estrutura do Cronômetro:", document.querySelector(".cronometro"));
console.log(
  "Container de botões:",
  document.querySelector(".buttons-container")
);
