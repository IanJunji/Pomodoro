document.addEventListener("DOMContentLoaded", function () {
  // Elementos DOM - Controles
  const startBtn = document.getElementById("start-btn");
  const pauseBtn = document.getElementById("pause-btn");
  const resetBtn = document.getElementById("reset-btn");

  // Elementos DOM - Modos
  const clockModeBtn = document.getElementById("clock-mode");
  const chronoModeBtn = document.getElementById("chrono-mode");
  const timerModeBtn = document.getElementById("timer-mode");
  const timerConfig = document.getElementById("timer-config");

  // Elemento DOM - Botão de tema
  const themeToggleBtn = document.getElementById("theme-toggle");

  // Elementos DOM - Inputs do timer
  const hoursInput = document.getElementById("hours-input");
  const minutesInput = document.getElementById("minutes-input");
  const secondsInput = document.getElementById("seconds-input");

  // Elementos do relógio flip
  const hoursTopEl = document.querySelector(".hours .top");
  const hoursBottomEl = document.querySelector(".hours .bottom");
  const minutesTopEl = document.querySelector(".minutes .top");
  const minutesBottomEl = document.querySelector(".minutes .bottom");
  const secondsTopEl = document.querySelector(".seconds .top");
  const secondsBottomEl = document.querySelector(".seconds .bottom");

  // Todos os cards flip para animação
  const allFlipCards = document.querySelectorAll(".flip-card");

  // Cria o elemento de áudio para o feedback sonoro
  const timerSound = new Audio();
  timerSound.src = "../sounds/timer-end.mp3";
  timerSound.preload = "auto";

  // Variáveis de estado
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  let isRunning = false;
  let timerInterval;
  let currentMode = "chrono"; // Valores possíveis: "clock", "chrono", "timer"
  let isDarkTheme = localStorage.getItem("zenTheme") === "dark";

  // ======= FUNÇÕES DE TEMA =======

  // Inicializa o tema com base na preferência salva
  function initTheme() {
    if (isDarkTheme) {
      document.documentElement.classList.add("dark-theme");
      themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      document.documentElement.classList.remove("dark-theme");
      themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }

  // Alterna entre tema claro e escuro
  function toggleTheme() {
    isDarkTheme = !isDarkTheme;

    if (isDarkTheme) {
      document.documentElement.classList.add("dark-theme");
      themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem("zenTheme", "dark");
    } else {
      document.documentElement.classList.remove("dark-theme");
      themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem("zenTheme", "light");
    }
  }

  // ======= FUNÇÕES DE UTILIDADE =======

  // Formata um número para ter sempre dois dígitos
  function formatTwoDigits(num) {
    return num.toString().padStart(2, "0");
  }

  // Limpa qualquer intervalo existente
  function clearAllIntervals() {
    if (timerInterval) {
      clearInterval(timerInterval);
      isRunning = false;
    }
  }

  // ======= FUNÇÕES DE ATUALIZAÇÃO DO DISPLAY =======

  // Atualiza o display com os valores atuais
  function updateDisplay() {
    const formattedHours = formatTwoDigits(hours);
    const formattedMinutes = formatTwoDigits(minutes);
    const formattedSeconds = formatTwoDigits(seconds);

    // Somente atualiza se o valor mudou, para evitar animações desnecessárias
    if (hoursTopEl.getAttribute("data-value") !== formattedHours) {
      updateFlipCard("hours", formattedHours);
    }

    if (minutesTopEl.getAttribute("data-value") !== formattedMinutes) {
      updateFlipCard("minutes", formattedMinutes);
    }

    if (secondsTopEl.getAttribute("data-value") !== formattedSeconds) {
      updateFlipCard("seconds", formattedSeconds);
    }
  }

  // Função melhorada para atualizar um cartão flip
  function updateFlipCard(type, newValue) {
    let selector;

    // Determina qual seletor usar
    if (type === "hours") {
      selector = ".hours";
    } else if (type === "minutes") {
      selector = ".minutes";
    } else if (type === "seconds") {
      selector = ".seconds";
    }

    // Obtém os elementos
    const flipCard = document.querySelector(`${selector} .flip-card`);
    const topEl = flipCard.querySelector(".top");
    const bottomEl = flipCard.querySelector(".bottom");
    const topFlipEl = flipCard.querySelector(".top-flip");
    const bottomFlipEl = flipCard.querySelector(".bottom-flip");

    const currentValue = topEl.getAttribute("data-value");

    // Só anima se o valor mudou
    if (currentValue !== newValue) {
      // Configurar para animação
      // Top flip tem o valor antigo (o que vai desaparecer)
      topFlipEl.setAttribute("data-value", currentValue);
      // Bottom flip tem o novo valor (o que vai aparecer)
      bottomFlipEl.setAttribute("data-value", newValue);

      // Esconde qualquer animação anterior
      flipCard.classList.remove("flipping");

      // Força reflow para reiniciar animações
      void flipCard.offsetWidth;

      // Inicia animação - parte crucial
      requestAnimationFrame(() => {
        // Imediatamente muda o top element para o novo valor
        topEl.setAttribute("data-value", newValue);
        // O bottom element mantém o valor antigo por enquanto

        // Adiciona a classe para animar
        flipCard.classList.add("flipping");

        // Após a animação completa, atualiza o bottom element
        setTimeout(() => {
          // Agora o bottom element recebe o novo valor
          bottomEl.setAttribute("data-value", newValue);
        }, 1000); // Tempo total da animação
      });
    }
  }

  // ======= FUNÇÕES DE MODO =======

  // Alterna para o modo selecionado
  function switchMode(mode) {
    clearAllIntervals();

    // Atualiza a classe ativa nos botões
    clockModeBtn.classList.toggle("active", mode === "clock");
    chronoModeBtn.classList.toggle("active", mode === "chrono");
    timerModeBtn.classList.toggle("active", mode === "timer");

    // Mostra/esconde campos de configuração do timer
    timerConfig.classList.toggle("hidden", mode !== "timer");

    // Configura os controles baseado no modo
    if (mode === "clock") {
      startBtn.classList.add("hidden");
      pauseBtn.classList.add("hidden");
      resetBtn.classList.add("hidden"); // Esconde o botão de resetar no modo relógio

      // Inicia o relógio
      updateClock();
      timerInterval = setInterval(updateClock, 1000);
    } else {
      startBtn.classList.remove("hidden");
      pauseBtn.classList.remove("hidden");
      resetBtn.classList.remove("hidden"); // Mostra o botão de resetar nos outros modos

      // Zerar os valores ao trocar do relógio para outros modos
      if (currentMode === "clock") {
        if (mode === "chrono") {
          hours = 0;
          minutes = 0;
          seconds = 0;
          updateDisplay();
        } else if (mode === "timer") {
          // No modo timer, inicializa com os valores dos inputs ou zero
          hours = parseInt(hoursInput.value) || 0;
          minutes = parseInt(minutesInput.value) || 0;
          seconds = parseInt(secondsInput.value) || 0;
          updateDisplay();
        }
      } else if (mode === "chrono") {
        // Se estiver mudando para o cronômetro de qualquer outro modo (exceto relógio)
        hours = 0;
        minutes = 0;
        seconds = 0;
        updateDisplay();
      } else if (mode === "timer") {
        // Se estiver mudando para o timer de qualquer outro modo (exceto relógio)
        hours = parseInt(hoursInput.value) || 0;
        minutes = parseInt(minutesInput.value) || 0;
        seconds = parseInt(secondsInput.value) || 0;
        updateDisplay();
      }
    }

    currentMode = mode;
  }

  // Atualiza o relógio com a hora atual
  function updateClock() {
    const now = new Date();
    hours = now.getHours();
    minutes = now.getMinutes();
    seconds = now.getSeconds();
    updateDisplay();
  }

  // Função principal do cronômetro - contagem progressiva
  function tickChrono() {
    seconds++;

    if (seconds === 60) {
      seconds = 0;
      minutes++;

      if (minutes === 60) {
        minutes = 0;
        hours++;

        if (hours === 24) {
          hours = 0;
        }
      }
    }

    updateDisplay();
  }

  // Função principal do timer - contagem regressiva
  function tickTimer() {
    if (seconds > 0) {
      seconds--;
    } else if (minutes > 0) {
      minutes--;
      seconds = 59;
    } else if (hours > 0) {
      hours--;
      minutes = 59;
      seconds = 59;
    }

    // Se chegou a zero
    if (hours === 0 && minutes === 0 && seconds === 0) {
      clearAllIntervals();

      // Feedback sonoro quando o timer termina
      timerSound.play().catch((error) => {
        console.log("Não foi possível reproduzir o som: ", error);
      });

      // Alerta visual de término (pisca o display usando classe CSS)
      allFlipCards.forEach((card) => {
        card.classList.add("pulse-animation");
      });

      setTimeout(() => {
        allFlipCards.forEach((card) => {
          card.classList.remove("pulse-animation");
        });
      }, 2000);
    }

    updateDisplay();
  }

  // Validação e configuração dos valores do timer a partir dos inputs
  function setupTimer() {
    // Validar os inputs para garantir valores positivos
    const hoursValue = Math.max(0, parseInt(hoursInput.value) || 0);
    const minutesValue = Math.max(0, parseInt(minutesInput.value) || 0);
    const secondsValue = Math.max(0, parseInt(secondsInput.value) || 0);

    // Normalizar minutos e segundos (não permitir valores > 59)
    const normalizedMinutes = Math.min(59, minutesValue);
    const normalizedSeconds = Math.min(59, secondsValue);

    // Atualizar os inputs com os valores normalizados
    hoursInput.value = hoursValue;
    minutesInput.value = normalizedMinutes;
    secondsInput.value = normalizedSeconds;

    // Atualizar variáveis de estado
    hours = hoursValue;
    minutes = normalizedMinutes;
    seconds = normalizedSeconds;

    updateDisplay();
  }

  // ======= EVENT LISTENERS =======

  // Botão de alternar tema
  themeToggleBtn.addEventListener("click", toggleTheme);

  // Botões de seleção de modo
  clockModeBtn.addEventListener("click", () => switchMode("clock"));
  chronoModeBtn.addEventListener("click", () => switchMode("chrono"));
  timerModeBtn.addEventListener("click", () => switchMode("timer"));

  // Validação de entrada para campos numéricos do timer
  [hoursInput, minutesInput, secondsInput].forEach((input) => {
    input.addEventListener("input", function () {
      // Remover caracteres não numéricos
      this.value = this.value.replace(/[^0-9]/g, "");

      // Limitar comprimento
      if (this.value.length > 2) {
        this.value = this.value.slice(0, 2);
      }
    });
  });

  // Botão Iniciar
  startBtn.addEventListener("click", function () {
    if (isRunning) return;

    if (currentMode === "timer") {
      // Configura o timer com os valores dos inputs
      setupTimer();

      // Verifica se é válido para iniciar
      if (hours === 0 && minutes === 0 && seconds === 0) {
        alert("Por favor, defina um tempo para o timer.");
        return;
      }

      // Executa a primeira atualização imediatamente
      tickTimer();
      timerInterval = setInterval(tickTimer, 1000);
    } else if (currentMode === "chrono") {
      // Executa a primeira atualização imediatamente
      tickChrono();
      timerInterval = setInterval(tickChrono, 1000);
    }

    isRunning = true;
  });

  // Botão Pausar
  pauseBtn.addEventListener("click", function () {
    if (isRunning) {
      clearAllIntervals();
    }
  });

  // Botão Reiniciar
  resetBtn.addEventListener("click", function () {
    clearAllIntervals();

    if (currentMode === "timer") {
      setupTimer();
    } else if (currentMode === "chrono") {
      hours = 0;
      minutes = 0;
      seconds = 0;
    } else if (currentMode === "clock") {
      updateClock();
    }

    updateDisplay();
  });

  // Mudar valores do timer quando os inputs mudam
  hoursInput.addEventListener("change", setupTimer);
  minutesInput.addEventListener("change", setupTimer);
  secondsInput.addEventListener("change", setupTimer);

  // Animação sutil para as pinceladas
  const brushStrokes = document.querySelectorAll(".brush-stroke");
  brushStrokes.forEach((stroke) => {
    const randomDuration = 20 + Math.random() * 10;
    stroke.style.transition = `all ${randomDuration}s ease-in-out`;

    setInterval(() => {
      const randomRotate = Math.random() * 2 - 1;
      const baseRotate = parseFloat(stroke.dataset.baseRotate || 0);
      stroke.style.transform = `rotate(${baseRotate + randomRotate}deg)`;
      stroke.style.opacity = 0.08 + Math.random() * 0.04;
    }, 5000);
  });

  // Inicializa o tema
  initTheme();

  // Inicializa no modo cronômetro (padrão)
  switchMode("chrono");

  // Prepara os elementos para animação suave
  document.querySelectorAll(".flip-card").forEach((card) => {
    // Adiciona uma pequena transição para movimentos não-animados
    card.style.transition = "transform 0.2s ease";

    // Inicializa para evitar problemas no primeiro flip
    const topEl = card.querySelector(".top");
    const bottomEl = card.querySelector(".bottom");
    const topFlipEl = card.querySelector(".top-flip");
    const bottomFlipEl = card.querySelector(".bottom-flip");

    const value = "00";

    // Garante que todos os elementos tenham o mesmo valor inicial
    topEl.setAttribute("data-value", value);
    bottomEl.setAttribute("data-value", value);
    topFlipEl.setAttribute("data-value", value);
    bottomFlipEl.setAttribute("data-value", value);
  });
});
