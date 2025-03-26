import { useState, useEffect } from "react";
import { Table, Input, Select, Button, Modal, Form, InputNumber, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Order } from "@/services/Order/typings";
import "./style.css";

const { Search } = Input;
const { Option } = Select;

const products = [
  { name: "Gạo", price: 200000 },
  { name: "Nước ngọt", price: 300000 },
  { name: "Bánh mì", price: 500000 },
  { name: "Mì tôm", price: 5000 },
  { name: "Bim bim", price: 10000 },
  { name: "Xúc xích", price: 10000 },
];

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      const parsedOrders = JSON.parse(storedOrders);
      setOrders(parsedOrders);
      setFilteredOrders(parsedOrders);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    filterOrders(value, statusFilter);
  };

  const handleFilterChange = (value: string) => {
    setStatusFilter(value || null);
    filterOrders(searchText, value);
  };

  const filterOrders = (search: string, status: string | null) => {
    let filtered = orders.filter(order =>
      order.id.includes(search) || order.customer.toLowerCase().includes(search.toLowerCase())
    );
    if (status) {
      filtered = filtered.filter(order => order.status === status);
    }
    setFilteredOrders(filtered);
  };

  const handleAddOrder = (values: any) => {
    const newOrder: Order = {
      id: (orders.length + 1).toString(),
      customer: values.customer,
      date: dayjs().format("YYYY-MM-DD"),
      total: values.total,
      status: "Chờ xác nhận",
    };
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders);
    setIsModalOpen(false);
    form.resetFields();
  };
  const handleStatusChange = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders);
  };
  

  const handleDeleteOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order?.status !== "Chờ xác nhận") {
      message.warning("Chỉ có thể hủy đơn hàng ở trạng thái 'Chờ xác nhận'.");
      return;
    }
    Modal.confirm({
      title: "Xác nhận hủy đơn hàng",
      content: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      onOk: () => {
        const updatedOrders = orders.filter(order => order.id !== orderId);
        setOrders(updatedOrders);
        setFilteredOrders(updatedOrders);
      }
    });
  };

  const calculateTotal = (selectedProducts: string[]) => {
    return selectedProducts.reduce((sum, productName) => {
      const product = products.find(p => p.name === productName);
      return sum + (product ? product.price : 0);
    }, 0);
  };

  const columns: ColumnsType<Order> = [
    { title: "Mã đơn hàng", dataIndex: "id", key: "id" },
    { title: "Khách hàng", dataIndex: "customer", key: "customer" },
    { title: "Ngày đặt hàng", dataIndex: "date", key: "date", sorter: (a, b) => a.date.localeCompare(b.date) },
    { title: "Tổng tiền", dataIndex: "total", key: "total", sorter: (a, b) => a.total - b.total },
    { 
      title: "Trạng thái", 
      dataIndex: "status", 
      key: "status",
      render: (_, record) => (
        <Select 
          value={record.status} 
          onChange={(value) => handleStatusChange(record.id, value)} 
          style={{ width: 120 }}
        >
          <Option value="Chờ xác nhận">Chờ xác nhận</Option>
          <Option value="Đang giao">Đang giao</Option>
          <Option value="Hoàn thành">Hoàn thành</Option>
          <Option value="Hủy">Hủy</Option>
        </Select>
      )
    },
    { title: "Hành động", key: "action", render: (_, record) => (
        <Button type="link" onClick={() => handleDeleteOrder(record.id)}>Hủy</Button>
      )
    }
  ];
  
  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", gap: 10 }}>
        <Search placeholder="Tìm kiếm theo mã đơn hoặc khách hàng" onSearch={handleSearch} allowClear />
        <Select placeholder="Lọc theo trạng thái" onChange={handleFilterChange} allowClear>
          <Option value="Chờ xác nhận">Chờ xác nhận</Option>
          <Option value="Đang giao">Đang giao</Option>
          <Option value="Hoàn thành">Hoàn thành</Option>
          <Option value="Hủy">Hủy</Option>
        </Select>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>Thêm đơn hàng</Button>
      </div>
      <Table columns={columns} dataSource={filteredOrders} rowKey="id" />

      <Modal title="Thêm đơn hàng" visible={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} onFinish={handleAddOrder} layout="vertical">
          <Form.Item name="customer" label="Tên khách hàng" rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}>            
            <Input placeholder="Nhập tên khách hàng" />
          </Form.Item>
          <Form.Item name="products" label="Chọn sản phẩm" rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}>            
            <Select mode="multiple" placeholder="Chọn sản phẩm" onChange={(value) => form.setFieldsValue({ total: calculateTotal(value) })}>
              {products.map(product => <Option key={product.name} value={product.name}>{product.name} - {product.price.toLocaleString()} đ</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="total" label="Tổng tiền">
            <InputNumber style={{ width: "100%" }} disabled />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Thêm</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderList;