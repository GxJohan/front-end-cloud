const API_BASE_URL = 'https://prueba-cloud-414030780526.southamerica-east1.run.app';

class AlumnoManager {
    constructor() {
        this.form = document.getElementById('alumnoForm');
        this.table = document.getElementById('alumnosTable');
        this.tableBody = document.getElementById('alumnosTableBody');
        this.loading = document.getElementById('loading');
        this.error = document.getElementById('error');
        
        this.initializeEventListeners();
        this.loadAlumnos();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async loadAlumnos() {
        this.showLoading();
        this.hideError();
        
        try {
            const response = await fetch(`${API_BASE_URL}/alumnos`);
            
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }
            
            const alumnos = await response.json();
            this.displayAlumnos(alumnos);
            this.hideLoading();
            
        } catch (error) {
            console.error('Error al cargar alumnos:', error);
            this.showError('Error al cargar los alumnos. Verifica la conexión con el servidor.');
            this.hideLoading();
        }
    }

    displayAlumnos(alumnos) {
        this.tableBody.innerHTML = '';
        
        if (alumnos.length === 0) {
            this.tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center;">No hay alumnos registrados</td></tr>';
        } else {
            alumnos.forEach(alumno => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${alumno.id}</td>
                    <td>${alumno.nombre}</td>
                    <td>${alumno.apellido}</td>
                `;
                this.tableBody.appendChild(row);
            });
        }
        
        this.table.classList.remove('hidden');
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const alumnoData = {
            nombre: formData.get('nombre').trim(),
            apellido: formData.get('apellido').trim()
        };

        if (!alumnoData.nombre || !alumnoData.apellido) {
            this.showError('Por favor completa todos los campos.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/alumnos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(alumnoData)
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const nuevoAlumno = await response.json();
            this.showSuccess('Alumno agregado exitosamente');
            this.form.reset();
            this.loadAlumnos();

        } catch (error) {
            console.error('Error al agregar alumno:', error);
            this.showError('Error al agregar el alumno. Verifica la conexión con el servidor.');
        }
    }

    showLoading() {
        this.loading.classList.remove('hidden');
        this.table.classList.add('hidden');
    }

    hideLoading() {
        this.loading.classList.add('hidden');
    }

    showError(message) {
        this.error.textContent = message;
        this.error.classList.remove('hidden');
        setTimeout(() => this.hideError(), 5000);
    }

    hideError() {
        this.error.classList.add('hidden');
    }

    showSuccess(message) {
        const existingSuccess = document.querySelector('.success');
        if (existingSuccess) {
            existingSuccess.remove();
        }

        const successDiv = document.createElement('div');
        successDiv.className = 'success';
        successDiv.textContent = message;
        
        this.form.parentNode.insertBefore(successDiv, this.form.nextSibling);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AlumnoManager();
});