import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import Spinner from 'react-bootstrap/Spinner';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { get, post } from "http/ApiService";

const ProductSelector = ({ products, selectedProduct, setSelectedProduct }) => {
  const [show, setShow] = useState(false);

  const handleSelect = (product) => {
    setSelectedProduct(product);
    setShow(false); // Cerrar el dropdown después de seleccionar
  };

  return (
    <Dropdown className="mb-3" onToggle={(nextShow) => setShow(nextShow)}>
      <Dropdown.Toggle variant="primary" id="product-dropdown">
        {selectedProduct ? selectedProduct.name : 'Seleccione un producto'}
      </Dropdown.Toggle>
      <Dropdown.Menu style={{ display: !show ? "none" : "" }}>
        {products.map((product) => (
          <Dropdown.Item
            key={product.id}
            onClick={() => {
              handleSelect(product);
            }}
          >
            {product.name} - Stock: {product.stock} - ${product.price}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const SalesMediaSelector = ({ salesMedia, selectedSalesMedia, setSelectedSalesMedia, setSelectedSalesMediaId }) => {
  const [show, setShow] = useState(false);

  const handleSelect = (salesMedia) => {
    setSelectedSalesMedia(salesMedia.name);
    setSelectedSalesMediaId(salesMedia.id);
    setShow(false); // Cerrar el dropdown después de seleccionar
  };

  return (
    <Dropdown className="mb-3" onToggle={(nextShow) => setShow(nextShow)}>
      <Dropdown.Toggle variant="primary" id="product-dropdown">
        {selectedSalesMedia ? selectedSalesMedia : 'Seleccione un medio de venta'}
      </Dropdown.Toggle>
      <Dropdown.Menu style={{ display: !show ? "none" : "" }}>
        {salesMedia.map((salesMedia) => (
          <Dropdown.Item
            key={salesMedia.id}
            onClick={() => {
              handleSelect(salesMedia);
            }}
          >
            {salesMedia.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const CreateSale = ({ show, handleClose, products, getData }) => {
  const { token } = useSelector((state) => state.auth);

  // Estado para el producto seleccionado y detalles
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [list, setList] = useState([]);

  // Estado para medios de venta
  const [salesMedia, setSalesMedia] = useState([]);
  const [selectedSalesMedia, setSelectedSalesMedia] = useState(null);
  const [selectedSalesMediaId, setSelectedSalesMediaId] = useState(null);
  const [addNewSalesMedia, setAddNewSalesMedia] = useState(false);
  const [newSalesMediaName, setNewSalesMediaName] = useState('');

  // Estado para el procesamiento
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [total, setTotal] = useState(0);

  // Actualizar precio cuando se selecciona un producto
  useEffect(() => {
    if (selectedProduct) {
      setPrice(selectedProduct.price);
    }
  }, [selectedProduct]);

  // Calcular total
  useEffect(() => {
    const newTotal = list.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [list]);

  // Cargar medios de venta
  useEffect(() => {
    handleGetMeansOfSale();
  }, []);

  const handleGetMeansOfSale = async () => {
    try {
      const resp = await get('sales-media', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      });
      setSalesMedia(resp);
      if (resp.length == 0) {
        setAddNewSalesMedia(true);
      }
    } catch (error) {
      console.log("Error al obtener medios de venta", error);
    }
  };

  const handleAddProductToSale = () => {
    if (!selectedProduct || quantity <= 0) return;

    const newItem = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      subtotal: parseFloat(price) * parseInt(quantity)
    };

    setList([...list, newItem]);
    setQuantity(1);
    setSelectedProduct(null);
  };

  const handleRemoveItem = (index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleSubmit = async () => {
    if (list.length === 0 || (!selectedSalesMedia && !newSalesMediaName)) {
      return; // Validar datos antes de enviar
    }

    setIsSubmitting(true);

    try {
      const saleMediaId = addNewSalesMedia ? newSalesMediaName : selectedSalesMediaId;

      // Aquí puedes adaptar el formato de datos según tu API
      const saleData = {
        items: list.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          //unitPrice: item.price,
          //totalAmount: item.subtotal,
          //newPrice: item.price,
          //saleMediaId: saleMediaId,
        })),
        saleMediaId: saleMediaId,
        //totalAmount: total
      };

      // Ejemplo de envío al endpoint
      const resp = await post("/sales-product", saleData, {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      });

      resetForm();
      handleClose();
    } catch (error) {
      console.error("Error al guardar la venta:", error);
    } finally {
      setIsSubmitting(false);
      getData();
    }
  };

  const resetForm = () => {
    setList([]);
    setSelectedProduct(null);
    setPrice(0);
    setQuantity(1);
    setSelectedSalesMedia(null);
    setNewSalesMediaName('');
    setAddNewSalesMedia(false);
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        resetForm();
        handleClose();
      }}
      size="lg"
      backdrop="static"
    >
      <Modal.Header closeButton className="bg-primary text-white" style={{ height: '5em' }}>
        <Modal.Title>Nueva Venta</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h5 className="mb-3">Agregar Productos</h5>

        {/* Selector de productos */}
        <ProductSelector
          products={products}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />

        {selectedProduct && (
          <Form className="mb-4">
            <Row className="align-items">
              <Col md={4} className='align-items-start'>
                <Form.Group>
                  <Form.Label>Precio de venta</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max={selectedProduct.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Disponible: {selectedProduct.stock}
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={4} className='align-items-end'>
                <Button
                  variant="primary"
                  className="d-flex align-items-center"
                  onClick={handleAddProductToSale}
                >
                  <AddIcon className="me-1" /> Agregar
                </Button>
              </Col>
            </Row>
          </Form>
        )}

        {/* Lista de productos */}
        {list.length > 0 && (
          <>
            <h5 className="mt-4 mb-2">Productos seleccionados</h5>
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-primary">
                  <tr>
                    <th style={{ width: "5%" }}>#</th>
                    <th style={{ width: "40%" }}>Producto</th>
                    <th style={{ width: "15%" }}>Precio</th>
                    <th style={{ width: "15%" }}>Cantidad</th>
                    <th style={{ width: "15%" }}>Subtotal</th>
                    <th style={{ width: "10%" }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((item, index) => (
                    <tr key={`${item.id}-${index}`}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>${item.subtotal.toFixed(2)}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  <tr className="fw-bold">
                    <td colSpan={4} className="text-end">Total:</td>
                    <td colSpan={2}>${total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </Table>
            </div>

            {/* Medio de venta */}
            <h5 className="mt-4 mb-3">Medio de venta</h5>
            <Row className="align-items-end mb-4">
              <Col>
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    Seleccione medio de venta
                    {salesMedia.length > 0 && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="ms-2"
                        onClick={() => {
                          setAddNewSalesMedia(!addNewSalesMedia);
                          setSelectedSalesMedia(null);
                          setNewSalesMediaName('');

                        }}
                      >
                        {addNewSalesMedia ? "Cancelar" : "Agregar nuevo"}
                      </Button>
                    )}
                  </Form.Label>

                  {(salesMedia.length === 0 || addNewSalesMedia) ? (
                    <Form.Control
                      type="text"
                      placeholder="Ingrese nuevo medio de venta"
                      value={newSalesMediaName}
                      onChange={(e) => setNewSalesMediaName(e.target.value)}
                    />
                  ) : (
                    <SalesMediaSelector
                      salesMedia={salesMedia}
                      selectedSalesMedia={selectedSalesMedia}
                      setSelectedSalesMedia={setSelectedSalesMedia}
                      setSelectedSalesMediaId={setSelectedSalesMediaId}
                    />
                  )}
                </Form.Group>
              </Col>
            </Row>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            resetForm();
            handleClose();
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting || list.length === 0 || (!selectedSalesMedia && !newSalesMediaName)}
          className="bg-primary text-white"
        >
          {isSubmitting ? (
            <>
              <Spinner as="span" size="sm" animation="border" className="me-2" style={{ color: 'blue' }} />
              Guardando...
            </>
          ) : 'Guardar Venta'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateSale;