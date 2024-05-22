function showSection(sectionId) {
    $('.content-section').hide();
    $('#' + sectionId).show();
}

var currentTipoPlanes = [];
var currentPage = 1;
var rowsPerPage = 5;

function showSection(sectionId) {
    $('.content-section').hide();
    $('#' + sectionId).show();
}

// Function to display tipoPlanes with pagination
function displayTipoPlanes(page) {
    var startIndex = (page - 1) * rowsPerPage;
    var endIndex = startIndex + rowsPerPage;
    var paginatedItems = currentTipoPlanes.slice(startIndex, endIndex);

    $('#tipoPlanList').empty();
    paginatedItems.forEach(function (tipoPlan) {
        $('#tipoPlanList').append('<tr><td>' + tipoPlan.TIPOPLAN_ID + '</td><td>' + tipoPlan.TIPOPLAN_NOMBRE + '</td><td>' + tipoPlan.TIPOPLAN_DURACION + '</td><td>' + tipoPlan.TIPOPLAN_PRECIO + '</td><td>' + (tipoPlan.TIPOPLAN_ESTADO ? 'Activo' : 'Inactivo') + '</td><td>' +
            '<button class="btn btn-info btn-sm" onclick="viewTipoPlan(' + tipoPlan.TIPOPLAN_ID + ')">Ver</button> ' +
            '<button class="btn btn-warning btn-sm" onclick="loadUpdateForm(' + tipoPlan.TIPOPLAN_ID + ')">Actualizar</button> ' +
            '<button class="btn btn-danger btn-sm" onclick="loadDeleteForm(' + tipoPlan.TIPOPLAN_ID + ')">Eliminar</button>' +
            '</td></tr>');
    });

    setupPagination(currentTipoPlanes.length, page);
}

function setupPagination(totalItems, currentPage) {
    var totalPages = Math.ceil(totalItems / rowsPerPage);

    $('#pagination').empty();
    for (let i = 1; i <= totalPages; i++) {
        var liClass = currentPage == i ? 'page-item active' : 'page-item';
        var pageItem = '<li class="' + liClass + '"><a class="page-link" href="#" onclick="displayTipoPlanes(' + i + ')">' + i + '</a></li>';
        $('#pagination').append(pageItem);
    }
}

function getTipoPlanes() {
    $.ajax({
        url: 'https://localhost:44346/api/TipoPlan/Listar',
        type: 'GET',
        success: function (data) {
            console.log("TipoPlanes recibidos:", data);
            currentTipoPlanes = data;
            if (data.length) {
                displayTipoPlanes(1);
                $('#errorMessage').hide();
            } else {
                $('#errorMessage').show().text('No hay tipoPlanes');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener tipoPlanes:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al obtener tipoPlanes: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

function getTipoPlanById() {
    var id = $('#searchId').val().trim();
    if (!id) {
        getTipoPlanes();
        return;
    }
    $.get('https://localhost:44346/api/TipoPlan/leer/' + id, function (data) {
        currentTipoPlanes = [data];
        displayTipoPlanes(1);
    }).fail(function () {
        $('#errorMessage').show().text('TipoPlan no encontrado.');
    });
}

function addTipoPlan() {
    var nombre = $('#addNombre').val().trim();
    var duracion = $('#addDuracion').val().trim();
    var precio = $('#addPrecio').val().trim();
    var estado = $('#addEstado').val() === '1';

    if (!nombre || !duracion || !precio || estado === '') {
        alert('Por favor, complete todos los campos');
        return;
    }

    $.ajax({
        url: "https://localhost:44346/api/TipoPlan/Insertar",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            TIPOPLAN_NOMBRE: nombre,
            TIPOPLAN_DURACION: duracion,
            TIPOPLAN_PRECIO: precio,
            TIPOPLAN_ESTADO: estado
        }),
        success: function (data) {
            alert('TipoPlan agregado correctamente');
            getTipoPlanes();
            $('#addNombre').val('');
            $('#addDuracion').val('');
            $('#addPrecio').val('');
            $('#addEstado').val('');
        },
        error: function (xhr, status, error) {
            console.error('Error al agregar tipoPlan:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al agregar tipoPlan: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

function viewTipoPlan(id) {
    const tipoPlan = currentTipoPlanes.find(t => t.TIPOPLAN_ID === id);
    if (tipoPlan) {
        alert('ID: ' + tipoPlan.TIPOPLAN_ID + '\nNombre: ' + tipoPlan.TIPOPLAN_NOMBRE + '\nDuración: ' + tipoPlan.TIPOPLAN_DURACION + '\nPrecio: ' + tipoPlan.TIPOPLAN_PRECIO + '\nEstado: ' + (tipoPlan.TIPOPLAN_ESTADO ? 'Activo' : 'Inactivo'));
    }
}

function loadUpdateForm(id) {
    const tipoPlan = currentTipoPlanes.find(t => t.TIPOPLAN_ID === id);
    if (tipoPlan) {
        $('#updateId').val(tipoPlan.TIPOPLAN_ID);
        $('#updateNombre').val(tipoPlan.TIPOPLAN_NOMBRE);
        $('#updateDuracion').val(tipoPlan.TIPOPLAN_DURACION);
        $('#updatePrecio').val(tipoPlan.TIPOPLAN_PRECIO);
        $('#updateEstado').val(tipoPlan.TIPOPLAN_ESTADO ? '1' : '0');
        showSection('update');
    }
}

function loadDeleteForm(id) {
    const tipoPlan = currentTipoPlanes.find(t => t.TIPOPLAN_ID === id);
    if (tipoPlan) {
        $('#deleteId').val(tipoPlan.TIPOPLAN_ID);
        showSection('delete');
    }
}

function updateTipoPlan() {
    var id = $('#updateId').val().trim();
    var nombre = $('#updateNombre').val().trim();
    var duracion = $('#updateDuracion').val().trim();
    var precio = $('#updatePrecio').val().trim();
    var estado = $('#updateEstado').val() === '1';

    if (!id || !nombre || !duracion || !precio || estado === '') {
        alert('Por favor, complete todos los campos');
        return;
    }

    $.ajax({
        url: 'https://localhost:44346/api/TipoPlan/Actualizar',
        method: "PUT",
        data: JSON.stringify({
            TIPOPLAN_ID: id,
            TIPOPLAN_NOMBRE: nombre,
            TIPOPLAN_DURACION: duracion,
            TIPOPLAN_PRECIO: precio,
            TIPOPLAN_ESTADO: estado
        }),
        contentType: "application/json",
        success: function (result) {
            alert('TipoPlan actualizado con éxito!');
            getTipoPlanes();
            showSection('list');
        },
        error: function (xhr, status, error) {
            console.error('Error al actualizar tipoPlan:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al actualizar tipoPlan: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

function deleteTipoPlan() {
    var id = $('#deleteId').val().trim();
    if (!id) {
        alert('Por favor, proporcione un ID');
        return;
    }
    $.ajax({
        url: 'https://localhost:44346/api/TipoPlan/Eliminar/' + id,
        method: 'DELETE',
        success: function (result) {
            alert("TipoPlan eliminado con éxito");
            getTipoPlanes();
            showSection('list');
        },
        error: function (xhr, status, error) {
            console.error('Error al eliminar tipoPlan:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al eliminar tipoPlan: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

$(document).ready(function() {
    getTipoPlanes();
});
