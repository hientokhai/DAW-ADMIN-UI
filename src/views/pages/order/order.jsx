import { formatCurrency } from 'formatCurrency';
import { useState, useEffect } from 'react';
import { Button, Card, Form, Modal, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    const fakeData = [
      {
        id: 1,
        createdAt: '11/12/2024',
        customer: 'Khải Hiên',
        totalAmount: '525000',
        paymentMethod: 'VNPay',
        paymentStatus: 'Đã thanh toán',
        orderStatus: 'Chờ xác nhận'
      },
      {
        id: 2,
        createdAt: '10/12/2024',
        customer: 'Nguyễn Văn A',
        totalAmount: '730000',
        paymentMethod: 'COD',
        paymentStatus: 'Chưa thanh toán',
        orderStatus: 'Đang vận chuyển'
      },
      {
        id: 3,
        createdAt: '10/12/2024',
        customer: 'Nguyễn Văn B',
        totalAmount: '730000',
        paymentMethod: 'COD',
        paymentStatus: 'Đã thanh toán',
        orderStatus: 'Hoàn thành'
      },
      {
        id: 4,
        createdAt: '10/12/2024',
        customer: 'Nguyễn Văn C',
        totalAmount: '730000',
        paymentMethod: 'COD',
        paymentStatus: 'Chưa thanh toán',
        orderStatus: 'Đã hủy'
      }
    ];
    setOrders(fakeData);
  };

  const handleEditOrderStatus = (order) => {
    setCurrentOrder(order);
    setShowModal(true);
  };

  const handleDeleteOrder = (orderId) => {
    // Xác nhận trước khi xóa
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?');
    if (confirmDelete) {
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      alert('Đơn hàng đã được xóa.');
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/app/order/${orderId}`);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentOrder(null);
  };

  const handleSaveStatusChange = () => {
    if (currentOrder) {
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === currentOrder.id ? { ...order, orderStatus: currentOrder.orderStatus } : order))
      );
    }
    handleClose();
    alert('Trạng thái đơn hàng đã được cập nhật!');
  };

  const handleStatusChange = (e) => {
    if (currentOrder) {
      setCurrentOrder({ ...currentOrder, orderStatus: e.target.value });
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Chờ xác nhận':
        return {
          border: '3px solid #86857E',
          color: '#86857E',
          fontWeight: 'bold',
          borderRadius: '20px',
          textAlign: 'center',
          padding: '5px'
        };
      case 'Đang vận chuyển':
        return {
          border: '3px solid #FFA500',
          color: '#FFA500',
          fontWeight: 'bold',
          borderRadius: '20px',
          textAlign: 'center',
          padding: '5px'
        };
      case 'Hoàn thành':
        return {
          border: '3px solid #28A745',
          color: '#28A745',
          fontWeight: 'bold',
          borderRadius: '20px',
          textAlign: 'center',
          padding: '5px'
        };
      case 'Đã hủy':
        return {
          border: '3px solid #db2b39',
          color: '#db2b39',
          fontWeight: 'bold',
          borderRadius: '20px',
          textAlign: 'center',
          padding: '5px'
        };
      case 'Chưa thanh toán':
        return {
          color: 'black',
          backgroundColor: '#EDEBE1',
          fontWeight: 'bold',
          borderRadius: '5px',
          textAlign: 'center',
          padding: '5px'
        };
      case 'Đã thanh toán':
        return {
          backgroundColor: '#28A745',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '5px',
          textAlign: 'center',
          padding: '5px'
        };
      default:
        return {
          border: '3px solid #000000',
          color: '#000000',
          fontWeight: 'bold',
          borderRadius: '20px',
          textAlign: 'center',
          padding: '5px'
        };
    }
  };

  return (
    <>
      <Card>
        <Card.Header>
          <Card.Title as="h5">TẤT CẢ ĐƠN HÀNG</Card.Title>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Ngày tạo</th>
                <th>Khách hàng</th>
                <th>Tổng đơn hàng</th>
                <th>HTTT</th>
                <th>Trạng thái Thanh toán</th>
                <th>Trạng thái đơn hàng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={order.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{order.createdAt}</td>
                    <td>{order.customer}</td>
                    <td style={{ fontWeight: 'bold' }}>{formatCurrency(order.totalAmount)}</td>
                    <td>{order.paymentMethod}</td>
                    <td>
                      <p style={getStatusStyle(order.paymentStatus)}>{order.paymentStatus}</p>
                    </td>
                    <td>
                      <p style={getStatusStyle(order.orderStatus)}>{order.orderStatus}</p>
                    </td>
                    <td>
                      <Button variant="info" onClick={() => handleViewDetails(order.id)}>
                        Chi tiết
                      </Button>
                      <Button variant="warning" onClick={() => handleEditOrderStatus(order)}>
                        Sửa
                      </Button>{' '}
                      <Button variant="danger" onClick={() => handleDeleteOrder(order.id)}>
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    Không có đơn hàng
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa trạng thái đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentOrder && (
            <Form>
              <Form.Group controlId="orderStatus">
                <Form.Label>Trạng thái đơn hàng</Form.Label>
                <Form.Control as="select" value={currentOrder.orderStatus} onChange={handleStatusChange}>
                  <option disabled value="Chờ xác nhận">
                    Chờ xác nhận
                  </option>
                  <option value="Đang vận chuyển">Bàn giao vận chuyển</option>
                  <option value="Hoàn thành">Giao thành công</option>
                  <option value="Đã hủy">Hủy đơn</option>
                </Form.Control>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSaveStatusChange}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderPage;
