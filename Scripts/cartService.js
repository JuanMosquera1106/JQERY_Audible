function agregarAlCarrito(dataProducto) {
    const producto = JSON.parse(dataProducto); // Parsea directamente el string JSON
    const memoria = JSON.parse(localStorage.getItem("suscripciones"));
    console.log(memoria);
    let cuenta = 0;

    if (!memoria) {
        const nuevoProducto = getNuevoProductoParaMemoria(producto);
        console.log(nuevoProducto.productoID);
        localStorage.setItem("suscripciones", JSON.stringify([nuevoProducto]));
        cuenta = 1;
    } else {
        let productoParsed = typeof producto === "string" ? JSON.parse(producto) : producto;
        let indiceProducto = memoria.findIndex(semestre => semestre.productoID === productoParsed.productoID);

        if (indiceProducto === -1) {
            const nuevoProducto = getNuevoProductoParaMemoria(productoParsed);
            memoria.push(nuevoProducto);
            cuenta = 1;
        } else {
            //  memoria[indiceProducto].cantidad++;
            cuenta = memoria[indiceProducto].cantidad;
        }

        localStorage.setItem("suscripciones", JSON.stringify(memoria));
    }

    actualizarCarrito();
    return cuenta;
}

function restarAlCarrito(producto) {
    const memoria = JSON.parse(localStorage.getItem("suscripciones"));
    let cuenta = 0;
    console.log(memoria);
    if (memoria) {
        const indiceProducto = memoria.findIndex(semestre => semestre.productoID === producto.productoID);
        if (indiceProducto !== -1) {
            if (memoria[indiceProducto].cantidad === 1) {
                memoria.splice(indiceProducto, 1);
            }
            localStorage.setItem("suscripciones", JSON.stringify(memoria));
            actualizarCarrito();
            try {
                cuenta = memoria[indiceProducto].cantidad;
            } catch (e) {
                cuenta = 0;
            }
            return cuenta;
        }
    }
}

function getNuevoProductoParaMemoria(producto) {
    let nuevoProducto;

    if (typeof producto === 'string') {
        try {
            nuevoProducto = JSON.parse(producto);
        } catch (e) {
            console.error("Error al parsear el producto:", e);
            return null;
        }
    } else if (typeof producto === "object" && producto.hasOwnProperty("productoID")) {
        nuevoProducto = producto;
    } else {
        console.error("Formato de producto no reconocido");
        return null;
    }

    if (nuevoProducto) {
        nuevoProducto.cantidad = 1;
        return nuevoProducto;
    }
}

function actualizarCarrito() {
    const memoria = JSON.parse(localStorage.getItem("suscripciones"));

    if (memoria && memoria.length > 0) {
        const cuenta = memoria.reduce((acumulado, elemento) => acumulado + elemento.cantidad, 0);
        cuentaCarritoElement.innerText = cuenta;
        bc.postMessage({
            action: "add",
            count: cuenta,
        });
    } else {
        cuentaCarritoElement.innerText = 0;
        bc.postMessage({
            action: "add",
            count: 0,
        });
    }
}

function reiniciarCarrito() {
    localStorage.removeItem("suscripciones");
    actualizarCarrito();
}

actualizarCarrito();
