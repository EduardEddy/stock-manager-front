import Swal from "sweetalert2";
import { post } from "http/ApiService";

/**
 * Abre un cuadro de diálogo para seleccionar un archivo XLSX y procesa el archivo con un spinner.
 * @param {string} token - Token de autenticación para la API
 * @returns {Promise<File|null>} Retorna el archivo seleccionado o null si el usuario cancela.
 */
export const selectFile = async (token) => {
  // Definir la estructura de columnas requerida para la plantilla
  const requiredColumns = [
    { name: "nombre", description: "Nombre del producto" },
    { name: "precio", description: "Precio de venta" },
    { name: "stock", description: "Cantidad disponible" },
    { name: "precioDolar", description: "Precio en dólares (opcional)" },
    { name: "precioCompra", description: "Precio de compra (opcional)" },
  ];

  // Crear la tabla de ejemplo con datos
  const exampleData = [
    { nombre: "Laptop HP", precio: "1200000", stock: "10", precioDolar: "350", precioCompra: "980000" },
    { nombre: "Mouse Logitech", precio: "45000", stock: "25", precioDolar: "13", precioCompra: "30000" }
  ];

  const tableHTML = `
    <div class="template-info mb-4">
      <h6 class="text-primary mb-2"><i class="fas fa-info-circle"></i> El archivo Excel debe contener las siguientes columnas:</h6>
      <div class="table-responsive">
        <table class="table table-sm table-bordered">
          <thead class="table-primary">
            <tr>
              ${requiredColumns.map(col => `<th scope="col">${col.name}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${exampleData.map(row => `
              <tr>
                ${requiredColumns.map(col => `<td>${row[col.name] || ''}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="mt-2 text-muted small">
        <ul class="ps-3 mb-0">
          <li><b>nombre, precio, stock</b>: campos obligatorios</li>
          <li><b>precioDolar, precioCompra</b>: campos opcionales</li>
        </ul>
      </div>
    </div>
  `;

  try {
    const result = await Swal.fire({
      title: '<i class="fas fa-file-excel text-success me-2"></i>Importar Productos',
      html: `
        <div class="upload-container">
          ${tableHTML}
          <div class="file-input-wrapper">
            <label for="excel-file" class="form-label">Selecciona un archivo Excel (.xlsx, .xls):</label>
          </div>
        </div>
      `,
      input: "file",
      inputAttributes: {
        accept: ".xlsx, .xls",
        "aria-label": "Selecciona un archivo Excel",
        id: "excel-file"
      },
      showCancelButton: true,
      cancelButtonText: '<i class="fas fa-times"></i> Cancelar',
      cancelButtonColor: "#dc3545",
      confirmButtonText: '<i class="fas fa-upload"></i> Importar Archivo',
      confirmButtonColor: "#28a745",
      allowOutsideClick: false,
      inputValidator: (value) => {
        if (!value) {
          return "Debes seleccionar un archivo antes de continuar";
        }

        // Validación adicional de tipo de archivo si es necesario
        const fileExt = value.name.split('.').pop().toLowerCase();
        if (!['xlsx', 'xls'].includes(fileExt)) {
          return "Solo se permiten archivos Excel (.xlsx, .xls)";
        }
      },
      customClass: {
        popup: 'upload-popup',
        title: 'upload-title',
        confirmButton: 'btn-confirm',
        cancelButton: 'btn-cancel'
      }
    });

    // Si el usuario canceló, retornar null
    if (result.isDismissed) {
      return null;
    }

    const file = result.value;
    if (!file) return null;

    // Mostrar spinner mientras se procesa
    Swal.fire({
      title: '<i class="fas fa-spin fa-spinner me-2"></i>Procesando',
      html: `
        <div class="text-center">
          <p>Procesando archivo <b>${file.name}</b></p>
          <div class="progress mt-3">
            <div class="progress-bar progress-bar-striped progress-bar-animated" 
                 role="progressbar" 
                 style="width: 100%" 
                 aria-valuenow="100" 
                 aria-valuemin="0" 
                 aria-valuemax="100">
            </div>
          </div>
        </div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false
    });

    try {
      // Crear y enviar FormData con el archivo
      const formData = new FormData();
      formData.append("file", file);

      // Realizar la petición a la API
      const response = await post("/upload-products", formData, {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      });

      // Mostrar mensaje de éxito con los detalles devueltos por la API
      const successDetails = response.data && response.data.details
        ? response.data.details
        : `Archivo "${file.name}" procesado correctamente.`;

      Swal.fire({
        title: '<i class="fas fa-check-circle text-success me-2"></i>¡Importación exitosa!',
        html: `
          <div class="result-container">
            <p>${successDetails}</p>
            ${response.data && response.data.stats ? `
              <div class="stats-container mt-3">
                <div class="row text-center">
                  <div class="col-4">
                    <div class="stat-item">
                      <span class="stat-value text-success">${response.data.stats.inserted || 0}</span>
                      <span class="stat-label">Agregados</span>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="stat-item">
                      <span class="stat-value text-warning">${response.data.stats.updated || 0}</span>
                      <span class="stat-label">Actualizados</span>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="stat-item">
                      <span class="stat-value text-danger">${response.data.stats.errors || 0}</span>
                      <span class="stat-label">Errores</span>
                    </div>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        `,
        icon: "success",
        confirmButtonText: 'Aceptar'
      });

      return file;
    } catch (error) {
      console.error("Error en la carga:", error);

      // Obtener mensaje de error del servidor si está disponible
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Hubo un problema al procesar el archivo. Intenta nuevamente.";

      Swal.fire({
        title: '<i class="fas fa-exclamation-triangle text-danger me-2"></i>Error',
        html: `<p>${errorMessage}</p>`,
        icon: "error",
        confirmButtonColor: "#dc3545"
      });

      return null;
    }
  } catch (error) {
    console.error("Error en el selector de archivos:", error);
    return null;
  }
};

/**
 * Genera una tabla de ejemplo para la estructura de datos
 * @param {Array} columns - Columnas a mostrar
 * @param {Array} data - Datos de ejemplo
 * @returns {JSX.Element} Tabla con datos de ejemplo
 */
export const generateExampleTable = (columns, data) => {
  return (
    <div className="example-table-container">
      <h6 className="mb-2">Estructura del archivo:</h6>
      <table className="table table-sm table-bordered">
        <thead className="table-primary">
          <tr>
            {columns.map((col, index) => (
              <th key={index} scope="col">{col.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={`${rowIndex}-${colIndex}`}>{row[col.name] || ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Estilos CSS que puedes agregar al componente
export const uploadStyles = `
  .upload-popup {
    max-width: 800px;
  }
  
  .upload-title {
    font-size: 1.5rem;
    color: #28a745;
  }
  
  .template-info {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 12px;
  }
  
  .btn-confirm, .btn-cancel {
    padding: 10px 16px;
    font-weight: 500;
  }
  
  .stats-container {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 15px;
  }
  
  .stat-item {
    display: flex;
    flex-direction: column;
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .stat-label {
    font-size: 0.85rem;
  }
`;