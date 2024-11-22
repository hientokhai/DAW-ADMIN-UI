import React, { useState, useEffect } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import SiteInfoApi from "../../../api/siteinfoApi";


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
        axios.get('http://127.0.0.1:8000/api/site-info')
            .then((response) => {
                // Cập nhật state với dữ liệu API
                setSiteInfo(response.data.data);
                console.log(response.data.data);
            })
            .catch((error) => {
                console.error("Lỗi khi lấy dữ liệu API: ", error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSiteInfo({
            ...siteInfo,
            [name]: value
        });
    };

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

    const handleSaveChanges = () => {
        // Gửi thông tin cập nhật lên server (ví dụ thông qua PUT request)
        alert('Thông tin website đã được cập nhật!');
        // console.log(siteInfo); // Hiển thị thông tin đã thay đổi trong console
        setIsEditing(false); // Tắt chế độ sửa sau khi lưu
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
                                <Form.Control
                                    type="text"
                                    name="address"
                                    value={siteInfo.address}
                                    onChange={handleInputChange}
                                    className="custom-input"
                                />
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
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={siteInfo.email}
                                    onChange={handleInputChange}
                                    className="custom-input"
                                />
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
                                {siteInfo.logo_header_url && <img src={siteInfo.logo_header_url} alt="Logo Header" style={{ width: '100px', height: 'auto' }} />}
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
                                {siteInfo.logo_footer_url && <img src={siteInfo.logo_footer_url} alt="Logo Footer" style={{ width: '100px', height: 'auto' }} />}
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
                                {siteInfo.social_facebook && <img src={siteInfo.social_facebook} alt="Facebook" style={{ width: '101px', height: 'auto' }} />}
                                <Form.Control
                                    type="file"
                                    onChange={(e) => handleImageChange(e, 'social_facebook')}
                                    className="custom-file-input"
                                    style={{ marginTop: '10px' }}
                                />
                                <div style={{ marginTop: '5px' }}></div>
                            </Form.Group><Form.Group controlId="social_instagram">
                                <Form.Label className="font-weight-bold">Instagram</Form.Label>
                                {siteInfo.social_instagram && (
                                    <img
                                        src={siteInfo.social_instagram}
                                        alt="Instagram"
                                        style={{ width: '100px', height: 'auto' }}
                                    />
                                )}
                                <Form.Control
                                    type="file"
                                    onChange={(e) => handleImageChange(e, 'social_instagram')}
                                    className="custom-file-input"
                                    style={{ marginTop: '10px' }}
                                />
                                <div style={{ marginTop: '5px' }}></div>
                            </Form.Group>

                            <Form.Group controlId="social_twitter">
                                <Form.Label className="font-weight-bold">Twitter</Form.Label>
                                {siteInfo.social_twitter && (
                                    <img
                                        src={siteInfo.social_twitter}
                                        alt="Twitter"
                                        style={{ width: '100px', height: 'auto' }}
                                    />
                                )}
                                <Form.Control
                                    type="file"
                                    onChange={(e) => handleImageChange(e, 'social_twitter')}
                                    className="custom-file-input"
                                    style={{ marginTop: '10px' }}
                                />
                                <div style={{ marginTop: '5px' }}></div>
                            </Form.Group>

                            <Form.Group controlId="social_linkedin">
                                <Form.Label className="font-weight-bold">LinkedIn</Form.Label>
                                {siteInfo.social_linkedin && (
                                    <img
                                        src={siteInfo.social_linkedin}
                                        alt="LinkedIn"
                                        style={{ width: '100px', height: 'auto' }}
                                    />
                                )}
                                <Form.Control
                                    type="file"
                                    onChange={(e) => handleImageChange(e, 'social_linkedin')}
                                    className="custom-file-input"
                                    style={{ marginTop: '10px' }}
                                />
                                <div style={{ marginTop: '5px' }}></div>
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
                            <p><strong style={{ fontWeight: 'bold', color: '#333' }}>Tên cửa hàng:</strong>{siteInfo.shop_name}</p>
                            <p><strong style={{ fontWeight: 'bold', color: '#333' }}>Địa chỉ:</strong> {siteInfo.address}</p>
                            <p><strong style={{ fontWeight: 'bold', color: '#333' }}>Số điện thoại:</strong>{siteInfo.phone_number}</p>
                            <p><strong style={{ fontWeight: 'bold', color: '#333' }}>Email:</strong> {siteInfo.email}</p>
                            <p><strong style={{ fontWeight: 'bold', color: '#333' }}>Mô tả:</strong> {siteInfo.description}</p>

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
                                <img
                                    src={siteInfo.social_facebook}
                                    alt="Facebook"
                                    className="custom-image"
                                    style={{ width: '100px', height: 'auto', display: 'inline-block', marginLeft: '10px' }}
                                />
                            </p>
                            <p>
                                <strong style={{ fontWeight: 'bold', color: '#333' }}>Logo Instagram:</strong>
                                <img
                                    src={siteInfo.social_instagram}
                                    alt="Instagram"
                                    className="custom-image"
                                    style={{ width: '100px', height: 'auto', display: 'inline-block', marginLeft: '10px' }}
                                />
                            </p>

                            <p>
                                <strong style={{ fontWeight: 'bold', color: '#333' }}>Logo Twitter:</strong>
                                <img
                                    src={siteInfo.social_twitter}
                                    alt="Twitter"
                                    className="custom-image"
                                    style={{ width: '100px', height: 'auto', display: 'inline-block', marginLeft: '10px' }}
                                />
                            </p>

                            <p>
                                <strong style={{ fontWeight: 'bold', color: '#333' }}>Logo LinkedIn:</strong>
                                <img
                                    src={siteInfo.social_linkedin}
                                    alt="LinkedIn"
                                    className="custom-image"
                                    style={{ width: '100px', height: 'auto', display: 'inline-block', marginLeft: '10px' }}
                                />
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
