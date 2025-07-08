import supabase from '../backend/supabase.js';

document.addEventListener('DOMContentLoaded', function() {
    // Configuración de la fecha actual para los campos de fecha
    const today = new Date().toISOString().substr(0, 10);
    document.getElementById('fecha-entrada').value = today;
    document.getElementById('fecha-salida').value = today;

    // Manejo de pestañas
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');

            // Actualizar clases activas
            tabLinks.forEach(el => el.classList.remove('active', 'text-blue-600', 'border-blue-600'));
            tabContents.forEach(el => el.classList.remove('active'));
            this.classList.add('active', 'text-blue-600', 'border-blue-600');
            document.getElementById(`${tabId}-tab`).classList.add('active');

            // Guardar pestaña activa en localStorage
            localStorage.setItem('activeTab', tabId);

            // Cargar datos según la pestaña
            if (tabId === 'stock') {
                loadInventory();
            } else if (tabId === 'entrega') {
                loadAccesorios();
                loadSalidas();
            }
        });
    });

    // Cargar pestaña guardada o por defecto
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) {
        document.querySelector(`.tab-link[data-tab="${savedTab}"]`).click();
    }

    // Simulación de exportación
    document.getElementById('exportar-inventario').addEventListener('click', function() {
        showToast('Exportando inventario a PDF...', 'success');
        setTimeout(() => {
            showToast('Exportación completada.', 'success');
        }, 1500);
    });

    // Cargar accesorios para el dropdown de entregas
    function loadAccesorios() {
        const accesorioDropdown = document.getElementById('accesorio-id');
        accesorioDropdown.innerHTML = '<option value="">Seleccione un accesorio</option>';
        mockData.inventory.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.numero_parte} - ${item.descripcion} (${item.cantidad} disponibles)`;
            accesorioDropdown.appendChild(option);
        });
    }

    // Cargar salidas para la tabla de historial
    function loadSalidas() {
        const salidasItems = document.getElementById('salidas-items');
        salidasItems.innerHTML = '<tr><td colspan="7" class="py-4 px-4 text-center text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i> Cargando salidas...</td></tr>';

        // Simulamos carga de datos
        setTimeout(() => {
            salidasItems.innerHTML = '';
            if (mockData.salidas.length === 0) {
                salidasItems.innerHTML = '<tr><td colspan="7" class="py-4 px-4 text-center text-gray-500">No hay registros de salidas.</td></tr>';
                return;
            }

            mockData.salidas.forEach(item => {
                const accesorio = mockData.inventory.find(inv => inv.id === item.accesorio_id) || { numero_parte: 'Desconocido' };
                const row = document.createElement('tr');
                row.className = 'hover:bg-gray-50';
                row.innerHTML = `
                    <td class="py-2 px-4 border-b">${item.id}</td>
                    <td class="py-2 px-4 border-b">${accesorio.numero_parte}</td>
                    <td class="py-2 px-4 border-b text-right">${item.cantidad}</td>
                    <td class="py-2 px-4 border-b">${item.fecha_salida}</td>
                    <td class="py-2 px-4 border-b">${item.supervisor}</td>
                    <td class="py-2 px-4 border-b">${item.persona}</td>
                    <td class="py-2 px-4 border-b text-center">
                        <button class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" onclick="openEditModal(${item.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500" onclick="confirmDeleteSalida(${item.id})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;
                salidasItems.appendChild(row);
            });

            // Actualizar información de paginación
            document.getElementById('salidas-showing').textContent = mockData.salidas.length;
            document.getElementById('salidas-total').textContent = mockData.salidas.length;
        }, 1000);
    }

    // Formulario de entrega de accesorios
    const entregaForm = document.getElementById('entrega-form');
    entregaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const accesorioId = document.getElementById('accesorio-id').value;
        const tipoAccesorio = document.getElementById('tipo-accesorio').value;
        const cantidadSalida = parseInt(document.getElementById('cantidad-salida').value);
        const celdaDestino = document.getElementById('celda-destino').value;
        const supervisor = document.getElementById('supervisor').value;
        const personaEntrega = document.getElementById('persona-entrega').value;
        const fechaSalida = document.getElementById('fecha-salida').value;

        // Validación
        if (!accesorioId || !tipoAccesorio || !cantidadSalida || !celdaDestino || !supervisor || !personaEntrega || !fechaSalida) {
            showToast('Por favor complete todos los campos obligatorios.', 'error');
            return;
        }

        // Verificar stock disponible
        const accesorio = mockData.inventory.find(item => item.id === parseInt(accesorioId));
        if (!accesorio || accesorio.cantidad < cantidadSalida) {
            showToast('No hay suficiente stock disponible.', 'error');
            return;
        }

        // Simular carga
        const saveButton = document.getElementById('registrar-salida');
        saveButton.disabled = true;
        saveButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Registrando...';

        const salidaItem = {
            accesorio_id: parseInt(accesorioId),
            tipo_accesorio: tipoAccesorio,
            cantidad: cantidadSalida,
            celda_destino: celdaDestino,
            supervisor: supervisor,
            persona: personaEntrega,
            fecha_salida: fechaSalida
        };

        // Simulación de registro de salida
        setTimeout(() => {
            // Añadir a las salidas mockeadas
            const newId = mockData.salidas.length > 0 ? Math.max(...mockData.salidas.map(s => s.id)) + 1 : 1;
            mockData.salidas.push({ id: newId, ...salidaItem });

            // Actualizar stock
            accesorio.cantidad -= cantidadSalida;

            saveButton.disabled = false;
            saveButton.innerHTML = '<i class="fas fa-paper-plane mr-2"></i> Registrar Salida';

            // Éxito
            entregaForm.reset();
            document.getElementById('fecha-salida').value = today;
            showToast('Salida de accesorios registrada con éxito.', 'success');

            // Recargar datos
            loadAccesorios();
            loadSalidas();
        }, 800);
    });

    // Abrir modal de edición
    function openEditModal(salidaId) {
        const salida = mockData.salidas.find(s => s.id === salidaId);
        if (!salida) return;
        document.getElementById('editar-id').value = salida.id;
        document.getElementById('editar-cantidad').value = salida.cantidad;
        document.getElementById('editar-supervisor').value = salida.supervisor;
        document.getElementById('editar-persona').value = salida.persona;
        document.getElementById('modal-editar').classList.remove('hidden');
    }

    // Cerrar modal
    document.getElementById('cerrar-modal').addEventListener('click', function() {
        document.getElementById('modal-editar').classList.add('hidden');
    });
    document.getElementById('cancelar-edicion').addEventListener('click', function() {
        document.getElementById('modal-editar').classList.add('hidden');
    });

    // Guardar edición
    document.getElementById('editar-salida-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = parseInt(document.getElementById('editar-id').value);
        const nuevaCantidad = parseInt(document.getElementById('editar-cantidad').value);
        const nuevoSupervisor = document.getElementById('editar-supervisor').value;
        const nuevaPersona = document.getElementById('editar-persona').value;

        // Actualizar en mock data
        const salidaIndex = mockData.salidas.findIndex(s => s.id === id);
        if (salidaIndex !== -1) {
            const cantidadAnterior = mockData.salidas[salidaIndex].cantidad;
            const accesorioId = mockData.salidas[salidaIndex].accesorio_id;
            const accesorio = mockData.inventory.find(item => item.id === accesorioId);

            // Ajustar inventario (devolver cantidad anterior y restar nueva cantidad)
            if (accesorio) {
                accesorio.cantidad += cantidadAnterior - nuevaCantidad;
            }

            // Actualizar salida
            mockData.salidas[salidaIndex].cantidad = nuevaCantidad;
            mockData.salidas[salidaIndex].supervisor = nuevoSupervisor;
            mockData.salidas[salidaIndex].persona = nuevaPersona;

            showToast('Salida actualizada correctamente.', 'success');
            document.getElementById('modal-editar').classList.add('hidden');
            loadSalidas();
            loadAccesorios();
        }
    });

    // Confirmar eliminación de salida
    function confirmDeleteSalida(salidaId) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede revertir",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteSalida(salidaId);
            }
        });
    }

    // Eliminar salida
    function deleteSalida(salidaId) {
        const salidaIndex = mockData.salidas.findIndex(s => s.id === salidaId);
        if (salidaIndex !== -1) {
            const salida = mockData.salidas[salidaIndex];
            const accesorio = mockData.inventory.find(item => item.id === salida.accesorio_id);

            // Devolver cantidades al inventario
            if (accesorio) {
                accesorio.cantidad += salida.cantidad;
            }

            // Eliminar salida
            mockData.salidas.splice(salidaIndex, 1);
            showToast('Salida eliminada correctamente.', 'success');
            loadSalidas();
            loadAccesorios();
        }
    }

    // Filtros de stock
    document.getElementById('aplicar-filtros').addEventListener('click', function() {
        // Simulación de filtrado
        showToast('Filtros aplicados.', 'success');

        // Guardar filtros en localStorage
        const filtros = {
            parte: document.getElementById('filtro-parte').value,
            descripcion: document.getElementById('filtro-descripcion').value,
            ubicacion: document.getElementById('filtro-ubicacion').value
        };
        localStorage.setItem('filtrosStock', JSON.stringify(filtros));
    });

    document.getElementById('limpiar-filtros').addEventListener('click', function() {
        document.getElementById('filtro-parte').value = '';
        document.getElementById('filtro-descripcion').value = '';
        document.getElementById('filtro-ubicacion').value = '';
        localStorage.removeItem('filtrosStock');
        showToast('Filtros limpiados.', 'success');
    });

    // Filtros de salidas
    document.getElementById('aplicar-filtros-salidas').addEventListener('click', function() {
        // Simulación de filtrado
        showToast('Filtros aplicados.', 'success');

        // Guardar filtros en localStorage
        const filtros = {
            fecha: document.getElementById('filtro-fecha').value,
            supervisor: document.getElementById('filtro-supervisor').value,
            celda: document.getElementById('filtro-celda').value
        };
        localStorage.setItem('filtrosSalidas', JSON.stringify(filtros));
    });

    document.getElementById('limpiar-filtros-salidas').addEventListener('click', function() {
        document.getElementById('filtro-fecha').value = '';
        document.getElementById('filtro-supervisor').value = '';
        document.getElementById('filtro-celda').value = '';
        localStorage.removeItem('filtrosSalidas');
        showToast('Filtros limpiados.', 'success');
    });

    // Exportar salidas a Excel
    document.getElementById('exportar-excel-salidas').addEventListener('click', function() {
        // Simulación de exportación
        showToast('Exportando salidas a Excel...', 'success');
        setTimeout(() => {
            showToast('Exportación completada.', 'success');
        }, 1500);
    });

    // Exportar salidas a PDF
    document.getElementById('exportar-pdf-salidas').addEventListener('click', function() {
        // Simulación de exportación
        showToast('Exportando salidas a PDF...', 'success');
        setTimeout(() => {
            showToast('Exportación completada.', 'success');
        }, 1500);
    });

    // Mostrar toast
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        toast.className = `toast toast-${type}`;
        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Cargar datos iniciales
    loadInventory();

    // Restaurar filtros guardados
    const savedStockFilters = localStorage.getItem('filtrosStock');
    if (savedStockFilters) {
        const filtros = JSON.parse(savedStockFilters);
        document.getElementById('filtro-parte').value = filtros.parte || '';
        document.getElementById('filtro-descripcion').value = filtros.descripcion || '';
        document.getElementById('filtro-ubicacion').value = filtros.ubicacion || '';
    }

    const savedSalidasFilters = localStorage.getItem('filtrosSalidas');
    if (savedSalidasFilters) {
        const filtros = JSON.parse(savedSalidasFilters);
        document.getElementById('filtro-fecha').value = filtros.fecha || '';
        document.getElementById('filtro-supervisor').value = filtros.supervisor || '';
        document.getElementById('filtro-celda').value = filtros.celda || '';
    }

    // Vista previa de imágenes
    const imageInput = document.getElementById('imagenes');
    const previewContainer = document.getElementById('image-preview-container');
    imageInput.addEventListener('change', function() {
        previewContainer.innerHTML = '';
        if (this.files) {
            Array.from(this.files).forEach(file => {
                if (!file.type.match('image.*')) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.classList.add('image-preview');
                    previewContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        }
    });

    // Formulario de entrada de inventario
    const entradaForm = document.getElementById('entrada-form');
    entradaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const numeroParte = document.getElementById('numero-parte').value;
        const fechaEntrada = document.getElementById('fecha-entrada').value;
        const descripcion = document.getElementById('descripcion').value;
        const ubicacion = document.getElementById('ubicacion').value;
        const cantidad = parseInt(document.getElementById('cantidad').value);
        const imagenes = document.getElementById('imagenes').files;

        // Validación
        if (!numeroParte || !fechaEntrada || !descripcion || !ubicacion || !cantidad) {
            showToast('Por favor complete todos los campos obligatorios.', 'error');
            return;
        }

        // Simular carga
        const saveButton = document.getElementById('guardar-entrada');
        saveButton.disabled = true;
        saveButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Guardando...';

        // Subir imágenes (simulado)
        let imagePath = null;
        if (imagenes.length > 0) {
            const file = imagenes[0];
            const filePath = `inventory/${Date.now()}_${file.name}`;
            supabase.storage.from('accesorios').upload(filePath, file).then(({ data, error }) => {
                if (error) {
                    showToast('Error al subir la imagen.', 'error');
                    return;
                }
                imagePath = data.path;
                saveInventoryItem();
            });
        } else {
            saveInventoryItem();
        }

        function saveInventoryItem() {
            const inventoryItem = {
                numero_parte: numeroParte,
                fecha_entrada: fechaEntrada,
                descripcion: descripcion,
                ubicacion: ubicacion,
                cantidad: cantidad,
                imagen: imagePath
            };

            supabase.from('inventario').insert(inventoryItem).then(({ data, error }) => {
                saveButton.disabled = false;
                saveButton.innerHTML = '<i class="fas fa-save mr-2"></i> Guardar';

                if (error) {
                    showToast('Error al guardar el inventario.', 'error');
                    return;
                }

                // Éxito
                entradaForm.reset();
                document.getElementById('fecha-entrada').value = today;
                previewContainer.innerHTML = '';
                showToast('Entrada de inventario registrada con éxito.', 'success');

                // Actualizar lista si estamos en esa pestaña
                if (document.getElementById('stock-tab').classList.contains('active')) {
                    loadInventory();
                }
            });
        }
    });

    // Cargar inventario para la pestaña de Stock
    function loadInventory() {
        const stockItems = document.getElementById('stock-items');
        stockItems.innerHTML = '<tr><td colspan="5" class="py-4 px-4 text-center text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i> Cargando inventario...</td></tr>';

        // Simulamos carga de datos
        setTimeout(() => {
            stockItems.innerHTML = '';
            if (mockData.inventory.length === 0) {
                stockItems.innerHTML = '<tr><td colspan="5" class="py-4 px-4 text-center text-gray-500">No hay elementos en el inventario.</td></tr>';
                return;
            }

            mockData.inventory.forEach(item => {
                const row = document.createElement('tr');
                row.className = 'hover:bg-gray-50';
                row.innerHTML = `
                    <td class="py-2 px-4 border-b">${item.numero_parte}</td>
                    <td class="py-2 px-4 border-b">${item.descripcion}</td>
                    <td class="py-2 px-4 border-b">${item.ubicacion}</td>
                    <td class="py-2 px-4 border-b text-right">${item.cantidad}</td>
                    <td class="py-2 px-4 border-b text-center">
                        ${item.imagen ? `<img src="${item.imagen.trim()}" alt="Miniatura" class="thumbnail mx-auto">` : 'Sin imagen'}
                    </td>
                `;
                stockItems.appendChild(row);
            });

            // Actualizar información de paginación
            document.getElementById('items-showing').textContent = mockData.inventory.length;
            document.getElementById('items-total').textContent = mockData.inventory.length;
        }, 500);
    }
});

// Mock data para el prototipo
const mockData = {
    inventory: [
        { id: 1, numero_parte: 'ACC-001', descripcion: 'Bolsa deportiva grande', ubicacion: 'Jaula A-1', cantidad: 25, imagen: 'https://cdn.pixabay.com/photo/2017/08/02/01/34/pocket-2569181_960_720.jpg ' },
        { id: 2, numero_parte: 'ACC-002', descripcion: 'Gorra ajustable', ubicacion: 'Jaula B-3', cantidad: 50, imagen: 'https://cdn.pixabay.com/photo/2016/11/19/15/43/baseball-cap-1839731_960_720.jpg ' },
        { id: 3, numero_parte: 'ACC-003', descripcion: 'Guantes deportivos talla M', ubicacion: 'Jaula A-2', cantidad: 30, imagen: 'https://cdn.pixabay.com/photo/2017/08/06/00/27/gym-2587064_960_720.jpg ' },
        { id: 4, numero_parte: 'ACC-004', descripcion: 'Pelota de fútbol', ubicacion: 'Jaula C-1', cantidad: 15, imagen: 'https://cdn.pixabay.com/photo/2014/05/03/00/46/soccer-ball-336772_960_720.jpg ' }
    ],
    salidas: [
        { id: 1, accesorio_id: 1, tipo_accesorio: 'bolsa', cantidad: 5, celda_destino: 'Celda-123', supervisor: 'Juan Pérez', persona: 'María García', fecha_salida: '2023-10-15' },
        { id: 2, accesorio_id: 2, tipo_accesorio: 'gorra', cantidad: 3, celda_destino: 'Celda-456', supervisor: 'Carlos López', persona: 'Ana Rodríguez', fecha_salida: '2023-10-16' },
        { id: 3, accesorio_id: 3, tipo_accesorio: 'guantes', cantidad: 8, celda_destino: 'Celda-789', supervisor: 'Carlos López', persona: 'Ana Torres', fecha_salida: '2025-03-17' }
    ]
};
