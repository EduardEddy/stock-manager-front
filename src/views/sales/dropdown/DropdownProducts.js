import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <button
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className="btn btn-primary"
  >
    {children} &#x25bc;
  </button>
));

const CustomMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy, show }, ref) => {
    const [value, setValue] = useState("");

    return (
      <div
        ref={ref}
        style={{
          ...style,
          maxHeight: "300px",
          overflowY: "auto",
          display: show ? "block" : "none",
        }}
        className={`${className} p-2`}
        aria-labelledby={labeledBy}
      >
        <Form.Control
          autoFocus
          className="mb-2"
          placeholder="Buscar producto..."
          onChange={(e) => {
            setValue(e.target.value)
          }}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().includes(value.toLowerCase())
          )}
        </ul>
      </div>
    );
  }
);

const DropdownProducts = ({ products, setSelectedProduct, selectedProduct }) => {
  const [show, setShow] = useState(false);

  const handleSelect = (eventKey) => {
    const product = products.find((p) => p.id === eventKey);
    setSelectedProduct(product || null);
    setShow(false);
  };

  const handleToggle = (isOpen) => {
    setShow(isOpen);
  };

  return (
    <Dropdown onSelect={handleSelect} show={show} onToggle={handleToggle}>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        {selectedProduct ? selectedProduct.name : "Seleccione Producto"}
      </Dropdown.Toggle>

      <Dropdown.Menu as={CustomMenu}>
        {products.map((product) => (
          <Dropdown.Item
            key={product.id}
            eventKey={product.id.toString()}
            as="button"
          >
            {product.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownProducts;
