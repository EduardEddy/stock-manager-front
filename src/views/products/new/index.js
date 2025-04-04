
import axios from "axios";
import { post } from "http/ApiService";
import React, { useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import Swal from 'sweetalert2';
import { selectFile } from "./file";

const NewProduct = () => {
  const { token } = useSelector((state) => state.auth);

  // Estado único para manejar datos del formulario
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    stock: 0,
    priceBuyLocalCurrency: 0,
    priceDollar: 0,
  });

  // Estado único para manejar errores
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    handleGetDollarPrice()
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    let newErrors = {};

    if (!formData.name) newErrors.name = "El nombre del producto no puede estar vacío";
    if (formData.priceDollar <= 0) newErrors.priceDollar = "El precio debe ser mayor a 0";
    if (formData.priceBuyLocalCurrency <= 0) newErrors.priceBuyLocalCurrency = "El precio debe ser mayor a 0";
    if (formData.price <= 0) newErrors.price = "El precio debe ser mayor a 0";
    if (formData.stock < 0) newErrors.stock = "El stock debe ser mayor o igual a 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsSubmitting(true);

    try {
      const response = await post("/products", formData, {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      });

      Swal.fire({
        title: "Procesado con éxito!",
        icon: "success",
        draggable: true
      });

      setFormData({
        name: "",
        price: 0,
        stock: 0,
        priceBuyLocalCurrency: 0,
        priceDollar: 0,
      });

      setErrors({});
    } catch (error) {
      console.error("Error:", error);
      if (error?.status === 400) {
        const messages = error?.response?.data?.message || [];
        Swal.fire({
          title: "<strong>Errores</strong>",
          icon: "error",
          html: `<ul style="text-align: left; padding-left: 20px; color: red">${messages.map(msg => `<li>${msg}</li>`).join("")}</ul>`,
          showCloseButton: true,
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Ha ocurrido un error!",
          icon: "error",
          draggable: true
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderError = (field) => errors[field] && <small className="text-danger">{errors[field]}</small>;

  const handleGetDollarPrice = async () => {
    const response = await axios.get('https://api.currencyapi.com/v3/latest?apikey=cur_live_7OCoSZU3flCLflxxHckeUXiXjisfu1ymzM1px1SM');
    setFormData({
      priceDollar: response?.data?.data?.COP?.value?.toFixed(2)
    })
  }

  return (
    <Card>
      <Card.Header>
        <div className="row">
          <div className="col-md-3">
            <h3>Nuevo Producto</h3>
          </div>
          <div className="col-md-3 ml-auto">
            <button className="btn btn-primary btn-fill" onClick={() => { selectFile(token) }}>
              <i className="nc-icon nc-bullet-list-67"></i> Cargar listado
            </button>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md="4">
              <Form.Group>
                <label>Nombre del producto</label>
                <Form.Control
                  name="name"
                  value={formData.name}
                  placeholder="pelota"
                  type="text"
                  onChange={handleChange}
                />
                {renderError("name")}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md="4">
              <Form.Group>
                <label>Precio Dólar</label>
                <Form.Control
                  name="priceDollar"
                  value={formData.priceDollar}
                  type="number"
                  onChange={handleChange}
                />
                {renderError("priceDollar")}
              </Form.Group>
            </Col>

            <Col md="4">
              <Form.Group>
                <label>Precio Compra</label>
                <Form.Control
                  name="priceBuyLocalCurrency"
                  value={formData.priceBuyLocalCurrency}
                  type="number"
                  onChange={handleChange}
                />
                {renderError("priceBuyLocalCurrency")}
              </Form.Group>
            </Col>

            <Col md="4">
              <Form.Group>
                <label>Precio Venta</label>
                <Form.Control
                  name="price"
                  value={formData.price}
                  type="number"
                  min={0}
                  onChange={handleChange}
                />
                {renderError("price")}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md="4">
              <Form.Group>
                <label>Stock</label>
                <Form.Control
                  name="stock"
                  value={formData.stock}
                  type="number"
                  onChange={handleChange}
                />
                {renderError("stock")}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md="4" className="pt-5">
              {isSubmitting ? (
                <div className="spinner-border text-primary" role="status"></div>
              ) : (
                <button className="btn btn-primary btn-fill" type="submit">
                  <i className="nc-icon nc-cloud-upload-94"></i> Guardar
                </button>
              )}
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default NewProduct;
