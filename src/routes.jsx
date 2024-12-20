import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import { BASE_URL } from './config/constant';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    exact: 'true',
    path: '/login',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  // Đăng nhập - hien
  {
    exact: 'true',
    path: '/sign-in',
    element: lazy(() => import('./views/pages/signin/signin'))
  },
  // Đăng ký - hien
  {
    exact: 'true',
    path: '/sign-up',
    element: lazy(() => import('./views/pages/signup/signup'))
  },
  {
    exact: 'true',
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: true,
        path: '/app/slideshow/slideshow',
        element: lazy(() => import('./views/pages/slideshow/slideshow'))
      },
      {
        exact: true,
        path: '/app/category/category',
        element: lazy(() => import('./views/pages/category/category'))
      },
      {
        exact: true,
        path: '/app/order/order',
        element: lazy(() => import('./views/pages/order/order'))
      },
      {
        exact: true,
        path: '/app/order/:orderId',
        element: lazy(() => import('./views/pages/order/orderDetail'))
      },
      //Văn Tuấn QLLH
      {
        exact: 'true',
        path: '/app/contacts/contacts',
        element: lazy(() => import('./views/pages/contacts/contacts'))
      },
      {
        exact: 'true',
        path: '/app/contacts/:contactId',
        element: lazy(() => import('./views/pages/contacts/contactsDetail'))
      },
      // Văn Tuấn QLTTWS
      {
        exact: 'true',
        path: '/app/siteinfo/siteinfo',
        element: lazy(() => import('./views/pages/siteinfo/siteinfo'))
      },
      ///////////////
      {
        exact: true,
        path: '/app/comment/comment',
        element: lazy(() => import('./views/pages/comment/comment'))
      },
      {
        exact: true,
        path: '/app/statistic/statistic',
        element: lazy(() => import('./views/pages/statistic/statistic'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/default1',
        element: lazy(() => import('./views/dashboard/index1'))
      },
      //////
      {
        exact: 'true',
        path: '/app/products/products',
        element: lazy(() => import('./views/pages/products/products'))
      },
      {
        exact: 'true',
        path: '/app/products/addproducts',
        element: lazy(() => import('./views/pages/products/addproducts'))
      },
      {
        exact: 'true',
        path: '/app/products/update/:id',
        element: lazy(() => import('./views/pages/products/update'))
      },
      {
        exact: 'true',
        path: '/app/products/create',
        element: lazy(() => import('./views/pages/products/create'))
      },
      ///////
      {
        exact: 'true',
        path: '/basic/button',
        element: lazy(() => import('./views/ui-elements/basic/BasicButton'))
      },
      {
        exact: 'true',
        path: '/basic/badges',
        element: lazy(() => import('./views/ui-elements/basic/BasicBadges'))
      },
      {
        exact: 'true',
        path: '/basic/breadcrumb-paging',
        element: lazy(() => import('./views/ui-elements/basic/BasicBreadcrumb'))
      },
      {
        exact: 'true',
        path: '/basic/collapse',
        element: lazy(() => import('./views/ui-elements/basic/BasicCollapse'))
      },
      {
        exact: 'true',
        path: '/basic/tabs-pills',
        element: lazy(() => import('./views/ui-elements/basic/BasicTabsPills'))
      },
      {
        exact: 'true',
        path: '/basic/typography',
        element: lazy(() => import('./views/ui-elements/basic/BasicTypography'))
      },
      {
        exact: 'true',
        path: '/forms/form-basic',
        element: lazy(() => import('./views/forms/FormsElements'))
      },
      {
        exact: 'true',
        path: '/tables/bootstrap',
        element: lazy(() => import('./views/tables/BootstrapTable'))
      },
      {
        exact: 'true',
        path: '/charts/nvd3',
        element: lazy(() => import('./views/charts/nvd3-chart'))
      },
      {
        exact: 'true',
        path: '/maps/google-map',
        element: lazy(() => import('./views/maps/GoogleMaps'))
      },
      {
        exact: 'true',
        path: '/sample-page',
        element: lazy(() => import('./views/extra/SamplePage'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default routes;
