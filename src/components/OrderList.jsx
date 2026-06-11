import React, { useState } from 'react';
import { Search, Eye, Edit2, Trash2, Printer, FileText } from 'lucide-react';
import OrderDetailModal from './OrderDetailModal';

const STATUS_LABELS = {
  new: { text: 'รับออเดอร์', class: 'payment-badge paid_full' }, // Using badges style
  cutting: { text: 'กำลังตัดเย็บ', class: 'payment-badge deposit' },
  embroidery: { text: 'กำลังปัก/สกรีน', class: 'payment-badge cod' },
  done: { text: 'เสร็จสิ้น', class: 'payment-badge paid_full' }
};

export default function OrderList({ orders = [], onDelete, onEdit }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.embWinName && order.embWinName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.id && order.id.toString().includes(searchTerm));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getPaymentLabel = (type) => {
    switch (type) {
      case 'paid_full': return 'จ่ายหมดแล้ว';
      case 'deposit': return 'จ่ายมัดจำ';
      case 'cod': return 'เก็บเงินปลายทาง';
      default: return type;
    }
  };

  const getStatusLabel = (status) => {
    return STATUS_LABELS[status]?.text || status;
  };

  const handlePrint = (order) => {
    setSelectedOrder(order);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const formatThaiDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0]) + 543;
        const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
        const monthIndex = parseInt(parts[1]) - 1;
        return `${parseInt(parts[2])} ${months[monthIndex]} ${year}`;
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="list-filters-row">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon-inside" />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อลูกค้า, ชื่อวิน หรือ รหัสออเดอร์..." 
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ width: '200px' }}>
          <select 
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">สถานะขั้นตอน: ทั้งหมด</option>
            <option value="new">รับออเดอร์ (ใหม่)</option>
            <option value="cutting">กำลังตัดเย็บ</option>
            <option value="embroidery">กำลังปัก/สกรีน</option>
            <option value="done">เสร็จสิ้น</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-responsive">
        {filteredOrders.length > 0 ? (
          <table className="orders-table">
            <thead>
              <tr>
                <th>รหัส</th>
                <th>วันที่สั่งจอง</th>
                <th>ชื่อผู้ว่าจ้าง</th>
                <th>เบอร์โทร</th>
                <th>ประเภทเสื้อ</th>
                <th>จำนวน / ไซส์</th>
                <th>ยอดรวม</th>
                <th>การชำระเงิน</th>
                <th>ขั้นตอน</th>
                <th style={{ textAlign: 'center' }}>การกระทำ</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600 }}>#{order.id}</td>
                  <td>{formatThaiDate(order.contactDate)}</td>
                  <td style={{ fontWeight: 600 }}>{order.contactName}</td>
                  <td>{order.contactPhone}</td>
                  <td>{order.shirtType.split(' (')[0]}</td>
                  <td>{order.quantity} ตัว ({order.size})</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>฿{order.total.toLocaleString()}</td>
                  <td>
                    <span className={`payment-badge ${order.paymentType}`}>
                      {getPaymentLabel(order.paymentType)}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', padding: '4px 10px', borderRadius: '4px', fontWeight: 600, background: order.status === 'done' ? '#e2fbe8' : '#f1f5f9', color: order.status === 'done' ? '#10b981' : '#475569' }}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons-group" style={{ justifyContent: 'center' }}>
                      <button 
                        className="btn-icon" 
                        title="ดูรายละเอียด"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="btn-icon" 
                        title="แก้ไขออเดอร์"
                        onClick={() => onEdit(order)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="btn-icon print" 
                        title="พิมพ์ใบงานสั่งปัก"
                        onClick={() => handlePrint(order)}
                      >
                        <Printer size={16} />
                      </button>
                      <button 
                        className="btn-icon delete" 
                        title="ลบออเดอร์"
                        onClick={() => onDelete(order.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', color: '#94a3b8' }}>
            <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>ไม่พบข้อมูลออเดอร์</p>
            <p style={{ fontSize: '0.9rem' }}>ลองเปลี่ยนคำค้นหาหรือตัวกรองสถานะใหม่</p>
          </div>
        )}
      </div>

      {/* Details & Printing Modal */}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}

