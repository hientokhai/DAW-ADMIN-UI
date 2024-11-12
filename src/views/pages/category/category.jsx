import React, { useState } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Danh mục 1', parent: 'Không có' },
    { id: 2, name: 'Danh mục 2', parent: 'Danh mục 1' },
    { id: 3, name: 'Danh mục 3', parent: 'Không có' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', parent: 'Không có' });

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
    setNewCategory({ name: '', parent: 'Không có' });
  };

  const handleDelete = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  const handleSave = () => {
    const updatedCategories = categories.map((category) => (category.id === currentCategory.id ? currentCategory : category));
    setCategories(updatedCategories);
    handleClose();
  };

  const handleAddCategory = () => {
    const newId = categories.length > 0 ? Math.max(categories.map((c) => c.id)) + 1 : 1;
    setCategories([...categories, { id: newId, ...newCategory }]);
    handleCloseAdd();
  };

  return (
    <div>
      <h2>Quản lý Danh mục</h2>
      <Button variant="primary" onClick={handleShowAdd}>
        Thêm Danh mục
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Danh mục cha</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>
                <select value={category.parent} onChange={(e) => handleParentChange(category.id, e.target.value)}>
                  <option value="">Chọn danh mục cha</option>
                  {categories.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <Button variant="warning" onClick={() => handleShow(category)}>
                  Sửa
                </Button>
                <Button variant="danger" onClick={() => handleDelete(category.id)}>
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa Danh mục</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentCategory && (
            <Form>
              <Form.Group controlId="formCategoryName">
                <Form.Label>Tên danh mục</Form.Label>
                <Form.Control
                  type="text"
                  value={currentCategory.name}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formParentCategory">
                <Form.Label>Danh mục cha</Form.Label>
                <Form.Control
                  as="select"
                  value={currentCategory.parent}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, parent: e.target.value })}
                >
                  <option value="">Chọn danh mục cha</option>
                  {categories.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddModal} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm Danh mục</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewCategoryName">
              <Form.Label>Tên danh mục</Form.Label>
              <Form.Control
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formNewParentCategory">
              <Form.Label>Danh mục cha</Form.Label>
              <Form.Control
                as="select"
                value={newCategory.parent}
                onChange={(e) => setNewCategory({ ...newCategory, parent: e.target.value })}
              >
                <option value="">Chọn danh mục cha</option>
                {categories.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAdd}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleAddCategory}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const SizeManagement = () => {
  const [sizes, setSizes] = useState([
    { id: 1, name: 'Size S' },
    { id: 2, name: 'Size M' },
    { id: 3, name: 'Size L' }
  ]);

  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showAddSizeModal, setShowAddSizeModal] = useState(false);
  const [currentSize, setCurrentSize] = useState(null);
  const [newSize, setNewSize] = useState('');

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
  };

  const handleDeleteSize = (id) => {
    setSizes(sizes.filter((size) => size.id !== id));
  };

  const handleSaveSize = () => {
    const updatedSizes = sizes.map((size) => (size.id === currentSize.id ? currentSize : size));
    setSizes(updatedSizes);
    handleCloseSize();
  };

  const handleAddSize = () => {
    const newId = sizes.length > 0 ? Math.max(sizes.map((s) => s.id)) + 1 : 1;
    setSizes([...sizes, { id: newId, name: newSize }]);
    handleCloseAddSize();
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
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((size) => (
            <tr key={size.id}>
              <td>{size.id}</td>
              <td>{size.name}</td>
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
                  value={currentSize.name}
                  onChange={(e) => setCurrentSize({ ...currentSize, name: e.target.value })}
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
  const [colors, setColors] = useState([
    { id: 1, name: 'Đỏ' },
    { id: 2, name: 'Xanh' },
    { id: 3, name: 'Vàng' }
  ]);

  const [showColorModal, setShowColorModal] = useState(false);
  const [showAddColorModal, setShowAddColorModal] = useState(false);
  const [currentColor, setCurrentColor] = useState(null);
  const [newColor, setNewColor] = useState('');

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

  const handleDeleteColor = (id) => {
    setColors(colors.filter((color) => color.id !== id));
  };

  const handleSaveColor = () => {
    const updatedColors = colors.map((color) => (color.id === currentColor.id ? currentColor : color));
    setColors(updatedColors);
    handleCloseColor();
  };

  const handleAddColor = () => {
    const newId = colors.length > 0 ? Math.max(colors.map((c) => c.id)) + 1 : 1;
    setColors([...colors, { id: newId, name: newColor }]);
    handleCloseAddColor();
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
              <td>{color.name}</td>
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
                  value={currentColor.name}
                  onChange={(e) => setCurrentColor({ ...currentColor, name: e.target.value })}
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

      <Modal show={showAddColorModal} onHide={handleCloseAddColor}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm Màu sắc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewColorName">
              <Form.Label>Tên Màu sắc</Form.Label>
              <Form.Control type="text" value={newColor} onChange={(e) => setNewColor(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button></Button>
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
