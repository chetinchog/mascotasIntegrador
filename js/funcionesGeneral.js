function compartirFunciones(app) {
    //Se inicializa el complemento DataTable con los datos correspondientes
    app.cargarDataTable = function (tipo) {
        var url = "controlador/ruteador/Ruteador.php?accion=listar&Formulario=" + tipo;
        $("#tabla" + tipo).DataTable({
            //Configura el idioma a español
            "language": {
                "url": "js/DataTables/Spanish.json"
            },
            "autoWidth": false,
            //Configura los parametros para la llamada de ajax
            "ajax": {
                "url": url,
                "dataSrc": ""
            },
            //Configura las columnas que va tener la tabla
            "columns": [{
                    "data": "nombre"
                },
                {
                    "data": "raza"
                },
                {
                    "data": "sexo"
                },
                {
                    "data": "edad"
                },
                {
                    "data": "Acciones",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, row, meta) {
                        var a = '<a class="pull-left editar btn btn-success" data-id="' + row.id + '"><span class="glyphicon glyphicon-pencil"></span> Editar</a>' +
                            '<a class="pull-right eliminar btn btn-danger" data-id="' + row.id + '"><span class="glyphicon glyphicon-remove"></span> Eliminar</a>';
                        return a;
                    }
                }
            ]
        });
    };

    //Actualiza la tabla de la vista usando DataTable
    app.actualizarDataTable = function (tipo) {
        var tabla = $("#tabla" + tipo).DataTable();
        tabla.ajax.reload();
    };

    //Se agrega un registro a la base de datos
    app.guardarMascota = function (tipo) {
        var url = "controlador/ruteador/Ruteador.php?accion=agregar&Formulario=" + tipo;
        var datosEnviar = $("#form" + tipo).serialize();
        $.ajax({
            url: url,
            method: 'POST',
            dataType: 'json',
            data: datosEnviar,
            success: function (datosRecibidos) {
                $("#modal" + tipo).modal('hide');
                app.limpiarModal(tipo);
                app.actualizarDataTable(tipo);
            },
            error: function (datosRecibidos) {
                alert("Hubo un error al guardar los datos del registro")
                alert(datosRecibidos);
            }
        });
    };

    //Se actualizan los datos de un registro
    app.modificarMascota = function (tipo) {
        var url = "controlador/ruteador/Ruteador.php?accion=modificar&Formulario=" + tipo;
        var datosEnviar = $("#form" + tipo).serialize();
        $.ajax({
            url: url,
            method: 'POST',
            data: datosEnviar,
            success: function (datosRecibidos) {
                $("#modal" + tipo).modal('hide');
                app.limpiarModal(tipo);
                app.actualizarDataTable(tipo);
            },
            error: function (datosRecibidos) {
                alert("Hubo un error al actualizar los datos del registro");
                alert(datosRecibidos);
            }
        });
    };

    //Se elimina un registro de la base de datos
    app.eliminarMascota = function (tipo, id) {
        //Se confirma que se desee eliminar ese registro
        if (confirm("¿Esta seguro que desea eliminar ese registro?")) {
            var url = "controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=" + tipo;
            var datosEnviar = {
                id: id
            };
            $.ajax({
                url: url,
                method: "POST",
                data: datosEnviar,
                success: function (datosRecibidos) {
                    alert('El registro se elimino exitosamente');
                    app.actualizarDataTable(tipo);
                },
                error: function (datosRecibidos) {
                    alert('Hubo un error al eliminar el registro');
                }
            });
        }
    };

    //Se vacian los campos del modal
    app.limpiarModal = function (tipo) {
        $("#id").val(0);
        $("#nombre").val('');
        $("#raza").val('');
        $("#sexo").val('');
        $("#edad").val('');
    };

    //Se imprimen los datos de la tabla en un archivo pdf
    app.imprimir = function (tipo) {
        var aux = $("#tabla" + tipo).html();
        aux = aux.replace('<th class="sorting_disabled" rowspan="1" colspan="1" aria-label="Acciones">Acciones</th>', '');
        var inicio = aux.indexOf("<td><a class", 0);
        while (inicio > 0) {
            var fin = aux.indexOf("</td>", inicio) + 5;
            var strBorrar = aux.substring(inicio, fin);
            aux = aux.replace(strBorrar, "");
            inicio = aux.indexOf("<td><a class", 0);
        }
        $("#html").val(aux);
        $("#imprimir" + tipo).submit();
    };

    //Se muestra el modal vacio para poder agregar un registro
    app.modalAgregar = function (tipo) {
        app.limpiarModal(tipo);
        $("#tituloModal").html("Nuevo " + tipo);
        $("#modal" + tipo).modal({
            show: true
        });
    };

    //Se muestra el modal con todos los datos del registro que se quiera editar
    app.modalEditar = function (tipo, contexto) {
        $("#id").val($(contexto).attr("data-id"));
        $("#nombre").val($(contexto).parent().parent().children().first().html());
        $("#raza").val($(contexto).parent().parent().children().first().next().html());
        $("#sexo").val($(contexto).parent().parent().children().first().next().next().html());
        $("#edad").val($(contexto).parent().parent().children().first().next().next().next().html());
        $("#tituloModal").html("Editar " + tipo);
        $("#modal" + tipo).modal({
            show: true
        });
    };

    //Se activan los oyentes para todos los eventos
    app.oyentes = function (tipo) {
        //Oyente para cuando se hace click en el boton Agregar
        $("#agregar" + tipo).on('click', function (event) {
            app.modalAgregar(tipo);
        });

        //Oyente para cuando se hace click en el boton Imprimir
        $("#imprimir").on('click', function (event) {
            app.imprimir(tipo);
        });

        //Oyente para cuando se hace click en el boton Editar
        $("#cuerpoTabla").on('click', '.editar', function (event) {
            app.modalEditar(tipo, this);
        });

        //Oyente para cuando se hace click en el boton Eliminar
        $("#cuerpoTabla").on('click', '.eliminar', function () {
            app.eliminarMascota(tipo, $(this).attr("data-id"));
        });

        //Oyente para cuando se hace click en el boton Guardar
        $("#guardar").on("click", function (event) {
            if ($("#id").val() == 0) {
                app.guardarMascota(tipo);
            } else {
                app.modificarMascota(tipo);
            }
        });

        //Se configuran las validaciones de bootstrap
        $("#form" + tipo).bootstrapValidator({
            excluded: []
        });
    };
};