$(document).ready(function(){
    var apiURL = "https://localhost:44346/api/SP/ListarActividadUsuarios";
    var rowsPerPage = 10;
    var currentPage = 1;
    var totalPages = 0;
    var data = [];

    function displayPage(page) {
        var startIndex = (page - 1) * rowsPerPage;
        var endIndex = startIndex + rowsPerPage;
        var paginatedData = data.slice(startIndex, endIndex);
        var tableBody = $('#actividadUsuariosTable tbody');
        
        tableBody.empty();
        
        paginatedData.forEach(function(item) {
            tableBody.append('<tr><td>' + item.Cedula + '</td><td>' + item.Nombre + '</td><td>' + item.Apellido + '</td><td>' + item.Email + '</td><td>' + item.NumeroPagos + '</td></tr>');
        });
    }

    function setupPagination() {
        totalPages = Math.ceil(data.length / rowsPerPage);
        var pagination = $('#pagination');
        
        pagination.empty();
        
        for (var i = 1; i <= totalPages; i++) {
            var liClass = currentPage == i ? 'page-item active' : 'page-item';
            var pageItem = '<li class="' + liClass + '"><a class="page-link" href="#" onclick="goToPage(' + i + ')">' + i + '</a></li>';
            pagination.append(pageItem);
        }
    }

    function goToPage(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        displayPage(currentPage);
        setupPagination();
    }

    window.goToPage = goToPage; // Make function available globally

    $.ajax({
        url: apiURL,
        type: 'GET',
        success: function(responseData) {
            data = responseData;
            setupPagination();
            displayPage(currentPage);

            // Configurar el gráfico
            var nombres = data.map(item => item.Nombre + ' ' + item.Apellido);
            var numPagos = data.map(item => item.NumeroPagos);
            
            var ctx = document.getElementById('actividadUsuariosChart').getContext('2d');
            var chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: nombres,
                    datasets: [{
                        label: 'Número de Pagos',
                        data: numPagos,
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        },
        error: function(xhr, status, error) {
            alert('Error al cargar los datos: ' + error);
        }
    });
});
