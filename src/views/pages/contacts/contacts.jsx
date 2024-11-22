import { useState, useEffect } from 'react';
import { Button, Card, Form, Modal, Table } from 'react-bootstrap';
import axios from 'axios';
import ContactApi from "../../../api/contactApi";

const ContactsPage = () => {
    const [contacts, setContacts] = useState([]);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentContact, setCurrentContact] = useState(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await ContactApi.getAll();
            setContacts(response.data); // Cập nhật state với dữ liệu từ API
        } catch (error) {
            console.error('Lỗi khi lấy danh sách liên hệ:', error);
            // Xóa hoặc không thực hiện thông báo lỗi
        }
    };

    const handleResponseContact = (contact) => {
        setCurrentContact(contact);
        setShowResponseModal(true);a
    };

    const handleClose = () => {
        setShowResponseModal(false);
        setShowDeleteModal(false);
        setCurrentContact(null);
    };

    const handleDeleteContact = (contactId) => {
        setShowDeleteModal(true);
        setCurrentContact(contacts.find(contact => contact.id === contactId));
    };

    const confirmDelete = async () => {
        try {
            await ContactApi.delete(currentContact.id);
            setContacts(contacts.filter(contact => contact.id !== currentContact.id));
            handleClose();
            alert('Liên hệ đã được xóa!');
        } catch (error) {
            console.error('Lỗi khi xóa liên hệ:', error);
            alert('Không thể xóa liên hệ. Vui lòng thử lại!');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentContact((prevContact) => ({
            ...prevContact,
            [name]: value,
        }));
    };


    const handleSaveResponse = async () => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/contacts/${currentContact.id}`, {
                response: currentContact.response, // Trường cần gửi
            });
    
            if (response.status === 200) {
                // Cập nhật danh sách liên hệ
                setContacts((prevContacts) =>
                    prevContacts.map((contact) =>
                        contact.id === currentContact.id
                            ? { ...contact, response: currentContact.response, status: 'replied' }
                            : contact
                    )
                );
                handleClose();
                alert('Phản hồi đã được lưu thành công!');
                fetchContacts();
            }
        } catch (error) {
            console.error('Lỗi khi lưu phản hồi:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại.');
        }
    };
    


    return (
        <>
            <Card>
                <Card.Header>
                    <Card.Title as="h5">QUẢN LÝ LIÊN HỆ KHÁCH HÀNG</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Ngày giờ</th>
                                <th>Khách hàng</th>
                                <th>Email</th>
                                <th>Địa chỉ</th>
                                <th>Chủ đề liên hệ</th>
                                <th>Nội dung</th>
                                <th>Trạng thái</th>
                                <th>Nội dung phản hồi</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.length > 0 ? (
                                contacts.map((contact, index) => (
                                    <tr key={contact.id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{contact.created_at}</td>
                                        {/* Thông tin người dùng */}
                                        <td>{contact.user ? contact.user.name : 'Không có tên'}</td>
                                        <td>{contact.user ? contact.user.email : 'Không có email'}</td>
                                        <td>{contact.user ? contact.user.address : 'Không có địa chỉ'}</td>
                                        {/* Thông tin liên hệ */}
                                        <td>{contact.title}</td>
                                        <td>{contact.message}</td>
                                        <td>
                                            <span
                                                style={{
                                                    color: contact.status === 1 ? 'green' : 'red',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {contact.status === 1 ? 'Đã phản hồi' : 'Chưa phản hồi'}
                                            </span>
                                        </td>
                                        <td>
                                            {contact.response || 'Chưa có phản hồi'}
                                        </td>
                                        <td>
                                            {contact.status !== 1 && (
                                                <Button
                                                    variant="warning"
                                                    onClick={() => handleResponseContact(contact)}
                                                >
                                                    Phản hồi
                                                </Button>
                                            )}
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDeleteContact(contact.id)}
                                            >
                                                Xóa
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center">
                                        Không có liên hệ
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Modal phản hồi */}
            <Modal show={showResponseModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Phản hồi khách hàng: {currentContact?.user?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentContact && (
                        <Form>
                            <Form.Group controlId="subject">
                                <Form.Label>Tiêu đề</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="subject"
                                    value={currentContact.title}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group controlId="message">
                                <Form.Label>Nội dung liên hệ</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="message"
                                    value={currentContact.message}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group controlId="response">
                                <Form.Label>Phản hồi của bạn</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="response"
                                    value={currentContact.response || ''}
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
                    <Button variant="primary" onClick={handleSaveResponse}>
                        Lưu phản hồi
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal xác nhận xóa */}
            <Modal show={showDeleteModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bạn có chắc chắn muốn xóa liên hệ này không?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ContactsPage;
