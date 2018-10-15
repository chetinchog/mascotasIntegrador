$(function () {
    var FuncionesMascota = {};

    (function (app) {      
                    
        app.init = function () {
            //Se comparten todas las funciones del archivo funcionesGeneral con la app
            compartirFunciones(app);
            //Se cargan los datos de todos las mascotas         
            app.cargarDataTable("Mascota");
            //Se inicializan los oyentes para los eventos
            app.oyentes("Mascota");
        };

        app.init();

    })(FuncionesMascota);    
});