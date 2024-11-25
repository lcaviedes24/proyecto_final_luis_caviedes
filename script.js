// URL base de la API
const API_URL = 'http://localhost:3000';

// Array para almacenar los eventos
let events = [];

// Cargar eventos al iniciar la página
async function loadEvents() {
    try {
        const response = await fetch(`${API_URL}/events`);
        events = await response.json();
        displayEvents();
    } catch (error) {
        console.error('Error al cargar eventos:', error);
        alert('Error al cargar los eventos');
    }
}

// Función para mostrar/ocultar el formulario
function toggleForm() {
    const form = document.getElementById('eventForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Función para agregar un nuevo evento
document.getElementById('form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const newEvent = {
        nombre: document.getElementById('nombreEvento').value,
        fecha: document.getElementById('fechaEvento').value,
        descripcion: document.getElementById('descripcionEvento').value
    };

    try {
        const response = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEvent)
        });

        if (!response.ok) {
            throw new Error('Error al crear evento');
        }

        // Limpiar el formulario
        this.reset();
        toggleForm();
        
        // Recargar eventos
        await loadEvents();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear el evento');
    }
});

// Función para mostrar los eventos en la lista
function displayEvents() {
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = '';

    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item';
        eventElement.innerHTML = `
            <h3>${event.nombre}</h3>
            <p>Fecha: ${formatDate(event.fecha)}</p>
            <p>Descripción: ${event.descripcion}</p>
            <div class="event-actions">
                <button onclick="editEvent('${event.id}')" class="btn btn-primary">Editar</button>
                <button onclick="deleteEvent('${event.id}')" class="btn btn-secondary">Eliminar</button>
            </div>
        `;
        eventsList.appendChild(eventElement);
    });
}

// Función para formatear la fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

// Función para eliminar un evento
async function deleteEvent(id) {
    try {
        const response = await fetch(`${API_URL}/events/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar evento');
        }

        await loadEvents();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el evento');
    }
}

// Función para editar un evento
async function editEvent(id) {
    const event = events.find(event => event.id === id);
    if (event) {
        document.getElementById('nombreEvento').value = event.nombre;
        document.getElementById('fechaEvento').value = event.fecha;
        document.getElementById('descripcionEvento').value = event.descripcion;
        
        // Modificar el formulario para manejar la actualización
        const form = document.getElementById('form');
        form.onsubmit = async function(e) {
            e.preventDefault();
            
            const updatedEvent = {
                nombre: document.getElementById('nombreEvento').value,
                fecha: document.getElementById('fechaEvento').value,
                descripcion: document.getElementById('descripcionEvento').value
            };

            try {
                const response = await fetch(`${API_URL}/events/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedEvent)
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar evento');
                }

                // Restaurar el comportamiento original del formulario
                form.onsubmit = null;
                form.reset();
                toggleForm();
                
                // Recargar eventos
                await loadEvents();
            } catch (error) {
                console.error('Error:', error);
                alert('Error al actualizar el evento');
            }
        };
        
        toggleForm();
    }
}

// Inicializar la carga de eventos
document.addEventListener('DOMContentLoaded', loadEvents);