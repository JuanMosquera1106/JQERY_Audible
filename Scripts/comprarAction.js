document.getElementById("comprar")?.addEventListener("click", () => {
    const cedula = prompt("Por favor, ingresa tu cédula:");
    if (cedula !== null && cedula !== "") {
        var resultado = confirm("¿Estás seguro de que deseas comprar los productos en el carrito?");
        if (resultado) {
            const suscripcionesData = localStorage.getItem("suscripciones");
            const subtotalData = localStorage.getItem("precio");
            localStorage.setItem("cedula", cedula);

            fetch('http://localhost:4000/compra', { // Ajusta la URL a tu endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    SuscripcionesData: suscripcionesData,
                    SubtotalData: subtotalData,
                    Cedula: cedula
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.href = 'index.html';
                        localStorage.removeItem("suscripciones");
                        localStorage.removeItem("precio");
                        localStorage.removeItem("cedula");
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    } else {
        alert("Debes ingresar tu cédula para realizar la compra.");
    }
});
