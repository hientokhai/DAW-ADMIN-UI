import { useState, useEffect } from 'react';
import { Button, Card, Form, Modal, Table ,InputGroup } from 'react-bootstrap';

const ProductsPage = () => {
    const [products, setproducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentProduct, setcurrentProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', discription: '',status: 'Còn hàng'});
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        const fakeData = [
            {
                id: 1,
                createdAt: '11/12/2024',
                category: 'Quần',
                name: 'Th0m Br0wne Blue Oxford 4-Bar Straight with Stripe Blue Shirt',
                price: '600.000đ',
                discription: '123 Đường ABC, Quận 1, TP.HCM',
                status: 'Còn hàng',
            },
            {
                id: 2,
                createdAt: '10/12/2024',
                category: 'Áo',
                name: 'Th0m Br0wne Blue Oxford 4-Bar Straight with Stripe Blue Shirt',
                price: '300.000đ',
                discription: '456 Đường DEF, Quận 2, TP.HCM',
                status: 'Hết hàng',
            },
            {
                id: 3,
                createdAt: '10/12/2024',
                category: 'Giày',
                name: 'Th0m Br0wne Blue Oxford 4-Bar Straight with Stripe Blue Shirt',
                price: '800.000đ',
                discription: '456 Đường DEF, Quận 2, TP.HCM',
                status: 'Còn hàng',
            },
        ];
        setproducts(fakeData);
    };

    const handleEditproduct = (product) => {
        setcurrentProduct(product);
        setShowModal(true);
    };

    const handleAddProduct = () => {
      setShowAddModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setcurrentProduct(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (currentProduct) {
            setcurrentProduct({ ...currentProduct, [name]: value });
        }
    };

    const handleSaveproductChange = () => {
        if (currentProduct) {
            setproducts((prevproducts) =>
                prevproducts.map((product) =>
                    product.id === currentProduct.id ? { ...product, ...currentProduct } : product
                )
            );
        }
        handleClose();
        alert('Thông tin sản phẩm đã được cập nhật!');
    };
    const handleCloseAdd = () => {
      setShowAddModal(false);
      setNewProduct({ name: '', category: '', price: '', discription: '',status: 'Còn hàng'})
    };
    const handleAddproduct = () => {
      const newId = products.length > 0 ? Math.max(products.map((c) => c.id)) + 1 : 1;
      setproducts([...products, { id: newId, ...newProduct}]);
      handleClose();
      alert('Thông tin sản phẩm đã được thêm mới!');
  };
    return (
        <>
        <InputGroup className="mb-3">
        <Button variant="dark" id="button-addon1">
          Tìm kiếm
        </Button>
        <Form.Control
          aria-label="Example text with button addon"
          aria-describedby="basic-addon1"
          placeholder="Nhập vào từ khóa tìm kiếm"
        />
      </InputGroup>

            <Card>
                <Card.Header>
                    <Card.Title as="h5">QUẢN LÝ SẢN PHẨM</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Ngày nhập</th>
                                <th>Loại sản phẩm</th>
                                <th>Tên sản phẩm</th>
                                <th>Tổng giá trị</th>
                                <th>Thông tin sản phẩm</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((product, index) => (
                                    <tr key={product.id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{product.createdAt}</td>
                                        <td>{product.category}</td>
                                        <td>{product.name}</td>
                                        <td>{product.price}</td>
                                        <td>{product.discription}</td>
                                        <td>
                                            <span
                                                style={{
                                                    color: product.status === 'Còn hàng' ? 'green' : 'red',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {product.status}
                                            </span>
                                        </td>

                                        <td>
                                            <Button variant="info" onClick={() => handleEditproduct(product)}>
                                                Cập Nhật
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center">
                                        Không có sản phẩm
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
            <Button variant="warning" onClick={() => handleAddProduct()}>
                                                    Thêm sản phẩm
            </Button>

            {/* Modal chỉnh sửa thông tin liên hệ */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa thông tin sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentProduct && (
                        <Form>
                            <Form.Group controlId="category">
                                <Form.Label>Loại sản phẩm</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="category"
                                    value={currentProduct.category}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group controlId="name">
                                <Form.Label>Tên sản phẩm</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={currentProduct.name}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="price">
                                <Form.Label>Giá</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="price"
                                    value={currentProduct.price}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="discription">
                                <Form.Label>Thông tin sản phẩm</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="discription"
                                    value={currentProduct.discription}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="status">
                                <Form.Label>Trạng thái</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentProduct.status}
                                    readOnly
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSaveproductChange}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showAddModal} onHide={handleCloseAdd}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm sản phẩm mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                <Form.Group controlId="formNewProductName">
                <Form.Label>Tên sản phẩm</Form.Label>
                <Form.Control
                type="text" 
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Nhập tên sản phẩm" />
                </Form.Group>
                <Form.Group controlId="formNewProductCategory">
                <Form.Label>Loại sản phẩm</Form.Label>
                <Form.Select as="select"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              >
                <option value="">Chọn loại sản phẩm</option>
                {products.map((producted) => (
                  <option key={producted.id} value={producted.id}>
                    {producted.category}
                  </option>
                ))}
                </Form.Select>
                </Form.Group>
                <Form.Group controlId="formNewProductPrice">
                <Form.Label>Giá</Form.Label>
                <Form.Control
                type="text" 
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                placeholder="Nhập giá sản phẩm" />
                </Form.Group>
                <Form.Group controlId="formNewProductDiscription">
                <Form.Label>Thông tin</Form.Label>
                <Form.Control as="textarea" rows={3} 
                value={newProduct.discription}
                onChange={(e) => setNewProduct({ ...newProduct, discription: e.target.value })}
                placeholder="Nhập thông tin sản phẩm" />
                </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAdd}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleAddproduct}>
                        Thêm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProductsPage;
