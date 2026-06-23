const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");
const submitButton = contactForm?.querySelector('button[type="submit"]');
const buttonLabel = submitButton?.querySelector(".button-label");
const buttonLoading = submitButton?.querySelector(".button-loading");

navToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    siteNav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!formStatus || !submitButton || !buttonLabel || !buttonLoading) {
    return;
  }

  const formData = new FormData(contactForm);
  const accessKey = String(formData.get("access_key") || "");

  formStatus.className = "form-status";

  if (!accessKey || accessKey === "PASTE_WEB3FORMS_ACCESS_KEY_HERE") {
    formStatus.classList.add("is-error");
    formStatus.textContent = "This form needs a Web3Forms access key before enquiries can be sent.";
    return;
  }

  submitButton.disabled = true;
  buttonLabel.style.display = "none";
  buttonLoading.style.display = "inline";
  formStatus.textContent = "";

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error("Submission failed");
    }

    contactForm.reset();
    formStatus.classList.add("is-success");
    formStatus.textContent = "Thanks. Your enquiry has been sent to Prism Realty.";
  } catch {
    formStatus.classList.add("is-error");
    formStatus.textContent = "Something went wrong. Please email smitha@prismrealty.com.au directly.";
  } finally {
    submitButton.disabled = false;
    buttonLabel.style.display = "inline";
    buttonLoading.style.display = "none";
  }
});
