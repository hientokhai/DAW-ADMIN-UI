import React from 'react';
import { Card } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

import AuthLogin from './JWTLogin';

const SignIn = () => {
  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless text-center">
            <Card.Body>
              <div className="mb-4">
                <i className="feather icon-unlock auth-icon" />
              </div>
              <AuthLogin />
              <p className="mb-2 text-muted">
                Quên mật khẩu?{' '}
                <NavLink to={'#'} className="f-w-400">
                  Đặt lại
                </NavLink>
              </p>
              <p className="mb-0 text-muted">
                Bạn chưa có tài khoản?{' '}
                <NavLink to="/sign-up" className="f-w-400">
                  Đăng ký
                </NavLink>
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignIn;
