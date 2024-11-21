import { useState, useEffect } from 'react';
import { Button, Card, Form, Table, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ProductApi from 'api/productApi';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    // const [showModal, setShowModal] = useState(false);
    // const [currentProduct, setCurrentProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [expandedProductId, setExpandedProductId] = useState(null);
    const [sizes, setSizes] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetchProducts();
        fetchSizes();
    }, []);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [products, searchTerm]);

    // Fetch dữ liệu kích thước từ API
    const fetchSizes = async () => {
        try {
            const response = await ProductApi.getSizes(); // Giả sử API trả về một danh sách các kích thước
            setSizes(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách kích thước:', error);
        }
    };
  const fetchProducts = async () => {
    try {
      // Fetch sản phẩm
      const response = await ProductApi.getAll();
      console.log('Dữ liệu sản phẩm:', response.data);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    }
  };
    
    const getSizeNameById = (sizeId) => {
        const size = sizes.find((s) => s.id === sizeId);
        return size ? size.size_name : 'Không xác định'; // Trả về tên size hoặc 'Không xác định' nếu không tìm thấy
    };

  // const fetchProductList = async () => {
  //     try {
  //       const response = await ProductApi.getAll();
  //       setProducts(response.data);
  //     } catch (error) {
  //       console.log('fail', error);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchProductList();
  //   }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!products.length) return; // Nếu products rỗng, dừng tìm kiếm
    if (term.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) => product.name.toLowerCase().includes(term.toLowerCase()));
      setFilteredProducts(filtered);
    }
  };

  // Hiển thị modal chỉnh sửa khi nhấn vào nút "Cập nhật"
  // const handleEditProduct = (product) => {
  //     setCurrentProduct(product);
  //     setShowModal(true);
  // };

  // Xử lý đóng modal
  // const handleClose = () => {
  //     setShowModal(false);
  //     setCurrentProduct(null);
  // };

  // Xử lý khi người dùng thay đổi thông tin sản phẩm trong modal
  // const handleInputChange = (e, index = null, field = null) => {
  //     const { value } = e.target;
  //     if (index !== null && field) {
  //         // Trường hợp cập nhật biến thể
  //         const updatedVariants = currentProduct.variants.map((variant, idx) => {
  //             if (idx === index) {
  //                 return { ...variant, [field]: value };
  //             }
  //             return variant;
  //         });
  //         setCurrentProduct({ ...currentProduct, variants: updatedVariants });
  //     } else {
  //         // Trường hợp cập nhật các trường khác ngoài variants
  //         const { name } = e.target;
  //         setCurrentProduct({ ...currentProduct, [name]: value });
  //     }
  // };

  // const handleSaveProductChange = () => {
  //     if (currentProduct) {
  //         setProducts((prevProducts) =>
  //             prevProducts.map((product) =>
  //                 product.id === currentProduct.id ? { ...product, ...currentProduct } : product
  //             )
  //         );
  //     }
  //     handleClose();
  //     alert('Thông tin sản phẩm đã được cập nhật!');
  // };

  // Điều hướng sang trang thêm sản phẩm mới
  const handleAddProduct = () => {
    navigate(`/app/products/addproducts`);
  };

  const toggleVariants = (productId) => {
    setExpandedProductId((prev) => (prev === productId ? null : productId));
  };

  return (
    <>
      <InputGroup className="mb-3">
        <Button variant="dark" id="button-addon1" onClick={() => handleSearch(searchTerm)}>
          Tìm kiếm
        </Button>
        <Form.Control placeholder="Nhập vào từ khóa tìm kiếm" value={searchTerm} onChange={(e) => handleSearch(e.target.value)} />
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
                <th>Loại sản phẩm</th>
                <th>Tên sản phẩm</th>
                <th>Thông tin sản phẩm</th>
                <th>Giá nhập</th>
                <th>Giá bán</th>
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
                      <td>
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].image_url} // Lấy ảnh đầu tiên nếu có
                            alt={product.name}
                            style={{ width: '50px', height: '50px' }}
                          />
                        ) : (
                          'Không có ảnh'
                        )}
                      </td>
                      <td>{product.category_id}</td>
                      <td>
                        <span
                          onClick={() => toggleVariants(product.id)}
                          style={{
                            cursor: 'pointer',
                            color: 'blue',
                            textDecoration: 'underline'
                          }}
                        >
                          {product.name}
                        </span>
                      </td>
                      <td>{product.description}</td>
                      <td>{product.ori_price}</td>
                      <td>{product.sel_price}</td>
                      <td>{product.product_variants.length > 0 ? 'Còn hàng' : 'Hết hàng'}</td>
                      <td>
                        <Button
                          variant="info"
                          onClick={() => navigate(`/app/products/update/${product.id}`)} // Điều hướng đến trang cập nhật sản phẩm
                        >
                          Cập Nhật
                        </Button>
                      </td>
                    </tr>

                    {/* Table for product variants - shown when product name is clicked */}
                    {expandedProductId === product.id && (
                      <tr>
                        <td colSpan="6">
                          <div>
                            <h4>Danh sách sản phẩm:</h4>
                            {product.product_variants.length > 0 ? (
                              <table style={{ width: '100%', border: '1px solid #ddd', marginTop: '10px' }}>
                                <thead>
                                  <tr>
                                    <th>ID</th>
                                    <th>Kích cỡ (Size)</th>
                                    <th>Màu sắc (Color)</th>
                                    <th>Số lượng tồn</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {product.product_variants.map((variant) => (
                                    <tr key={variant.id}>
                                      <td>{variant.id}</td>
                                      <td>{variant.size_name}</td>
                                      <td>{variant.color_name}</td>
                                      <td>{variant.quantity}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <p>Không có thành phần nào cho sản phẩm này.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    Không có sản phẩm
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <Button variant="warning" onClick={handleAddProduct} className="mt-3">
        Thêm sản phẩm
      </Button>

      {/* <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa thông tin sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentProduct && (
                        <Form>
                            <Form.Group controlId="name">
                                <Form.Label>Tên sản phẩm</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={currentProduct.name}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            {
                            currentProduct.variants.map((variant, index) => (
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
                                ))
                            }
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
            </Modal> */}
    </>
  );
};

export default ProductsPage;
