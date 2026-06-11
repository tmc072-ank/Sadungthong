import React from 'react';
import { X, Printer } from 'lucide-react';

export default function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  const getPaymentLabel = (type) => {
    switch (type) {
      case 'paid_full': return 'จ่ายหมดแล้ว';
      case 'deposit': return 'จ่ายมัดจำ';
      case 'cod': return 'เก็บเงินปลายทาง';
      default: return type;
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      new: 'รับออเดอร์',
      cutting: 'กำลังตัดเย็บ',
      embroidery: 'กำลังปัก/สกรีน',
      done: 'เสร็จสิ้น'
    };
    return statusMap[status] || status;
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

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Print Only Header */}
        <div className="print-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img src="/logo.jpg" alt="สดึงทอง" style={{ height: '70px', width: 'auto', borderRadius: '8px' }} />
            <div>
              <h2 style={{ fontSize: '20pt', fontWeight: 'bold', color: '#ea580c' }}>ร้าน สดึงทอง</h2>
              <p style={{ fontSize: '10pt', color: '#475569' }}>งานปักทุกประเภท - TEL 086 017 4068</p>
            </div>
          </div>
          <div className="print-header-info">
            <h3 style={{ fontSize: '14pt', fontWeight: 'bold' }}>ใบสั่งจอง / ใบงานสั่งปักเสื้อวิน</h3>
            <p style={{ fontSize: '10pt', marginTop: '4px' }}>เลขที่ออเดอร์: <strong>#{order.id}</strong></p>
            <p style={{ fontSize: '10pt' }}>วันที่จอง: {formatThaiDate(order.contactDate)}</p>
          </div>
        </div>

        {/* Modal Web View Header */}
        <div className="modal-header">
          <span className="modal-title">รายละเอียดออเดอร์ #{order.id}</span>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="modal-details-grid">
            
            {/* Block 1: Customer Details */}
            <div className="modal-detail-block">
              <p className="modal-detail-block-title">ผู้สั่งจอง / ผู้ว่าจ้าง</p>
              <div className="modal-detail-item">
                <span>ชื่อผู้จอง:</span>
                <span>{order.contactName}</span>
              </div>
              <div className="modal-detail-item">
                <span>เบอร์โทร:</span>
                <span>{order.contactPhone}</span>
              </div>
              <div className="modal-detail-item">
                <span>ที่อยู่ลูกค้า:</span>
                <span>{order.contactAddress || 'ไม่ระบุ'}</span>
              </div>
              <div className="modal-detail-item">
                <span>วันที่จอง:</span>
                <span>{formatThaiDate(order.contactDate)}</span>
              </div>
            </div>

            {/* Block 2: Delivery Details */}
            <div className="modal-detail-block">
              <p className="modal-detail-block-title">กำหนดส่งมอบ & ที่อยู่จัดส่ง</p>
              <div className="modal-detail-item">
                <span>กำหนดส่งงาน:</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                  {formatThaiDate(order.deliveryDate)}
                </span>
              </div>
              <div className="modal-detail-item">
                <span>ผู้รับสินค้า:</span>
                <span>{order.shippingName || 'ไม่ระบุ'}</span>
              </div>
              <div className="modal-detail-item">
                <span>เบอร์โทรผู้รับ:</span>
                <span>{order.shippingPhone || 'ไม่ระบุ'}</span>
              </div>
              <div className="modal-detail-item">
                <span>ที่จัดส่งอย่างละเอียด:</span>
                <span>{order.shippingAddress || 'ไม่ระบุ'}</span>
              </div>
            </div>

            {/* Block 3: Vest Tailoring Specs */}
            <div className="modal-detail-full-width">
              <p className="modal-detail-block-title">รายละเอียดเสื้อวินและสเปกงานตัด</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <div className="modal-detail-item">
                    <span>ประเภทเสื้อ:</span>
                    <span style={{ fontWeight: 600 }}>{order.shirtType}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span>ตัวหนังสือ:</span>
                    <span>{order.letterType}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span>แถบสะท้อนแสง:</span>
                    <span>{order.reflectiveStrip}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span>ชนิดผ้า:</span>
                    <span>{order.fabricType}</span>
                  </div>
                </div>
                <div>
                  <div className="modal-detail-item">
                    <span>ไซส์ / Size:</span>
                    <span style={{ fontWeight: 600 }}>{order.size}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span>ชื่อปักบนวิน:</span>
                    <span style={{ color: 'var(--primary)' }}>{order.embWinName || 'ไม่ระบุ'}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span>เขตพื้นที่ปัก:</span>
                    <span>{order.embArea || 'ไม่ระบุ'}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span>ปักหมายเลข:</span>
                    <span style={{ fontWeight: 600 }}>{order.embNumber || 'ไม่ระบุ'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Block 4: Financial Summary */}
            <div className="modal-detail-full-width">
              <p className="modal-detail-block-title">การชำระเงินและคำนวณราคา</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div className="modal-detail-item">
                    <span>ราคาเสื้อเริ่มต้น:</span>
                    <span>฿{order.basePrice.toLocaleString()} / ตัว</span>
                  </div>
                  <div className="modal-detail-item">
                    <span>ส่วนเสริมป้ายซองชื่อ:</span>
                    <span>{order.hasNameTag ? `฿${order.nameTagPrice}` : 'ไม่รับ'}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span>ส่วนเสริมปักธงชาติ:</span>
                    <span>{order.hasFlag ? `฿${order.flagPrice}` : 'ไม่รับ'}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span>ส่วนต่างเพิ่มเติมตามไซส์:</span>
                    <span>{order.hasSizeExtra ? `฿${order.sizeExtraPrice}` : 'ไม่รับ'}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span>ส่วนเสริมสะท้อนแสง:</span>
                    <span>{order.hasReflectiveExtra ? `฿${order.reflectivePrice}` : 'ไม่รับ'}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span>ซิปเสื้อ ({order.zipType === 'nylon' ? 'ฟันไนล่อน' : 'ฟันกระดูก'}):</span>
                    <span>฿{order.zipPrice}</span>
                  </div>
                </div>

                <div style={{ borderLeft: '1px solid #cbd5e1', paddingLeft: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="modal-detail-item">
                    <span>จำนวนสินค้า:</span>
                    <span><strong>{order.quantity} ตัว</strong></span>
                  </div>
                  <div className="modal-detail-item" style={{ fontSize: '1.1rem', marginTop: '6px' }}>
                    <span>ราคารวมทั้งหมด:</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary-hover)' }}>฿{order.total.toLocaleString()}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span>ประเภทการชำระ:</span>
                    <span>{getPaymentLabel(order.paymentType)}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span>ชำระมาแล้ว:</span>
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>฿{order.paidAmount.toLocaleString()}</span>
                  </div>
                  <div className="modal-detail-item" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '4px' }}>
                    <span>ยอดค้างชำระ:</span>
                    <span style={{ color: 'var(--danger)', fontWeight: 700 }}>
                      ฿{(order.total - order.paidAmount).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Print Only Signature Lines */}
        <div className="print-footer-signature">
          <div className="signature-line">ลงชื่อผู้สั่งจอง (ลูกค้า)</div>
          <div className="signature-line">ลงชื่อผู้รับจอง (สดึงทอง)</div>
        </div>

        {/* Web View Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            ปิดหน้าต่าง
          </button>
          <button className="btn-primary" onClick={triggerPrint}>
            <Printer size={16} />
            พิมพ์ใบงานนี้
          </button>
        </div>

      </div>
    </div>
  );
}
