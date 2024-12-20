import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Form, Toast } from 'react-bootstrap';
import CategoryApi from 'api/CategoryApi';
import SizeApi from 'api/SizeApi';
import ColorsApi from 'api/colorApi';
// Hàm để chuyển đổi tên thành slug
const generateSlug = (name) => {
  if (typeof name !== 'string') return ''; // Kiểm tra đầu vào

  const accentsMap = {
    à: 'a', á: 'a', ả: 'a', ã: 'a', ạ: 'a',
    â: 'a', ầ: 'a', ấ: 'a', ẩ: 'a', ẫ: 'a', ậ: 'a',
    è: 'e', é: 'e', ẻ: 'e', ẽ: 'e', ẹ: 'e',
    ê: 'e', ề: 'e', ế: 'e', ể: 'e', ễ: 'e', ệ: 'e',
    ì: 'i', í: 'i', ỉ: 'i', ĩ: 'i', ị: 'i',
    ò: 'o', ó: 'o', ỏ: 'o', õ: 'o', ọ: 'o',
    ô: 'o', ồ: 'o', ố: 'o', ổ: 'o', ỗ: 'o', ộ: 'o',
    ù: 'u', ú: 'u', ủ: 'u', ũ: 'u', ụ: 'u',
    ư: 'u', ừ: 'u', ứ: 'u', ử: 'u', ữ: 'u', ự: 'u',
    ý: 'y', ỳ: 'y', ỷ: 'y', ỹ: 'y', ỵ: 'y',
    Đ: 'D', đ: 'd'
  };

  // Thay thế các ký tự có dấu bằng ký tự không dấu
  const normalized = name
    .split('')
    .map(char => accentsMap[char] || char) // Thay thế ký tự có dấu
    .join(''); // Kết hợp lại thành chuỗi

  return normalized
    .toLowerCase()
    .trim() // Xóa khoảng trắng ở đầu và cuối
    .replace(/\s+/g, '-') // Thay thế khoảng trắng (bao gồm nhiều khoảng trắng) bằng dấu gạch ngang
    .replace(/[^\w-]+/g, '') // Xóa các ký tự không hợp lệ
    .replace(/-+/g, '-') // Xóa các dấu gạch ngang liên tiếp
    .replace(/^-|-$/g, ''); // Xóa dấu gạch ngang ở đầu và cuối
};


const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', parent_id: null });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' hoặc 'error'
  const [searchTerm, setSearchTerm] = useState(''); // State cho tìm kiếm

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryApi.getAll();
        setCategories(response.data);
      } catch (error) {
        setToastMessage('Lỗi khi lấy danh mục.');
        setToastType('error');
        setShowToast(true);
      }
    };

    fetchCategories();
  }, []);

  const handleShow = (category) => {
    setCurrentCategory(category);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentCategory(null);
  };

  const handleShowAdd = () => {
    setShowAddModal(true);
  };

  const handleCloseAdd = () => {
    setShowAddModal(false);
    setNewCategory({ name: '', slug: '', parent_id: null });
  };

  const handleDelete = async (id) => {
    try {
      await CategoryApi.delete(id); // Gọi API để xóa danh mục
      setCategories(categories.filter((category) => category.id !== id));
      setToastMessage('Xóa danh mục thành công!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Có lỗi xảy ra khi xóa danh mục.');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleSave = async () => {
    try {
      await CategoryApi.update(currentCategory.id, currentCategory); // Gọi API để cập nhật danh mục
      const updatedCategories = categories.map((category) =>
        category.id === currentCategory.id ? currentCategory : category
      );
      setCategories(updatedCategories);
      handleClose();
      setToastMessage('Cập nhật danh mục thành công!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Có lỗi xảy ra khi cập nhật danh mục.');
      setToastType('error');
      setShowToast(true);
    }
  };
  const handleToggleVisible = async (id) => {
    try {
      const updatedCategory = { ...categories.find(category => category.id === id), is_visible: !categories.find(category => category.id === id).is_visible };
      await CategoryApi.update(id, updatedCategory); // Gọi API để cập nhật trạng thái
      const updatedCategories = categories.map((category) =>
        category.id === id ? updatedCategory : category
      );
      setCategories(updatedCategories);
      setToastMessage('Cập nhật trạng thái danh mục thành công!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Có lỗi xảy ra khi cập nhật trạng thái danh mục.');
      setToastType('error');
      setShowToast(true);
    }
  };
  const handleAdd = async () => {
    const slug = generateSlug(newCategory.name); // Tạo slug từ tên danh mục
    const categoryToAdd = { ...newCategory, slug }; // Thêm slug vào danh mục mới

    try {
      const response = await CategoryApi.create(categoryToAdd); // Gọi API để tạo mới danh mục
      setCategories([...categories, response.data]);
      handleCloseAdd();
      setToastMessage('Thêm danh mục thành công!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Có lỗi xảy ra khi thêm danh mục.');
      setToastType('error');
      setShowToast(true);
    }
  };

  // Hàm để lọc danh mục dựa trên từ khóa tìm kiếm
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Form.Control
        type="text"
        placeholder="Tìm kiếm danh mục..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật giá trị tìm kiếm
      />
      <Button onClick={handleShowAdd}>Thêm Danh Mục</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Slug</th>
            <th>Danh mục cha</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        {/* <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Slug</th>
              <th>Danh mục cha</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.slug}</td>
                <td>{category.parent_id ? categories.find((cat) => cat.id === category.parent_id)?.name : 'Không có'}</td>
                <td>
                  <Button variant={category.is_visible ? 'success' : 'secondary'} onClick={() => handleToggleVisible(category.id)}>
                    {category.is_visible ? 'Đang Hoạt động' : 'Đã tắt'}
                  </Button>
                </td>
                <td>
                  <Button onClick={() => handleShow(category)}>Chỉnh sửa</Button>
                  <Button onClick={() => handleDelete(category.id)}>Xóa</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table> */}
        <tbody>
          {filteredCategories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{category.slug}</td>
              <td>{category.parent_id ? categories.find((cat) => cat.id === category.parent_id)?.name : 'Không có'}</td>
              {/* Chỉ hiển thị nút trạng thái nếu danh mục có parent_id */}
              <td>
                {category.parent_id !== null ? (
                  <>
                    {category.is_visible ? '' : ''}
                    <Button variant={category.is_visible ? 'success' : 'secondary'} onClick={() => handleToggleVisible(category.id)}>
                      {category.is_visible ? 'Đang Hoạt động' : 'Đã tắt'}
                    </Button>
                  </>
                ) : (
                  // Nếu là danh mục cha, hiển thị text "Không áp dụng"
                  'Không áp dụng'
                )}
              </td>
              <td>
                <Button onClick={() => handleShow(category)}>Chỉnh sửa</Button>
                <Button onClick={() => handleDelete(category.id)}>Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for editing category */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh Sửa Danh Mục</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCategoryName">
              <Form.Label>Tên Danh Mục</Form.Label>
              <Form.Control
                type="text"
                value={currentCategory ? currentCategory.name : ''}
                onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formCategorySlug">
              <Form.Label>Slug</Form.Label>
              <Form.Control
                type="text"
                value={currentCategory ? currentCategory.slug : ''}
                onChange={(e) => setCurrentCategory({ ...currentCategory, slug: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formParentCategory">
              <Form.Label>Danh Mục Cha</Form.Label>
              <Form.Control
                as="select"
                value={currentCategory ? currentCategory.parent_id : ''}
                onChange={(e) => setCurrentCategory({ ...currentCategory, parent_id: e.target.value })}
              >
                <option value="">Chọn danh mục cha</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for adding category */}
      <Modal show={showAddModal} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm Danh Mục Mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewCategoryName">
              <Form.Label>Tên Danh Mục</Form.Label>
              <Form.Control
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formNewCategorySlug">
              <Form.Label>Slug</Form.Label>
              <Form.Control
                type="text"
                value={newCategory.slug}
                onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formNewParentCategory">
              <Form.Label>Danh Mục Cha</Form.Label>
              <Form.Control
                as="select"
                value={newCategory.parent_id}
                onChange={(e) => setNewCategory({ ...newCategory, parent_id: e.target.value })}
              >
                <option value="">Chọn danh mục cha</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAdd}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast for notifications */}
      <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
        <Toast.Body className={toastType === 'error' ? 'text-danger' : 'text-success'}>
          {toastMessage}
        </Toast.Body>
      </Toast>
    </div>
  );
};



const SizeManagement = () => {
  const [sizes, setSizes] = useState([]);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showAddSizeModal, setShowAddSizeModal] = useState(false);
  const [currentSize, setCurrentSize] = useState(null);
  const [newSize, setNewSize] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Fetch sizes on component mount
  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const response = await SizeApi.getAll();
        console.log('Fetched sizes:', response);
        setSizes(response);
      } catch (error) {
        console.error('Error fetching sizes:', error);
      }
    };
    fetchSizes();
  }, []);

  const handleShowSize = (size) => {
    setCurrentSize(size);
    setShowSizeModal(true);
  };

  const handleCloseSize = () => {
    setShowSizeModal(false);
    setCurrentSize(null);
  };

  const handleShowAddSize = () => {
    setShowAddSizeModal(true);
  };

  const handleCloseAddSize = () => {
    setShowAddSizeModal(false);
    setNewSize('');
    setNewDescription('');
  };

  const handleDeleteSize = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa kích thước này?");

    if (!confirmDelete) {
      return; // Nếu người dùng không xác nhận, thoát khỏi hàm
    }

    try {
      // Gọi API để xóa kích thước
      await SizeApi.destroy(id);

      // Cập nhật danh sách kích thước trong state
      setSizes((prevSizes) => prevSizes.filter((size) => size.id !== id));

      alert("Kích thước đã được xóa thành công.");
    } catch (error) {
      console.error('Error deleting size:', error);
      alert("Có lỗi xảy ra khi xóa kích thước. Vui lòng thử lại.");
    }
  };

  const handleSaveSize = async () => {
    if (!currentSize || !currentSize.size_name || !currentSize.description) {
      alert("Vui lòng nhập tên kích thước và mô tả.");
      return;
    }

    try {
      // Gọi API để cập nhật kích thước
      const response = await SizeApi.update(currentSize.id, {
        size_name: currentSize.size_name,
        description: currentSize.description,
      });

      // Cập nhật danh sách kích thước trong state
      setSizes((prevSizes) =>
        prevSizes.map((size) =>
          size.id === currentSize.id ? { ...size, ...response.data } : size
        )
      );

      // Đóng modal
      handleCloseSize();

      // Tự động làm mới trang
      window.location.reload();
    } catch (error) {
      console.error('Error updating size:', error);
      alert("Có lỗi xảy ra khi cập nhật kích thước. Vui lòng thử lại.");
    }
  };

  const handleAddSize = async () => {
    if (!newSize || !newDescription) {
      alert("Vui lòng nhập tên kích thước và mô tả.");
      return;
    }

    const newSizeObject = { size_name: newSize, description: newDescription };

    try {
      const response = await SizeApi.store(newSizeObject);

      setSizes((prevSizes) => [
        ...prevSizes,
        { id: response.data.id, ...newSizeObject }
      ]);

      alert("Kích thước đã được thêm thành công!");

      // Tự động làm mới trang
      window.location.reload();
    } catch (error) {
      console.error('Error adding size:', error);
      alert("Có lỗi xảy ra khi thêm kích thước. Vui lòng thử lại.");
    }
  };

  return (
    <div>
      <h2>Quản lý Size</h2>
      <Button variant="primary" onClick={handleShowAddSize}>
        Thêm Size
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Size</th>
            <th>Mô tả</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map(size => (
            <tr key={size.id}>
              <td>{size.id}</td>
              <td>{size.size_name}</td>
              <td>{size.description}</td>
              <td>
                <Button variant="warning" onClick={() => handleShowSize(size)}>
                  Sửa
                </Button>
                <Button variant="danger" onClick={() => handleDeleteSize(size.id)}>
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Editing Size */}
      <Modal show={showSizeModal} onHide={handleCloseSize}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa Size</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentSize && (
            <Form>
              <Form.Group controlId="formSizeName">
                <Form.Label>Tên Size</Form.Label>
                <Form.Control
                  type="text"
                  value={currentSize.size_name}
                  onChange={(e) => setCurrentSize({ ...currentSize, size_name: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formSizeDescription">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  type="text"
                  value={currentSize.description}
                  onChange={(e) => setCurrentSize({ ...currentSize, description: e.target.value })}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSize}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSaveSize}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Adding Size */}
      <Modal show={showAddSizeModal} onHide={handleCloseAddSize}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm Size</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewSizeName">
              <Form.Label>Tên Size</Form.Label>
              <Form.Control type="text" value={newSize} onChange={(e) => setNewSize(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formNewSizeDescription">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddSize}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleAddSize}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};


const ColorManagement = () => {
  const [colors, setColors] = useState([]);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showAddColorModal, setShowAddColorModal] = useState(false);
  const [currentColor, setCurrentColor] = useState(null);
  const [newColor, setNewColor] = useState('');
  const [newColorCode, setNewColorCode] = useState(''); // Thêm state cho mã màu

  // Hàm để lấy màu sắc từ API khi component được mount
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await ColorsApi.getAll(); // Gọi API để lấy màu sắc
        setColors(response.data); // Giả sử response.data chứa danh sách màu sắc
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };

    fetchColors();
  }, []);

  const handleShowColor = (color) => {
    setCurrentColor(color);
    setShowColorModal(true);
  };

  const handleCloseColor = () => {
    setShowColorModal(false);
    setCurrentColor(null);
  };

  const handleShowAddColor = () => {
    setShowAddColorModal(true);
  };

  const handleCloseAddColor = () => {
    setShowAddColorModal(false);
    setNewColor('');
  };

  const handleDeleteColor = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa màu này không?")) {
      try {
        await ColorsApi.delete(id);
        setColors(colors.filter((color) => color.id !== id));
      } catch (error) {
        console.error("Error deleting color:", error.response ? error.response.data : error.message);
        alert("Đã xảy ra lỗi khi xóa màu sắc. Vui lòng thử lại.");
      }
    }
  };

  const handleSaveColor = async () => {
    try {
      // Gọi API để cập nhật màu sắc với cả tên và mã màu
      const response = await ColorsApi.update(currentColor.id, {
        color_name: currentColor.color_name,
        color_code: currentColor.color_code // Gửi mã màu
      });

      if (response && response.data) {
        // Cập nhật danh sách màu sắc trong state
        const updatedColors = colors.map((color) =>
          color.id === currentColor.id ? { ...color, color_name: response.data.color_name, color_code: response.data.color_code } : color
        );
        setColors(updatedColors);
        handleCloseColor(); // Đóng modal
      }
    } catch (error) {
      console.error("Error updating color:", error.response ? error.response.data : error.message);
      alert("Đã xảy ra lỗi khi cập nhật màu sắc. Vui lòng thử lại.");
    }
  };

  const handleAddColor = async () => {
    const newColorData = {
      color_name: newColor,
      color_code: newColorCode // Thêm mã màu vào dữ liệu
    };
    try {
      const response = await ColorsApi.create(newColorData);
      if (response && response.data) {
        setColors(prevColors => [
          ...prevColors,
          { id: response.data.id, color_name: newColor, color_code: newColorCode } // Thêm mã màu vào trạng thái
        ]);
        handleCloseAddColor();
      }
    } catch (error) {
      console.error("Error adding color:", error.response ? error.response.data : error.message);
      alert("Đã xảy ra lỗi khi thêm màu sắc. Vui lòng thử lại.");
    }
  };
  return (
    <div>
      <h2>Quản lý Màu sắc</h2>
      <Button variant="primary" onClick={handleShowAddColor}>
        Thêm Màu sắc
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Màu sắc</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {colors.map((color) => (
            <tr key={color.id}>
              <td>{color.id}</td>
              <td>{color.color_name}</td>
              <td>
                <Button variant="warning" onClick={() => handleShowColor(color)}>
                  Sửa
                </Button>
                <Button variant="danger" onClick={() => handleDeleteColor(color.id)}>
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Sửa Màu sắc */}
      <Modal show={showColorModal} onHide={handleCloseColor}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa Màu sắc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentColor && (
            <Form>
              <Form.Group controlId="formColorName">
                <Form.Label>Tên Màu sắc</Form.Label>
                <Form.Control
                  type="text"
                  value={currentColor.color_name} // Sửa lại để lấy tên màu
                  onChange={(e) => setCurrentColor({ ...currentColor, color_name: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formColorCode">
                <Form.Label>Mã Màu sắc</Form.Label>
                <Form.Control
                  type="text"
                  value={currentColor.color_code} // Sửa lại để lấy mã màu
                  onChange={(e) => setCurrentColor({ ...currentColor, color_code: e.target.value })}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseColor}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSaveColor}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Thêm Màu sắc */}
      <Modal show={showAddColorModal} onHide={handleCloseAddColor}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm Màu sắc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewColorName">
              <Form.Label>Tên Màu sắc</Form.Label>
              <Form.Control
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formNewColorCode">
              <Form.Label>Mã Màu sắc</Form.Label>
              <Form.Control
                type="text"
                value={newColorCode}
                onChange={(e) => setNewColorCode(e.target.value)} // Cập nhật mã màu
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddColor}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleAddColor}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
const AdminManagement = () => {
  return (
    <div>
      <CategoryManagement />
      <SizeManagement />
      <ColorManagement />
    </div>
  );
};

export default AdminManagement;
