function showSection(sectionId) {
    $('.content-section').hide();
    $('#' + sectionId).show();
}

var currentSuscripciones = [];
var currentClientes = [];
var currentTipoPlanes = [];
var currentPage = 1;
var rowsPerPage = 5;

function showSection(sectionId) {
    $('.content-section').hide();
    $('#' + sectionId).show();
}

// Function to display suscripciones with pagination
function displaySuscripciones(page) {
    var startIndex = (page - 1) * rowsPerPage;
    var endIndex = startIndex + rowsPerPage;
    var paginatedItems = currentSuscripciones.slice(startIndex, endIndex);

    $('#suscripcionList').empty();
    paginatedItems.forEach(function (suscripcion) {
        var cliente = currentClientes.find(c => c.CLI_ID === suscripcion.CLI_ID);
        var tipoPlan = currentTipoPlanes.find(t => t.TIPOPLAN_ID === suscripcion.TIPOPLAN_ID);
        var clienteName = cliente ? `${cliente.CLI_NOMBRE} ${cliente.CLI_APELLIDO}` : 'Desconocido';
        var tipoPlanName = tipoPlan ? tipoPlan.TIPOPLAN_NOMBRE : 'Desconocido';

        $('#suscripcionList').append('<tr><td>' + suscripcion.SUS_ID + '</td><td>' + clienteName + '</td><td>' + tipoPlanName + '</td><td>' + suscripcion.SUS_STARTDATE + '</td><td>' + suscripcion.SUS_ENDDATE + '</td><td>' + (suscripcion.SUS_RENOVACIONAUTO ? 'Sí' : 'No') + '</td><td>' + (suscripcion.SUS_ESTADO ? 'Activo' : 'Inactivo') + '</td><td>' +
            '<button class="btn btn-info btn-sm" onclick="viewSuscripcion(' + suscripcion.SUS_ID + ')">Ver</button> ' +
            '<button class="btn btn-warning btn-sm" onclick="loadUpdateForm(' + suscripcion.SUS_ID + ')">Actualizar</button> ' +
            '<button class="btn btn-danger btn-sm" onclick="loadDeleteForm(' + suscripcion.SUS_ID + ')">Eliminar</button>' +
            '</td></tr>');
    });

    setupPagination(currentSuscripciones.length, page);
}

function setupPagination(totalItems, currentPage) {
    var totalPages = Math.ceil(totalItems / rowsPerPage);

    $('#pagination').empty();
    for (let i = 1; i <= totalPages; i++) {
        var liClass = currentPage == i ? 'page-item active' : 'page-item';
        var pageItem = '<li class="' + liClass + '"><a class="page-link" href="#" onclick="displaySuscripciones(' + i + ')">' + i + '</a></li>';
        $('#pagination').append(pageItem);
    }
}

function getSuscripciones() {
    $.ajax({
        url: 'https://localhost:44346/api/Suscripcion/Listar',
        type: 'GET',
        success: function (data) {
            console.log("Suscripciones recibidas:", data);
            currentSuscripciones = data;
            if (data.length) {
                displaySuscripciones(1);
                $('#errorMessage').hide();
            } else {
                $('#errorMessage').show().text('No hay suscripciones');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener suscripciones:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al obtener suscripciones: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

function getClientes() {
    $.ajax({
        url: 'https://localhost:44346/api/Cliente/Listar',
        type: 'GET',
        success: function (data) {
            console.log("Clientes recibidos:", data);
            currentClientes = data;
            loadClientSelectList(data, '#addClienteId');
            loadClientSelectList(data, '#updateClienteId');
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener clientes:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al obtener clientes: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

function getTipoPlanes() {
    $.ajax({
        url: 'https://localhost:44346/api/TipoPlan/Listar',
        type: 'GET',
        success: function (data) {
            console.log("TipoPlanes recibidos:", data);
            currentTipoPlanes = data;
            loadTipoPlanSelectList(data, '#addTipoPlanId');
            loadTipoPlanSelectList(data, '#updateTipoPlanId');
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener tipoPlanes:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al obtener tipoPlanes: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

function loadClientSelectList(clientes, selectId) {
    $(selectId).empty();
    clientes.forEach(function (cliente) {
        $(selectId).append('<option value="' + cliente.CLI_ID + '">' + cliente.CLI_APELLIDO + ' ' + cliente.CLI_NOMBRE + '</option>');
    });
}

function loadTipoPlanSelectList(tipoPlanes, selectId) {
    $(selectId).empty();
    tipoPlanes.forEach(function (tipoPlan) {
        $(selectId).append('<option value="' + tipoPlan.TIPOPLAN_ID + '">' + tipoPlan.TIPOPLAN_NOMBRE + '</option>');
    });
}

function getSuscripcionById() {
    var id = $('#searchId').val().trim();
    if (!id) {
        getSuscripciones();
        return;
    }
    $.get('https://localhost:44346/api/Suscripcion/leer/' + id, function (data) {
        currentSuscripciones = [data];
        displaySuscripciones(1);
    }).fail(function () {
        $('#errorMessage').show().text('Suscripción no encontrada.');
    });
}

function addSuscripcion() {
    var clienteId = $('#addClienteId').val().trim();
    var tipoPlanId = $('#addTipoPlanId').val().trim();
    var startDate = $('#addStartDate').val().trim();
    var endDate = $('#addEndDate').val().trim();
    var renovacionAuto = $('#addRenovacionAuto').val().trim() === '1';
    var estado = $('#addEstado').val() === '1';

    if (!clienteId || !tipoPlanId || !startDate || !endDate || estado === '') {
        alert('Por favor, complete todos los campos');
        return;
    }

    $.ajax({
        url: "https://localhost:44346/api/Suscripcion/Insertar",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            CLI_ID: clienteId,
            TIPOPLAN_ID: tipoPlanId,
            SUS_STARTDATE: startDate,
            SUS_ENDDATE: endDate,
            SUS_RENOVACIONAUTO: renovacionAuto,
            SUS_ESTADO: estado
        }),
        success: function (data) {
            alert('Suscripción agregada correctamente');
            getSuscripciones();
            $('#addClienteId').val('');
            $('#addTipoPlanId').val('');
            $('#addStartDate').val('');
            $('#addEndDate').val('');
            $('#addRenovacionAuto').val('');
            $('#addEstado').val('');
        },
        error: function (xhr, status, error) {
            console.error('Error al agregar suscripción:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al agregar suscripción: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

function viewSuscripcion(id) {
    const suscripcion = currentSuscripciones.find(s => s.SUS_ID === id);
    if (suscripcion) {
        var cliente = currentClientes.find(c => c.CLI_ID === suscripcion.CLI_ID);
        var tipoPlan = currentTipoPlanes.find(t => t.TIPOPLAN_ID === suscripcion.TIPOPLAN_ID);
        var clienteName = cliente ? `${cliente.CLI_APELLIDO} ${cliente.CLI_NOMBRE}` : 'Desconocido';
        var tipoPlanName = tipoPlan ? tipoPlan.TIPOPLAN_NOMBRE : 'Desconocido';
        alert('ID: ' + suscripcion.SUS_ID + '\nCliente: ' + clienteName + '\nTipo de Plan: ' + tipoPlanName + '\nFecha de Inicio: ' + suscripcion.SUS_STARTDATE + '\nFecha de Fin: ' + suscripcion.SUS_ENDDATE + '\nRenovación Automática: ' + (suscripcion.SUS_RENOVACIONAUTO ? 'Sí' : 'No') + '\nEstado: ' + (suscripcion.SUS_ESTADO ? 'Activo' : 'Inactivo'));
    }
}

function loadUpdateForm(id) {
    const suscripcion = currentSuscripciones.find(s => s.SUS_ID === id);
    if (suscripcion) {
        $('#updateId').val(suscripcion.SUS_ID);
        $('#updateClienteId').val(suscripcion.CLI_ID);
        $('#updateTipoPlanId').val(suscripcion.TIPOPLAN_ID);
        $('#updateStartDate').val(suscripcion.SUS_STARTDATE);
        $('#updateEndDate').val(suscripcion.SUS_ENDDATE);
        $('#updateRenovacionAuto').val(suscripcion.SUS_RENOVACIONAUTO ? '1' : '0');
        $('#updateEstado').val(suscripcion.SUS_ESTADO ? '1' : '0');
        showSection('update');
    }
}

function loadDeleteForm(id) {
    const suscripcion = currentSuscripciones.find(s => s.SUS_ID === id);
    if (suscripcion) {
        $('#deleteId').val(suscripcion.SUS_ID);
        showSection('delete');
    }
}

function updateSuscripcion() {
    var id = $('#updateId').val().trim();
    var clienteId = $('#updateClienteId').val().trim();
    var tipoPlanId = $('#updateTipoPlanId').val().trim();
    var startDate = $('#updateStartDate').val().trim();
    var endDate = $('#updateEndDate').val().trim();
    var renovacionAuto = $('#updateRenovacionAuto').val().trim() === '1';
    var estado = $('#updateEstado').val() === '1';

    if (!id || !clienteId || !tipoPlanId || !startDate || !endDate || estado === '') {
        alert('Por favor, complete todos los campos');
        return;
    }

    $.ajax({
        url: 'https://localhost:44346/api/Suscripcion/Actualizar',
        method: "PUT",
        data: JSON.stringify({
            SUS_ID: id,
            CLI_ID: clienteId,
            TIPOPLAN_ID: tipoPlanId,
            SUS_STARTDATE: startDate,
            SUS_ENDDATE: endDate,
            SUS_RENOVACIONAUTO: renovacionAuto,
            SUS_ESTADO: estado
        }),
        contentType: "application/json",
        success: function (result) {
            alert('Suscripción actualizada con éxito!');
            getSuscripciones();
            showSection('list');
        },
        error: function (xhr, status, error) {
            console.error('Error al actualizar suscripción:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al actualizar suscripción: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

function deleteSuscripcion() {
    var id = $('#deleteId').val().trim();
    if (!id) {
        alert('Por favor, proporcione un ID');
        return;
    }
    $.ajax({
        url: 'https://localhost:44346/api/Suscripcion/Eliminar/' + id,
        method: 'DELETE',
        success: function (result) {
            alert("Suscripción eliminada con éxito");
            getSuscripciones();
            showSection('list');
        },
        error: function (xhr, status, error) {
            console.error('Error al eliminar suscripción:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al eliminar suscripción: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

$(document).ready(function() {
    getClientes(); // Load clients first
    getTipoPlanes(); // Load tipoPlanes
    getSuscripciones(); // Then load suscripciones
});
