import proyectos from '../public/json/projects.json';
import certificaciones from '../public/json/certifications.json';

function capitalizeAndFormat(skill) {
    const lowerCaseSkill = skill.toLowerCase();
    return `<strong>${lowerCaseSkill.charAt(0).toUpperCase() + lowerCaseSkill.slice(1)}</strong>`;
}

function truncateDescription(description, maxLength = 150) {
    if (description.length > maxLength) {
        return description.slice(0, maxLength) + '...';
    }
    return description;
}

function appendItems(containerId, items) {
    const mainContainer = document.getElementById(containerId);
    if (!mainContainer) {
        console.error(`Contenedor de ${containerId} no encontrado`);
        return;
    }
    mainContainer.innerHTML = '';

    const limitedItems = items.slice(0, 3);

    limitedItems.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("col-lg-4", "col-md-6", "col-12", "pb-5");
        div.setAttribute("data-aos", "fade-up");
        div.setAttribute("data-aos-delay", `${400 + index * 100}`);
        
        // Añadir un evento de clic para abrir el modal
            div.innerHTML = `
            <div class="class-thumb" data-toggle="modal" data-target="#projectModal" data-title="${item.name}" data-description="${item.description}" data-img="${item.img}">
                <img src="${item.img}" class="img-fluid" alt="${item.name}">
                <div class="class-info">
                    <h3 class="card-name mb-1">${item.name}</h3>
      
                    <p class="card-description mt-3">${truncateDescription(item.description)}</p>
                    <div class="tag-container">
                    <ul class="list-inline mt-3 tag-container">
                        ${item.skill.slice(0, 3).map(skill => `
                            <li class="list-inline-item">
                                <div class="badge badge-teal">${capitalizeAndFormat(skill)}</div>
                            </li>
                        `).join('')}
                    </ul>
                    </div>
                </div>
            </div>
        `;
        
        // Agregar evento de clic para abrir el modal
        div.querySelector('.class-thumb').addEventListener('click', function() {
            const modalTitle = document.getElementById('projectModalLabel');
            const modalDescription = document.getElementById('modalDescription');
            const modalImage = document.getElementById('modalImage');
            
            modalTitle.innerText = item.name;
            modalDescription.innerText = item.description;
            modalImage.src = item.img;
        });
        
        mainContainer.appendChild(div);
    });
}

appendItems("proyecto", proyectos);
appendItems("certificacion", certificaciones);
