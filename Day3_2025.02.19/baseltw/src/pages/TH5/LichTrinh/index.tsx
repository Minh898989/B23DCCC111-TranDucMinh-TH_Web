import React, { useState } from "react";
import {
  Typography,
  Table,
  Button,
  Modal,
  Select,
  InputNumber,
  Space,
  Divider,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

interface DestinationPlan {
  key: string;
  name: string;
  date: string;
  cost: number;
  travelTime: number; // in hours
}

// Fake danh sách các điểm đến có thể chọn
const availableDestinations = [
  { name: "Vịnh Hạ Long", cost: 1500000, travelTime: 2.5 },
  { name: "Đà Lạt", cost: 1200000, travelTime: 4 },
  { name: "Hà Nội", cost: 1000000, travelTime: 1 },
  { name: "Sapa", cost: 1300000, travelTime: 3.5 },
];

const TravelPlanner: React.FC = () => {
  const [schedule, setSchedule] = useState<DestinationPlan[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string | undefined>();
  const [day, setDay] = useState<number>(1);

  const handleAddDestination = () => {
    if (!selectedDestination) return;

    const dest = availableDestinations.find(d => d.name === selectedDestination);
    if (!dest) return;

    const newEntry: DestinationPlan = {
      key: `${Date.now()}`,
      name: dest.name,
      date: `Ngày ${day}`,
      cost: dest.cost,
      travelTime: dest.travelTime,
    };

    setSchedule([...schedule, newEntry]);
    setIsModalOpen(false);
    setSelectedDestination(undefined);
    message.success("Đã thêm vào lịch trình!");
  };

  const handleDelete = (key: string) => {
    setSchedule(schedule.filter(d => d.key !== key));
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newSchedule = [...schedule];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= schedule.length) return;

    [newSchedule[index], newSchedule[targetIndex]] = [newSchedule[targetIndex], newSchedule[index]];
    setSchedule(newSchedule);
  };

  const columns: ColumnsType<DestinationPlan> = [
    { title: "Ngày", dataIndex: "date", key: "date" },
    { title: "Điểm đến", dataIndex: "name", key: "name" },
    {
      title: "Chi phí (VND)",
      dataIndex: "cost",
      key: "cost",
      render: (v) => v.toLocaleString(),
    },
    {
      title: "Thời gian di chuyển (giờ)",
      dataIndex: "travelTime",
      key: "travelTime",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record, index) => (
        <Space>
          <Button
            icon={<ArrowUpOutlined />}
            onClick={() => moveItem(index, "up")}
            disabled={index === 0}
          />
          <Button
            icon={<ArrowDownOutlined />}
            onClick={() => moveItem(index, "down")}
            disabled={index === schedule.length - 1}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
          />
        </Space>
      ),
    },
  ];

  const totalCost = schedule.reduce((sum, d) => sum + d.cost, 0);
  const totalTravelTime = schedule.reduce((sum, d) => sum + d.travelTime, 0);

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Tạo lịch trình du lịch</Title>

      <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
        Thêm điểm đến
      </Button>

      <Table
        columns={columns}
        dataSource={schedule.map((item, idx) => ({
          ...item,
          date: `Ngày ${idx + 1}`,
        }))}
        pagination={false}
        style={{ marginTop: 20 }}
        rowKey="key"
        scroll={{ x: "max-content" }}
      />

      <Divider />

      <Space direction="vertical" size="middle">
        <Title level={4}>Tổng ngân sách: {totalCost.toLocaleString()} VND</Title>
        <Title level={4}>Tổng thời gian di chuyển: {totalTravelTime} giờ</Title>
      </Space>

      {/* Modal thêm điểm đến */}
      <Modal
        title="Thêm điểm đến"
        visible={isModalOpen}
        onOk={handleAddDestination}
        onCancel={() => setIsModalOpen(false)}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Select
            placeholder="Chọn điểm đến"
            value={selectedDestination}
            onChange={(value) => setSelectedDestination(value)}
            style={{ width: "100%" }}
          >
            {availableDestinations.map((d) => (
              <Option key={d.name} value={d.name}>
                {d.name} - {d.cost.toLocaleString()} VND - {d.travelTime} giờ
              </Option>
            ))}
          </Select>
          <InputNumber
            min={1}
            value={day}
            onChange={(value) => setDay(value ?? 1)}
            addonBefore="Ngày"
            style={{ width: "100%" }}
          />
        </Space>
      </Modal>
    </div>
  );
};

export default TravelPlanner;
