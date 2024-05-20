function initCartScripts() {
    const contenedor = document.getElementById('cart-container');
    const carritoVacioElement = document.getElementById('carrito-vacio');
    const cantidadElement = document.getElementById("cantidad");
    const precioElement = document.getElementById("precio");
    const totalesContainer = document.getElementById('hidden-section');

    function crearTarjetasProductos() {
        if (!contenedor || !carritoVacioElement || !cantidadElement || !precioElement || !totalesContainer) return;

        contenedor.innerHTML = "";
        const productos = JSON.parse(localStorage.getItem("suscripciones"));

        if (productos && productos.length > 0) {
            productos.forEach(producto => {
                const newSus = document.createElement('article');
                newSus.classList = "col-12";
                newSus.innerHTML = `
                <section class="container border-bottom border-dark">
                    <div class="row justify-content-center align-items-center mb-3 mt-3">
                        <div class="col-12 col-md-6 text-center">
                            <img src="${producto.foto}" alt="" class="imagen">
                        </div>
                        <div class="col-12 col-md-6 text-center mb-3">
                            <span class="text-center fw-bold p-5">${producto.nombre}</span>
                            <span class="text-center fw-bold precio-font p-3">$${producto.precio}</span>                    
                            <span class="p-2" id="cantidad-producto">${producto.cantidad}</span>
                        </div>
                    </div>
                </section>`;

                contenedor.appendChild(newSus);
            });
        }
        revisarMensajeVacio();
        actualizarTotales();
    }

    function actualizarTotales() {
        if (!cantidadElement || !precioElement) return;

        const productos = JSON.parse(localStorage.getItem("suscripciones"));
        let cantidad = 0;
        let precio = 0;
        if (productos && productos.length > 0) {
            productos.forEach((producto) => {
                cantidad += producto.cantidad;
                precio += producto.precio * producto.cantidad;
            });
        }
        cantidadElement.innerText = cantidad;
        localStorage.setItem('precio', precio);
        precioElement.innerText = precio;
        if (precio === 0) {
            reiniciarCarrito();
            revisarMensajeVacio();
        }
    }

    function revisarMensajeVacio() {
        const productos = JSON.parse(localStorage.getItem("suscripciones"));
        if (carritoVacioElement && totalesContainer) {
            carritoVacioElement.classList.toggle("escondido", productos);
            totalesContainer.classList.toggle("escondido", !(productos && productos.length > 0));
        }
    }

    document.getElementById("reiniciar")?.addEventListener("click", () => {
        var resultado = confirm("¿Estás seguro de que deseas remover todos los items del carrito?");
        if (resultado) {
            if (contenedor) contenedor.innerHTML = "";
            reiniciarCarrito();
            revisarMensajeVacio();
        }
    });

    crearTarjetasProductos();
}
