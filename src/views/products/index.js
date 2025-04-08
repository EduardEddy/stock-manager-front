import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { get } from "http/ApiService";

import DataTable from 'react-data-table-component';
import { useSelector } from "react-redux";
import handleFormatCurrency from "utils/formatCurrency";

const Products = () => {
  const { token } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  const customStyles = {
    rows: {
      style: {
        padding: '2px 0px'
      },
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  const handleGetData = async () => {
    setIsLoading(true);
    try {
      const response = await get('/products', {
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
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Stock',
      selector: row => row.stock,
      sortable: true,
    },
    {
      name: 'Precio Venta',
      selector: row => handleFormatCurrency(row.price),
      sortable: true,
    },
    {
      name: 'Editar',
      selector: row => <button className="btn btn-primary btn-fill" onClick={() => { console.log(row.id) }} style={{ padding: "2px 8px" }}>
        <i className="nc-icon nc-notes" style={{ fontSize: 20 }}></i>
      </button>,
      sortable: false,
    },
    {
      name: 'Desactivar',
      selector: row => <button className="btn btn-danger btn-fill" onClick={() => { console.log(row.id) }} style={{ padding: "2px 8px" }}>
        <i className="nc-icon nc-simple-remove" style={{ fontSize: 20 }}></i>
      </button>,
      sortable: false,
    },
  ];

  return (
    <Card>
      <Card.Header>
        <div className="row justify-content-between">
          <div className="col-3">
            <h3>Productos</h3>
          </div>
          <div className="col-3 text-end">
            <a href="/admin/products/new" className="btn btn-primary">
              <icon className="nc-icon nc-simple-add"></icon> Agregar nuevo
            </a>
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

export default Products;