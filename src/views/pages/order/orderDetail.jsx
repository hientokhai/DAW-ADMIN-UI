import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, ListGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { formatCurrency } from 'formatCurrency';
import OrderApi from 'api/orderApi';

const OrderDetailPage = () => {
  const { orderId } = useParams(); // Lấy orderId từ URL
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  const fetchOrderDetail = async () => {
    try {
      const response = await OrderApi.get(orderId);
      setOrder(response.data);
    } catch (error) {
      console.log('fail', error);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  // const fetchOrderDetails = (id) => {
  //   const fakeOrders = [
  //     {
  //       id: 1,
  //       created_at: '11/12/2024',
  //       customer: 'Khải Hiên',
  //       phone_number: '0866508347',
  //       address: 'abc street',
  //       total_order_price: '525000',
  //       payment_method: 'VNPay',
  //       payment_status: 'Đã thanh toán',
  //       order_status: 'Chờ xác nhận',
  //       products: [
  //         {
  //           name: 'Áo thun',
  //           quantity: 2,
  //           price: 200000,
  //           imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/January2024/poloapl220.9.jpg'
  //         },
  //         {
  //           name: 'Quần jeans',
  //           quantity: 1,
  //           price: 125000,
  //           imageUrl:
  //             'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/July2024/Quan_Jeans_Nam_sieu_nhe.xanh_dam.jpg'
  //         }
  //       ]
  //     }
  //   ];

  //   // Lấy thông tin đơn hàng từ danh sách giả lập
  //   const foundOrder = fakeOrders.find((order) => order.id === parseInt(id));
  //   if (foundOrder) {
  //     setOrder(foundOrder);
  //   } else {
  //     alert('Đơn hàng không tồn tại!');
  //     navigate(-1); // Quay lại trang trước đó nếu không tìm thấy đơn hàng
  //   }
  // };

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
                <strong style={{ color: 'black' }}>Ngày tạo:</strong> {order.created_at}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong style={{ color: 'black' }}>Khách hàng:</strong> {order.customer} ({order.phone_number})
              </ListGroup.Item>
              <ListGroup.Item>
                <strong style={{ color: 'black' }}>Địa chỉ nhận hàng:</strong> {order.address}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong style={{ color: 'black' }}>Tổng đơn hàng:</strong> {formatCurrency(order.total_order_price)}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong style={{ color: 'black' }}>Hình thức thanh toán:</strong> {order.payment_method}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong style={{ color: 'black' }}>Trạng thái thanh toán:</strong> {order.payment_status}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong style={{ color: 'black' }}>Trạng thái đơn hàng:</strong>{' '}
                {order.order_status === 1
                  ? 'Chờ xử lý'
                  : order.order_status === 2
                    ? 'Đang vận chuyển'
                    : order.order_status === 3
                      ? 'Đã giao'
                      : 'Đã hủy'}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong style={{ color: 'black' }}>Sản phẩm:</strong>
                <ul>
                  {order.products.map((item, index) => (
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
