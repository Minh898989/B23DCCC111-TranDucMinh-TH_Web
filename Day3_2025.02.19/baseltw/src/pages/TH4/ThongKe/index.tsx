import React, { useEffect, useState } from "react";
import { Table, Card, Progress } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UngVien } from "@/services/QuanLyDangKy/typings";

const BaoCaoThongKe: React.FC = () => {
  const [ungVienList, setUngVienList] = useState<UngVien[]>([]);
  const [groupStats, setGroupStats] = useState<any[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("dangKyList") || "[]");
    setUngVienList(data);
    const groupMap: Record<string, { total: number; approved: number; rejected: number }> = {};

    data.forEach((uv: UngVien) => {
      if (!groupMap[uv.nguyenVong]) {
        groupMap[uv.nguyenVong] = { total: 0, approved: 0, rejected: 0 };
      }
      groupMap[uv.nguyenVong].total += 1;
      if (uv.trangThai === "Approved") groupMap[uv.nguyenVong].approved += 1;
      if (uv.trangThai === "Rejected") groupMap[uv.nguyenVong].rejected += 1;
    });

    const result = Object.entries(groupMap).map(([name, stats]) => {
      const { total, approved, rejected } = stats;
      return {
        nguyenVong: name,
        tongSo: total,
        daDuyet: approved,
        daTuChoi: rejected,
        choDuyet: total - approved - rejected,
        tiLeDuyet: Math.round((approved / total) * 100),
      };
    });

    setGroupStats(result);
  }, []);

  const columns: ColumnsType<any> = [
    { title: "Nguyện vọng", dataIndex: "nguyenVong" },
    { title: "Tổng số đơn", dataIndex: "tongSo" },
    { title: "Đã duyệt", dataIndex: "daDuyet" },
    { title: "Đã từ chối", dataIndex: "daTuChoi" },
    { title: "Chờ duyệt", dataIndex: "choDuyet" },
    {
      title: "Tỉ lệ duyệt",
      dataIndex: "tiLeDuyet",
      render: (value: number) => (
        <Progress percent={value} size="small" strokeColor="#52c41a" />
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card title="Báo cáo & Thống kê" bordered={false}>
        <Table
          columns={columns}
          dataSource={groupStats}
          rowKey="nguyenVong"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default BaoCaoThongKe;
