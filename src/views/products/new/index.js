
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
    aditionalId: "",
  });

  // Estado único para manejar errores
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    handleGetDollarPrice()
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Lista de campos que deben ser numéricos
    const numericFields = ['price', 'stock', 'priceDollar', 'priceBuyLocalCurrency'];

    setFormData({
      ...formData,
      [name]: numericFields.includes(name) ? (value === '' ? '' : Number(value)) : value,
    });
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
      const { priceDollar, name, price, aditionalId, stock, priceBuyLocalCurrency } = formData;

      const response = await post("/products", {
        priceDollar, name, price, aditionalId, initialStock: stock, priceBuyLocalCurrency
      }, {
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
        aditionalId: ""
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
      priceDollar: Number(response?.data?.data?.COP?.value?.toFixed(2))
    })
  }

  return (
    <Card className="animated fadeIn">
      <Card.Header className="bg-gradient-primary text-white">
        <div className="row justify-content-between">
          <div className="col-3">
            <h3>Nuevo Producto</h3>
          </div>
          <div className="col-3 text-end">
            <button className="btn btn-primary btn-fill" onClick={() => { selectFile(token) }}>
              <i className="nc-icon nc-bullet-list-67"></i> Cargar listado
            </button>
          </div>
        </div>
      </Card.Header>
      <Card.Body className="pt-4">
        <Form onSubmit={handleSubmit}>
          <div className="bg-light p-4 mb-4 rounded shadow-sm">
            <h5 className="mb-3 text-primary">
              <i className="nc-icon nc-bag mr-2"></i>Información del Producto
            </h5>
            <Row className="mb-3">
              <Col md="6">
                <Form.Group className="mb-3">
                  <label className="form-label fw-bold">Nombre del producto</label>
                  <div className="input-group">
                    <span className="input-group-text bg-primary text-white">
                      <i className="nc-icon nc-tag-content"></i>
                    </span>
                    <Form.Control
                      name="name"
                      value={formData.name}
                      placeholder="Ej: Pelota de fútbol"
                      type="text"
                      onChange={handleChange}
                      className="shadow-sm"
                    />
                  </div>
                  {renderError("name")}
                </Form.Group>
              </Col>
              <Col md="6">
                <Form.Group className="mb-3">
                  <label className="form-label fw-bold">Identificador adicional</label>
                  <div className="input-group">
                    <span className="input-group-text bg-primary text-white">
                      <i className="nc-icon nc-barcode-qr"></i>
                    </span>
                    <Form.Control
                      name="aditionalId"
                      value={formData.aditionalId}
                      placeholder="Código opcional"
                      type="text"
                      onChange={handleChange}
                      className="shadow-sm"
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div className="bg-light p-4 mb-4 rounded shadow-sm">
            <h5 className="mb-3 text-success">
              <i className="nc-icon nc-money-coins mr-2"></i>Información de Precios
            </h5>
            <Row className="mb-3">
              <Col md="4">
                <Form.Group className="mb-3">
                  <label className="form-label fw-bold">Precio Dólar</label>
                  <div className="input-group">
                    <span className="input-group-text bg-success text-white">
                      <i className="nc-icon nc-money-coins"></i>
                    </span>
                    <Form.Control
                      name="priceDollar"
                      value={formData.priceDollar}
                      type="number"
                      placeholder="0.00"
                      onChange={handleChange}
                      className="shadow-sm"
                    />
                  </div>
                  {renderError("priceDollar")}
                </Form.Group>
              </Col>
              <Col md="4">
                <Form.Group className="mb-3">
                  <label className="form-label fw-bold">Precio Compra</label>
                  <div className="input-group">
                    <span className="input-group-text bg-success text-white">
                      <i className="nc-icon nc-cart-simple"></i>
                    </span>
                    <Form.Control
                      name="priceBuyLocalCurrency"
                      value={formData.priceBuyLocalCurrency}
                      type="number"
                      placeholder="0.00"
                      onChange={handleChange}
                      className="shadow-sm"
                    />
                  </div>
                  {renderError("priceBuyLocalCurrency")}
                </Form.Group>
              </Col>
              <Col md="4">
                <Form.Group className="mb-3">
                  <label className="form-label fw-bold">Precio Venta</label>
                  <div className="input-group">
                    <span className="input-group-text bg-success text-white">
                      <i className="nc-icon nc-shop"></i>
                    </span>
                    <Form.Control
                      name="price"
                      value={formData.price}
                      type="number"
                      min={0}
                      placeholder="0.00"
                      onChange={handleChange}
                      className="shadow-sm"
                    />
                  </div>
                  {renderError("price")}
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div className="bg-light p-4 mb-4 rounded shadow-sm">
            <h5 className="mb-3 text-info">
              <i className="nc-icon nc-box mr-2"></i>Inventario
            </h5>
            <Row>
              <Col md="6">
                <Form.Group className="mb-3">
                  <label className="form-label fw-bold">Stock</label>
                  <div className="input-group">
                    <span className="input-group-text bg-info text-white">
                      <i className="nc-icon nc-basket"></i>
                    </span>
                    <Form.Control
                      name="stock"
                      value={formData.stock}
                      type="number"
                      placeholder="0"
                      onChange={handleChange}
                      className="shadow-sm"
                    />
                  </div>
                  {renderError("stock")}
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div className="text-center mt-4">
            {isSubmitting ? (
              <div className="spinner-grow text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            ) : (
              <button
                className="btn btn-primary btn-lg btn-fill shadow-sm px-5"
                type="submit"
              >
                <i className="nc-icon nc-cloud-upload-94 mr-2"></i> Guardar Producto
              </button>
            )}
          </div>
        </Form>
      </Card.Body>
      {/*<Card.Body>
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
            <Col md="4">
              <Form.Group>
                <label>Identificador adicional</label>
                <Form.Control
                  name="aditionalId"
                  value={formData.aditionalId}
                  type="text"
                  onChange={handleChange}
                />
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
      </Card.Body>*/}
    </Card>
  );
};

export default NewProduct;
