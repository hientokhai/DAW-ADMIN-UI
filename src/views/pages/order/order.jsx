import OrderApi from 'api/orderApi';
import { formatCurrency } from 'formatCurrency';
import { useState, useEffect } from 'react';
import { Button, Card, Form, Modal, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const navigate = useNavigate();

  const fetchOrderList = async () => {
    try {
      const response = await OrderApi.getAll();
      setOrders(response.data);
    } catch (error) {
      console.log('fail', error);
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, []);

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
        prevOrders.map((order) => (order.id === currentOrder.id ? { ...order, order_status: currentOrder.order_status } : order))
      );
    }
    handleClose();
    alert('Trạng thái đơn hàng đã được cập nhật!');
  };

  const handleStatusChange = (e) => {
    if (currentOrder) {
      setCurrentOrder({ ...currentOrder, order_status: e.target.value });
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Chờ xử lý':
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
      case 'Đã giao':
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
                    <td>{order.created_at}</td>
                    <td>{order.customer_name}</td>
                    <td style={{ fontWeight: 'bold' }}>{formatCurrency(order.total_order_price)}</td>
                    <td>{order.payment_method === 1 ? 'COD' : 'VNPay'}</td>
                    <td>
                      <p style={getStatusStyle(order.payment_status === 1 ? 'Đã thanh toán' : 'Chưa thanh toán')}>
                        {order.payment_status === 1 ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </p>
                    </td>
                    <td>
                      <p
                        style={getStatusStyle(
                          order.order_status === 1
                            ? 'Chờ xử lý'
                            : order.order_status === 2
                              ? 'Đang vận chuyển'
                              : order.order_status === 3
                                ? 'Đã giao'
                                : 'Đã hủy'
                        )}
                      >
                        {order.order_status === 1
                          ? 'Chờ xử lý'
                          : order.order_status === 2
                            ? 'Đang vận chuyển'
                            : order.order_status === 3
                              ? 'Đã giao'
                              : 'Đã hủy'}
                      </p>
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
                <Form.Control as="select" value={currentOrder.order_status} onChange={handleStatusChange}>
                  <option disabled value="Chờ xử lý">
                    Chờ xử lý
                  </option>
                  <option value="Đang vận chuyển">Bàn giao vận chuyển</option>
                  <option value="Đã giao">Giao thành công</option>
                  <option value="Đã hủy">Hủy đơn hàng</option>
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
