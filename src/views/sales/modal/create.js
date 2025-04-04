import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DropdownProducts from '../dropdown/DropdownProducts';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import AddIcon from '@mui/icons-material/Add';
import Table from 'react-bootstrap/Table';

const CreateSale = ({ show, handleClose, products }) => {
  const [selectedProduct, setSelectedProduct] = React.useState();
  const [price, setPrice] = React.useState(0);
  const [cant, setCant] = React.useState(0)
  const [list, setList] = React.useState([]);

  React.useEffect(() => {
    setPrice(selectedProduct?.price);
  }, [selectedProduct])

  const handleAddProductToSale = () => {
    if (!selectedProduct || cant <= 0) return;

    const newItem = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price,
      cant,
    };

    setList([...list, newItem]);
    setCant(0);
    setPrice(0);
    setSelectedProduct(null);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} style={{ width: 800 }}>
        <Modal.Header closeButton>
          <Modal.Title style={{ margin: 0 }}>Nueva venta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DropdownProducts products={products} setSelectedProduct={setSelectedProduct} selectedProduct={selectedProduct} />

          <Form>
            <Row>
              <Col>
                <label>Precio venta</label>
                <Form.Control placeholder="monto" value={price} onChange={(e) => setPrice(e.target.value)} type='number' min={0} />
              </Col>
              <Col>
                <label>Cantidad</label>
                <Form.Control placeholder="5" value={cant} onChange={(e) => setCant(e.target.value)} type='number' min={0} />
              </Col>
              <Col>
                <div className='mt-4'>
                  <button className='btn btn-primary btn-fill' onClick={(e) => {
                    e.preventDefault();
                    handleAddProductToSale();
                  }}>
                    <AddIcon />
                  </button>
                </div>
              </Col>
            </Row>
          </Form>

          <Row style={{ display: list.length > 0 ? "block" : "none" }}>
            <StripedRowExample list={list} />
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setCant(0);
            setPrice(0);
            setSelectedProduct(null);
            setList([]);
            handleClose()
          }}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            setCant(0);
            setPrice(0);
            setSelectedProduct(null);
            setList([]);
            handleClose()
          }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal >
    </>
  );
}


const StripedRowExample = ({ list }) => {
  return (
    <Table striped>
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>cantidad</th>
        </tr>
      </thead>
      <tbody>
        {
          list.map((item, i) => (
            <tr key={i++}>
              <td>{i++}</td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.cant}</td>
            </tr>
          ))
        }
      </tbody>
    </Table>
  );
}

//export default StripedRowExample;

export default CreateSale;
