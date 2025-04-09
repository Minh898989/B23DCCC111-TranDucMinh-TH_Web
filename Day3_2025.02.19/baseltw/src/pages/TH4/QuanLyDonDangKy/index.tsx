import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Tag,
  Space,
  message,
 
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { UngVien} from "@/services/QuanLyDangKy/typings";


const QuanLyUngVien: React.FC = () => {
  const [ungVienList, setUngVienList] = useState<UngVien[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<UngVien | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [note, setNote] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("dangKyList") || "[]");
    setUngVienList(data);
  }, []);

  const saveData = (data: UngVien[]) => {
    localStorage.setItem("dangKyList", JSON.stringify(data));
    setUngVienList(data);
  };

  const handleAction = (status: "Approved" | "Rejected") => {
    if (!selected) return;
    const updatedList = ungVienList.map((uv) =>
      uv.id === selected.id ? { ...uv, trangThai: status, ghiChu: note } : uv
    );
    saveData(updatedList);
    const log = `Admin đã ${status} ứng viên ${selected.hoTen} vào lúc ${dayjs().format("HH:mm DD/MM/YYYY")} với lý do: ${note}`;
    const newLogs = [...logs, log];
    setLogs(newLogs);
    localStorage.setItem("logUngVien", JSON.stringify(newLogs));
    message.success(`${status === "Approved" ? "Duyệt" : "Từ chối"} thành công!`);
    setModalVisible(false);
    setNote("");
  };

  const filteredList = ungVienList.filter(
    (uv) =>
      uv.hoTen.toLowerCase().includes(search.toLowerCase()) ||
      uv.email.toLowerCase().includes(search.toLowerCase()) ||
      uv.nguyenVong.toLowerCase().includes(search.toLowerCase())
  );

  const columns: ColumnsType<UngVien> = [
    { title: "Họ tên", dataIndex: "hoTen", sorter: (a, b) => a.hoTen.localeCompare(b.hoTen) },
    { title: "Email", dataIndex: "email", sorter: (a, b) => a.email.localeCompare(b.email) },
    { title: "Nguyện vọng", dataIndex: "nguyenVong" },
    { title: "Lý do", dataIndex: "lyDo" },
    {
        title: "Trạng thái",
        dataIndex: "trangThai",
        render: (value) => {
            let color = value === "Approved" ? "green" : value === "Rejected" ? "red" : "gold";
            return <Tag color={color}>{value}</Tag>;
        },
        filters: [
            { text: "Pending", value: "Pending" },
            { text: "Approved", value: "Approved" },
            { text: "Rejected", value: "Rejected" },
        ],
        onFilter: (value, record) => record.trangThai === value,
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setSelected(record);
              setModalVisible(true);
            }}
            disabled={record.trangThai !== "Pending"}
          >
            Duyệt / Từ chối
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
        <Input.Search
            placeholder="Tìm kiếm theo tên, email hoặc nguyện vọng"
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 400, marginBottom: 10 }}
        />
        <Table
            columns={columns}
            dataSource={filteredList}
            rowKey="id"
            pagination={{ pageSize: 5 }}
        />

    <Modal
        destroyOnClose
        footer={false}
        title={
            selected?.trangThai === "Pending"
            ? "Duyệt / Từ chối ứng viên"
            : "Thông tin ứng viên"
        }
        visible={modalVisible}
        onCancel={() => {
            setModalVisible(false);
            setNote("");
            setSelected(null);
        }}
        >
        {selected?.trangThai === "Pending" ? (
            <>
            <p>Nhập ghi chú (nếu có):</p>
            <Input.TextArea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Lý do từ chối hoặc ghi chú thêm"
            />
            <div style={{ marginTop: 10, textAlign: "right" }}>
                <Button
                onClick={() => {
                    setModalVisible(false);
                    setNote("");
                    setSelected(null);
                }}
                style={{ marginRight: 10 }}
                >
                Hủy
                </Button>
                <Button type="primary" onClick={() => handleAction("Approved")}>
                Duyệt
                </Button>
                <Button danger onClick={() => handleAction("Rejected")} style={{ marginLeft: 10 }}>
                Từ chối
                </Button>
            </div>
            </>
        ) : (
            <>
            <p>Trạng thái hiện tại: <Tag color={selected?.trangThai === "Approved" ? "green" : "red"}>{selected?.trangThai}</Tag></p>
            {selected?.ghiChu && <p><strong>Ghi chú:</strong> {selected.ghiChu}</p>}
            </>
        )}
    </Modal>
    </div>
  );
};

export default QuanLyUngVien;