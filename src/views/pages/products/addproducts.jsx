import { useState, useEffect } from 'react';
import { Button, Form, Card, Table, Image } from 'react-bootstrap';

const AddProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '', category: '', supplier: '', color: '', size: '', importprice: '', sellprice: '', description: '', status: 'Còn hàng', image: null
    });
    const [addedProducts, setAddedProducts] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProduct({ ...newProduct, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setAddedProducts([...addedProducts, newProduct]);
        setNewProduct({ name: '', category: '', supplier: '', color: '', size: '', importprice: '', sellprice: '', description: '', status: 'Còn hàng', image: null });
    };

    const slugify = (str) => {
        str = str.replace(/^\s+|\s+$/g, '').toLowerCase();
        str = str.replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
        return str;
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        const fakeData = [
            { category: 'Quần', color: 'Đỏ', size: 'S' },
            { category: 'Áo', color: 'Xanh', size: 'M' },
            { category: 'Giày', color: 'Vàng', size: 'L' },
        ];
        setProducts(fakeData);
    };

    const handleAddProduct = () => {
        alert('Thông tin sản phẩm đã được thêm mới!');
    };

    return (
        <>
            <h1>Thêm Sản Phẩm Mới</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formNewProductName">
                    <Form.Label>Tên sản phẩm</Form.Label>
                    <Form.Control type="text" name="name" placeholder="Nhập tên sản phẩm" value={newProduct.name} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formNewProductSlug">
                    <Form.Label>Slug</Form.Label>
                    <Form.Control type="text" value={slugify(newProduct.name)} readOnly />
                </Form.Group>

                <Form.Group controlId="formNewProductSupplier">
                    <Form.Label>Nhà cung cấp</Form.Label>
                    <Form.Control type="text" name="supplier" value={newProduct.supplier} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formNewProductCategory">
                    <Form.Label>Loại sản phẩm</Form.Label>
                    <Form.Select name="category" value={newProduct.category} onChange={handleChange}>
                        <option value="">Chọn loại sản phẩm</option>
                        {products.map((product, index) => (
                            <option key={index} value={product.category}>{product.category}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="formNewProductColor">
                    <Form.Label>Màu sắc</Form.Label>
                    <Form.Select name="color" value={newProduct.color} onChange={handleChange}>
                        <option value="">Chọn màu sắc</option>
                        {products.map((product, index) => (
                            <option key={index} value={product.color}>{product.color}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="formNewProductSize">
                    <Form.Label>Kích cỡ</Form.Label>
                    <Form.Select name="size" value={newProduct.size} onChange={handleChange}>
                        <option value="">Chọn kích cỡ</option>
                        {products.map((product, index) => (
                            <option key={index} value={product.size}>{product.size}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="formNewProductQuantity">
                    <Form.Label>Số lượng</Form.Label>
                    <Form.Control type="text" name="quantity" placeholder="Nhập số lượng" value={newProduct.quantity} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formNewProductImportPrice">
                    <Form.Label>Giá nhập</Form.Label>
                    <Form.Control type="text" name="importprice" placeholder="Nhập giá nhập" value={newProduct.importprice} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formNewProductSellPrice">
                    <Form.Label>Giá bán</Form.Label>
                    <Form.Control type="text" name="sellprice" placeholder="Nhập giá bán" value={newProduct.sellprice} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formNewProductDescription">
                    <Form.Label>Thông tin</Form.Label>
                    <Form.Control as="textarea" rows={3} name="description" placeholder="Nhập thông tin sản phẩm" value={newProduct.description} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formFileMultiple" className="mb-3">
                    <Form.Label>Hình ảnh</Form.Label>
                    <Form.Control type="file" onChange={handleImageChange} />
                </Form.Group>

                <Button variant="dark" type="submit">
                    Nhập
                </Button>
            </Form>

            <Card>
                <Card.Header>
                    <Card.Title as="h5">Danh sách nhập</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>Hình ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Loại sản phẩm</th>
                                <th>Màu sắc</th>
                                <th>Kích cỡ</th>
                                <th>Số lượng</th>
                                <th>Giá nhập</th>
                                <th>Giá bán</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {addedProducts.map((product, index) => (
                                <tr key={index}>
                                    <td>
                                        {product.image ? <Image src={product.image} alt="Product" width={50} height={50} /> : 'N/A'}
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>{product.color}</td>
                                    <td>{product.size}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.importprice}</td>
                                    <td>{product.sellprice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Button variant="secondary">Đóng</Button>
            <Button variant="primary" onClick={handleAddProduct}>Thêm</Button>
        </>
    );
};

export default AddProductsPage;