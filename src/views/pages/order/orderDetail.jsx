import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, ListGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { formatCurrency } from 'formatCurrency';

const OrderDetailPage = () => {
  const { orderId } = useParams(); // Lấy orderId từ URL
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetails(orderId);
  }, [orderId]);

  const fetchOrderDetails = (id) => {
    const fakeOrders = [
      {
        id: 1,
        createdAt: '11/12/2024',
        customer: 'Khải Hiên',
        phone_number: '0866508347',
        address: 'abc street',
        totalAmount: '525000',
        paymentMethod: 'VNPay',
        paymentStatus: 'Đã thanh toán',
        orderStatus: 'Chờ xác nhận',
        items: [
          {
            name: 'Áo thun',
            quantity: 2,
            price: 200000,
            imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/January2024/poloapl220.9.jpg'
          },
          {
            name: 'Quần jeans',
            quantity: 1,
            price: 125000,
            imageUrl:
              'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/July2024/Quan_Jeans_Nam_sieu_nhe.xanh_dam.jpg'
          }
        ]
      }
    ];

    // Lấy thông tin đơn hàng từ danh sách giả lập
    const foundOrder = fakeOrders.find((order) => order.id === parseInt(id));
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      alert('Đơn hàng không tồn tại!');
      navigate(-1); // Quay lại trang trước đó nếu không tìm thấy đơn hàng
    }
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Chi Tiết Đơn Hàng #{orderId}</Card.Title>
      </Card.Header>
      <Card.Body>
        {order ? (
          <>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Ngày tạo:</strong> {order.createdAt}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Khách hàng:</strong> {order.customer} ({order.phone_number})
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Địa chỉ nhận hàng:</strong> {order.address}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Tổng đơn hàng:</strong> {formatCurrency(order.totalAmount)}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Hình thức thanh toán:</strong> {order.paymentMethod}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Trạng thái thanh toán:</strong> {order.paymentStatus}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Trạng thái đơn hàng:</strong> {order.orderStatus}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Sản phẩm:</strong>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{ width: '80px', height: '80px', marginRight: '10px', objectFit: 'cover' }}
                      />
                      <div>
                        {item.name} - Số lượng: {item.quantity} - Giá: {formatCurrency(item.price)}
                      </div>
                    </li>
                  ))}
                </ul>
              </ListGroup.Item>
            </ListGroup>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Quay lại
            </Button>
          </>
        ) : (
          <p>Đang tải thông tin đơn hàng...</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default OrderDetailPage;
