import Swal from "sweetalert2";
import { post } from "http/ApiService";

/**
 * Abre un cuadro de diálogo para seleccionar un archivo XLSX y procesa el archivo con un spinner.
 * @returns {Promise<File|null>} Retorna el archivo seleccionado o null si el usuario cancela.
 */
export const selectFile = async (token) => {
  let selectedFile = null; // Variable para almacenar el archivo

  await Swal.fire({
    title: "Selecciona un archivo XLSX",
    html: `<strong>El documento excel debe tener las siguientes columnas</strong>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">nombre</th>
          <th scope="col">precio</th>
          <th scope="col">stock</th>
        </tr>
      </thead>
    </table>`,
    input: "file",
    inputAttributes: {
      accept: ".xlsx|.xls",
      "aria-label": "Sube un archivo Excel",
    },
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    cancelButtonColor: "red",
    confirmButtonText: "Enviar",
    allowOutsideClick: false, // Evita que el usuario cierre el diálogo haciendo clic afuera
    didOpen: () => {
      document.querySelector(".swal2-file").addEventListener("change", (event) => {
        // Guarda el archivo seleccionado en una variable global dentro de SweetAlert2
        //        Swal.getPopup().dataset.file = event.target.files[0];
        selectedFile = event.target.files[0]; // Guarda el archivo en la variable local

      });
    },
    preConfirm: async () => {
      const file = Swal.getPopup().dataset.file;

      if (!selectedFile) {
        Swal.showValidationMessage("Debes seleccionar un archivo antes de continuar.");
        return false;
      }

      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        Swal.fire({
          title: "Procesando archivo...",
          text: "Por favor espera",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await post("/upload-products", formData, {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        });

        Swal.fire({
          title: "Archivo procesado",
          text: `Archivo "${selectedFile.name}" subido con éxito.`,
          icon: "success",
        });
      } catch (error) {
        console.error("Error en la carga:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al subir el archivo.",
          icon: "error",
        });
      }
    },
  });
};

const tableModel = () => {
  return <table class="table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">First</th>
        <th scope="col">Last</th>
        <th scope="col">Handle</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">1</th>
        <td>Mark</td>
        <td>Otto</td>
        <td>@mdo</td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td>Jacob</td>
        <td>Thornton</td>
        <td>@fat</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td>Larry</td>
        <td>the Bird</td>
        <td>@twitter</td>
      </tr>
    </tbody>
  </table>
}
