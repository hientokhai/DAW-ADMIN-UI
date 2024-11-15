import React, { useState } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import styled from 'styled-components';

const StyledTable = styled(Table)`
    td, th {
        vertical-align: middle; /* Center align content vertically */
    }
`;

const SlideImage = styled.img`
    width: 100px; /* Set a fixed width */
    height: auto; /* Maintain aspect ratio */
    object-fit: cover; /* Ensure the image covers the area without distortion */
`;

const SlideshowManagement = () => {
    const [slides, setSlides] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(null);
    const [newSlide, setNewSlide] = useState({
        id: Date.now(),
        title: '',
        image_url: '',
        link_url: '',
        description: '',
        is_active: true,
        created_at: new Date().toISOString().split("T")[0],
        deleted_at: null,
    });

    const handleShowAdd = () => setShowAddModal(true);
    const handleCloseAdd = () => setShowAddModal(false);

    const handleShowEdit = (slide) => {
        setCurrentSlide(slide);
        setNewSlide(slide);
        setShowEditModal(true);
    };

    const handleCloseEdit = () => {
        setShowEditModal(false);
        setCurrentSlide(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewSlide({ ...newSlide, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewSlide({ ...newSlide, image_url: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddSlide = () => {
        setSlides([...slides, { ...newSlide, id: Date.now() }]);
        resetNewSlide();
        handleCloseAdd();
    };

    const handleEditSlide = () => {
        setSlides(slides.map(slide => (slide.id === newSlide.id ? { ...newSlide } : slide)));
        handleCloseEdit();
    };

    const toggleActive = (id) => {
        setSlides(slides.map(slide =>
            slide.id === id ? { ...slide, is_active: !slide.is_active } : slide
        ));
    };

    const handleDeleteSlide = (id) => {
        setSlides(slides.filter(slide => slide.id !== id));
    };

    const resetNewSlide = () => {
        setNewSlide({
            id: Date.now(),
            title: '',
            image_url: '',
            link_url: '',
            description: '',
            is_active: true,
            created_at: new Date().toISOString(),
            deleted_at: null,
        });
    };

    return (
        <div>
            <Button variant="primary" onClick={handleShowAdd}>Thêm Slide</Button>

            {/* Add Slide Modal */}
            <Modal show={showAddModal} onHide={handleCloseAdd}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Slide Mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formSlideTitle">
                            <Form.Label>Tiêu đề Slide</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tiêu đề"
                                name="title"
                                value={newSlide.title}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formSlideImage">
                            <Form.Label>Chọn Hình ảnh</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formSlideLink">
                            <Form.Label>URL Liên kết</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập URL liên kết"
                                name="link_url"
                                value={newSlide.link_url}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formSlideDescription">
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Nhập mô tả"
                                name="description"
                                value={newSlide.description}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAdd}>Đóng</Button>
                    <Button variant="primary" onClick={handleAddSlide}>Thêm Slide</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Slide Modal */}
            <Modal show={showEditModal} onHide={handleCloseEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>Sửa Slide</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formSlideTitle">
                            <Form.Label>Tiêu đề Slide</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tiêu đề"
                                name="title"
                                value={newSlide.title}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formSlideImage">
                            <Form.Label>Chọn Hình ảnh</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formSlideLink">
                            <Form.Label>URL Liên kết</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập URL liên kết"
                                name="link_url"
                                value={newSlide.link_url}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formSlideDescription">
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Nhập mô tả"
                                name="description"
                                value={newSlide.description}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formSlideActive">
                            <Form.Check
                                type="checkbox"
                                label="Kích hoạt"
                                checked={newSlide.is_active}
                                onChange={() => setNewSlide({ ...newSlide, is_active: !newSlide.is_active })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEdit}>Đóng</Button>
                    <Button variant="primary" onClick={handleEditSlide}>Lưu thay đổi</Button>
                </Modal.Footer>
            </Modal>

            <StyledTable striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tiêu đề</th>
                        <th>Hình ảnh</th>
                        <th>URL Liên kết</th>
                        <th>Mô tả</th>
                        <th>Kích hoạt</th>
                        <th>Ngày tạo</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {slides.map((slide) => (
                        <tr key={slide.id}>
                            <td>{slide.id}</td>
                            <td>{slide.title}</td>
                            <td>
                                {slide.image_url && (
                                    <SlideImage
                                        src={slide.image_url}
                                        alt={slide.title}
                                    />
                                )}
                            </td>
                            <td>{slide.link_url}</td>
                            <td>{slide.description}</td>
                            <td>
                                <Button variant={slide.is_active ? 'success' : 'danger'} onClick={() => toggleActive(slide.id)}>
                                    {slide.is_active ? 'Kích hoạt' : 'Không kích hoạt'}
                                </Button>
                            </td>
                            <td>{slide.created_at}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleDeleteSlide(slide.id)}>Xóa</Button>
                                <Button variant="warning" onClick={() => handleShowEdit(slide)}>Sửa</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </StyledTable>
        </div>
    );
};

export default SlideshowManagement;