function showSection(sectionId) {
    $('.content-section').hide();
    $('#' + sectionId).show();
}

var currentPagos = [];
var currentClientes = [];
var currentPage = 1;
var rowsPerPage = 20;

function showSection(sectionId) {
    $('.content-section').hide();
    $('#' + sectionId).show();
}

// Function to display pagos with pagination
function displayPagos(page) {
    var startIndex = (page - 1) * rowsPerPage;
    var endIndex = startIndex + rowsPerPage;
    var paginatedItems = currentPagos.slice(startIndex, endIndex);

    $('#pagoList').empty();
    paginatedItems.forEach(function (pago) {
        var cliente = currentClientes.find(c => c.CLI_ID === pago.CLI_ID);
        var clienteName = cliente ? `${cliente.CLI_NOMBRE} ${cliente.CLI_APELLIDO}` : 'Desconocido';

        $('#pagoList').append('<tr><td>' + pago.PAGO_ID + '</td><td>' + clienteName + '</td><td>' + pago.PAGO_COD + '</td><td>' + pago.PAGO_TIPO + '</td><td>' + pago.PAGO_MONTO + '</td><td>' + pago.PAGO_FECHA + '</td><td>' + pago.PAGO_PENDIENTE + '</td><td>' + (pago.PAGO_ESTADO ? 'Activo' : 'Inactivo') + '</td><td>' +
            '<button class="btn btn-info btn-sm" onclick="viewPago(' + pago.PAGO_ID + ')">Ver</button> ' +
            '<button class="btn btn-warning btn-sm" onclick="loadUpdateForm(' + pago.PAGO_ID + ')">Actualizar</button> ' +
            '<button class="btn btn-danger btn-sm" onclick="loadDeleteForm(' + pago.PAGO_ID + ')">Eliminar</button>' +
            '</td></tr>');
    });

    setupPagination(currentPagos.length, page);
}

function setupPagination(totalItems, currentPage) {
    var totalPages = Math.ceil(totalItems / rowsPerPage);

    $('#pagination').empty();
    for (let i = 1; i <= totalPages; i++) {
        var liClass = currentPage == i ? 'page-item active' : 'page-item';
        var pageItem = '<li class="' + liClass + '"><a class="page-link" href="#" onclick="displayPagos(' + i + ')">' + i + '</a></li>';
        $('#pagination').append(pageItem);
    }
}

function getPagos() {
    $.ajax({
        url: 'https://localhost:44346/api/Pago/Listar',
        type: 'GET',
        success: function (data) {
            console.log("Pagos recibidos:", data);
            currentPagos = data;
            if (data.length) {
                displayPagos(1);
                $('#errorMessage').hide();
            } else {
                $('#errorMessage').show().text('No hay pagos');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener pagos:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al obtener pagos: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
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

function loadClientSelectList(clientes, selectId) {
    $(selectId).empty();
    clientes.forEach(function (cliente) {
        $(selectId).append('<option value="' + cliente.CLI_ID + '">' + cliente.CLI_APELLIDO + ' ' + cliente.CLI_NOMBRE + '</option>');
    });
}

function getPagoById() {
    var id = $('#searchId').val().trim();
    if (!id) {
        getPagos();
        return;
    }
    $.get('https://localhost:44346/api/Pago/leer/' + id, function (data) {
        currentPagos = [data];
        displayPagos(1);
    }).fail(function () {
        $('#errorMessage').show().text('Pago no encontrado.');
    });
}

function addPago() {
    var clienteId = $('#addClienteId').val().trim();
    var codigo = $('#addCodigo').val().trim();
    var tipo = $('#addTipo').val().trim();
    var monto = $('#addMonto').val().trim();
    var fecha = $('#addFecha').val().trim();
    var pendiente = $('#addPendiente').val().trim();
    var estado = $('#addEstado').val() === '1';

    if (!clienteId || !codigo || !tipo || !monto || !fecha || !pendiente || estado === '') {
        alert('Por favor, complete todos los campos');
        return;
    }

    $.ajax({
        url: "https://localhost:44346/api/Pago/Insertar",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            PAGO_ID: id,
            CLI_ID: clienteId,
            PAGO_COD: codigo,
            PAGO_TIPO: tipo,
            PAGO_MONTO: monto,
            PAGO_FECHA: fecha,
            PAGO_PENDIENTE: pendiente,
            PAGO_ESTADO: estado
        }),
        success: function (data) {
            alert('Pago agregado correctamente');
            getPagos();
            $('#addClienteId').val('');
            $('#addCodigo').val('');
            $('#addTipo').val('');
            $('#addMonto').val('');
            $('#addFecha').val('');
            $('#addPendiente').val('');
            $('#addEstado').val('');
        },
        error: function (xhr, status, error) {
            console.error('Error al agregar pago:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al agregar pago: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

function viewPago(id) {
    const pago = currentPagos.find(p => p.PAGO_ID === id);
    if (pago) {
        var cliente = currentClientes.find(c => c.CLI_ID === pago.CLI_ID);
        var clienteName = cliente ? `${cliente.CLI_APELLIDO} ${cliente.CLI_NOMBRE}` : 'Desconocido';
        alert('ID: ' + pago.PAGO_ID + '\nCliente: ' + clienteName + '\nCódigo: ' + pago.PAGO_COD + '\nTipo: ' + pago.PAGO_TIPO + '\nMonto: ' + pago.PAGO_MONTO + '\nFecha: ' + pago.PAGO_FECHA + '\nPendiente: ' + pago.PAGO_PENDIENTE + '\nEstado: ' + (pago.PAGO_ESTADO ? 'Activo' : 'Inactivo'));
    }
}

function loadUpdateForm(id) {
    const pago = currentPagos.find(p => p.PAGO_ID === id);
    if (pago) {
        $('#updateId').val(pago.PAGO_ID);
        $('#updateClienteId').val(pago.CLI_ID);
        $('#updateCodigo').val(pago.PAGO_COD);
        $('#updateTipo').val(pago.PAGO_TIPO);
        $('#updateMonto').val(pago.PAGO_MONTO);
        $('#updateFecha').val(pago.PAGO_FECHA);
        $('#updatePendiente').val(pago.PAGO_PENDIENTE);
        $('#updateEstado').val(pago.PAGO_ESTADO ? '1' : '0');
        showSection('update');
    }
}

function loadDeleteForm(id) {
    const pago = currentPagos.find(p => p.PAGO_ID === id);
    if (pago) {
        $('#deleteId').val(pago.PAGO_ID);
        showSection('delete');
    }
}

function updatePago() {
    var id = $('#updateId').val().trim();
    var clienteId = $('#updateClienteId').val().trim();
    var codigo = $('#updateCodigo').val().trim();
    var tipo = $('#updateTipo').val().trim();
    var monto = $('#updateMonto').val().trim();
    var fecha = $('#updateFecha').val().trim();
    var pendiente = $('#updatePendiente').val().trim();
    var estado = $('#updateEstado').val() === '1';

    if (!id || !clienteId || !codigo || !tipo || !monto || !fecha || !pendiente || estado === '') {
        alert('Por favor, complete todos los campos');
        return;
    }

    $.ajax({
        url: 'https://localhost:44346/api/Pago/Actualizar',
        method: "PUT",
        data: JSON.stringify({
            PAGO_ID: id,
            CLI_ID: clienteId,
            PAGO_COD: codigo,
            PAGO_TIPO: tipo,
            PAGO_MONTO: monto,
            PAGO_FECHA: fecha,
            PAGO_PENDIENTE: pendiente,
            PAGO_ESTADO: estado
        }),
        contentType: "application/json",
        success: function (result) {
            alert('Pago actualizado con éxito!');
            getPagos();
            showSection('list');
        },
        error: function (xhr, status, error) {
            console.error('Error al actualizar pago:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al actualizar pago: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

function deletePago() {
    var id = $('#deleteId').val().trim();
    if (!id) {
        alert('Por favor, proporcione un ID');
        return;
    }
    $.ajax({
        url: 'https://localhost:44346/api/Pago/Eliminar/' + id,
        method: 'PUT',
        contentType: "application/json",
        success: function (result) {
            alert("Pago eliminado con éxito");
            getPagos();
            showSection('list');
        },
        error: function (xhr, status, error) {
            console.error('Error al eliminar pago:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al eliminar pago: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

$(document).ready(function() {
    getClientes(); // Load clients first
    getPagos(); // Then load pagos
});

