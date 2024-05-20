function showSection(sectionId) {
    $('.content-section').hide();
    $('#' + sectionId).show();
}

var currentClientes = [];
var currentPage = 1;
var rowsPerPage = 5;

// Función para mostrar clientes paginados
function displayClientes(page) {
    var startIndex = (page - 1) * rowsPerPage;
    var endIndex = startIndex + rowsPerPage;
    var paginatedItems = currentClientes.slice(startIndex, endIndex);

    $('#clienteList').empty();
    paginatedItems.forEach(function (cliente) {
        $('#clienteList').append('<tr><td>' + cliente.cli_ID + '</td><td>' + cliente.cli_NOMBRE + '</td><td>' + cliente.cli_APELLIDO + '</td><td>' + cliente.cli_PAIS + '</td><td>' + cliente.cli_EMAIL + '</td><td>' + (cliente.cli_ESTADO ? 'Activo' : 'Inactivo') + '</td><td>' +
            '<button class="btn btn-info btn-sm" onclick="viewCliente(\'' + cliente.cli_ID + '\')">Ver</button> ' +
            '<button class="btn btn-warning btn-sm" onclick="loadUpdateForm(\'' + cliente.cli_ID + '\')">Actualizar</button> ' +
            '<button class="btn btn-danger btn-sm" onclick="loadDeleteForm(\'' + cliente.cli_ID + '\')">Eliminar</button>' +
            '</td></tr>');
    });

    setupPagination(currentClientes.length, page);
}

function setupPagination(totalItems, currentPage) {
    var totalPages = Math.ceil(totalItems / rowsPerPage);

    $('#pagination').empty();
    for (let i = 1; i <= totalPages; i++) {
        var liClass = currentPage == i ? 'page-item active' : 'page-item';
        var pageItem = '<li class="' + liClass + '"><a class="page-link" href="#" onclick="displayClientes(' + i + ')">' + i + '</a></li>';
        $('#pagination').append(pageItem);
    }
}

// Función para obtener los clientes desde el servidor
function getClientes() {
    $.ajax({
        url: 'http://localhost:4000/cliente',
        type: 'GET',
        success: function (data) {
            console.log(data); // Añade esto para ver los datos en la consola
            currentClientes = data;
            if (data.length) {
                displayClientes(1);
                $('#errorMessage').hide();
            } else {
                $('#errorMessage').show().text('No hay clientes');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener clientes:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al obtener clientes: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

function getClienteById() {
    var id = $('#searchId').val().trim();
    if (!id) {
        getClientes();
        return;
    }
    $.get('http://localhost:4000/cliente/' + id, function (data) {
        currentClientes = [data];
        displayClientes(1);
    }).fail(function () {
        $('#errorMessage').show().text('Cliente no encontrado.');
    });
}

function addCliente() {
    var id = $('#addId').val().trim();
    var nombre = $('#addNombre').val().trim();
    var apellido = $('#addApellido').val().trim();
    var pais = $('#addPais').val().trim();
    var email = $('#addEmail').val().trim();
    var estado = $('#addEstado').val() === '1';

    if (!id || !nombre || !apellido || !pais || !email || estado === '') {
        alert('Por favor, complete todos los campos');
        return;
    }

    $.ajax({
        url: "http://localhost:4000/cliente",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            cli_ID: id,
            cli_NOMBRE: nombre,
            cli_APELLIDO: apellido,
            cli_PAIS: pais,
            cli_EMAIL: email,
            cli_ESTADO: estado
        }),
        success: function (data) {
            alert('Cliente agregado correctamente');
            getClientes();
            $('#addId').val('');
            $('#addNombre').val('');
            $('#addApellido').val('');
            $('#addPais').val('');
            $('#addEmail').val('');
            $('#addEstado').val('');
        },
        error: function (xhr, status, error) {
            console.error('Error al agregar cliente:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al agregar cliente: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

function viewCliente(id) {
    const cliente = currentClientes.find(c => c.cli_ID === id);
    if (cliente) {
        alert('ID: ' + cliente.cli_ID + '\nNombre: ' + cliente.cli_NOMBRE + '\nApellido: ' + cliente.cli_APELLIDO + '\nPaís: ' + cliente.cli_PAIS + '\nEmail: ' + cliente.cli_EMAIL + '\nEstado: ' + (cliente.cli_ESTADO ? 'Activo' : 'Inactivo'));
    }
}

function loadUpdateForm(id) {
    const cliente = currentClientes.find(c => c.cli_ID === id);
    if (cliente) {
        $('#updateId').val(cliente.cli_ID);
        $('#updateNombre').val(cliente.cli_NOMBRE);
        $('#updateApellido').val(cliente.cli_APELLIDO);
        $('#updatePais').val(cliente.cli_PAIS);
        $('#updateEmail').val(cliente.cli_EMAIL);
        $('#updateEstado').val(cliente.cli_ESTADO ? '1' : '0');
        showSection('update');
    }
}

function loadDeleteForm(id) {
    const cliente = currentClientes.find(c => c.cli_ID === id);
    if (cliente) {
        $('#deleteId').val(cliente.cli_ID);
        showSection('delete');
    }
}

function updateCliente() {
    var id = $('#updateId').val().trim();
    var nombre = $('#updateNombre').val().trim();
    var apellido = $('#updateApellido').val().trim();
    var pais = $('#updatePais').val().trim();
    var email = $('#updateEmail').val().trim();
    var estado = $('#updateEstado').val() === '1';

    if (!id || !nombre || !apellido || !pais || !email || estado === '') {
        alert('Por favor, complete todos los campos');
        return;
    }

    $.ajax({
        url: 'http://localhost:4000/cliente/' + id,
        method: "PUT",
        data: JSON.stringify({
            cli_NOMBRE: nombre,
            cli_APELLIDO: apellido,
            cli_PAIS: pais,
            cli_EMAIL: email,
            cli_ESTADO: estado
        }),
        contentType: "application/json",
        success: function (result) {
            alert('Cliente actualizado con éxito!');
            getClientes();
            showSection('list');
        },
        error: function (xhr, status, error) {
            console.error('Error al actualizar cliente:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al actualizar cliente: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

function deleteCliente() {
    var id = $('#deleteId').val().trim();
    if (!id) {
        alert('Por favor, proporcione un ID');
        return;
    }
    $.ajax({
        url: 'http://localhost:4000/cliente/' + id,
        method: 'DELETE',
        success: function (result) {
            alert("Cliente eliminado con éxito");
            getClientes(); // Recargar lista de clientes
            showSection('list');
        },
        error: function (xhr, status, error) {
            console.error('Error al eliminar cliente:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al eliminar cliente: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

// Inicializar la visualización de clientes al cargar la página
$(document).ready(function() {
    getClientes();
});
