const form = document.getElementById("giphySearchForm");
const tokenInput = document.getElementById("apiKeyInput");
const searchInput = document.getElementById("searchInput");
const messageContainer = document.getElementById("messageContainer");
const gifContainer = document.getElementById("gifContainer");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const apiKey = tokenInput.value.trim();
    const query = searchInput.value.trim();

    if (!apiKey || !query) {
        messageContainer.style.color = "red";
        messageContainer.textContent =
            "Proszę podać klucz API oraz szukaną frazę.";
        return;
    }

    messageContainer.style.color = "black";
    messageContainer.textContent = "Wyszukiwanie...";
    gifContainer.innerHTML = "";

    try {
        const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(query)}&limit=12&rating=g`;

        const response = await fetch(url);

        if (!response.ok) {
            messageContainer.style.color = "red";
            messageContainer.textContent = `Błąd HTTP: ${response.status} - sprawdź poprawność klucza.`;
            return;
        }

        const json = await response.json();

        const gifs = json.data;

        if (!gifs || gifs.length === 0) {
            messageContainer.style.color = "red";
            messageContainer.textContent = "Brak wyników dla podanej frazy.";
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
    } catch (error) {
        messageContainer.style.color = "red";
        messageContainer.textContent =
            "Wystąpił błąd sieci podczas łączenia z API.";
        console.error("Szczegóły błędu:", error);
    }
});
