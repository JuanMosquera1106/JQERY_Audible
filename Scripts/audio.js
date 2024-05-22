function showSection(sectionId) {
    $('.content-section').hide();
    $('#' + sectionId).show();
}

var currentAudios = [];
var currentPage = 1;
var rowsPerPage = 5;

function showSection(sectionId) {
    $('.content-section').hide();
    $('#' + sectionId).show();
}

// Function to display audios with pagination
function displayAudios(page) {
    var startIndex = (page - 1) * rowsPerPage;
    var endIndex = startIndex + rowsPerPage;
    var paginatedItems = currentAudios.slice(startIndex, endIndex);

    $('#audioList').empty();
    paginatedItems.forEach(function (audio) {
        $('#audioList').append('<tr><td>' + audio.AUDIO_ID + '</td><td>' + audio.AUDIO_TITULO + '</td><td>' + audio.AUDIO_DURACION + '</td><td>' + audio.AUDIO_AUTOR + '</td><td>' + audio.AUDIO_FECHA + '</td><td>' + (audio.AUDIO_ESTADO ? 'Activo' : 'Inactivo') + '</td><td>' +
            '<button class="btn btn-info btn-sm" onclick="viewAudio(' + audio.AUDIO_ID + ')">Ver</button> ' +
            '<button class="btn btn-warning btn-sm" onclick="loadUpdateForm(' + audio.AUDIO_ID + ')">Actualizar</button> ' +
            '<button class="btn btn-danger btn-sm" onclick="loadDeleteForm(' + audio.AUDIO_ID + ')">Eliminar</button>' +
            '</td></tr>');
    });

    setupPagination(currentAudios.length, page);
}

function setupPagination(totalItems, currentPage) {
    var totalPages = Math.ceil(totalItems / rowsPerPage);

    $('#pagination').empty();
    for (let i = 1; i <= totalPages; i++) {
        var liClass = currentPage == i ? 'page-item active' : 'page-item';
        var pageItem = '<li class="' + liClass + '"><a class="page-link" href="#" onclick="displayAudios(' + i + ')">' + i + '</a></li>';
        $('#pagination').append(pageItem);
    }
}

function getAudios() {
    $.ajax({
        url: 'https://localhost:44346/api/Audio/Listar',
        type: 'GET',
        success: function (data) {
            console.log("Audios recibidos:", data);
            currentAudios = data;
            if (data.length) {
                displayAudios(1);
                $('#errorMessage').hide();
            } else {
                $('#errorMessage').show().text('No hay audios');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener audios:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al obtener audios: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

function getAudioById() {
    var id = $('#searchId').val().trim();
    if (!id) {
        getAudios();
        return;
    }
    $.get('https://localhost:44346/api/Audio/leer/' + id, function (data) {
        currentAudios = [data];
        displayAudios(1);
    }).fail(function () {
        $('#errorMessage').show().text('Audio no encontrado.');
    });
}

function addAudio() {
    var titulo = $('#addTitulo').val().trim();
    var duracion = $('#addDuracion').val().trim();
    var autor = $('#addAutor').val().trim();
    var fecha = $('#addFecha').val().trim();
    var estado = $('#addEstado').val() === '1';

    if (!titulo || !duracion || !autor || !fecha || estado === '') {
        alert('Por favor, complete todos los campos');
        return;
    }

    $.ajax({
        url: "https://localhost:44346/api/Audio/Insertar",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            AUDIO_TITULO: titulo,
            AUDIO_DURACION: duracion,
            AUDIO_AUTOR: autor,
            AUDIO_FECHA: fecha,
            AUDIO_ESTADO: estado
        }),
        success: function (data) {
            alert('Audio agregado correctamente');
            getAudios();
            $('#addTitulo').val('');
            $('#addDuracion').val('');
            $('#addAutor').val('');
            $('#addFecha').val('');
            $('#addEstado').val('');
        },
        error: function (xhr, status, error) {
            console.error('Error al agregar audio:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al agregar audio: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

function viewAudio(id) {
    const audio = currentAudios.find(a => a.AUDIO_ID === id);
    if (audio) {
        alert('ID: ' + audio.AUDIO_ID + '\nTítulo: ' + audio.AUDIO_TITULO + '\nDuración: ' + audio.AUDIO_DURACION + '\nAutor: ' + audio.AUDIO_AUTOR + '\nFecha: ' + audio.AUDIO_FECHA + '\nEstado: ' + (audio.AUDIO_ESTADO ? 'Activo' : 'Inactivo'));
    }
}

function loadUpdateForm(id) {
    const audio = currentAudios.find(a => a.AUDIO_ID === id);
    if (audio) {
        $('#updateId').val(audio.AUDIO_ID);
        $('#updateTitulo').val(audio.AUDIO_TITULO);
        $('#updateDuracion').val(audio.AUDIO_DURACION);
        $('#updateAutor').val(audio.AUDIO_AUTOR);
        $('#updateFecha').val(audio.AUDIO_FECHA);
        $('#updateEstado').val(audio.AUDIO_ESTADO ? '1' : '0');
        showSection('update');
    }
}

function loadDeleteForm(id) {
    const audio = currentAudios.find(a => a.AUDIO_ID === id);
    if (audio) {
        $('#deleteId').val(audio.AUDIO_ID);
        showSection('delete');
    }
}

function updateAudio() {
    var id = $('#updateId').val().trim();
    var titulo = $('#updateTitulo').val().trim();
    var duracion = $('#updateDuracion').val().trim();
    var autor = $('#updateAutor').val().trim();
    var fecha = $('#updateFecha').val().trim();
    var estado = $('#updateEstado').val() === '1';

    if (!id || !titulo || !duracion || !autor || !fecha || estado === '') {
        alert('Por favor, complete todos los campos');
        return;
    }

    $.ajax({
        url: 'https://localhost:44346/api/Audio/Actualizar',
        method: "PUT",
        data: JSON.stringify({
            AUDIO_ID: id,
            AUDIO_TITULO: titulo,
            AUDIO_DURACION: duracion,
            AUDIO_AUTOR: autor,
            AUDIO_FECHA: fecha,
            AUDIO_ESTADO: estado
        }),
        contentType: "application/json",
        success: function (result) {
            alert('Audio actualizado con éxito!');
            getAudios();
            showSection('list');
        },
        error: function (xhr, status, error) {
            console.error('Error al actualizar audio:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al actualizar audio: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

function deleteAudio() {
    var id = $('#deleteId').val().trim();
    if (!id) {
        alert('Por favor, proporcione un ID');
        return;
    }
    $.ajax({
        url: 'https://localhost:44346/api/Audio/Eliminar/' + id,
        method: 'DELETE',
        success: function (result) {
            alert("Audio eliminado con éxito");
            getAudios();
            showSection('list');
        },
        error: function (xhr, status, error) {
            console.error('Error al eliminar audio:', xhr.status, xhr.statusText, xhr.responseText, status, error);
            alert('Error al eliminar audio: ' + xhr.status + ' ' + xhr.statusText + ' ' + xhr.responseText + ' ' + status + ' ' + error);
        }
    });
}

$(document).ready(function() {
    getAudios();
});
