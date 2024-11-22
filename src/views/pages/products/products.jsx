import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Table, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ProductApi from 'api/productApi';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const navigate = useNavigate();

  // Fetch initial product data
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [products, searchTerm]);

  const fetchProducts = async () => {
    try {
      const response = await ProductApi.getAll();
      const productsData = response.data.map((product) => ({
        ...product,
        product_variants: product.product_variants || [], // Ensure product_variants exists
      }));
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!products.length) return;
    if (term.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleAddProduct = () => {
    navigate('/app/products/addproducts');
  };

  const toggleVariants = async (productId) => {
    if (expandedProductId === productId) {
      setExpandedProductId(null); // Thu gọn nếu đang mở
      return;
    }
  
    try {
      const response = await ProductApi.getById(productId);
      const productDetails = response.data || {};
      const { product, sizes = [], colors = [] } = productDetails;
  
      if (!product || !Array.isArray(product.productVariants)) { //kiểm tra xem một giá trị có phải là một mảng (Array) hay không
        console.error("Không tìm thấy thông tin sản phẩm hoặc variants không hợp lệ:", productDetails);
        return;
      }
  
      // Gắn thêm thông tin tên size và màu sắc
      const updatedVariants = product.productVariants.map((variant) => ({
        ...variant,
        size_name: sizes.find((size) => size.id === variant.size_id)?.size_name || "Không xác định",
        color_name: colors.find((color) => color.id === variant.color_id)?.color_name || "Không xác định",
      }));
  
      // Cập nhật danh sách sản phẩm trong state
      setFilteredProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, product_variants: updatedVariants }
            : product
        )
      );
  
      setExpandedProductId(productId); // Mở rộng chi tiết sản phẩm
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
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
                  <React.Fragment key={product.id}>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{product.createdAt}</td>
                      <td>
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].image_url}
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
                            textDecoration: 'underline',
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
                          onClick={() => navigate(`/app/products/update/${product.id}`)}
                        >
                          Cập Nhật
                        </Button>
                      </td>
                    </tr>

                    {expandedProductId === product.id && (
                      <tr>
                        <td colSpan="10">
                          <div>
                            <h4>Danh sách sản phẩm:</h4>
                            {product.product_variants.length > 0 ? (
                              <table
                                style={{
                                  width: '100%',
                                  border: '1px solid #ddd',
                                  marginTop: '10px',
                                }}
                              >
                                <thead>
                                  <tr>
                                    <th>Kích cỡ (Size)</th>
                                    <th>Màu sắc (Color)</th>
                                    <th>Số lượng tồn</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {product.product_variants.map((variant) => (
                                    <tr key={variant.id}>
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
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">
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
    </>
  );
};

export default ProductsPage;