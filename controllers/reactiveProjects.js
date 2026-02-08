function loadProjects() {
    fetch('../public/json/projects.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error in Projects');
            }
            return response.json();
        })
        .then(data => {
            appendItems('proyecto', data);
        })
        .catch(error => {
            console.error('Error in projects.json:', error);
        });
}

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
        return;
    }
    mainContainer.innerHTML = '';

    // Función para obtener el número de proyectos a mostrar
    function getItemsToShow() {
        return window.innerWidth < 768 ? 1 : 3; // Si es pantalla pequeña, mostrar 1, sino 3
    }

    const itemsToShow = getItemsToShow(); // Número de proyectos a mostrar
    const limitedItems = items.slice(0, itemsToShow);

    // Mostrar las tarjetas con los proyectos limitados
    limitedItems.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("col-lg-4", "col-md-6", "col-12", "pb-5");
        div.setAttribute("data-aos", "fade-up");
        div.setAttribute("data-aos-delay", `${400 + index * 100}`);

        div.innerHTML = 
        `<div class="class-thumb" data-toggle="modal" data-target="#projectModal" data-title="${item.name}" data-description="${item.description}" data-img="${item.img}">
            <img src="${item.img}" class="img-fluid" alt="${item.name}">
            <div class="class-info">
                <h3 class="card-name mb-1">${item.name}</h3>
                <p class="card-description mt-3">${truncateDescription(item.description)}</p>
                <div class="tag-container">
                    <ul class="list-inline mt-3 tag-container">
                        ${item.skill.slice(0, 3).map(skill => 
                            `<li class="list-inline-item">
                                <div class="tag badge badge-teal">${capitalizeAndFormat(skill)}</div>
                            </li>`
                        ).join('')}
                    </ul>
                </div>
            </div>
        </div>`;

        div.querySelector('.class-thumb').addEventListener('click', function() {
            const modalTitle = document.getElementById('projectModalLabel');
            const modalDescription = document.getElementById('modalDescription');
            const modalImage = document.getElementById('modalImage');
            const modalDate = document.getElementById('modalDate');
            const modalLink = document.getElementById('modalLink');
        
            modalTitle.innerText = item.name;
            modalDescription.innerText = truncateDescription(item.description); // Aplicar truncamiento en el modal también
            modalDate.innerText = item.date ? `Fecha: ${item.date}` : ''; // Si no hay fecha, deja vacío
            modalImage.src = item.img;
            modalImage.alt = `Imagen de ${item.name}`;
            
            if (item.repository) {
                modalLink.href = item.repository;
                modalLink.style.display = 'block'; // Asegurar que se vea
            } else {
                modalLink.style.display = 'none'; // Ocultar si no hay repositorio
            }
        });

        mainContainer.appendChild(div);
    });

    // Mostrar todos los proyectos en la tabla del modal
    const tableBody = document.querySelector("#projectList .modal-body tbody");
    tableBody.innerHTML = ''; // Limpiar tabla antes de agregar nuevos proyectos

    items.forEach((item) => {
        const row = document.createElement("tr");
        const name = item.name ?? '-';
        const date = item.date ?? '-';
        const repository = item.repository ?? '-';
        // Aquí aplicamos capitalizeAndFormat a cada habilidad dentro de item.skill
        const formattedSkills = item.skill.map(skill => capitalizeAndFormat(skill)).join(', ');

        row.innerHTML = 
        `<td>${name}</td>
        <td>${date}</td>
        <td>
            ${repository === '-' 
                ? '-' 
                : `<button type="button" class="btn custom-btn-table w-100 mb-2 pl-2 pr-2" data-dismiss="modal" onclick="window.open('${repository}', '_blank')">Click</button>` 
            }
        </td>`;

        tableBody.appendChild(row);
    });
}

// Llamar a loadProjects inicialmente
loadProjects();

// Recargar proyectos cada vez que la ventana cambie de tamaño
window.addEventListener('resize', function() {
    loadProjects();
});
