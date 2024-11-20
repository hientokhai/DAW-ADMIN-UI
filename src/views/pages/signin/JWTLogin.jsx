import React from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios'; // Cần cài axios
import { useNavigate } from 'react-router-dom'; // Hook để chuyển hướng

const JWTLogin = () => {
  const navigate = useNavigate(); // Dùng để chuyển hướng sau khi đăng nhập thành công

  const handleLogin = (values) => {
    axios
      .post('http://127.0.0.1:8000/api/login', {
        email: values.email,
        password: values.password,
      })
      .then((response) => {
        // Kiểm tra nếu có token trong response
        if (response.data.token) {
          // Kiểm tra role của người dùng
          const userRole = response.data.user.role; // Giả sử user.role là cách lấy thông tin role
  
          if (userRole === 'admin') {
            // Lưu token vào localStorage (hoặc sessionStorage)
            localStorage.setItem('token', response.data.token);
  
            // Chuyển hướng đến trang Dashboard
            navigate('/app/dashboard/default1');
          } else {
            // Nếu không phải admin, thông báo lỗi
            alert('Đăng nhập bị từ chối! Chỉ có admin mới có thể đăng nhập.');
          }
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu đăng nhập không thành công
        alert('Login failed: ' + (error.response?.data.message || 'Something went wrong!'));
      });
  };
  return (
    <Formik
      initialValues={{
        email: 'admin@gmail.com',
        password: '***',
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Vui lòng nhập đúng định dạng email').max(255).required('Vui lòng nhập email'),
        password: Yup.string().max(255).required('Vui lòng nhập mật khẩu'),
      })}
      onSubmit={handleLogin} // Gọi hàm handleLogin khi submit
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              className="form-control"
              label="Email Address / Username"
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              type="email"
              value={values.email}
            />
            {touched.email && errors.email && <small className="text-danger form-text">{errors.email}</small>}
          </div>
          <div className="form-group mb-4">
            <input
              className="form-control"
              label="Password"
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              type="password"
              value={values.password}
            />
            {touched.password && errors.password && <small className="text-danger form-text">{errors.password}</small>}
          </div>

          {errors.submit && (
            <Col sm={12}>
              <Alert>{errors.submit}</Alert>
            </Col>
          )}

          <Row>
            <Col mt={2}>
              <Button className="btn-block mb-4" color="primary" disabled={isSubmitting} size="large" type="submit" variant="primary">
                Đăng nhập
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </Formik>
  );
};

export default JWTLogin;