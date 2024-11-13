import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, ListGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const ContactDetailPage = () => {
  const { contactId } = useParams(); // Lấy contactId từ URL
  const [contact, setContact] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContactDetails(contactId);
  }, [contactId]);

  const fetchContactDetails = (id) => {
    // Dữ liệu giả lập của các liên hệ
    const fakeContacts = [
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
        },
        {
            id: 2,
            createdAt: '10/12/2024',
            customerName: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
            phone: '0987654321',
            address: '456 Đường DEF, Quận 2, TP.HCM',
            subject: 'Hỏ về tình trạng đơn hàng',
            message: 'Đơn hàng của tôi tới đâu rồi?',
            status: 'Đã phản hồi',
        },
        {
            id: 3,
            createdAt: '10/12/2024',
            customerName: 'Nguyễn Văn B',
            email: 'nguyenvana@example.com',
            phone: '0987654321',
            address: '456 Đường DEF, Quận 2, TP.HCM',
            subject: 'Phàn nàn về dịch vụ',
            message: 'Tôi muốn biết thêm thông tin về dịch vụ bảo hành.',
            status: 'Chưa phản hồi',
        },
    ];

    // Lấy thông tin liên hệ từ danh sách giả lập
    const foundContact = fakeContacts.find((contact) => contact.id === parseInt(id));
    if (foundContact) {
      setContact(foundContact);
    } else {
      alert('Liên hệ không tồn tại!');
      navigate(-1); // Quay lại trang trước đó nếu không tìm thấy liên hệ
    }
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Chi Tiết Liên Hệ #{contactId}</Card.Title>
      </Card.Header>
      <Card.Body>
        {contact ? (
          <>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Ngày gửi:</strong> {contact.createdAt}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Khách hàng:</strong> {contact.customerName} ({contact.phoneNumber})
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Email:</strong> {contact.email}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Địa chỉ:</strong> {contact.address}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Chủ đề liên hệ:</strong> {contact.subject}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Nội dung:</strong> {contact.message}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Trạng thái:</strong> {contact.status}
              </ListGroup.Item>
            </ListGroup>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Quay lại
            </Button>
          </>
        ) : (
          <p>Đang tải thông tin liên hệ...</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default ContactDetailPage;
