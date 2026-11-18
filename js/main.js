(function () {
  const data = window.ARTJOBS || { email: "", projects: [] };
  const projects = Array.isArray(data.projects) ? data.projects : [];

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const grid = document.getElementById("project-grid");
  const empty = document.getElementById("project-empty");
  const filters = document.getElementById("project-filters");
  const dialog = document.getElementById("project-dialog");
  const form = document.getElementById("brief-form");

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toggle.addEventListener("click", function () {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.querySelector(".sr-only").textContent = open ? "Cerrar menú" : "Abrir menú";
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  function initials(title) {
    return String(title || "AJ")
      .split(/\s+/)
      .slice(0, 2)
      .map(function (word) {
        return word.charAt(0);
      })
      .join("")
      .toUpperCase();
  }

  function renderProjects(category) {
    const visible = projects.filter(function (project) {
      return !category || category === "Todos" || project.category === category;
    });

    grid.innerHTML = "";
    visible.forEach(function (project) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "project-card";
      const cover = coverOf(project);
      const visual = cover
        ? '<img src="' + escapeAttr(cover) + '" alt="" />'
        : "<span>" + escapeHtml(initials(project.title)) + "</span>";
      const play = project.video ? '<span class="play-mark">Timelapse</span>' : "";
      button.innerHTML =
        '<div class="project-visual">' +
        visual +
        play +
        "</div>" +
        '<div class="project-body">' +
        '<p class="project-meta">' +
        escapeHtml(project.category || "Proyecto") +
        (project.year ? " · " + escapeHtml(project.year) : "") +
        "</p>" +
        "<h3>" +
        escapeHtml(project.title || "Sin título") +
        "</h3>" +
        "<p>" +
        escapeHtml(project.summary || "") +
        "</p>" +
        "</div>";
      button.addEventListener("click", function () {
        openProject(project);
      });
      grid.appendChild(button);
    });
  }

  function setupFilters() {
    const categories = ["Todos"];
    projects.forEach(function (project) {
      if (project.category && categories.indexOf(project.category) === -1) {
        categories.push(project.category);
      }
    });

    filters.innerHTML = "";
    categories.forEach(function (category, index) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = category;
      button.setAttribute("aria-pressed", index === 0 ? "true" : "false");
      button.addEventListener("click", function () {
        filters.querySelectorAll("button").forEach(function (item) {
          item.setAttribute("aria-pressed", item === button ? "true" : "false");
        });
        renderProjects(category);
      });
      filters.appendChild(button);
    });
  }

  function picturesOf(project) {
    if (Array.isArray(project.images) && project.images.length) return project.images;
    if (project.image) return [project.image];
    return [];
  }

  function coverOf(project) {
    return project.poster || picturesOf(project)[0] || "";
  }

  function openProject(project) {
    const media = document.getElementById("dialog-media");
    const pictures = picturesOf(project);
    let html = "";
    if (project.video) {
      html +=
        '<video controls playsinline preload="metadata" poster="' +
        escapeAttr(project.poster || "") +
        '"><source src="' +
        escapeAttr(project.video) +
        '" type="video/mp4" />Tu navegador no reproduce este video.</video>';
    }
    if (pictures.length) {
      html +=
        '<div class="dialog-gallery">' +
        pictures
          .map(function (src) {
            return '<img src="' + escapeAttr(src) + '" alt="" />';
          })
          .join("") +
        "</div>";
    }
    media.innerHTML = html || '<div class="fallback">' + escapeHtml(initials(project.title)) + "</div>";
    dialog.classList.toggle("is-video", Boolean(project.video));
    document.getElementById("dialog-kicker").textContent = [project.category, project.year]
      .filter(Boolean)
      .join(" · ");
    document.getElementById("dialog-title").textContent = project.title || "Proyecto";
    document.getElementById("dialog-client").textContent = project.client
      ? "Cliente: " + project.client
      : "";
    document.getElementById("dialog-summary").textContent = project.summary || "";
    document.getElementById("dialog-detail").textContent = project.detail || "";
    const tags = document.getElementById("dialog-tags");
    tags.innerHTML = "";
    (project.services || []).forEach(function (service) {
      const item = document.createElement("li");
      item.textContent = service;
      tags.appendChild(item);
    });
    document.getElementById("dialog-engine").textContent = project.engine
      ? "Motor o formato: " + project.engine
      : "";
    dialog.showModal();
  }

  document.getElementById("dialog-close").addEventListener("click", function () {
    dialog.close();
  });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", function () {
    dialog.querySelectorAll("video").forEach(function (video) {
      video.pause();
    });
  });

  if (projects.length) {
    empty.hidden = true;
    grid.hidden = false;
    filters.hidden = false;
    setupFilters();
    renderProjects("Todos");
  }

  const error = document.getElementById("form-error");
  const success = document.getElementById("form-success");
  const successText = document.getElementById("form-success-text");
  const preview = document.getElementById("brief-preview");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    error.hidden = true;
    success.hidden = true;

    const fields = ["nombre", "empresa", "correo", "servicio", "motor", "mensaje"];
    const values = {};
    let invalid = null;
    fields.forEach(function (name) {
      const field = form.elements[name];
      values[name] = field.value.trim();
      if (!invalid && !field.checkValidity()) invalid = field;
    });

    if (invalid) {
      error.hidden = false;
      error.textContent = "Revisa los campos marcados antes de preparar el briefing.";
      invalid.focus();
      return;
    }

    const text = [
      "Briefing Art Jobs Studio",
      "Nombre: " + values.nombre,
      "Empresa: " + values.empresa,
      "Correo: " + values.correo,
      "Servicio: " + values.servicio,
      "Motor o formato: " + values.motor,
      "",
      values.mensaje,
    ].join("\n");

    preview.textContent = text;
    success.hidden = false;

    const email = String(data.email || "").trim();
    if (email) {
      successText.textContent =
        "Se abrió tu aplicación de correo con el briefing. Si no ocurrió, copia el texto.";
      const subject = encodeURIComponent("Briefing — " + values.empresa);
      const body = encodeURIComponent(text);
      window.location.href = "mailto:" + email + "?subject=" + subject + "&body=" + body;
    } else {
      successText.textContent =
        "Briefing listo. Cópialo y envíalo al estudio. Cuando haya un correo público, este formulario lo abrirá directo.";
    }
  });

  document.getElementById("copy-brief").addEventListener("click", function () {
    const text = preview.textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        successText.textContent = "Texto copiado.";
      });
      return;
    }
    successText.textContent = "Selecciona el texto y cópialo manualmente.";
  });

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/'/g, "&#39;");
  }
})();
