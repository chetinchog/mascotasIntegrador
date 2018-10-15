<?php
require_once 'ControladorGeneral.php';

class ControladorMascota extends ControladorGeneral {

    function __construct($datos) {
        parent::__construct();
    }

    //Se agrega un mascota a la base de datos
    public function agregar($datos) {
        try {            
            $this->refControladorPersistencia->iniciarTransaccion();
            //Se agrega el mascota
            $parametros = array("nombre" => $datos['nombre'], "raza" => $datos['raza'], "sexo" => $datos['sexo'], "edad" => $datos['edad']);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_MASCOTA, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
            
            //Se devuelve el mascota recien agregado
            return $this->buscarUltimoMascota();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    //Se busca un mascota bajo un criterio en particular
    public function buscar($datos) {
        try {
            $parametros = array( "criterio" => $datos['criterio'],"valor" => $datos['buscar']);
            $query = str_replace("? = ?", $parametros['criterio']." = '".$parametros['valor']."'", DbSentencias::BUSCAR_MASCOTAS);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia($query);
            $arrayMascotas = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $arrayMascotas;
        } catch (Exception $e) {
            echo "Failed: " . $e->getMessage();
        }
    }

    //Se busca al ultimo mascota agregado a la base de datos
    private function buscarUltimoMascota() {
        try {
            $parametros = null;
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_ULTIMOMASCOTA, $parametros);
            $fila = $resultado->fetch();
            return $fila;
        } catch (Exception $e) {
            echo "Failed: " . $e->getMessage();
        }
    }

    //Se busca a todos las mascotas
    public function listar($datos) {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_MASCOTAS);
            $arrayMascotas = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $arrayMascotas;
        } catch (Exception $e) {
            echo "Failed: " . $e->getMessage();
        }
    }

    //Se elimina a un mascota
    public function eliminar($datos) {
        try {
            //Se elimina al mascota
            $parametros = array("id" => $datos['id']);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_MASCOTA, $parametros);
            $idMascota = (int)$parametros['id'];
            return $idMascota;
        } catch (Exception $e) {
            echo "Failed: " . $e->getMessage();
        }
    }

    //Se modifican los datos de un mascota
    public function modificar($datos) {
        try {            
            //Se modifica el mascota
            $parametros = array("nombre" => $datos['nombre'], "raza" => $datos['raza'], "sexo" => $datos['sexo'], "edad" => $datos['edad'], "id" => $datos['id']);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_MASCOTA, $parametros);
        } catch (Exception $e) {
            echo "Failed: " . $e->getMessage();
        }
    }
}