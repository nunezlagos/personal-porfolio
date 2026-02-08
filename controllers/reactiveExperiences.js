async function loadExperiences() {
    try {
        const response = await fetch('../public/json/experiences.json');
        if (!response.ok) {
            throw new Error('Error al cargar los datos de las experiencias');
        }
        const data = await response.json();

        const experiencesSection = document.getElementById('experiences');
        const experiencesContainer = experiencesSection.querySelector('.container .row');

        data.forEach(experience => {
            const experienceDiv = document.createElement('div');
            experienceDiv.classList.add('col-lg-12', 'mb-5');
            experienceDiv.setAttribute('data-aos', 'fade-up');
            experienceDiv.setAttribute('data-aos-delay', '50');
           
            const fullText = experience.resume;
            const words = fullText.split(" ");
            const shortText = words.slice(0, 30).join(" ") + "...";

            // Contenido del resumen de la experiencia
            experienceDiv.innerHTML = `
                <h4 class="card-subtitle">${experience.dateFrom} - ${experience.dateTo}</h4>
                <p><strong>${experience.place} - ${experience.position} </strong></p>
                <p id="experience-summary-${experience.id}">${shortText} <span id="toggle-text-${experience.id}" style="color: #FFD580; cursor: pointer;">Ver más</span></p>
            `;

            experiencesContainer.appendChild(experienceDiv);

            // Función para alternar entre "Ver más" y "Ver menos"
            const toggleButton = document.getElementById(`toggle-text-${experience.id}`);
            
            // Event listener para el botón "Ver más" o "Ver menos"
            toggleButton.addEventListener("click", function toggleDescription() {
                const summaryElement = document.getElementById(`experience-summary-${experience.id}`);
                
                // Comprobar si el texto está truncado o completo
                if (summaryElement.innerHTML.includes("...")) {
                    // Si está truncado, mostrar el texto completo
                    summaryElement.innerHTML = `${fullText} <span id="toggle-text-${experience.id}" style="color: #FFD580; cursor: pointer;">Ver menos</span>`;
                } else {
                    // Si está completo, mostrar el texto truncado
                    summaryElement.innerHTML = `${shortText} <span id="toggle-text-${experience.id}" style="color: #FFD580; cursor: pointer;">Ver más</span>`;
                }

                // Reasignar el evento al nuevo botón "Ver más" o "Ver menos"
                const newToggleButton = document.getElementById(`toggle-text-${experience.id}`);
                newToggleButton.removeEventListener("click", toggleDescription); // Eliminar el antiguo event listener
                newToggleButton.addEventListener("click", toggleDescription);  // Asignar el nuevo event listener
            });
        });
    } catch (error) {
        console.error('Error cargando los datos de las experiencias:', error);
    }
}

loadExperiences();
