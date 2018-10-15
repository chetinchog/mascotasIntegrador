<?php

interface DbSentencias {

    //Mascota
    const INSERTAR_MASCOTA = "INSERT INTO `mascota` (`nombre`,`raza`,`sexo`,`edad`) VALUES (?,?,?,?);";
    const ELIMINAR_MASCOTA = "DELETE FROM `mascota` WHERE id = ?";
    const ACTUALIZAR_MASCOTA = "UPDATE `mascota` SET `nombre`= ?,`raza`= ?, `sexo`= ?, `edad`= ? WHERE id = ?";
    const BUSCAR_MASCOTA = "SELECT * FROM `mascota` WHERE `mascota`.`id` = ?;";
    const BUSCAR_MASCOTAS = "SELECT * FROM `mascota` WHERE ? = ?;";
    const LISTAR_MASCOTAS = "SELECT * FROM `mascota`";
    const BUSCAR_ULTIMOMASCOTA = "SELECT *  FROM `mascota` WHERE `mascota`.`id` = (SELECT MAX(id) FROM `mascota`);";
}
