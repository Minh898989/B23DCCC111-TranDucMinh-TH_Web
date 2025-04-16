import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  InputNumber,
  Modal,
  Select,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { Destination } from "../../../services/KhamPhaDiemDen/typings";
import dayjs from "dayjs";

const LOCAL_STORAGE_KEY = "destinations";
const ITINERARIES_STORAGE_KEY = "itineraries"; // Thêm key lưu lịch trình
const { Title } = Typography;

interface ItineraryItem {
  id: number;
  name: string;
  cost: number;
  duration: number; // giờ
}

interface Itinerary {
  id: number;
  createdTime: string;
  items: ItineraryItem[];
}

const ItineraryPlanner: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [allItineraries, setAllItineraries] = useState<Itinerary[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [form] = Form.useForm();

  // Load danh sách điểm đến từ localStorage
  useEffect(() => {
    const storedDestinations = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedDestinations) {
      setDestinations(JSON.parse(storedDestinations));
    }

    // Load các lịch trình đã lưu từ localStorage
    const storedItineraries = localStorage.getItem(ITINERARIES_STORAGE_KEY);
    if (storedItineraries) {
      setAllItineraries(JSON.parse(storedItineraries));
    }
  }, []);

  const openModal = () => {
    form.resetFields(); // Reset các trường trong form
    setSelectedIds([]); // Reset các địa điểm đã chọn
    setIsModalOpen(true); // Mở modal
  };

  const handleAddToItinerary = () => {
    form.validateFields().then((values) => {
      const items: ItineraryItem[] = selectedIds.map((id) => {
        const dest = destinations.find((d) => d.id === id);
        return {
          id: dest!.id,
          name: dest!.name,
          cost: values[`cost_${id}`],
          duration: values[`duration_${id}`],
        };
      });

      const newItinerary: Itinerary = {
        id: Date.now(),
        createdTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        items,
      };

      const updatedItineraries = [...allItineraries, newItinerary];

      // Lưu lịch trình mới vào localStorage
      localStorage.setItem(ITINERARIES_STORAGE_KEY, JSON.stringify(updatedItineraries));

      setAllItineraries(updatedItineraries);
      setIsModalOpen(false); // Đóng modal
      message.success("Đã tạo lịch trình mới!");

      // Reset form và danh sách đã chọn
      form.resetFields();
      setSelectedIds([]);
    });
  };

  const columns = [
    { title: "Tên điểm đến", dataIndex: "name" },
    { title: "Thời gian ở lại (giờ)", dataIndex: "duration" },
    {
      title: "Chi phí (VND)",
      dataIndex: "cost",
      render: (v: number) => v.toLocaleString(),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Tạo lịch trình du lịch</Title>

      <Button type="primary" onClick={openModal} style={{ marginBottom: 24 }}>
        Thêm điểm đến
      </Button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: 24,
        }}
      >
        {allItineraries.map((itinerary) => {
          const totalCost = itinerary.items.reduce((sum, item) => sum + item.cost, 0);
          const totalDuration = itinerary.items.reduce((sum, item) => sum + item.duration, 0);
          const estimatedTravelTime = (itinerary.items.length - 1) * 1;

          return (
            <Card
              key={itinerary.id}
              title={`Lịch trình lúc ${itinerary.createdTime}`}
              extra={<Tag color="blue">{itinerary.items.length} điểm</Tag>}
              style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            >
              <div style={{ marginBottom: 12 }}>
                <Tag color="green">
                  Tổng thời gian: {totalDuration + estimatedTravelTime} giờ
                </Tag>
                <Tag color="gold">
                  Tổng chi phí: {totalCost.toLocaleString()} VND
                </Tag>
              </div>

              <Table
                dataSource={itinerary.items}
                rowKey="id"
                columns={columns}
                pagination={false}
                size="small"
              />
            </Card>
          );
        })}
      </div>

      <Modal
        visible={isModalOpen}
        title="Chọn điểm đến"
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddToItinerary}
        okText="Thêm"
        cancelText="Hủy"
        width={800}
      >
        <Form layout="vertical" form={form}>
          <Select
            mode="multiple"
            placeholder="Chọn địa điểm"
            onChange={setSelectedIds}
            style={{ width: "100%", marginBottom: 16 }}
          >
            {destinations.map((d) => (
              <Select.Option key={d.id} value={d.id}>
                {d.name}
              </Select.Option>
            ))}
          </Select>

          {selectedIds.map((id) => {
            const dest = destinations.find((d) => d.id === id);
            if (!dest) return null;

            return (
              <Card
                key={id}
                title={dest.name}
                style={{ marginBottom: 16 }}
                extra={<Tag color="magenta">{dest.location}</Tag>}
              >
                <Form.Item
                  label="Thời gian ở lại (giờ)"
                  name={`duration_${id}`}
                  rules={[{ required: true, message: "Nhập thời gian ở lại" }]}
                >
                  <InputNumber min={1} max={72} />
                </Form.Item>
                <Form.Item
                  label="Chi phí (VND)"
                  name={`cost_${id}`}
                  rules={[{ required: true, message: "Nhập chi phí" }]}
                >
                  <InputNumber min={0} step={50000} />
                </Form.Item>
              </Card>
            );
          })}
        </Form>
      </Modal>
    </div>
  );
};

export default ItineraryPlanner;
