function loadView(viewName) {
    $('#view-content').load(`../CRUD/${viewName}.html`, function(response, status, xhr) {
        initLayoutScripts();
        if (status == "error") {
            console.log("Error loading view: " + xhr.status + " " + xhr.statusText);
            return;
        }
        // Ejecutar scripts específicos después de cargar la vista
        if (viewName === 'cart') {
            initCartScripts();
        } else if (viewName === 'secciones') {
            initSeccionesScripts();
        } else if (viewName === 'UIClientes') {
            initClientesScripts();
        } else if (viewName === 'UIAudios') {
            initAudiosScripts();
        } else if (viewName === 'UISuscripciones') {
            initSuscripcionesScripts();
        } else if (viewName === 'UIPagos') {
            initPagosScripts();
        } else if (viewName === 'UITipoPlan') {
            initTipoPlanScripts();
        } else if (viewName === 'UIEscuchas') {
            initEscuchasScripts();
        }else if (viewName === 'UIActividad_usuarios') {
            initActividad_usuariosScripts();
        }
        else if (viewName === 'UIAudios_mas_escuchados') {
            initAudios_mas_escuchadosScripts();
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

function initLayoutScripts() {
    $.getScript("../../Scripts/broadcastHandler.js", function() {
        console.log("broadcastHandler.js loaded successfully.");
    });
    $.getScript("../../Scripts/cartService.js", function() {
        console.log("cartService.js loaded successfully.");
    });
}


function initCartScripts() {
    $.getScript("../../Scripts/comprarAction.js", function() {
        console.log("comprarAction.js loaded successfully.");
    });
    $.getScript("../../Scripts/cart.js", function() {
        console.log("cart.js loaded successfully.");
    });
}

function initClientesScripts() {
    $.getScript("../../Scripts/clientes.js", function() {
        console.log("clientes.js loaded successfully.");
    });
}

function initAudiosScripts() {
    $.getScript("../../Scripts/audios.js", function() {
        console.log("audios.js loaded successfully.");
    });
}

function initSuscripcionesScripts() {
    $.getScript("../../Scripts/suscripciones.js", function() {
        console.log("suscripciones.js loaded successfully.");
    });
}

function initPagosScripts() {
    $.getScript("../../Scripts/pagos.js", function() {
        console.log("pagos.js loaded successfully.");
    });
}

function initTipoPlanScripts() {
    $.getScript("../../Scripts/tipoplan.js", function() {
        console.log("tipoplan.js loaded successfully.");
    });
}

function initEscuchasScripts() {
    $.getScript("../../Scripts/escuchas.js", function() {
        console.log("escuchas.js loaded successfully.");
    });
}


function initActividad_usuariosScripts() {
    $.getScript("../../Scripts/sp_actividadUsuarios.js", function() {
        console.log("sp_actividadUsuarios.js loaded successfully.");
    });
}

function initAudios_mas_escuchadosScripts() {
    $.getScript("../../Scripts/sp_audios_mas_escuchados.js", function() {
        console.log("sp_audios_mas_escuchados.js loaded successfully.");
    });
}
