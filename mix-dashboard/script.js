const API_URL = "https://localhost:7124";

const cardsContainer = document.getElementById("cards");
const totalElement = document.getElementById("total");
const emptyElement = document.getElementById("empty");
const toast = document.getElementById("toast");
const logoutButton = document.getElementById("logout-button");
const disciplinesCount = document.getElementById("disciplinesCount");

const usernameElement = document.getElementById("username");
const userAvatarElement = document.getElementById("avatar");

logoutButton.addEventListener("click", async () =>{
    const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
    })

    if (!response.ok)
        alert("Error!")

    window.location.href = "login.html";
});

function createDisciplineCard(discipline) {
    const progress = Math.min(
        100,
        Math.max(0, Number(discipline.progress) || 0)
    );

    const card = document.createElement("article");
    card.className = "course-card";
    card.dataset.id = discipline.id;

    card.innerHTML = `
        <div class="cover ${discipline.coverClass}">
            <span class="category ${discipline.categoryClass}">
                ${discipline.categoryIcon}
                &nbsp; ${discipline.category}
            </span>
        </div>

        <div class="card-body">
            <h3></h3>

            <div class="date">
                <span></span>
            </div>

            <div class="progress-row">
                <div
                    class="progress-ring"
                    style="--progress: ${progress}; --ring: ${discipline.color}"
                    role="img"
                    aria-label="Завершено ${progress}%"
                >
                    <span>${progress}%</span>
                </div>

                <div class="progress-info">
                    <div class="progress-label">Завершено</div>

                    <div
                        class="bar"
                        role="progressbar"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow="${progress}"
                        aria-label="Прогрес дисципліни"
                    >
                        <span
                            style="--progress: ${progress}%; --ring: ${discipline.color}"
                        ></span>
                    </div>
                </div>

                <button
                    class="go"
                    type="button"
                    aria-label="Відкрити дисципліну"
                >→</button>
            </div>
        </div>
    `;
    card.querySelector("h3").textContent = discipline.name;

    card.querySelector(".date span:last-child").textContent =
        `(${discipline.startDate} - ${discipline.endDate})`;

    card.querySelector(".go").addEventListener("click", () => {
        showToast(`Відкриваємо: ${discipline.name}`);
    });

    return card;
}

function renderDisciplines(disciplines) {
    cardsContainer.replaceChildren();

    disciplines.forEach(discipline => {
        const card = createDisciplineCard(discipline);
        cardsContainer.appendChild(card);
    });

    totalElement.textContent = disciplines.length;
    emptyElement.style.display =
        disciplines.length === 0 ? "block" : "none";
}

let toastTimeout;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

async function loadDisciplines(branchId) {
    const response = await fetch(`${API_URL}/disciplines/branch/${branchId}`, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok){
        console.log("Couldn't get disciplines")
        return;
    }

    const data = await response.json();

    disciplinesCount.textContent = data.length;

    const disciplines = data.map(mapDiscipline);
    renderDisciplines(disciplines);
}

async function loadCurrentUser(){
    const response = await fetch(`${API_URL}/api/user/me`, {
        method: "GET",
        credentials: "include"
    });

    const user = await response.json();

    usernameElement.textContent = user.firstName + " " + user.secondName + " " + user.middleName;

    userAvatarElement.textContent = user.secondName[0] + "" + user.firstName[0];

    loadDisciplines(user.branch);
}

function mapDiscipline(discipline) {
    let category;
    let categoryClass;
    let categoryIcon;
    let coverClass;
    let color;

    switch (discipline.category) {
        case 1:
            category = "Математика";
            categoryClass = "green";
            categoryIcon = "📏";

            if (discipline.name != "Вища математика"){
                coverClass = "discrete";
            }
            else{
                coverClass = "math";
            }

            break;

        case 2:
            category = "Спеціальність";
            categoryClass = "purple";
            categoryIcon = "💼";
            coverClass = "specialty";
            break;

        case 3:
            category = "Інформатика";
            categoryClass = "blue";
            categoryIcon = "💻";

            if (discipline.name === "Програмування"){
                coverClass = "programming";
            }
            else if (discipline.name === "Обслуговування комп’ютерної техніки"){
                coverClass = "remont";
            }
            else{
                coverClass = "obrobka";
            }

            break;
        case 4:
            category = "Мова та стилістика";
            categoryClass = "orange";
            categoryIcon = "✒️";
            coverClass = "language";
            break;
        default:
            category = "Інша";
            categoryClass = "gray";
            categoryIcon = "📚";
            coverClass = "default";
            color = "#64748b";
            break;
    }

    return {
        id: discipline.id,
        name: discipline.name,
        category: category,
        categoryClass: categoryClass,
        categoryIcon: categoryIcon,
        coverClass: coverClass,
        startDate: discipline.startDate.slice(0, 10),
        endDate: discipline.endDate.slice(0, 10),
        progress: Math.floor(Math.random() * 36) + 10,
        color: "#1f6db6"
    };
}



loadCurrentUser();