import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Select, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./styles.css";
import { StudyRecord } from "@/services/MonHoc/typings";

const { Option } = Select;

const LOCAL_STORAGE_KEY = "studyRecords";

const StudyTracker: React.FC = () => {
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<StudyRecord | null>(null);

  const subjects = ["Toán", "Văn", "Anh", "Công nghệ", "Hóa"];
  const timeSlots = ["07:00 - 09:00", "09:30 - 11:30", "13:00 - 15:00", "15:30 - 17:30", "19:00 - 21:00"];

  useEffect(() => {
    const storedRecords = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const addOrUpdateRecord = () => {
    if (!selectedSubject || !selectedTimeSlot) {
      message.error("Vui lòng chọn môn học và khung giờ!");
      return;
    }

    if (editingRecord) {
      const updatedRecords = records.map(record =>
        record.id === editingRecord.id ? { ...editingRecord, subject: selectedSubject, time: selectedTimeSlot } : record
      );
      setRecords(updatedRecords);
      message.success("Môn học đã được cập nhật!");
    } else {
      const newRecord = { id: Date.now().toString(), subject: selectedSubject, time: selectedTimeSlot };
      setRecords([...records, newRecord]);
      message.success("Môn học đã được thêm!");
    }

    resetModal();
  };

  const deleteRecord = (id: string) => {
    const updatedRecords = records.filter(record => record.id !== id);
    setRecords(updatedRecords);
    message.success("Môn học đã được xóa!");
  };

  const editRecord = (record: StudyRecord) => {
    setEditingRecord(record);
    setSelectedSubject(record.subject);
    setSelectedTimeSlot(record.time);
    setModalVisible(true);
  };

  const resetModal = () => {
    setSelectedSubject(null);
    setSelectedTimeSlot(null);
    setEditingRecord(null);
    setModalVisible(false);
  };

  const columns = [
    {
      title: "Tên Môn Học",
      dataIndex: "subject",
      key: "subject",
      align: "center",
    },
    {
      title: "Khung Giờ Học",
      dataIndex: "time",
      key: "time",
      align: "center",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_: any, record: StudyRecord) => (
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <Button type="default" onClick={() => editRecord(record)} icon={<EditOutlined />}>
            Sửa
          </Button>
          <Button type="primary" danger onClick={() => deleteRecord(record.id)} icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container">
      <h1 className="title">Quản lý Môn Học</h1>

      <div className="button-container">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          Thêm Môn Học
        </Button>
      </div>

      <Table dataSource={records} columns={columns} rowKey="id" className="study-table" />

      <Modal
        title={editingRecord ? "Chỉnh Sửa Môn Học" : "Thêm Môn Học"}
        visible={modalVisible}
        onCancel={resetModal}
        onOk={addOrUpdateRecord}
        okText={editingRecord ? "Cập Nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <div className="modal-content">
          <label>Chọn môn học:</label>
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn môn học"
            value={selectedSubject}
            onChange={setSelectedSubject}
          >
            {subjects.map((subject) => (
              <Option key={subject} value={subject}>
                {subject}
              </Option>
            ))}
          </Select>

          <label>Chọn khung giờ học:</label>
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn khung giờ"
            value={selectedTimeSlot}
            onChange={setSelectedTimeSlot}
          >
            {timeSlots.map((slot) => (
              <Option key={slot} value={slot}>
                {slot}
              </Option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default StudyTracker;
