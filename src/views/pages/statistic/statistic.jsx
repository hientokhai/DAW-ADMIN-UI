import React, { useState, useEffect } from 'react';
import { Col, Card, Form, Row, Button, Alert } from 'react-bootstrap';
import StatisticApi from '../../../api/statisticApi';

const StatisticPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stats, setStats] = useState({ total_revenue: 0, total_orders: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStatistic = async ({ start_date = '', end_date = '' }) => {
    setLoading(true);
    try {
      const response = await StatisticApi.getAll({ start_date, end_date });
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Không thể tải dữ liệu thống kê.');
      console.log('Error fetching statistics:', error);
    }
  };

  const handleFilter = () => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError('Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc.');
      return;
    }
    setError(''); // Reset error message
    fetchStatistic({ start_date: startDate, end_date: endDate });
  };

  useEffect(() => {
    fetchStatistic({}); // Load initial stats without filter
  }, []);

  return (
    <Row>
      <Col md={6}>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Thống kê doanh thu</Card.Title>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
              <p>Đang tải...</p>
            ) : (
              <>
                <h3>{`Doanh thu: ${stats.total_revenue.toLocaleString()} VNĐ`}</h3>
                <h4>{`Số đơn hàng: ${stats.total_orders}`}</h4>
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Lọc theo thời gian</Card.Title>
          </Card.Header>
          <Card.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="startDate">
                    <Form.Label>Từ ngày</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="endDate">
                    <Form.Label>Đến ngày</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="primary" onClick={handleFilter} disabled={loading}>
                {loading ? 'Đang lọc...' : 'Lọc dữ liệu'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default StatisticPage;
