import React from 'react';
import { ArrowLeft, ArrowRight, Eye, Trash2, Calendar, Clipboard } from 'lucide-react';

const COLUMNS = [
  { id: 'new', title: 'ใหม่ (ได้รับออเดอร์)', dotClass: 'dot-new' },
  { id: 'cutting', title: 'กำลังตัดเย็บ', dotClass: 'dot-cutting' },
  { id: 'embroidery', title: 'กำลังปัก / สกรีน', dotClass: 'dot-emb' },
  { id: 'done', title: 'เสร็จสิ้น (พร้อมส่ง)', dotClass: 'dot-done' }
];

const COLUMN_FLOW = ['new', 'cutting', 'embroidery', 'done'];

export default function KanbanBoard({ orders = [], onStatusChange, onViewDetails, onDelete }) {
  
  const handleMoveStatus = (order, direction) => {
    const currentIndex = COLUMN_FLOW.indexOf(order.status);
    let nextIndex = currentIndex;
    
    if (direction === 'next' && currentIndex < COLUMN_FLOW.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (direction === 'prev' && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    }

    if (nextIndex !== currentIndex) {
      const updatedOrder = { ...order, status: COLUMN_FLOW[nextIndex] };
      onStatusChange(updatedOrder);
    }
  };

  const getPaymentLabel = (type) => {
    switch (type) {
      case 'paid_full': return 'จ่ายครบ';
      case 'deposit': return 'มัดจำ';
      case 'cod': return 'ปลายทาง';
      default: return type;
    }
  };

  const formatThaiDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        // yyyy-mm-dd
        const year = parseInt(parts[0]) + 543;
        const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        const monthIndex = parseInt(parts[1]) - 1;
        return `${parseInt(parts[2])} ${months[monthIndex]} ${year.toString().slice(-2)}`;
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="kanban-board-container">
      {COLUMNS.map((col) => {
        const columnOrders = orders.filter((o) => o.status === col.id);
        
        return (
          <div key={col.id} className="kanban-column">
            <div className="kanban-column-header">
              <span className="kanban-column-title">
                <span className={`dot ${col.dotClass}`}></span>
                {col.title}
              </span>
              <span className="kanban-column-count">{columnOrders.length}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '500px', overflowY: 'auto' }}>
              {columnOrders.length > 0 ? (
                columnOrders.map((order) => (
                  <div key={order.id} className="kanban-card">
                    
                    <div className="kanban-card-header">
                      <span className="kanban-card-customer" title={order.contactName}>
                        {order.contactName}
                      </span>
                      <span className="kanban-card-date">
                        ส่ง: {formatThaiDate(order.deliveryDate)}
                      </span>
                    </div>

                    <div className="kanban-card-details">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span>แบบเสื้อ:</span>
                        <span style={{ fontWeight: 600, color: '#334155' }}>
                          {order.shirtType.split(' (')[0].replace('เสื้อวิน', '')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span>จำนวน/ไซส์:</span>
                        <span style={{ fontWeight: 600 }}>{order.quantity} ตัว / {order.size}</span>
                      </div>
                      {order.embWinName && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--primary-hover)', fontStyle: 'italic' }}>
                          ปัก: วิน {order.embWinName} #{order.embNumber || '-'}
                        </div>
                      )}
                    </div>

                    <div className="kanban-card-tags">
                      <span className="kanban-tag kanban-tag-type">{order.fabricType}</span>
                      <span className={`payment-badge ${order.paymentType}`}>
                        {getPaymentLabel(order.paymentType)}
                      </span>
                    </div>

                    <div className="kanban-card-footer">
                      <span className="kanban-card-price">฿{order.total.toLocaleString()}</span>
                      
                      <div className="kanban-card-actions">
                        <button 
                          className="kanban-action-btn" 
                          title="ดูรายละเอียด"
                          onClick={() => onViewDetails(order)}
                        >
                          <Eye size={14} />
                        </button>
                        
                        {order.status !== COLUMN_FLOW[0] && (
                          <button 
                            className="kanban-action-btn" 
                            title="ย้อนกลับขั้นตอน"
                            onClick={() => handleMoveStatus(order, 'prev')}
                          >
                            <ArrowLeft size={14} />
                          </button>
                        )}
                        
                        {order.status !== COLUMN_FLOW[COLUMN_FLOW.length - 1] ? (
                          <button 
                            className="kanban-action-btn btn-next" 
                            title="เลื่อนขั้นตอนถัดไป"
                            onClick={() => handleMoveStatus(order, 'next')}
                          >
                            <ArrowRight size={14} />
                          </button>
                        ) : (
                          <button 
                            className="kanban-action-btn" 
                            style={{ color: '#ef4444' }}
                            title="ลบออเดอร์"
                            onClick={() => onDelete(order.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ))
              ) : (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '180px', 
                  color: '#94a3b8', 
                  fontSize: '0.85rem',
                  border: '1.5px dashed #cbd5e1',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(248, 250, 252, 0.4)'
                }}>
                  <Clipboard size={20} style={{ marginBottom: '8px', opacity: 0.6 }} />
                  ไม่มีออเดอร์ในขั้นตอนนี้
                </div>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}
