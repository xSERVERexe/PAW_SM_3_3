const form = document.getElementById("giphyForm");
const tokenInput = document.getElementById("apiKeyInput");
const messageContainer = document.getElementById("messageContainer");
const gifContainer = document.getElementById("gifContainer");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const apiKey = tokenInput.value.trim();

    if (!apiKey) {
        messageContainer.style.color = "red";
        messageContainer.textContent = "Proszę podać klucz API.";
        return;
    }

    messageContainer.style.color = "black";
    messageContainer.textContent = "Losowanie GIF-a...";
    gifContainer.innerHTML = "";

    try {
        const url = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&rating=g`;

        const response = await fetch(url);

        if (!response.ok) {
            messageContainer.style.color = "red";
            messageContainer.textContent = `Błąd HTTP: ${response.status} - sprawdź poprawność klucza.`;
            return;
        }

        const json = await response.json();

        const gifUrl = json.data?.images?.original?.url;

        if (!gifUrl) {
            messageContainer.style.color = "red";
            messageContainer.textContent =
                "Nie udało się znaleźć adresu obrazka w odpowiedzi.";
            return;
        }

        messageContainer.textContent = "";

        const img = document.createElement("img");
        img.src = gifUrl;
        img.alt = json.data?.title || "Losowy GIF";
        gifContainer.appendChild(img);
    } catch (error) {
        messageContainer.style.color = "red";
        messageContainer.textContent =
            "Wystąpił błąd sieci podczas łączenia z GIPHY API.";
    }
});
