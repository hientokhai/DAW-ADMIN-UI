import React from 'react';
import { Row, Col, Card, Table, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';

const DashDefault = () => {
    const orderStats = [
        { title: 'Đơn hàng đã xử lý', value: 120, icon: 'check-circle', class: 'bg-success' },
        { title: 'Đơn hàng đang chờ', value: 30, icon: 'hourglass', class: 'bg-warning' },
        { title: 'Đơn hàng đã giao', value: 90, icon: 'truck', class: 'bg-info' },
        { title: 'Đơn hàng đã hủy', value: 10, icon: 'times-circle', class: 'bg-danger' },
    ];

    const customerStats = [
        { title: 'Tổng số khách hàng', value: 500 },
        { title: 'Khách hàng mới hôm nay', value: 5 },
    ];

    const profitStats = [
        { title: 'Doanh thu hôm nay', value: '500,000 VND' },
        { title: 'Lợi nhuận', value: '500,000 VND' },
    ];

    const tabContent = (
        <React.Fragment>
            {orderStats.map((data, index) => (
                <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20" key={index}>
                    <div className="m-r-10 photo-table flex-shrink-0">
                        <Link to="#">
                            <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" />
                        </Link>
                    </div>
                    <div className="flex-grow-1 ms-3">
                        <h6 className="m-0 d-inline">{data.title}</h6>
                        <span className="float-end d-flex align-items-center">
                            <i className={`fa fa-caret-up f-22 m-r-10 ${data.class}`} />
                            {data.value}
                        </span>
                    </div>
                </div>
            ))}
        </React.Fragment>
    );

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
                            <h3>{profitStats[0].value}</h3>
                            <p>{profitStats[0].title}</p>
                            <h3>{profitStats[1].value}</h3>
                            <p>{profitStats[1].title}</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={12} xl={8} className="user-activity">
                    <Card>
                        <Tabs defaultActiveKey="today" id="uncontrolled-tab-example">
                            <Tab eventKey="today" title="Hôm nay">
                                {tabContent}
                            </Tab>
                            <Tab eventKey="week" title="Tuần này">
                                {tabContent}
                            </Tab>
                            <Tab eventKey="all" title="Tất cả">
                                {tabContent}
                            </Tab>
                        </Tabs>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default DashDefault;