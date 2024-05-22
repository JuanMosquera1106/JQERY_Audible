$(document).ready(function() {
    $("#comprar").on("click", function() {
        const cedula = prompt("Por favor, ingresa tu cédula:");
        if (cedula !== null && cedula !== "") {
            const resultado = confirm("¿Estás seguro de que deseas comprar los productos en el carrito?");
            if (resultado) {
                const suscripcionesData = localStorage.getItem("suscripciones");
                const subtotalData = localStorage.getItem("precio");
                localStorage.setItem("cedula", cedula);

                $.ajax({
                    url: 'https://localhost:44346/api/Compra/GuardarCompra', // Ajusta la URL a tu endpoint
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        SuscripcionesData: suscripcionesData,
                        SubtotalData: subtotalData,
                        Cedula: cedula
                    }),
                    success: function(data) {
                        if (data.success) {
                            // Redirigir a la vista de inicio usando la función loadView
                            window.location.hash = '#index';
                            localStorage.removeItem("suscripciones");
                            localStorage.removeItem("precio");
                            localStorage.removeItem("cedula");
                        } else {
                            alert(data.message);
                        }
                    },
                    error: function(error) {
                        console.error('Error:', error);
                    }
                });
            }
        } else {
            alert("Debes ingresar tu cédula para realizar la compra.");
        }
    });
});

actualizarCarrito();