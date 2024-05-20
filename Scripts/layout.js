function loadView(viewName) {
    $('#view-content').load(`../CRUD/${viewName}.html`, function() {
        // Ejecutar scripts específicos después de cargar la vista
        if (viewName === 'cart') {
            initCartScripts();
        } else if (viewName === 'secciones') {
            initSeccionesScripts();
        } else if (viewName === 'UIClientes') {
            initClientesScripts();
        }
    });
}

$(document).ready(function() {
    var hash = window.location.hash.substr(1);
    if (hash) {
        loadView(hash);
    } else {
        loadView('index'); // Vista por defecto si no hay hash
    }

    $(window).on('hashchange', function() {
        var hash = window.location.hash.substr(1);
        if (hash) {
            loadView(hash);
        }
    });

    initNavbarCartCounter(); // Inicializar el contador del carrito en el navbar
});

function initCartScripts() {
    // Cargar y ejecutar scripts necesarios para la vista del carrito
    $.getScript("../../Scripts/comprarAction.js");
    $.getScript("../../Scripts/cart.js");
}
