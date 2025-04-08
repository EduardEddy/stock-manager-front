import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import DataTable from 'react-data-table-component';
import { get } from "http/ApiService";
import handleFormatCurrency from "utils/formatCurrency";
import CreateSale from "./modal/create";

const Sales = () => {
  const { token } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [products, setProducts] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const customStyles = {
    rows: {
      style: {
        padding: '2px 0px'
      },
    }
  };

  useEffect(() => {
    handleGetData();
    handleGetProducts();
  }, []);

  const handleGetData = async () => {
    setIsLoading(true);
    try {
      const response = await get('/sales-product', {
        'Content-Type': 'application',
        'Authorization': `Bearer ${token}`,
      });
      setData(response);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }
  let f = 1;
  const columns = [
    {
      name: '#',
      selector: _ => f++,
      sortable: true,
    },
    {
      name: 'Nombre',
      selector: row => row.product.name,
      sortable: true,
    },
    {
      name: 'Cantidad',
      selector: row => row.quantity,
      sortable: true,
    },
    {
      name: 'Precio Venta',
      selector: row => handleFormatCurrency(row.unitPrice),
      sortable: true,
    },
    {
      name: 'Precio Vendido',
      selector: row => handleFormatCurrency(row.newPrice),
      sortable: true,
    },

    {
      name: 'Total',
      selector: row => handleFormatCurrency(row.totalAmount),
      sortable: true,
    },
  ];

  const handleGetProducts = async () => {
    setIsLoading(true);
    try {
      const response = await get('/products', {
        'Content-Type': 'application',
        'Authorization': `Bearer ${token}`,
      });
      setProducts(response);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <Card.Header>
        <div className="row justify-content-between">
          <div className="col-3">
            <h3>Ventas</h3>
          </div>
          <div className="col-3 text-end">
            <button className="btn btn-primary" onClick={handleShow}>
              <icon className="nc-icon nc-simple-add"></icon> Nueva venta
            </button>
            <CreateSale show={show} handleClose={handleClose} products={products} />
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        {
          isLoading
            ? <div className="spinner-border text-primary" role="status"></div>
            :
            <DataTable
              columns={columns}
              data={data}
              className="table-hover mt-2"
              direction="auto"
              fixedHeaderScrollHeight="300px"
              pagination
              responsive
              subHeaderAlign="right"
              subHeaderWrap
              customStyles={customStyles}
            />
        }
      </Card.Body>
    </Card>
  );
}

export default Sales;