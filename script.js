const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isExpanded));
    navigation.classList.toggle("is-open", !isExpanded);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      menuButton.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
    }
  });
}

const audienceOptions = document.querySelectorAll(".audience-option");
const audienceTitle = document.querySelector(".audience-title");
const audienceDescription = document.querySelector(".audience-description");
const audienceLink = document.querySelector(".audience-link");
const audienceContent = {
  personal: {
    title: "Cuidado pensado para tu auto.",
    description: "Contanos qué vehículo tenés y qué querés resolver. Te orientamos con claridad, desde el mantenimiento preventivo hasta una reparación puntual.",
    link: "Ver atención para particulares",
    href: "#particulares",
  },
  fleet: {
    title: "Mantenimiento alineado a tu operación.",
    description: "Cada flota trabaja distinto. Consideramos tipo de unidad, recorrido y exigencia para conversar una propuesta adecuada a tu operación.",
    link: "Conversemos sobre tu flota",
    href: "#flotas",
  },
};

if (audienceTitle && audienceDescription && audienceLink) {
  audienceOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedAudience = option.dataset.audience;
      const content = selectedAudience && audienceContent[selectedAudience];
      if (!content) {
        return;
      }

      audienceOptions.forEach((audienceOption) => {
        const isSelected = audienceOption === option;
        audienceOption.classList.toggle("is-active", isSelected);
        audienceOption.setAttribute("aria-pressed", String(isSelected));
      });

      audienceTitle.textContent = content.title;
      audienceDescription.textContent = content.description;
      audienceLink.firstChild.textContent = content.link + " ";
      audienceLink.href = content.href;
    });
  });
}

document.querySelectorAll(".service-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const detailId = trigger.getAttribute("aria-controls");
    const detail = detailId ? document.getElementById(detailId) : null;
    if (!detail) {
      return;
    }

    const isExpanded = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", String(!isExpanded));
    trigger.closest(".service-row")?.classList.toggle("is-open", !isExpanded);
    detail.hidden = isExpanded;
  });
});

const counters = document.querySelectorAll("[data-counter]");
const formatCounter = new Intl.NumberFormat("es-AR");
const setCounterValue = (counter, value) => {
  counter.textContent = formatCounter.format(value);
};

if (counters.length) {
  const showFinalValues = () => {
    counters.forEach((counter) => {
      setCounterValue(counter, Number(counter.dataset.target));
    });
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    showFinalValues();
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const counter = entry.target;
        const target = Number(counter.dataset.target);
        const start = performance.now();
        const duration = 1400;
        const animate = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const easedProgress = 1 - (1 - progress) ** 4;
          setCounterValue(counter, Math.round(target * easedProgress));
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
        observer.unobserve(counter);
      });
    }, { threshold: 0.6 });

    counters.forEach((counter) => {
      counter.textContent = "0";
      observer.observe(counter);
    });
  }
}
