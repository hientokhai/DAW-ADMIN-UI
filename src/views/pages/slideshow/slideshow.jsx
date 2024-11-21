import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import styled from 'styled-components';
import SlideApi from 'api/SlideApi';


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
        title: '',
        image_url: '',
        link_url: '',
        description: '',
        is_active: true,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        // Lấy danh sách slides từ API
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await SlideApi.getAll();
                setSlides(response.data);
                setErrorMessage(null);
            } catch (error) {
                console.error('Error fetching slides:', error);
                setErrorMessage('Lỗi khi tải dữ liệu.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

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

    const handleAddSlide = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', newSlide.title);
            if (newSlide.image_url instanceof File) {
                formData.append('image_url', newSlide.image_url); // If image_url is a file
            }
            formData.append('link_url', newSlide.link_url);
            formData.append('description', newSlide.description);
            formData.append('is_active', newSlide.is_active); // Ensure this is a boolean

            const response = await SlideApi.store(formData);
            setSlides([...slides, response.data]);
            resetNewSlide();
            handleCloseAdd();
        } catch (error) {
            console.error('Error adding slide:', error.response ? error.response.data : error.message);
            if (error.response && error.response.data && error.response.data.errors) {
                setErrorMessage(error.response.data.errors.title[0]);
            } else {
                setErrorMessage('Lỗi khi thêm slide.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditSlide = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', newSlide.title);
            if (newSlide.image_url instanceof File) {
                formData.append('image_url', newSlide.image_url); // Nếu image_url là một tệp tin
            }
            formData.append('link_url', newSlide.link_url);
            formData.append('description', newSlide.description);
            formData.append('is_active', newSlide.is_active);

            const response = await SlideApi.update(newSlide.id, formData);
            setSlides(slides.map((slide) => (slide.id === newSlide.id ? response.data : slide)));
            handleCloseEdit();
        } catch (error) {
            console.error('Error editing slide:', error);
            setErrorMessage('Lỗi khi sửa slide.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleActive = async (id) => {
        setIsLoading(true);
        try {
            const response = await SlideApi.update(id, { is_active: !slides.find(slide => slide.id === id).is_active });
            setSlides(slides.map(slide =>
                slide.id === id ? response.data : slide
            ));
            setErrorMessage(null);
        } catch (error) {
            console.error('Error togg ling slide active state:', error);
            setErrorMessage('Lỗi khi thay đổi trạng thái kích hoạt.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSlide = async (id) => {
        setIsLoading(true);
        try {
            await SlideApi.destroy(id);
            setSlides(slides.filter(slide => slide.id !== id));
        } catch (error) {
            console.error('Error deleting slide:', error);
            setErrorMessage('Lỗi khi xóa slide.');
        } finally {
            setIsLoading(false);
        }
    };

    const resetNewSlide = () => {
        setNewSlide({
            title: '',
            image_url: '',
            link_url: '',
            description: '',
            is_active: true,
        });
    };
    const shortenUrl = (url) => {
        // Giả lập việc rút ngắn URL, có thể sử dụng một API thực tế để rút ngắn URL
        return url.length > 30 ? `${url.substring(0, 27)}...` : url;
    };

    return (
        <div>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <Button variant="primary" onClick={handleShowAdd} disabled={isLoading}>
                {isLoading ? 'Đang tải...' : 'Thêm Slide'}
            </Button>

            {/* Add Slide Modal */}
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
                    <Button variant="secondary" onClick={handleCloseAdd}>Đóng</Button>
                    <Button variant="primary" onClick={handleAddSlide} disabled={isLoading}>
                        {isLoading ? 'Đang thêm...' : 'Thêm Slide'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Slide Modal */}
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
                    <Button variant="primary" onClick={handleEditSlide} disabled={isLoading}>
                        {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
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

                            <td>{shortenUrl(slide.link_url)}</td>
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