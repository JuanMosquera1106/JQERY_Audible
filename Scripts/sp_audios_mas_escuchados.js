$(document).ready(function(){
    var apiURL = "https://localhost:44346/api/SP/ListarAudiosEscuchados";
    $.ajax({
        url: apiURL,
        type: 'GET',
        success: function(data){
            var tableBody = $('#audiosMasEscuchadosTable tbody');
            var titulos = [];
            var vecesEscuchado = [];
            
            data.forEach(function(item) {
                titulos.push(item.AUDIO_TITULO);
                vecesEscuchado.push(item.VecesEscuchado);
                
                tableBody.append('<tr><td>' + item.AUDIO_ID + '</td><td>' + item.AUDIO_TITULO + '</td><td>' + item.AUDIO_AUTOR + '</td><td>' + item.VecesEscuchado + '</td></tr>');
            });

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
