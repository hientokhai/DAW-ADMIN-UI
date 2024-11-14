import { useState, useEffect } from 'react';
import { Button, Card, Form, Modal, Table, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [expandedProductId, setExpandedProductId] = useState(null); // Track the expanded product
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        handleSearch(searchTerm);
    }, [products, searchTerm]);

    const fetchProducts = () => {
        const fakeData = [
            {
                id: 1,
                createdAt: '11/12/2024',
                url: 'hehe',
                category: 'Quần',
                supplier: 'Nhà cung cấp 1',
                name: 'LEGGINGS',
                variants: [
                    { color: 'Đỏ', size: 'S', quantity: 30, importprice: '400.000đ', sellprice: '600.000đ' },
                    { color: 'Đỏ', size: 'M', quantity: 50, importprice: '400.000đ', sellprice: '600.000đ' },
                    { color: 'Xanh', size: 'L', quantity: 20, importprice: '400.000đ', sellprice: '600.000đ' },
                ],
                description: '123 Đường ABC, Quận 1, TP.HCM',
                status: 'Còn hàng',
                is_featured: 'checked',
            },
            {
                id: 2,
                createdAt: '11/12/2024',
                url: 'hehe',
                category: 'Áo',
                supplier: 'Nhà cung cấp 2',
                name: 'Áo Tank Top',
                variants: [
                    { color: 'Đỏ', size: 'S', quantity: 0, importprice: '400.000đ', sellprice: '600.000đ' },
                    { color: 'Đỏ', size: 'M', quantity: 1, importprice: '400.000đ', sellprice: '600.000đ' },
                    { color: 'Xanh', size: 'L', quantity: 2, importprice: '400.000đ', sellprice: '600.000đ' },
                ],
                description: '123 Đường ABC, Quận 1, TP.HCM',
                status: 'Hết hàng',
                is_featured: 'checked',
            },
            {
                id: 3,
                createdAt: '11/12/2024',
                url: 'hehe',
                category: 'Giày',
                supplier: 'Nhà cung cấp 3',
                name: 'Addidas',
                variants: [
                    { color: 'Đỏ', size: '29', quantity: 20, importprice: '400.000đ', sellprice: '600.000đ' },
                    { color: 'Đỏ', size: '30', quantity: 5, importprice: '400.000đ', sellprice: '600.000đ' },
                    { color: 'Xanh', size: '31', quantity: 20, importprice: '400.000đ', sellprice: '600.000đ' },
                ],
                description: '123 Đường ABC, Quận 1, TP.HCM',
                status: 'Còn hàng',
                is_featured: 'checked',
            },
            // Các sản phẩm khác
        ];
        setProducts(fakeData);
    };
    const getProductStatus = (variants) => {
        // Kiểm tra xem có bất kỳ biến thể nào có số lượng lớn hơn 0
        const isAvailable = variants.some(variant => variant.quantity > 0);
        return isAvailable ? "Còn hàng" : "Hết hàng";
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term.trim() === "") {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    };

    // Hiển thị modal chỉnh sửa khi nhấn vào nút "Cập nhật"
    const handleEditProduct = (product) => {
        setCurrentProduct(product);
        setShowModal(true);
    };

    // Xử lý đóng modal
    const handleClose = () => {
        setShowModal(false);
        setCurrentProduct(null);
    };

    // Xử lý khi người dùng thay đổi thông tin sản phẩm trong modal
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (currentProduct) {
            setCurrentProduct({ ...currentProduct, [name]: value });
        }
    };

    const handleSaveProductChange = () => {
        if (currentProduct) {
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === currentProduct.id ? { ...product, ...currentProduct } : product
                )
            );
        }
        handleClose();
        alert('Thông tin sản phẩm đã được cập nhật!');
    };

    // Điều hướng sang trang thêm sản phẩm mới
    const handleAddProduct = () => {
        navigate(`/app/products/addproducts`);
    };

    const toggleExpandProduct = (productId) => {
        if (expandedProductId === productId) {
            setExpandedProductId(null);
        } else {
            setExpandedProductId(productId);
        }
    };

    return (
        <>
            <InputGroup className="mb-3">
                <Button variant="dark" id="button-addon1" onClick={() => handleSearch(searchTerm)}>
                    Tìm kiếm
                </Button>
                <Form.Control
                    placeholder="Nhập vào từ khóa tìm kiếm"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
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
                                <th>Hình ảnh</th>
                                <th>Nhà cung cấp</th>
                                <th>Loại sản phẩm</th>
                                <th>Tên sản phẩm</th>
                                <th>Thông tin sản phẩm</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product, index) => (
                                    <>
                                        <tr key={product.id}>
                                            <td>{index + 1}</td>
                                            <td>{product.createdAt}</td>
                                            <td>{product.url}</td>
                                            <td>{product.supplier}</td>
                                            <td>{product.category}</td>
                                            <td
                                                style={{ cursor: 'pointer', color: 'blue' }}
                                                onClick={() => toggleExpandProduct(product.id)}
                                            >
                                                {product.name}
                                            </td>
                                            <td>{product.description}</td>
                                            <td style={{ color: getProductStatus(product.variants) === "Còn hàng" ? 'green' : 'red', fontWeight: 'bold' }}>
                                            {getProductStatus(product.variants)}
                                            </td>
                                            <td>
                                                <Button variant="info" onClick={() => handleEditProduct(product)}>
                                                    Cập Nhật
                                                </Button>
                                            </td>
                                        </tr>

                                        {/* Table for product variants - shown when product name is clicked */}
                                        {expandedProductId === product.id && (
                                            <tr>
                                                <td colSpan="8">
                                                    <Table bordered>
                                                        <thead>
                                                            <tr>
                                                                <th>Màu sắc</th>
                                                                <th>Kích cỡ</th>
                                                                <th>Số lượng</th>
                                                                <th>Giá nhập</th>
                                                                <th>Giá bán</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {product.variants.map((variant, idx) => (
                                                                <tr key={idx}>
                                                                    <td>{variant.color}</td>
                                                                    <td>{variant.size}</td>
                                                                    <td>{variant.quantity}</td>
                                                                    <td>{variant.importprice}</td>
                                                                    <td>{variant.sellprice}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">Không có sản phẩm</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
            <Button variant="warning" onClick={handleAddProduct} className="mt-3">
                Thêm sản phẩm
            </Button>

            {/* Modal chỉnh sửa thông tin sản phẩm */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa thông tin sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentProduct && (
                        <Form>
                            <Form.Group controlId="supplier">
                                <Form.Label>Nhà cung cấp</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="supplier"
                                    value={currentProduct.supplier}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            {/* Hiển thị các biến thể sản phẩm */}
                            {currentProduct.variants.map((variant, index) => (
                                <div key={index} style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '10px' }}>
                                    <Form.Group controlId={`color-${index}`}>
                                        <Form.Label>Màu sắc</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={variant.color}
                                            onChange={(e) => handleInputChange(e, index, 'color')}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId={`size-${index}`}>
                                        <Form.Label>Kích cỡ</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={variant.size}
                                            onChange={(e) => handleInputChange(e, index, 'size')}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId={`quantity-${index}`}>
                                        <Form.Label>Số lượng</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={variant.quantity}
                                            onChange={(e) => handleInputChange(e, index, 'quantity')}
                                        />
                                    </Form.Group>
                                </div>
                            ))}
                                <Form.Group controlId="description">
                                <Form.Label>Thông tin sản phẩm</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    value={currentProduct.description}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSaveProductChange}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProductsPage;