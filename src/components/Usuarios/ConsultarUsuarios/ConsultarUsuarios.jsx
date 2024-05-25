import React, { useEffect, useState } from "react";
import "./ConsultarUsuarios.css";
import ModalEliminar from "../../UI/ModalEliminar";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  eliminarCliente,
  obtenerClientes,
} from "../../../services/clienteServices";

const ConsultarUsuarios = () => {
  const [clientes, setClientes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false); // Nuevo estado para mostrar/ocultar el modal
  const [idAEliminar, setIdAEliminar] = useState(null); // Estado para almacenar el ID del cliente a eliminar
  const [filtroCedula, setFiltroCedula] = useState(""); // Estado para el valor del filtro de cédula

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await obtenerClientes();
        setClientes(data);
      } catch (error) {
        toast.error(error.response?.data || "Error al obtener clientes");
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    setIdAEliminar(id); // Establece el ID del cliente a eliminar
    setMostrarModal(true); // Muestra el modal de confirmación
  };

  const confirmarEliminacion = async (id) => {
    const originalData = [...clientes];
    try {
      const updatedClientes = originalData.filter(
        (cliente) => cliente._id !== id
      );
      setClientes(updatedClientes);
      const response = await eliminarCliente(id);
      toast.success(response.data);
    } catch (error) {
      toast.error(error.response?.data || "Error al eliminar cliente");
      setClientes(originalData);
    } finally {
      setMostrarModal(false); // Oculta el modal después de la operación
    }
  };

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.cedula.toLowerCase().includes(filtroCedula.toLowerCase())
  );

  return (
    <>
      <div className="titleo">Buscar Usuario</div>

      <div className="input-boxo">
        <input
          type="text"
          placeholder="Buscar por cedula"
          value={filtroCedula}
          onChange={(e) => setFiltroCedula(e.target.value)}
        />
      </div>

      <div className="contenedor">
        <table className="content-table">
          <thead>
            <tr>
              <th>Cédula</th>
              <th>Nombre</th>
              <th>Edad</th>
              <th>Dirección</th>
              <th>Celular</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map((cliente) => (
                <tr key={cliente._id}>
                  <td>{cliente.cedula}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.edad}</td>
                  <td>{cliente.direccion}</td>
                  <td>{cliente.celular}</td>
                  <td>
                    <Link to={`/EditarUsuario/${cliente._id}`}>
                      <button className="bEditar">Editar</button>
                    </Link>
                    <button
                      className="bEliminar"
                      onClick={() => handleDelete(cliente._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  No se encontraron clientes para la cédula ingresada.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {mostrarModal && (
          <ModalEliminar
            eliminarId={confirmarEliminacion}
            setMostrarModal={setMostrarModal}
            idAEliminar={idAEliminar}
          />
        )}
      </div>
    </>
  );
};

export default ConsultarUsuarios;
