function showSection(sectionId) {
    $('.content-section').hide();
    $('#' + sectionId).show();
}

var currentEscuchas = [];
var currentClientes = [];
var currentAudios = [];
var currentPage = 1;
var rowsPerPage = 5;

function showSection(sectionId) {
    $('.content-section').hide();
    $('#' + sectionId).show();
}

// Function to display escuchas with pagination
function displayEscuchas(page) {
    var startIndex = (page - 1) * rowsPerPage;
    var endIndex = startIndex + rowsPerPage;
    var paginatedItems = currentEscuchas.slice(startIndex, endIndex);

    $('#escuchaList').empty();
    paginatedItems.forEach(function (escucha) {
        var cliente = currentClientes.find(c => c.CLI_ID === escucha.CLI_ID);
        var audio = currentAudios.find(a => a.AUDIO_ID === escucha.AUDIO_ID);
        var clienteName = cliente ? `${cliente.CLI_APELLIDO} ${cliente.CLI_NOMBRE}` : 'Desconocido';
        var audioName = audio ? `${audio.AUDIO_TITULO}` : 'Desconocido';

        $('#escuchaList').append('<tr><td>' + escucha.ESCUCHA_ID + '</td><td>' + clienteName + '</td><td>' + audioName + '</td><td>' + escucha.ESCUCHA_FECHA + '</td><td>' + (escucha.ESCHUCHA_ESTADO ? 'Activo' : 'Inactivo') + '</td><td>' +
            '<button class="btn btn-info btn-sm" onclick="viewEscucha(' + escucha.ESCUCHA_ID + ')">Ver</button> ' +
            '<button class="btn btn-warning btn-sm" onclick="loadUpdateForm(' + escucha.ESCUCHA_ID + ')">Actualizar</button> ' +
            '<button class="btn btn-danger btn-sm" onclick="loadDeleteForm(' + escucha.ESCUCHA_ID + ')">Eliminar</button>' +
            '</td></tr>');
    });

    setupPagination(currentEscuchas.length, page);
}

function setupPagination(totalItems, currentPage) {
    var totalPages = Math.ceil(totalItems / rowsPerPage);

    $('#pagination').empty();
    for (let i = 1; i <= totalPages; i++) {
        var liClass = currentPage == i ? 'page-item active' : 'page-item';
        var pageItem = '<li class="' + liClass + '"><a class="page-link" href="#" onclick="displayEscuchas(' + i + ')">' + i + '</a></li>';
        $('#pagination').append(pageItem);
    }
}

function getEscuchas() {
    $.ajax({
        url: 'https://localhost:44346/api/Escucha/Listar',
        type: 'GET',
        success: function (data) {
            console.log("Escuchas recibidas:", data);
            currentEscuchas = data;
            if (data.length) {
                displayEscuchas(1);
                $('#errorMessage').hide();
            } else {
                $('#errorMessage').show().text('No hay escuchas');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener escuchas:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al obtener escuchas: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
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

function getAudios() {
    $.ajax({
        url: 'https://localhost:44346/api/Audio/Listar',
        type: 'GET',
        success: function (data) {
            console.log("Audios recibidos:", data);
            currentAudios = data;
            loadAudioSelectList(data, '#addAudioId');
            loadAudioSelectList(data, '#updateAudioId');
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener audios:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al obtener audios: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

function loadClientSelectList(clientes, selectId) {
    $(selectId).empty();
    clientes.forEach(function (cliente) {
        $(selectId).append('<option value="' + cliente.CLI_ID + '">' + cliente.CLI_APELLIDO + ' ' + cliente.CLI_NOMBRE + '</option>');
    });
}

function loadAudioSelectList(audios, selectId) {
    $(selectId).empty();
    audios.forEach(function (audio) {
        $(selectId).append('<option value="' + audio.AUDIO_ID + '">' + audio.AUDIO_TITULO + '</option>');
    });
}

function getEscuchaById() {
    var id = $('#searchId').val().trim();
    if (!id) {
        getEscuchas();
        return;
    }
    $.get('https://localhost:44346/api/Escucha/leer/' + id, function (data) {
        currentEscuchas = [data];
        displayEscuchas(1);
    }).fail(function () {
        $('#errorMessage').show().text('Escucha no encontrada.');
    });
}

function addEscucha() {
    var clienteId = $('#addClienteId').val().trim();
    var audioId = $('#addAudioId').val().trim();
    var fecha = $('#addFecha').val().trim();
    var estado = $('#addEstado').val() === '1';

    if (!clienteId || !audioId || !fecha || estado === '') {
        alert('Por favor, complete todos los campos');
        return;
    }

    $.ajax({
        url: "https://localhost:44346/api/Escucha/Insertar",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            CLI_ID: clienteId,
            AUDIO_ID: audioId,
            ESCUCHA_FECHA: fecha,
            ESCHUCHA_ESTADO: estado
        }),
        success: function (data) {
            alert('Escucha agregada correctamente');
            getEscuchas();
            $('#addClienteId').val('');
            $('#addAudioId').val('');
            $('#addFecha').val('');
            $('#addEstado').val('');
        },
        error: function (xhr, status, error) {
            console.error('Error al agregar escucha:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al agregar escucha: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

function viewEscucha(id) {
    const escucha = currentEscuchas.find(e => e.ESCUCHA_ID === id);
    if (escucha) {
        var cliente = currentClientes.find(c => c.CLI_ID === escucha.CLI_ID);
        var audio = currentAudios.find(a => a.AUDIO_ID === escucha.AUDIO_ID);
        var clienteName = cliente ? `${cliente.CLI_APELLIDO} ${cliente.CLI_NOMBRE}` : 'Desconocido';
        var audioName = audio ? `${audio.AUDIO_TITULO}` : 'Desconocido';
        alert('ID: ' + escucha.ESCUCHA_ID + '\nCliente: ' + clienteName + '\nAudio: ' + audioName + '\nFecha: ' + escucha.ESCUCHA_FECHA + '\nEstado: ' + (escucha.ESCHUCHA_ESTADO ? 'Activo' : 'Inactivo'));
    }
}

function loadUpdateForm(id) {
    const escucha = currentEscuchas.find(e => e.ESCUCHA_ID === id);
    if (escucha) {
        $('#updateId').val(escucha.ESCUCHA_ID);
        $('#updateClienteId').val(escucha.CLI_ID);
        $('#updateAudioId').val(escucha.AUDIO_ID);
        $('#updateFecha').val(escucha.ESCUCHA_FECHA);
        $('#updateEstado').val(escucha.ESCHUCHA_ESTADO ? '1' : '0');
        showSection('update');
    }
}

function loadDeleteForm(id) {
    const escucha = currentEscuchas.find(e => e.ESCUCHA_ID === id);
    if (escucha) {
        $('#deleteId').val(escucha.ESCUCHA_ID);
        showSection('delete');
    }
}

function updateEscucha() {
    var id = $('#updateId').val().trim();
    var clienteId = $('#updateClienteId').val().trim();
    var audioId = $('#updateAudioId').val().trim();
    var fecha = $('#updateFecha').val().trim();
    var estado = $('#updateEstado').val() === '1';

    if (!id || !clienteId || !audioId || !fecha || estado === '') {
        alert('Por favor, complete todos los campos');
        return;
    }

    $.ajax({
        url: 'https://localhost:44346/api/Escucha/Actualizar',
        method: "PUT",
        data: JSON.stringify({
            ESCUCHA_ID: id,
            CLI_ID: clienteId,
            AUDIO_ID: audioId,
            ESCUCHA_FECHA: fecha,
            ESCHUCHA_ESTADO: estado
        }),
        contentType: "application/json",
        success: function (result) {
            alert('Escucha actualizada con éxito!');
            getEscuchas();
            showSection('list');
        },
        error: function (xhr, status, error) {
            console.error('Error al actualizar escucha:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al actualizar escucha: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

function deleteEscucha() {
    var id = $('#deleteId').val().trim();
    if (!id) {
        alert('Por favor, proporcione un ID');
        return;
    }
    $.ajax({
        url: 'https://localhost:44346/api/Escucha/Eliminar/' + id,
        method: 'DELETE',
        success: function (result) {
            alert("Escucha eliminada con éxito");
            getEscuchas();
            showSection('list');
        },
        error: function (xhr, status, error) {
            console.error('Error al eliminar escucha:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al eliminar escucha: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

$(document).ready(function() {
    getClientes(); // Load clients first
    getAudios(); // Load audios
    getEscuchas(); // Then load escuchas
});
