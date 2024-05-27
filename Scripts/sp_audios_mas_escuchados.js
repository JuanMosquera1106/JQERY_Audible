$(document).ready(function(){
    var apiURL = "https://localhost:44346/api/SP/ListarAudiosEscuchados";
    var rowsPerPage = 10;
    var currentPage = 1;
    var totalPages = 0;
    var data = [];

    function displayPage(page) {
        var startIndex = (page - 1) * rowsPerPage;
        var endIndex = startIndex + rowsPerPage;
        var paginatedData = data.slice(startIndex, endIndex);
        var tableBody = $('#audiosMasEscuchadosTable tbody');
        
        tableBody.empty();
        
        paginatedData.forEach(function(item) {
            tableBody.append('<tr><td>' + item.AUDIO_ID + '</td><td>' + item.AUDIO_TITULO + '</td><td>' + item.AUDIO_AUTOR + '</td><td>' + item.VecesEscuchado + '</td></tr>');
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
            var titulos = data.map(item => item.AUDIO_TITULO);
            var vecesEscuchado = data.map(item => item.VecesEscuchado);
            
            var ctx = document.getElementById('audiosMasEscuchadosChart').getContext('2d');
            var chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: titulos,
                    datasets: [{
                        label: 'Veces Escuchado',
                        data: vecesEscuchado,
                        backgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#F77825', '#9966FF', '#FF9F40'
                        ],
                        hoverBackgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#F77825', '#9966FF', '#FF9F40'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    return tooltipItem.label + ': ' + tooltipItem.raw.toLocaleString() + ' veces';
                                }
                            }
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
