import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tabs, Tab } from 'react-bootstrap';
import OrderApi from 'api/orderApi';
import CustomerApi from 'api/customerApi'; // API mới để lấy danh sách khách hàng

const DashDefault = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [totals, setTotals] = useState({
    'Chờ xử lý': 0,
    'Đang vận chuyển': 0,
    'Đã giao': 0,
    'Đã hủy': 0
  });
  const [revenue, setRevenue] = useState(0); // Tổng doanh thu
  const [profit, setProfit] = useState(0); // Tổng lợi nhuận
  const [customers, setCustomers] = useState([]); // Danh sách khách hàng
  const [totalCustomers, setTotalCustomers] = useState(0); // Tổng số khách hàng
  const [newCustomersToday, setNewCustomersToday] = useState(0); // Tổng số khách hàng mới hôm nay

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, []);

  const fetchOrders = async () => {
    try {
      // Fetch đơn hàng
      const response = await OrderApi.getAll();
      console.log('Dữ liệu đơn hàng:', response.data);
      setOrders(response.data);
      setFilteredOrders(response.data);
      // Tính tổng trạng thái đơn hàng
      const calculatedTotals = calculateOrderStatusTotals(response.data);
      setTotals(calculatedTotals);

      // Tính doanh thu và lợi nhuận
      calculateRevenueAndProfit(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      // Fetch khách hàng
      const response = await CustomerApi.getAll();
      console.log('Dữ liệu khách hàng:', response.data);
      setCustomers(response.data);

      // Tính tổng số khách hàng và số khách hàng mới trong hôm nay
      calculateCustomerStats(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khách hàng:', error);
    }
  };

  const calculateOrderStatusTotals = (orders) => {
    const totals = {
      'Chờ xử lý': 0,
      'Đang vận chuyển': 0,
      'Đã giao': 0,
      'Đã hủy': 0
    };

    orders.forEach((orderStats) => {
      switch (orderStats.order_status) {
        case 1:
          totals['Chờ xử lý'] += 1;
          break;
        case 2:
          totals['Đang vận chuyển'] += 1;
          break;
        case 3:
          totals['Đã giao'] += 1;
          break;
        default:
          totals['Đã hủy'] += 1;
          break;
      }
    });

        return totals;
    };
    
    const parseDate = (date) => {
        if (!date || date === 'N/A') return null;
        const [day, month, year] = date.split('/');
        return new Date(`${year}-${month}-${day}`);
    };

    const calculateRevenueAndProfit = (orders) => {
        let totalRevenue = 0; // Tổng doanh thu
        let totalProfit = 0; // Tổng lợi nhuận
    
        // Lấy ngày hiện tại
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
        orders.forEach((order) => {
            // Lấy ngày tạo đơn hàng và kiểm tra định dạng
            const orderDate = parseDate(order.created_at)?.toISOString().split('T')[0];
    
            // Chỉ tính các đơn hàng đã giao trong ngày hôm nay
            if (orderDate === today && order.order_status === 3) {
                totalRevenue += order.total_order_price; // Cộng tổng giá trị đơn hàng
    
                // Tính tổng giá nhập từ chi tiết hóa đơn
                const totalCost = order.order_details?.reduce((sum, item) => {
                    return sum + (item.ori_price || 0) * (item.quantity || 0); // Giá nhập * số lượng
                }, 0) || 0;
    
                // Lợi nhuận = Doanh thu - Tổng giá nhập
                totalProfit += order.total_order_price - totalCost;
            }
        });
    
        setRevenue(totalRevenue); // Cập nhật doanh thu
        setProfit(totalProfit); // Cập nhật lợi nhuận
    };

    const calculateCustomerStats = (customers) => {
      const today = new Date().toISOString().split('T')[0]; // Ngày hôm nay
      let totalCustomers = 0;
      let newCustomersToday = 0;
  
      customers.forEach((customer) => {
          if (customer.role === 'customer') {
              totalCustomers += 1;
  
              // Kiểm tra nếu created_at hợp lệ trước khi sử dụng
              if (customer.created_at && !isNaN(new Date(customer.created_at))) {
                  const customerCreatedDate = new Date(customer.created_at).toISOString().split('T')[0];
                  if (customerCreatedDate === today) {
                      newCustomersToday += 1;
                  }
              }
          }
      });
  
      setTotalCustomers(totalCustomers);
      setNewCustomersToday(newCustomersToday);
  };
    
    const orderStats = [
        { title: 'Đơn hàng chờ xử lý', value: totals["Chờ xử lý"], icon: 'hourglass', class: 'bg-warning' },
        { title: 'Đơn hàng đang vận chuyển', value: totals["Đang vận chuyển"], icon: 'truck', class: 'bg-info' },
        { title: 'Đơn hàng đã giao', value: totals["Đã giao"], icon: 'check-circle', class: 'bg-success' },
        { title: 'Đơn hàng đã hủy', value: totals["Đã hủy"], icon: 'times-circle', class: 'bg-danger' },
    ];

  const customerStats = [
    { title: 'Tổng số khách hàng', value: totalCustomers },
    { title: 'Khách hàng mới hôm nay', value: newCustomersToday }
  ];

    return (
        <React.Fragment>
            <Row>
                {orderStats.map((data, index) => (
                    <Col key={index} md={6} xl={3}>
                        <Card>
                            <Card.Body>
                                <h6 className="mb-4">{data.title}</h6>
                                <div className="d-flex align-items-center">
                                    <i className={`fa fa-${data.icon} f-30 m-r-10 ${data.class}`} />
                                    <h3 className="m-0">{data.value}</h3>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
                <Col md={6} xl={4}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Khách hàng</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <h3>{customerStats[0].value}</h3>
                            <p>{customerStats[0].title}</p>
                            <h3>{customerStats[1].value}</h3>
                            <p>{customerStats[1].title}</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xl={4}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Lợi nhuận</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <h3>{revenue.toLocaleString()} VND</h3>
                            <p>Doanh thu hôm nay</p>
                            <h3>{profit.toLocaleString()} VND</h3>
                            <p>Lợi nhuận</p>
                        </Card.Body>
                    </Card>
                </Col>
      </Row>
    </React.Fragment>
  );
};

export default DashDefault;
