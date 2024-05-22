$(document).ready(function(){
    var apiURL = "https://localhost:44346/api/SP/ListarActividadUsuarios";
    $.ajax({
        url: apiURL,
        type: 'GET',
        success: function(data){
            var tableBody = $('#actividadUsuariosTable tbody');
            var nombres = [];
            var numPagos = [];
            
            data.forEach(function(item) {
                nombres.push(item.Nombre + ' ' + item.Apellido);
                numPagos.push(item.NumeroPagos);
                
                tableBody.append('<tr><td>' + item.Cedula + '</td><td>' + item.Nombre + '</td><td>' + item.Apellido + '</td><td>' + item.Email + '</td><td>' + item.NumeroPagos + '</td></tr>');
            });

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
