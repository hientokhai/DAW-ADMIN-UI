import { useState, useEffect } from 'react';
import { Button, Card, Form, Modal, Table } from 'react-bootstrap';

const ContactsPage = () => {
    const [contacts, setContacts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showResponseModal, setShowResponseModal] = useState(false); // Modal phản hồi
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal xác nhận xóa
    const [currentContact, setCurrentContact] = useState(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = () => {
        const fakeData = [
            {
                id: 1,
                createdAt: '11/12/2024',
                customerName: 'Dân Tứn',
                email: 'DanTun@example.com',
                phone: '0123456789',
                address: '123 Đường ABC, Quận 1, TP.HCM',
                subject: 'Cần tư vấn mua hàng',
                message: 'Xin chào, tôi muốn hỏi về sản phẩm mới nhất.',
                status: 'Chưa phản hồi',
                response: ''
            },
            {
                id: 2,
                createdAt: '10/12/2024',
                customerName: 'Nguyễn Văn A',
                email: 'nguyenvana@example.com',
                phone: '0987654321',
                address: '456 Đường DEF, Quận 2, TP.HCM',
                subject: 'Hỏi về tình trạng đơn hàng',
                message: 'Đơn hàng của tôi tới đâu rồi?',
                status: 'Đã phản hồi',
                response: 'Đơn hàng của bạn đang được vận chuyển.'
            },
            {
                id: 3,
                createdAt: '10/12/2024',
                customerName: 'Nguyễn Văn B',
                email: 'nguyenvanb@example.com',
                phone: '0987654321',
                address: '456 Đường DEF, Quận 2, TP.HCM',
                subject: 'Phàn nàn về dịch vụ',
                message: 'Tôi muốn biết thêm thông tin về dịch vụ bảo hành.',
                status: 'Chưa phản hồi',
                response: ''
            },
        ];
        setContacts(fakeData);
    };

    const handleEditContact = (contact) => {
        setCurrentContact(contact);
        setShowModal(true);
    };

    const handleResponseContact = (contact) => {
        setCurrentContact(contact);
        setShowResponseModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setShowResponseModal(false);
        setShowDeleteModal(false);
        setCurrentContact(null);
    };

    const handleDeleteContact = (contactId) => {
        // Hiển thị modal xác nhận xóa
        setShowDeleteModal(true);
        setCurrentContact(contacts.find(contact => contact.id === contactId));
    };

    const confirmDelete = () => {
        setContacts(contacts.filter(contact => contact.id !== currentContact.id));
        handleClose();
        alert('Liên hệ đã được xóa!');
    };

    const cancelDelete = () => {
        handleClose();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (currentContact) {
            setCurrentContact({ ...currentContact, [name]: value });
        }
    };

    const handleSaveContactChange = () => {
        if (currentContact) {
            setContacts((prevContacts) =>
                prevContacts.map((contact) =>
                    contact.id === currentContact.id ? { ...contact, ...currentContact } : contact
                )
            );
        }
        handleClose();
        alert('Thông tin liên hệ đã được cập nhật!');
    };

    const handleSaveResponse = () => {
        if (currentContact) {
            setContacts((prevContacts) =>
                prevContacts.map((contact) =>
                    contact.id === currentContact.id ? {
                        ...contact,
                        response: currentContact.response,
                        status: 'Đã phản hồi'
                    } : contact
                )
            );
        }
        handleClose();
        alert('Phản hồi đã được lưu!');
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
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.length > 0 ? (
                                contacts.map((contact, index) => (
                                    <tr key={contact.id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{contact.createdAt}</td>
                                        <td>{contact.customerName}</td>
                                        <td>{contact.email}</td>
                                        <td>{contact.address}</td>
                                        <td>{contact.subject}</td>
                                        <td>{contact.message}</td>
                                        <td>
                                            <span
                                                style={{
                                                    color: contact.status === 'Đã phản hồi' ? 'green' : 'red',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {contact.status}
                                            </span>
                                        </td>
                                        <td>
                                            <Button variant="info" onClick={() => handleEditContact(contact)}>
                                                Cập Nhật
                                            </Button>{' '}
                                            {contact.status === 'Chưa phản hồi' && (
                                                <Button variant="warning" onClick={() => handleResponseContact(contact)}>
                                                    Phản hồi
                                                </Button>
                                            )}{' '}
                                            <Button variant="danger" onClick={() => handleDeleteContact(contact.id)}>
                                                Xóa
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center">
                                        Không có liên hệ
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Modal chỉnh sửa thông tin liên hệ */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa thông tin khách hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentContact && (
                        <Form>
                            <Form.Group controlId="customerName">
                                <Form.Label>Tên khách hàng</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="customerName"
                                    value={currentContact.customerName}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="phone">
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="phone"
                                    value={currentContact.phone}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={currentContact.email}
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
                    <Button variant="primary" onClick={handleSaveContactChange}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal phản hồi */}
            <Modal show={showResponseModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Phản hồi khách hàng: {currentContact ? currentContact.customerName : ''}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentContact && (
                        <Form>
                            <Form.Group controlId="subject">
                                <Form.Label>Tiêu đề</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="subject"
                                    value={currentContact.subject}
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
                            <Form.Group controlId="status">
                                <Form.Label>Trạng thái</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentContact.status}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group controlId="response">
                                <Form.Label>Phản hồi của bạn</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="response"
                                    value={currentContact.response}
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
                    <Button variant="secondary" onClick={cancelDelete}>
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
