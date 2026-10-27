/**
 * OUTUBRO ROSA 2026 - CONTROLE DO CARROSSEL MOBILE E GESTOS
 * Suporte a Touch Gestures, Mouse Drag, Botões Flutuantes e Teclado
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM
  const sliderWrapper = document.getElementById('sliderWrapper');
  const sliderTrack = document.getElementById('sliderTrack');
  const slides = Array.from(document.querySelectorAll('.slide-card'));
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const dots = Array.from(document.querySelectorAll('.dot'));
  const currentPageNum = document.getElementById('currentPageNum');
  const swipeHint = document.getElementById('swipeHint');

  const totalSlides = slides.length;
  let currentIndex = 0;

  // Estado de controle de arraste (Touch & Mouse)
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentTranslateX = 0;
  let prevTranslateX = 0;
  let startTime = 0;
  let isHorizontalSwipe = false;
  let hasInteracted = false;

  /**
   * Vibração tátil sutil para celulares compatíveis
   */
  function triggerHaptic() {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch (e) {
        // Ignora silenciosamente se bloqueado pelo navegador
      }
    }
  }

  /**
   * Esconde a dica inicial de arraste
   */
  function dismissSwipeHint() {
    if (swipeHint && !hasInteracted) {
      hasInteracted = true;
      swipeHint.style.animation = 'none';
      swipeHint.style.opacity = '0';
      swipeHint.style.pointerEvents = 'none';
    }
  }

  /**
   * Atualiza a exibição para o slide com o índice fornecido
   * @param {number} index Índice do slide (0 a totalSlides - 1)
   * @param {boolean} animate Se deve aplicar transição suave
   */
  function goToSlide(index, animate = true) {
    // Limita os índices entre 0 e totalSlides - 1
    currentIndex = Math.max(0, Math.min(index, totalSlides - 1));

    if (animate) {
      sliderTrack.style.transition = 'transform 0.42s cubic-bezier(0.2, 0.9, 0.3, 1)';
    } else {
      sliderTrack.style.transition = 'none';
    }

    const percentage = -currentIndex * 100;
    sliderTrack.style.transform = `translate3d(${percentage}%, 0, 0)`;

    // Atualiza classes ativas nos slides
    slides.forEach((slide, idx) => {
      const isActive = idx === currentIndex;
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', (!isActive).toString());
    });

    // Atualiza contador numérico no cabeçalho
    if (currentPageNum) {
      currentPageNum.textContent = (currentIndex + 1).toString();
    }

    // Atualiza os dots indicadores
    dots.forEach((dot, idx) => {
      const isActive = idx === currentIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive.toString());
    });

    // Atualiza o estado dos botões flutuantes
    updateButtonStates();

    triggerHaptic();
  }

  /**
   * Atualiza botões Anterior e Avançar conforme o slide atual
   */
  function updateButtonStates() {
    // Botão Anterior
    if (currentIndex === 0) {
      btnPrev.disabled = true;
    } else {
      btnPrev.disabled = false;
    }

    // Botão Avançar
    const btnNextText = btnNext.querySelector('.btn-text');
    const btnNextIcon = btnNext.querySelector('.btn-icon svg');

    if (currentIndex === totalSlides - 1) {
      // Última página: exibe opção de reiniciar ou concluir
      btnNext.classList.add('completed');
      if (btnNextText) btnNextText.textContent = 'Reiniciar';
      btnNext.setAttribute('title', 'Voltar ao primeiro slide');
      if (btnNextIcon) {
        // Ícone de retorno circular
        btnNextIcon.innerHTML = '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path>';
      }
    } else {
      btnNext.classList.remove('completed');
      if (btnNextText) btnNextText.textContent = 'Avançar';
      btnNext.setAttribute('title', 'Avançar para a próxima página');
      if (btnNextIcon) {
        // Seta para a direita padrão
        btnNextIcon.innerHTML = '<polyline points="9 18 15 12 9 6"></polyline>';
      }
    }
  }

  // =========================================================================
  // EVENTOS DOS BOTÕES FLUTUANTES INFERIORES
  // =========================================================================

  btnPrev.addEventListener('click', () => {
    dismissSwipeHint();
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  });

  btnNext.addEventListener('click', () => {
    dismissSwipeHint();
    if (currentIndex < totalSlides - 1) {
      goToSlide(currentIndex + 1);
    } else {
      // No último slide, clica em "Reiniciar" e volta para o 1º
      goToSlide(0);
    }
  });

  // Clique direto nos dots indicadores
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      dismissSwipeHint();
      const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
      if (!isNaN(targetIndex)) {
        goToSlide(targetIndex);
      }
    });
  });

  // =========================================================================
  // MOTOR DE GESTOS: TOUCH & MOUSE SWIPE (ARRASTAR A TELA PARA OS LADOS)
  // =========================================================================

  function getClientX(event) {
    return event.type.startsWith('touch') ? event.touches[0].clientX : event.clientX;
  }

  function getClientY(event) {
    return event.type.startsWith('touch') ? event.touches[0].clientY : event.clientY;
  }

  function onDragStart(event) {
    dismissSwipeHint();
    isDragging = true;
    isHorizontalSwipe = false;
    startX = getClientX(event);
    startY = getClientY(event);
    startTime = Date.now();

    const wrapperWidth = sliderWrapper.offsetWidth || window.innerWidth;
    prevTranslateX = -currentIndex * wrapperWidth;
    currentTranslateX = prevTranslateX;

    sliderTrack.style.transition = 'none';
  }

  function onDragMove(event) {
    if (!isDragging) return;

    const currentX = event.type.startsWith('touch') ? event.touches[0].clientX : event.clientX;
    const currentY = event.type.startsWith('touch') ? event.touches[0].clientY : event.clientY;

    const diffX = currentX - startX;
    const diffY = currentY - startY;

    // Detecta intenção de gesto horizontal
    if (!isHorizontalSwipe) {
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 8) {
        isHorizontalSwipe = true;
      } else if (Math.abs(diffY) > 10) {
        // Se for rolagem vertical, cancela o arraste do slider
        isDragging = false;
        return;
      }
    }

    if (isHorizontalSwipe) {
      if (event.cancelable) {
        event.preventDefault();
      }

      const wrapperWidth = sliderWrapper.offsetWidth || window.innerWidth;
      let effectiveDiffX = diffX;

      // Efeito elástico / resistência nas bordas (primeiro e último slide)
      if ((currentIndex === 0 && diffX > 0) || (currentIndex === totalSlides - 1 && diffX < 0)) {
        effectiveDiffX = diffX * 0.35;
      }

      currentTranslateX = prevTranslateX + effectiveDiffX;
      sliderTrack.style.transform = `translate3d(${currentTranslateX}px, 0, 0)`;
    }
  }

  function onDragEnd(event) {
    if (!isDragging) return;
    isDragging = false;

    sliderTrack.style.transition = 'transform 0.42s cubic-bezier(0.2, 0.9, 0.3, 1)';

    const endX = event.type.startsWith('touch') ? (event.changedTouches[0] ? event.changedTouches[0].clientX : startX) : event.clientX;
    const diffX = endX - startX;
    const deltaTime = Math.max(1, Date.now() - startTime);
    const velocityX = Math.abs(diffX) / deltaTime; // velocidade em px/ms
    const wrapperWidth = sliderWrapper.offsetWidth || window.innerWidth;
    const swipeThreshold = Math.min(wrapperWidth * 0.18, 60);

    // Avalia se o arraste foi suficiente para mudar de página
    if (isHorizontalSwipe && (Math.abs(diffX) > swipeThreshold || velocityX > 0.4)) {
      if (diffX < 0 && currentIndex < totalSlides - 1) {
        // Arrastou para a esquerda -> Avançar
        goToSlide(currentIndex + 1);
      } else if (diffX > 0 && currentIndex > 0) {
        // Arrastou para a direita -> Retroceder
        goToSlide(currentIndex - 1);
      } else {
        // Resistência de borda: volta ao slide atual
        goToSlide(currentIndex);
      }
    } else {
      // Arraste insuficiente: volta ao slide atual
      goToSlide(currentIndex);
    }
  }

  // Registra eventos Touch
  sliderWrapper.addEventListener('touchstart', onDragStart, { passive: false });
  sliderWrapper.addEventListener('touchmove', onDragMove, { passive: false });
  sliderWrapper.addEventListener('touchend', onDragEnd, { passive: true });
  sliderWrapper.addEventListener('touchcancel', onDragEnd, { passive: true });

  // Registra eventos Mouse (para testes e uso no desktop)
  sliderWrapper.addEventListener('mousedown', onDragStart);
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);

  // Previne arrastar imagem nativa do navegador
  sliderWrapper.addEventListener('dragstart', e => e.preventDefault());

  // =========================================================================
  // NAVEGAÇÃO POR TECLADO (Acessibilidade e Desktop)
  // =========================================================================
  window.addEventListener('keydown', (e) => {
    dismissSwipeHint();
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      if (currentIndex < totalSlides - 1) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(0);
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      if (currentIndex > 0) {
        goToSlide(currentIndex - 1);
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToSlide(totalSlides - 1);
    }
  });

  // Recalcula posição ao redimensionar a janela
  window.addEventListener('resize', () => {
    goToSlide(currentIndex, false);
  });

  // Inicializa na página 1 (índice 0)
  goToSlide(0, false);
});
