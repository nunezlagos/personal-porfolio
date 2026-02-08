// homeData.js
function loadHomeInfo() {
    fetch('../public/json/home.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar los datos de la página de inicio');
            }
            return response.json();
        })
        .then(homeData => {
            const subtitleElement = document.getElementById('home-subtitle');
            const titleElement = document.getElementById('home-title');
            const aboutLink = document.getElementById('home-about-link');
            const socialLinksContainer = document.getElementById('social-links');

            subtitleElement.innerText = homeData.subtitle;
            titleElement.innerText = homeData.title;
            aboutLink.href = homeData.aboutUrl;

            // Crear un elemento strong para el texto del enlace "Sobre Mí"
            const strongText = document.createElement('strong');
            strongText.innerText = homeData.aboutText;
            aboutLink.appendChild(strongText); // Agregar el elemento strong al enlace

            homeData.socialLinks.forEach(link => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = link.url;
                a.className = `fa ${link.iconClass}`;
                a.setAttribute('data-aos', 'fade-up');
                a.setAttribute('data-aos-delay', '1000');
                a.target = '_blank';
                li.appendChild(a);
                socialLinksContainer.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error cargando los datos de la página de inicio:', error);
        });
}

loadHomeInfo();
