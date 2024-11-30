const menuItems = {
  items: [
    {
      id: 'menu',
      title: 'MENU',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Bảng điều khiển',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/dashboard/default1'
        },
        {
          id: 'category',
          title: 'Quản lý Danh mục',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/category/category'
        },
        {
          id: 'product',
          title: 'Quản lý Sản phẩm',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/products/products'
        },
        {
          id: 'order',
          title: 'Quản lý Đơn hàng',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/order/order'
        },
        {
          id: 'comment_rate',
          title: 'Quản lý Bình luận',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/comment/comment'
        },
        {
          id: 'contact',
          title: 'Quản lý Liên hệ',
          type: 'item',
          icon: 'feather icon-phone',
          url: '/app/contacts/contacts'
        },
        {
          id: 'slideshow',
          title: 'Quản lý Slideshow',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/slideshow/slideshow'
        },
        {
          id: 'site_info',
          title: 'Quản lý Thông tin Website',
          type: 'item',
          icon: 'feather icon-info',
          url: '/app/siteinfo/siteinfo'
        },
        {
          id: 'statistic',
          title: 'Quản lý Thống kê',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/statistic/statistic'
        }
      ]
    }
  ]
};

export default menuItems;
