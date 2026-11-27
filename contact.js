document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const toggle = document.getElementById("globalThemeToggle");
  const savedTheme = localStorage.getItem("theme");
  const systemLight = window.matchMedia?.("(prefers-color-scheme: light)").matches;
  applyTheme(savedTheme || (systemLight ? "light" : "dark"));

  toggle?.addEventListener("click", () => {
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });

  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    if (!toggle) return;
    const label = toggle.querySelector(".theme-btn-text");
    const icon = toggle.querySelector("i");
    if (label) label.textContent = theme === "light" ? "Dark Mode" : "Light Mode";
    if (icon) icon.className = theme === "light" ? "fa-solid fa-moon" : "fa-solid fa-sun";
  }

  const form = document.getElementById("kpcContactForm");
  const feedback = document.getElementById("formStatusFeedback");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("visitorName");
    const email = document.getElementById("visitorEmail");
    const message = document.getElementById("messageContent");
    const valid = name?.value.trim().length >= 2 &&
      /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email?.value.trim() || "") &&
      message?.value.trim().length >= 10;
    [name, email, message].filter(Boolean).forEach(el => el.parentElement?.classList.remove("error"));
    if (!valid) {
      if (name && name.value.trim().length < 2) name.parentElement?.classList.add("error");
      if (email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.value.trim())) email.parentElement?.classList.add("error");
      if (message && message.value.trim().length < 10) message.parentElement?.classList.add("error");
      if (feedback) { feedback.className = "form-feedback-message error"; feedback.textContent = "Please check your name, email and message."; }
      return;
    }
    if (feedback) { feedback.className = "form-feedback-message success"; feedback.textContent = "Your message is ready. Please use the website contact options to send it."; }
  });
});
