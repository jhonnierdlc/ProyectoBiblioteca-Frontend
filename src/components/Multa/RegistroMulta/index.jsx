import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearCliente } from "../../../services/clienteServices";
import Joi from 'joi';
import { toast } from 'react-toastify';
import "./styles.css";

function RegistrarMulta() {
  const [data, setData] = useState({ cedula: "", nombre: "", edad: "", direccion: "",celular: "" });
  const navigate = useNavigate();

  const schema = {
    cedula: Joi.string().required(),
    nombre: Joi.string().required(),
    edad: Joi.string().required(),
    direccion: Joi.string().required(),
    celular: Joi.string().required(),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar datos con Joi
    const { error } = Joi.object(schema).validate(data, { abortEarly: false });

    if (error) {
      console.error("Error de validación:", error.details);
      return;
    }

   

    try {
      // Llama a la función del servicio para enviar la solicitud POST
      await crearCliente(data);

      toast.success("Cliente creado con éxito");
      navigate('/');
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Error al crear el cliente");
      // Manejar los errores según sea necesario
    }
  }

  const handleChange = (e) => {
    // Actualizar el estado 'data' al escribir en los campos del formulario
    const { name, value } = e.target;

    // Validar si la entrada es un número para el campo de edad
    if (name === 'edad' && isNaN(value)) {
      return; // No actualices el estado si no es un número
    }

    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
  }


  return (
    <div className="bdy">
      <div class="containerr">
        <div class="title"> Registro de Multa </div>
        <form>
          <div class="user-details">
            <div class="input-box">
              <span class="details">
                Cedula
              </span>
              <input type="text" placeholder="Digite la cedula" required name="cedula"  />
            </div>
            <div class="input-box">
              <span class="details">
                Nombre Completo
              </span>
              <input type="text" placeholder="Escriba el nombre" required name="nombre"   />
            </div>
            <div class="input-box">
              <span class="details">
                Nombre libro prestado
              </span>
              <input type="text" placeholder="Digite titulo" required name="titulo" />
            </div>
            <div class="input-box">
              <span class="details">
                Valor Multa
              </span>
              <input type="text" placeholder="Digite valor" required name="valor" />
            </div>
            
            <div class="input-box">
              <span class="details">
                Dias en prestamo
              </span>
              <input type="text" placeholder="Digite los dias" required name="dias" 
               />
            </div>
          </div>
          <div class="button">
            <input type="submit" class="btt" value="Multar"  />
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrarMulta;
