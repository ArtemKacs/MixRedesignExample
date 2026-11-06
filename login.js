const API_URL = "https://localhost:7124";

const form = document.querySelector(".login-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const toggle = document.querySelector(".toggle-password");
const submitButton = form.querySelector(".submit-btn");
const message = document.querySelector("#login-message");

// Показать / скрыть пароль
toggle.addEventListener("click", () => {
    const show = passwordInput.type === "password";

    passwordInput.type = show ? "text" : "password";

    toggle.setAttribute(
        "aria-label",
        show ? "Приховати пароль" : "Показати пароль"
    );

    toggle.setAttribute(
        "title",
        show ? "Приховати пароль" : "Показати пароль"
    );
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    message.textContent = "";
    message.style.color = "#dc2626";

    submitButton.disabled = true;
    submitButton.textContent = "Вхід...";

    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          email: emailInput.value.trim(),
          password: passwordInput.value })
        });

        if (!response.ok) {
            throw new Error(
                data.message || data.title || "Неправильна пошта або пароль."
            );
        }

        window.location.href = "index.html";

    } catch (error) {
        console.error("Помилка входу:", error);

        message.style.color = "#dc2626";
        message.textContent =
            error instanceof TypeError
                ? "Не вдалося з'єднатися із сервером."
                : error.message;

    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Увійти <span aria-hidden="true">→</span>';
    }
});