import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Modal, Table } from 'react-bootstrap';
import CommentApi from '../../../api/commentApi';

const CommentPage = () => {
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [newResponse, setNewResponse] = useState('');

  // const fetchComments = () => {
  //   const fakeData = [
  //     {
  //       id: 1,
  //       customerName: 'Hiên',
  //       customerPhone: '0866508347',
  //       customerEmail: 'hien@gmail.com',
  //       productName: 'Áo thun ABCCCCC',
  //       size: 'M',
  //       color: 'Nâu',
  //       image: 'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/January2024/poloapl220.9.jpg',
  //       comment: 'Áo rất đẹp, mặc thoáng mát, tôn dáng!',
  //       stars: 5,
  //       status: 'Chờ duyệt',
  //       response: 'Shop cảm ơn quý khách rất nhiều ạ...'
  //     },
  //     {
  //       id: 2,
  //       customerName: 'Khải',
  //       customerPhone: '0866508347',
  //       customerEmail: 'hien@gmail.com',
  //       productName: 'Áo thun ABCCCCC',
  //       size: 'M',
  //       color: 'Nâu',
  //       image: 'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/January2024/poloapl220.9.jpg',
  //       comment: 'Áo rất đẹp, mặc thoáng mát, tôn dáng!',
  //       stars: 5,
  //       status: 'Chờ duyệt',
  //       response: ''
  //     }
  //   ];
  //   setComments(fakeData);
  // };

  const fetchComments = async () => {
    try {
      const response = await CommentApi.getAll();
      setComments(response.data);
      console.log(response.data);
    } catch (error) {
      console.log('fail', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAccept = (id) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              status: 'Đã duyệt'
            }
          : comment
      )
    );
  };

  const handleRespond = (comment) => {
    setSelectedComment(comment);
    setNewResponse(comment.response || '');
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa đánh giá này không?');
    if (confirmDelete) {
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== id));
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedComment(null);
  };

  const handleSaveResponse = () => {
    if (selectedComment) {
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === selectedComment.id
            ? {
                ...comment,
                response: newResponse
              }
            : comment
        )
      );
    }
    handleClose();
  };

  const getStatusText = (status) => {
    const statusMap = {
      0: 'Chờ duyệt',
      1: 'Đã duyệt',
      2: 'Bị từ chối'
    };

    return statusMap[status] || 'Không xác định';
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Chờ duyệt':
        return {
          border: '3px solid #86857E',
          color: '#86857E',
          fontWeight: 'bold',
          borderRadius: '20px',
          textAlign: 'center',
          padding: '5px'
        };
      case 'Đã duyệt':
        return {
          border: '3px solid #28A745',
          color: '#28A745',
          fontWeight: 'bold',
          borderRadius: '20px',
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
          <Card.Title as="h5">TẤT CẢ ĐÁNH GIÁ</Card.Title>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Khách hàng</th>
                <th>Sản phẩm - Bình luận - đánh giá</th>
                <th>Trạng thái</th>
                <th>Phản hồi</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment, index) => (
                <tr key={comment.id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <ul>
                      <li>{comment.user.name}</li>
                      <li>{comment.user.phone_number}</li>
                      <li>{comment.user.email}</li>
                    </ul>
                  </td>
                  <td>
                    <ul>
                      <li style={{ marginBottom: '10px' }}>
                        <img src={comment.product_variant?.product.images[0]?.image_url} alt="product" style={{ width: '30px' }} />
                        {comment.product_variant?.product.name} - ({comment.product_variant?.size.size_name}/{' '}
                        {comment.product_variant?.color.color_name})
                      </li>
                      <li style={{ marginBottom: '10px' }}>Đánh giá: {comment.rating}⭐</li>
                      <li>Bình luận: {comment.comment_text}</li>
                    </ul>
                  </td>
                  <td>
                    <p style={getStatusStyle(comment.status)}>{getStatusText(comment.status)}</p>
                  </td>
                  <td>{comment.response}</td>
                  <td>
                    {comment.status === 'Chờ duyệt' && (
                      <Button style={{ width: '110px' }} variant="info" onClick={() => handleAccept(comment.id)}>
                        Chấp nhận
                      </Button>
                    )}
                    <br />
                    <Button style={{ width: '110px' }} variant="warning" onClick={() => handleRespond(comment)}>
                      Phản hồi
                    </Button>
                    <br />
                    <Button style={{ width: '110px' }} variant="danger" onClick={() => handleDelete(comment.id)}>
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal for responding to comments */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Phản hồi bình luận</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="responseInput">
              <Form.Label>Phản hồi của bạn</Form.Label>
              <Form.Control as="textarea" rows={3} value={newResponse} onChange={(e) => setNewResponse(e.target.value)} />
            </Form.Group>
          </Form>
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
    </>
  );
};

export default CommentPage;
