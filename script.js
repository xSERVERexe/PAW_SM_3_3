const form = document.getElementById("giphySearchForm");
const tokenInput = document.getElementById("apiKeyInput");
const searchInput = document.getElementById("searchInput");
const messageContainer = document.getElementById("messageContainer");
const gifContainer = document.getElementById("gifContainer");

const paginationContainer = document.getElementById("paginationContainer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

let currentPage = 1;
const limit = 12;
let currentApiKey = "";
let currentQuery = "";

form.addEventListener("submit", (event) => {
    event.preventDefault();

    currentApiKey = tokenInput.value.trim();
    currentQuery = searchInput.value.trim();

    if (!currentApiKey || !currentQuery) {
        messageContainer.style.color = "red";
        messageContainer.textContent =
            "Proszę podać klucz API oraz szukaną frazę.";
        return;
    }
    currentPage = 1;
    fetchGifs();
});

prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        fetchGifs();
    }
});

nextBtn.addEventListener("click", () => {
    currentPage++;
    fetchGifs();
});

async function fetchGifs() {
    messageContainer.style.color = "black";
    messageContainer.textContent = "Ładowanie wyników...";
    gifContainer.innerHTML = "";
    paginationContainer.style.display = "none";
    const offset = (currentPage - 1) * limit;

    try {
        const url = `https://api.giphy.com/v1/gifs/search?api_key=${currentApiKey}&q=${encodeURIComponent(currentQuery)}&limit=${limit}&offset=${offset}&rating=g`;

        const response = await fetch(url);

        if (!response.ok) {
            messageContainer.style.color = "red";
            messageContainer.textContent = `Błąd HTTP: ${response.status} - sprawdź poprawność klucza.`;
            return;
        }

        const json = await response.json();
        const gifs = json.data;
        const paginationData = json.pagination;

        if (!gifs || gifs.length === 0) {
            messageContainer.style.color = "red";
            messageContainer.textContent = "Brak wyników dla tej strony.";
            return;
        }

        messageContainer.textContent = "";

        gifs.forEach((gif) => {
            const gifUrl = gif.images?.fixed_height?.url;

            if (gifUrl) {
                const img = document.createElement("img");
                img.src = gifUrl;
                img.alt = gif.title || "Znaleziony GIF";
                img.className = "gif-item";

                gifContainer.appendChild(img);
            }
        });

        pageInfo.textContent = `Strona ${currentPage}`;
        paginationContainer.style.display = "flex";

        prevBtn.disabled = currentPage === 1;

        const totalGifs = paginationData.total_count;
        nextBtn.disabled = offset + limit >= totalGifs;
    } catch (error) {
        messageContainer.style.color = "red";
        messageContainer.textContent =
            "Wystąpił błąd sieci podczas łączenia z API.";
    }
}
