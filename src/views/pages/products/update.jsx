import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ProductApi from 'api/productApi';
import axios from 'axios';

const UpdateProductPage = () => {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  // const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    category_id: '',
    productVariants: [],
    ori_price: '',
    sel_price: '',
    description: '',
    images: []
  });

  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await ProductApi.getById(id); // Lấy dữ liệu sản phẩm theo ID
        const { product, categories, sizes, colors } = response.data;

        setProduct({
          ...product,
          images: product.images || []
        });
        setCategories(categories);
        setSizes(sizes);
        setColors(colors);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProductData();
  }, [id]);

  // Xử lý thay đổi input cơ bản
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Xử lý thay đổi biến thể
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...product.productVariants];
    updatedVariants[index][field] = value;
    setProduct({ ...product, productVariants: updatedVariants });
  };

  const addVariant = () => {
    setProduct({
      ...product,
      productVariants: [...product.productVariants, { size_id: '', color_id: '', quantity: '' }]
    });
  };

  const removeVariant = (index) => {
    const updatedVariants = [...product.productVariants];
    updatedVariants.splice(index, 1);
    setProduct({ ...product, productVariants: updatedVariants });
  };

  // Upload ảnh lên Cloudinary và nhận image_url
  const uploadImageToCloudinary = async (file) => {
    const cloudinaryURL = `https://api.cloudinary.com/v1_1/dqnv0g0wl/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'product_image');

    try {
      const response = await axios.post(cloudinaryURL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.secure_url; // Trả về URL ảnh đã upload
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  // Xử lý submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tạo FormData
    const formData = new FormData();

    // Kiểm tra xem tất cả các trường có giá trị hợp lệ không
    if (!product.name || !product.category_id || !product.ori_price || !product.sel_price) {
      alert('Vui lòng điền đầy đủ thông tin sản phẩm.');
      return;
    }

    // Thêm các trường cơ bản vào FormData
    formData.append('name', product.name);
    formData.append('category_id', product.category_id);
    formData.append('ori_price', product.ori_price);
    formData.append('sel_price', product.sel_price);
    formData.append('description', product.description || ''); // Mô tả có thể null

    // Upload hình ảnh lên Cloudinary nếu có
    try {
      const uploadedImageUrls = [];
      for (let image of product.images) {
        if (image instanceof File) {
          const imageUrl = await uploadImageToCloudinary(image);
          uploadedImageUrls.push(imageUrl);
        } else {
          uploadedImageUrls.push(image); // Nếu ảnh đã là URL (sản phẩm đã có ảnh trước đó)
        }
      }

      // Gửi URLs hình ảnh về backend dưới dạng mảng (images[])
      uploadedImageUrls.forEach((url) => {
        formData.append('images[]', url);
      });

      // Thêm các biến thể sản phẩm
      product.productVariants.forEach((variant, index) => {
        formData.append(`productVariants[${index}][size_id]`, variant.size_id || '');
        formData.append(`productVariants[${index}][color_id]`, variant.color_id || '');
        formData.append(`productVariants[${index}][quantity]`, variant.quantity || '');
      });

      // Gửi request cập nhật sản phẩm
      await axios.post(`http://127.0.0.1:8000/api/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Cập nhật sản phẩm thành công!');
      // navigate(-1);
    } catch (error) {
      console.error('Error updating product:', error);
      if (error.response && error.response.data) {
        alert(`Lỗi: ${error.response.data.message || 'Không thể cập nhật sản phẩm.'}`);
      } else {
        alert('Đã xảy ra lỗi khi kết nối đến server.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Cập nhật sản phẩm</h1>
      <Form onSubmit={handleSubmit}>
        {/* Tên sản phẩm */}
        <Form.Group controlId="formProductName">
          <Form.Label>Tên sản phẩm</Form.Label>
          <Form.Control type="text" name="name" value={product.name} onChange={handleChange} placeholder="Nhập tên sản phẩm" />
        </Form.Group>

        {/* Danh mục */}
        <Form.Group controlId="formProductCategory">
          <Form.Label>Danh mục</Form.Label>
          <Form.Control as="select" name="category_id" value={product.category_id} onChange={handleChange}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {/* Biến thể sản phẩm */}
        <Form.Group controlId="formProductVariants">
          <Form.Label>Biến thể sản phẩm</Form.Label>
          {product.productVariants.map((variant, index) => (
            <div key={index} className="d-flex align-items-center mb-3">
              <Form.Control as="select" value={variant.size_id} onChange={(e) => handleVariantChange(index, 'size_id', e.target.value)}>
                <option value="">Chọn kích thước</option>
                {sizes.map((size) => (
                  <option key={size.id} value={size.id}>
                    {size.size_name}
                  </option>
                ))}
              </Form.Control>

              <Form.Control as="select" value={variant.color_id} onChange={(e) => handleVariantChange(index, 'color_id', e.target.value)}>
                <option value="">Chọn màu</option>
                {colors.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.color_name}
                  </option>
                ))}
              </Form.Control>

              <Form.Control
                type="number"
                value={variant.quantity}
                onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
              />

              <Button variant="danger" onClick={() => removeVariant(index)}>
                Xóa
              </Button>
            </div>
          ))}
          <Button variant="success" onClick={addVariant}>
            Thêm biến thể
          </Button>
        </Form.Group>

        {/* Giá nhập */}
        <Form.Group controlId="formProductImportPrice">
          <Form.Label>Giá nhập</Form.Label>
          <Form.Control type="text" name="ori_price" value={product.ori_price} onChange={handleChange} placeholder="Nhập giá nhập" />
        </Form.Group>

        {/* Giá bán */}
        <Form.Group controlId="formProductSellPrice">
          <Form.Label>Giá bán</Form.Label>
          <Form.Control type="text" name="sel_price" value={product.sel_price} onChange={handleChange} placeholder="Nhập giá bán" />
        </Form.Group>

        {/* Mô tả */}
        <Form.Group controlId="formProductDescription">
          <Form.Label>Mô tả sản phẩm</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Nhập mô tả sản phẩm"
          />
        </Form.Group>

        {/* Hình ảnh */}
        <Form.Group controlId="formProductImages">
          <Form.Label>Hình ảnh sản phẩm</Form.Label>
          <Form.Control type="file" multiple onChange={(e) => setProduct({ ...product, images: [...product.images, ...e.target.files] })} />

          {product.images.length > 0 && (
            <div className="mt-3">
              {product.images.map((image, index) => (
                // eslint-disable-next-line jsx-a11y/img-redundant-alt
                <img
                  key={index}
                  src={image instanceof File ? URL.createObjectURL(image) : image}
                  alt={`Image ${index}`}
                  style={{ maxWidth: '100px', marginRight: '10px' }}
                />
              ))}
            </div>
          )}
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-2">
          Lưu
        </Button>
      </Form>
    </div>
  );
};

export default UpdateProductPage;
