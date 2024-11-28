import React, { useState, useEffect } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import axios from 'axios';
// import SiteInfoApi from '../../../api/siteinfoApi';

const SiteSettingsPage = () => {
  const [isEditing, setIsEditing] = useState(false); // State kiểm tra chế độ sửa
  const [siteInfo, setSiteInfo] = useState({
    shop_name: '',
    address: '',
    phone_number: '',
    email: '',
    description: '',
    logo_header_url: '',
    logo_footer_url: '',
    social_facebook: '',
    social_instagram: '',
    social_twitter: '',
    social_linkedin: ''
  });

  // Lấy dữ liệu từ API khi component được mount
  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/site-info')
      .then((response) => {
        // Cập nhật state với dữ liệu API
        console.log(response.data.data);
        setSiteInfo(response.data.data);
        // console.log(response.data.data);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy dữ liệu API: ', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSiteInfo({
      ...siteInfo,
      [name]: value
    });
  };
  //   const handleSave = () => {
  //     const updatedCategories = categories.map((category) => (category.id === currentCategory.id ? currentCategory : category));
  //     setCategories(updatedCategories);
  //     handleClose();
  //   };
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSiteInfo({
          ...siteInfo,
          [type]: reader.result // Lưu kết quả hình ảnh dưới dạng base64
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    // Gửi thông tin cập nhật lên server (ví dụ thông qua PUT request)
    const response = await handleSubmit();
    alert('Thông tin website đã được cập nhật!');
    console.log(response);
    setSiteInfo(response.data.data);
    setIsEditing(false);
    // Tắt chế độ sửa sau khi lưu
  };

  const uploadImageToCloudinary = async (file, type) => {
    const cloudinaryURL = `https://api.cloudinary.com/v1_1/dqnv0g0wl/image/upload`;
    const formData = new FormData();
    formData.append('file', file); // Thêm file ảnh vào FormData
    formData.append('upload_preset', 'product_image'); // Upload preset của Cloudinary

    try {
      const response = await axios.post(cloudinaryURL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(response);
      return response.data.secure_url; // Trả về URL ảnh sau khi upload
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleSubmit = async () => {
    // Upload hình ảnh lên Cloudinary nếu có
    try {
      //   let logoHeaderUrl, logoFooterUrl;
      //   if (siteInfo['logo_header_url']) {
      //     logoHeaderUrl = await uploadImageToCloudinary(siteInfo['logo_header_url'], 'logo_header_url');
      //     setSiteInfo({ ...siteInfo, logo_header_url: logoHeaderUrl });
      //   }
      //   if (siteInfo['logo_footer_url']) {
      //     logoFooterUrl = await uploadImageToCloudinary(siteInfo['logo_footer_url'], 'logo_footer_url');
      //     setSiteInfo({ ...siteInfo, logo_header_url: logoFooterUrl });
      //   }

      const response = await axios.put(`http://127.0.0.1:8000/api/site-info/update/${siteInfo.id}`, { ...siteInfo });

      return response;
    } catch (error) {
      console.error('Error updating product:', error);
      if (error.response && error.response.data) {
        alert(`Lỗi: ${error.response.data.message || 'Không thể cập nhật sản phẩm.'}`);
      } else {
        alert('Đã xảy ra lỗi khi kết nối đến server.');
      }
    }
  };

  const handleCancelChanges = () => {
    const confirmCancel = window.confirm('Bạn có chắc chắn muốn hủy thay đổi không?');
    if (confirmCancel) {
      setIsEditing(false); // Tắt chế độ sửa nếu hủy
    }
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title as="h4">Thông Tin Website</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form>
          {isEditing ? (
            // Khi ở chế độ sửa, hiển thị form chỉnh sửa
            <>
              <Form.Group controlId="shop_name">
                <Form.Label className="font-weight-bold">Tên cửa hàng</Form.Label>
                <Form.Control
                  type="text"
                  name="shop_name"
                  value={siteInfo.shop_name}
                  onChange={handleInputChange}
                  className="custom-input"
                />
              </Form.Group>

              <Form.Group controlId="address">
                <Form.Label className="font-weight-bold">Địa chỉ</Form.Label>
                <Form.Control type="text" name="address" value={siteInfo.address} onChange={handleInputChange} className="custom-input" />
              </Form.Group>

              <Form.Group controlId="phone_number">
                <Form.Label className="font-weight-bold">Số điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  name="phone_number"
                  value={siteInfo.phone_number}
                  onChange={handleInputChange}
                  className="custom-input"
                />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label className="font-weight-bold">Email</Form.Label>
                <Form.Control type="email" name="email" value={siteInfo.email} onChange={handleInputChange} className="custom-input" />
              </Form.Group>

              <Form.Group controlId="description">
                <Form.Label className="font-weight-bold">Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={siteInfo.description}
                  onChange={handleInputChange}
                  className="custom-textarea"
                />
              </Form.Group>

              <Form.Group controlId="logo_header_url">
                <Form.Label className="font-weight-bold">Logo Header</Form.Label>
                {siteInfo.logo_header_url && (
                  <img src={siteInfo.logo_header_url} alt="Logo Header" style={{ width: '100px', height: 'auto' }} />
                )}
                <Form.Control
                  type="file"
                  onChange={(e) => handleImageChange(e, 'logo_header_url')}
                  className="custom-file-input"
                  style={{ marginTop: '10px' }}
                />
                <div style={{ marginTop: '5px' }}></div>
              </Form.Group>

              <Form.Group controlId="logo_footer_url">
                <Form.Label className="font-weight-bold">Logo Footer</Form.Label>
                {siteInfo.logo_footer_url && (
                  <img src={siteInfo.logo_footer_url} alt="Logo Footer" style={{ width: '100px', height: 'auto' }} />
                )}
                <Form.Control
                  type="file"
                  onChange={(e) => handleImageChange(e, 'logo_footer_url')}
                  className="custom-file-input"
                  style={{ marginTop: '10px' }}
                />
                <div style={{ marginTop: '5px' }}></div>
              </Form.Group>

              <Form.Group controlId="social_facebook">
                <Form.Label className="font-weight-bold">Facebook</Form.Label>
                <Form.Control
                  type="url"
                  name="social_facebook"
                  placeholder="Nhập URL Facebook"
                  value={siteInfo.social_facebook || ''}
                  onChange={handleInputChange}
                  style={{ marginTop: '10px' }}
                />
              </Form.Group>

              <Form.Group controlId="social_instagram">
                <Form.Label className="font-weight-bold">Instagram</Form.Label>
                <Form.Control
                  type="url"
                  name="social_instagram"
                  placeholder="Nhập URL Instagram"
                  value={siteInfo.social_instagram || ''}
                  onChange={handleInputChange}
                  style={{ marginTop: '10px' }}
                />
              </Form.Group>

              <Form.Group controlId="social_twitter">
                <Form.Label className="font-weight-bold">Twitter</Form.Label>
                <Form.Control
                  type="url"
                  name="social_twitter"
                  placeholder="Nhập URL Twitter"
                  value={siteInfo.social_twitter || ''}
                  onChange={handleInputChange}
                  style={{ marginTop: '10px' }}
                />
              </Form.Group>

              <Form.Group controlId="social_linkedin">
                <Form.Label className="font-weight-bold">LinkedIn</Form.Label>
                <Form.Control
                  type="url"
                  name="social_linkedin"
                  placeholder="Nhập URL LinkedIn"
                  value={siteInfo.social_linkedin || ''}
                  onChange={handleInputChange}
                  style={{ marginTop: '10px' }}
                />
              </Form.Group>

              <Button variant="primary" onClick={handleSaveChanges} className="custom-btn">
                Lưu thay đổi
              </Button>
              <Button variant="danger" onClick={handleCancelChanges} className="custom-btn" style={{ marginLeft: '10px' }}>
                Hủy thay đổi
              </Button>
            </>
          ) : (
            // Khi ở chế độ xem, hiển thị thông tin mà không cho chỉnh sửa
            <>
              <p>
                <strong style={{ fontWeight: 'bold', color: '#333' }}>Tên cửa hàng:</strong>
                {siteInfo.shop_name}
              </p>
              <p>
                <strong style={{ fontWeight: 'bold', color: '#333' }}>Địa chỉ:</strong> {siteInfo.address}
              </p>
              <p>
                <strong style={{ fontWeight: 'bold', color: '#333' }}>Số điện thoại:</strong>
                {siteInfo.phone_number}
              </p>
              <p>
                <strong style={{ fontWeight: 'bold', color: '#333' }}>Email:</strong> {siteInfo.email}
              </p>
              <p>
                <strong style={{ fontWeight: 'bold', color: '#333' }}>Mô tả:</strong> {siteInfo.description}
              </p>

              <p>
                <strong style={{ fontWeight: 'bold', color: '#333' }}>Logo Header:</strong>
                <img
                  src={siteInfo.logo_header_url}
                  alt="Logo Header"
                  className="custom-image"
                  style={{ width: '100px', height: 'auto', display: 'inline-block', marginLeft: '10px' }}
                />
              </p>

              <p>
                <strong style={{ fontWeight: 'bold', color: '#333' }}>Logo Footer:</strong>
                <img
                  src={siteInfo.logo_footer_url}
                  alt="Logo Footer"
                  className="custom-image"
                  style={{ width: '100px', height: 'auto', display: 'inline-block', marginLeft: '10px' }}
                />
              </p>

              <p>
                <strong style={{ fontWeight: 'bold', color: '#333' }}>Logo Facebook:</strong>
                {siteInfo.social_facebook && (
                  <a
                    href={siteInfo.social_facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: '10px', color: '#007bff', textDecoration: 'none' }}
                  >
                    {siteInfo.social_facebook}
                  </a>
                )}
              </p>

              <p>
                <strong style={{ fontWeight: 'bold', color: '#333' }}>Logo Instagram:</strong>
                {siteInfo.social_instagram && (
                  <a
                    href={siteInfo.social_instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: '10px', color: '#007bff', textDecoration: 'none' }}
                  >
                    {siteInfo.social_instagram}
                  </a>
                )}
              </p>

              <p>
                <strong style={{ fontWeight: 'bold', color: '#333' }}>Logo Twitter:</strong>
                {siteInfo.social_twitter && (
                  <a
                    href={siteInfo.social_twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: '10px', color: '#007bff', textDecoration: 'none' }}
                  >
                    {siteInfo.social_twitter}
                  </a>
                )}
              </p>

              <p>
                <strong style={{ fontWeight: 'bold', color: '#333' }}>Logo LinkedIn:</strong>
                {siteInfo.social_linkedin && (
                  <a
                    href={siteInfo.social_linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: '10px', color: '#007bff', textDecoration: 'none' }}
                  >
                    {siteInfo.social_linkedin}
                  </a>
                )}
              </p>
              <Button variant="primary" onClick={() => setIsEditing(true)} className="custom-btn">
                Chỉnh sửa
              </Button>
            </>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default SiteSettingsPage;
