async function loadAboutInfo() {
    try {
        const response = await fetch('../public/json/about.json');
        const aboutData = await response.json();

        document.getElementById('about-name').innerText = aboutData.name;
        document.getElementById('about-title').innerText = aboutData.title;
        document.getElementById('cv-link').href = aboutData.cvUrl;
        document.getElementById('cv-link').innerText = aboutData.cvText;

        document.getElementById('projects-link').href = aboutData.projectsUrl;
        document.getElementById('projects-link').innerText = aboutData.projectsText;
        document.getElementById('certifications-link').href = aboutData.certificationsUrl;
        document.getElementById('certifications-link').innerText = aboutData.certificationsText;
        document.getElementById('experiences-link').href = aboutData.experiencesUrl;
        document.getElementById('experiences-link').innerText = aboutData.experiencesText;

        // Manejo de la descripción
        const descriptionElement = document.getElementById('about-description');
        const fullText = aboutData.description;
        const words = fullText.split(" ");
        const shortText = words.slice(0, 8).join(" ") + "...";

        // Función para actualizar el texto en función del tamaño de la pantalla
        function updateDescription() {
            if (window.innerWidth <= 790) { // Pantalla pequeña
                if (words.length > 8) {
                    // Mostrar solo una parte del texto y el botón de "Ver más"
                    descriptionElement.innerHTML = `${shortText} <span id="toggle-text" style="color: #FFD580; cursor: pointer;">Ver más</span>`;
                    const toggleButton = document.getElementById("toggle-text");
                    toggleButton.removeEventListener("click", toggleDescription);

                    // Alternar entre "Ver más" y "Ver menos"
                    toggleButton.addEventListener("click", toggleDescription);
                } else {
                    descriptionElement.innerText = fullText; // Si el texto es corto, mostrar completo
                }
            } else { // Pantalla grande
                descriptionElement.innerText = fullText; // Mostrar siempre el texto completo
            }
        }

        // Función para alternar la descripción entre completa y truncada
        function toggleDescription() {
            const toggleButton = document.getElementById("toggle-text");
            if (descriptionElement.innerHTML.includes("...")) {
                descriptionElement.innerHTML = `${fullText} <span id="toggle-text" style="color: #FFD580; cursor: pointer;">Ver menos</span>`;
            } else {
                descriptionElement.innerHTML = `${shortText} <span id="toggle-text" style="color: #FFD580; cursor: pointer;">Ver más</span>`;
            }
        }

        // Llamar a la función para inicializar la descripción según el tamaño de la pantalla
        updateDescription();

        // Recargar la descripción cuando la ventana cambie de tamaño
        window.addEventListener('resize', updateDescription);

    } catch (error) {
        console.error("Error loading about data:", error);
    }
}

loadAboutInfo();
