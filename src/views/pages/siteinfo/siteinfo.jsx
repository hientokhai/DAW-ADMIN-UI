import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';


const SiteSettingsPage = () => {
    const [isEditing, setIsEditing] = useState(false); // State kiểm tra chế độ sửa
    const [siteInfo, setSiteInfo] = useState({
        shop_name: 'MENS STYLE',
        address: '84 NBT,P12, TB',
        phone_number: '0382488083',
        email: 'menstyle@gmail.com',
        description: 'shop uy tín và chất lượng nhất vn',
        logo_header_url: 'https://media.gq.com/photos/66bd04be6ceae75b0ef0564b/master/w_120,c_limit/Conde+Nast_r1_04L_4108_1x1-2loc11222o%20(1).jpg',
        logo_footer_url: 'https://media.gq.com/photos/66bd04be6ceae75b0ef0564b/master/w_120,c_limit/Conde+Nast_r1_04L_4108_1x1-2loc11222o%20(1).jpg',

    });

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
        // Đây là nơi bạn có thể gửi thông tin cập nhật lên server.
        alert('Thông tin website đã được cập nhật!');
        console.log(siteInfo); // Hiển thị thông tin đã thay đổi trong console
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
                                <Form.Label className="font-weight-bold">Logo Header URL</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="logo_header_url"
                                    value={siteInfo.logo_header_url}
                                    onChange={handleInputChange}
                                    className="custom-input"
                                />
                                <Form.Control
                                    type="file"
                                    onChange={(e) => handleImageChange(e, 'logo_header_url')}
                                    className="custom-file-input"
                                />
                            </Form.Group>

                            <Form.Group controlId="logo_footer_url">
                                <Form.Label className="font-weight-bold">Logo Footer URL</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="logo_footer_url"
                                    value={siteInfo.logo_footer_url}
                                    onChange={handleInputChange}
                                    className="custom-input"
                                />
                                <Form.Control
                                    type="file"
                                    onChange={(e) => handleImageChange(e, 'logo_footer_url')}
                                    className="custom-file-input"
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
                                />
                            </p>

                            <p>
                                <strong style={{ fontWeight: 'bold', color: '#333' }}>Logo Footer:</strong>
                                <img
                                    src={siteInfo.logo_footer_url}
                                    alt="Logo Footer"
                                    className="custom-image"
                                />
                            </p>

                            <Button variant="secondary" onClick={() => setIsEditing(true)} className="custom-btn">
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
