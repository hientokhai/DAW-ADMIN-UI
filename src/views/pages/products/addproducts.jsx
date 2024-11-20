import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Table } from 'react-bootstrap';
import ProductApi from 'api/productApi'; // Import API để giao tiếp với backend
import axios from 'axios';

const AddProductsPage = () => {
    const [products, setProducts] = useState([]);        // Dữ liệu sản phẩm
    const [newProduct, setNewProduct] = useState({
        name: '',
        category_id: '',
        productVariants: [],
        ori_price: '',
        sel_price: '',
        description: '',
        images: [],  // Thêm trường images
    });
    const [categories, setCategories] = useState([]);      // Loại sản phẩm
    const [colors, setColors] = useState([]);              // Màu sắc
    const [sizes, setSizes] = useState([]);                // Kích cỡ

    useEffect(() => {
        // Fetch dữ liệu các bảng: Loại sản phẩm, Màu sắc, Kích cỡ
        fetchCategories();
        fetchColors();
        fetchSizes();
    }, []);
    
    // Fetch các loại sản phẩm
    const fetchCategories = async () => {
        const response = await ProductApi.getCategories();
        setCategories(response.data);
    };

    // Fetch các màu sắc
    const fetchColors = async () => {
        const response = await ProductApi.getColors();
        setColors(response.data);
    };

    // Fetch các kích cỡ
    const fetchSizes = async () => {
        const response = await ProductApi.getSizes();
        setSizes(response.data);
    };

    // Xử lý thay đổi trường dữ liệu
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    // Xử lý thay đổi cho các variant (màu sắc, kích cỡ, số lượng)
    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...newProduct.productVariants];
        updatedVariants[index][field] = value;
        setNewProduct({ ...newProduct, productVariants: updatedVariants });
    };

    // Thêm variant mới
    const addVariant = () => {
        setNewProduct({
            ...newProduct,
            productVariants: [...newProduct.productVariants, { color_id: '', size_id: '', quantity: '' }],
        });
    };

    // Xóa variant
    const removeVariant = (index) => {
        const updatedVariants = [...newProduct.productVariants];
        updatedVariants.splice(index, 1);
        setNewProduct({ ...newProduct, productVariants: updatedVariants });
    };

    // Xử lý khi chọn ảnh và upload lên Cloudinary
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'ml_default'); // Thay YOUR_UPLOAD_PRESET bằng preset của bạn
            formData.append('cloud_name', 'dfikfmyvp'); // Thay YOUR_CLOUD_NAME bằng tên Cloudinary của bạn

            try {
                const res = await axios.post('https://api.cloudinary.com/v1_1/dfikfmyvp/image/upload', formData);
                const imageUrl = res.data.secure_url;
                setNewProduct({
                    ...newProduct,
                    images: [...newProduct.images, imageUrl],  // Lưu ảnh URL vào images
                });
            } catch (err) {
                console.error('Error uploading image', err);
            }
        }
    };

    const handleAddNewProduct = async () => {
        // Kiểm tra thông tin form
        if (!newProduct.name || !newProduct.category_id || !newProduct.ori_price || !newProduct.sel_price) {
            alert('Vui lòng điền đầy đủ thông tin sản phẩm!');
            return;
        }
    
        try {
            // Gửi yêu cầu thêm sản phẩm mới lên API
            const response = await ProductApi.addProduct(newProduct);
    
            if (response.status === 201) {
                setProducts([...products, { ...newProduct, id: products.length + 1 }]);
                alert('Sản phẩm đã được thêm thành công!');
                setNewProduct({
                    name: '',
                    category_id: '',
                    productVariants: [],
                    ori_price: '',
                    sel_price: '',
                    description: '',
                    images: [],
                });
            }
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            alert('Đã có lỗi xảy ra khi thêm sản phẩm!');
        }
    };

    // Xử lý khi nhấn nút nhập
    const handleSubmit = (e) => {
        e.preventDefault();
        // Kiểm tra trùng lặp biến thể
        const variantsSet = new Set();
        for (const variant of newProduct.productVariants) {
            const variantKey = `${variant.color_id}-${variant.size_id}`;  // Tạo khóa duy nhất cho mỗi biến thể
            if (variantsSet.has(variantKey)) {
                alert('Biến thể màu sắc và kích cỡ không được trùng lặp!');
                return;
            }
            variantsSet.add(variantKey);
        }
    
        // Thêm sản phẩm mới vào mảng products nếu không có lỗi
        setProducts([...products, { ...newProduct, id: products.length + 1 }]);
    
        // Reset lại form
        setNewProduct({
            name: '',
            category_id: '',
            productVariants: [],
            ori_price: '',
            sel_price: '',
            description: '',
            images: [],  // Reset lại ảnh
        });
    };

    return (
        <>
            <h1>Thêm Sản Phẩm Mới</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formNewProductName">
                    <Form.Label>Tên sản phẩm</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder="Nhập tên sản phẩm"
                        value={newProduct.name}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formNewProductCategory">
                    <Form.Label>Loại sản phẩm</Form.Label>
                    <Form.Control
                        as="select"
                        name="category_id"
                        value={newProduct.category_id}
                        onChange={handleChange}
                    >
                        <option value="">Chọn loại sản phẩm</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="formNewProductImage">
                    <Form.Label>Chọn ảnh sản phẩm</Form.Label>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </Form.Group>

                <Form.Group controlId="formNewProductVariants">
                    <Form.Label>Thành phần sản phẩm: </Form.Label>
                    {newProduct.productVariants.map((variant, index) => (
                        <div key={index} className="mb-3">
                            <Form.Control
                                as="select"
                                value={variant.color_id}
                                onChange={(e) =>
                                    handleVariantChange(index, 'color_id', e.target.value)
                                }
                                className="mb-2"
                            >
                                <option value="">Chọn màu sắc</option>
                                {colors.map((color) => (
                                    <option key={color.id} value={color.id}>
                                        {color.color_name}
                                    </option>
                                ))}
                            </Form.Control>

                            <Form.Control
                                as="select"
                                value={variant.size_id}
                                onChange={(e) =>
                                    handleVariantChange(index, 'size_id', e.target.value)
                                }
                                className="mb-2"
                            >
                                <option value="">Chọn kích cỡ</option>
                                {sizes.map((size) => (
                                    <option key={size.id} value={size.id}>
                                        {size.size_name}
                                    </option>
                                ))}
                            </Form.Control>

                            <Form.Control
                                type="number"
                                placeholder="Nhập số lượng"
                                value={variant.quantity}
                                onChange={(e) =>
                                    handleVariantChange(index, 'quantity', e.target.value)
                                }
                                className="mb-2"
                            />

                            <Button variant="danger" onClick={() => removeVariant(index)}>
                                Xóa
                            </Button>
                        </div>
                    ))}
                    <Button variant="success" onClick={addVariant}>
                        Thêm thành phần
                    </Button>
                </Form.Group>

                <Form.Group controlId="formNewProductImportPrice">
                    <Form.Label>Giá nhập</Form.Label>
                    <Form.Control
                        type="text"
                        name="ori_price"
                        placeholder="Nhập giá nhập"
                        value={newProduct.ori_price}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formNewProductSellPrice">
                    <Form.Label>Giá bán</Form.Label>
                    <Form.Control
                        type="text"
                        name="sel_price"
                        placeholder="Nhập giá bán"
                        value={newProduct.sel_price}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formNewProductDescription">
                    <Form.Label>Thông tin</Form.Label>
                    <Form.Control
                        type="text"
                        name="description"
                        placeholder="Nhập thông tin sản phẩm"
                        value={newProduct.description}
                        onChange={handleChange}
                    />
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
                                <th>Tên sản phẩm</th>
                                <th>Loại sản phẩm</th>
                                <th>Ảnh sản phẩm</th>
                                <th>Màu sắc</th>
                                <th>Kích cỡ</th>
                                <th>Số lượng</th>
                                <th>Giá nhập</th>
                                <th>Giá bán</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.name}</td>
                                    <td>{categories.find((cat) => cat.id === product.category_id)?.name}</td>
                                    <td>
                                        {product.images.length > 0 && (
                                            <img src={product.images[0]} alt="Product" width="100" />
                                        )}
                                    </td>
                                    <td>
                                        {newProduct.productVariants
                                            .map(productVariants => {
                                                const color = colors.find(color => color.id === productVariants.color_id);
                                                return color ? color.color_name : '';
                                            })
                                            .join(', ')}
                                    </td>
                                    <td>
                                        {product.productVariants
                                            .map(productVariants => {
                                                const size = sizes.find(size => size.id === productVariants.size_id);
                                                return size ? size.size_name : '';
                                            })
                                            .join(', ')}
                                    </td>
                                    <td>
                                        {product.productVariants
                                            .map(productVariants => productVariants.quantity)
                                            .join(', ')}
                                    </td>
                                    <td>{product.ori_price}</td>
                                    <td>{product.sel_price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
            <Button variant="dark" onClick={handleAddNewProduct}>
                    Thêm mới sản phẩm
            </Button>
        </>
    );
};

export default AddProductsPage;