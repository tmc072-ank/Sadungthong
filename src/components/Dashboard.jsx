import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const STATUS_CONFIG = {
  new: { label: 'รับออเดอร์ (ใหม่)', color: '#3b82f6' },
  cutting: { label: 'กำลังตัด', color: '#f59e0b' },
  embroidery: { label: 'กำลังปัก/สกรีน', color: '#8b5cf6' },
  done: { label: 'เสร็จสิ้น', color: '#10b981' },
};

const PAYMENT_CONFIG = {
  paid_full: { label: 'จ่ายหมดแล้ว', color: '#10b981' },
  deposit: { label: 'จ่ายมัดจำ', color: '#f59e0b' },
  cod: { label: 'เก็บเงินปลายทาง', color: '#ef4444' },
};

function StatCard({ icon: Icon, label, value, sub, colorClass }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon-wrapper ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {sub && <span className="stat-subtext">{sub}</span>}
      </div>
    </div>
  );
}

export default function Dashboard({ orders = [] }) {
  const total = orders.length;
  const active = orders.filter(o => o.status !== 'done').length;
  const done = orders.filter(o => o.status === 'done').length;
  
  // Calculate revenue details
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const receivedRevenue = orders.reduce((sum, o) => {
    if (o.paymentType === 'paid_full') return sum + (o.total || 0);
    if (o.paymentType === 'deposit') return sum + (o.paidAmount || 0);
    return sum;
  }, 0);
  const pending = totalRevenue - receivedRevenue;
  
  // Check overdue items (active and delivery date is in the past)
  const todayStr = new Date().toISOString().split('T')[0];
  const overdue = orders.filter(o => {
    if (o.status === 'done' || !o.deliveryDate) return false;
    return o.deliveryDate < todayStr;
  }).length;

  const totalQty = orders.reduce((sum, o) => sum + (o.quantity || 0), 0);

  // Chart data formatting
  const statusData = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
    name: cfg.label,
    count: orders.filter(o => o.status === key).length,
    color: cfg.color,
  }));

  const paymentData = Object.entries(PAYMENT_CONFIG).map(([key, cfg]) => ({
    name: cfg.label,
    value: orders.filter(o => o.paymentType === key).length,
    color: cfg.color,
  })).filter(d => d.value > 0);

  return (
    <div>
      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard 
          icon={Package} 
          label="ออเดอร์ทั้งหมด" 
          value={`${total} รายการ`} 
          sub={`${totalQty} ตัว`} 
          colorClass="bg-info" 
          style={{ backgroundColor: '#3b82f6' }}
        />
        <StatCard 
          icon={Clock} 
          label="กำลังดำเนินการ" 
          value={`${active} รายการ`} 
          sub={overdue > 0 ? `⚠️ เกินกำหนด ${overdue} รายการ` : 'ปกติ'} 
          colorClass="bg-warning" 
        />
        <StatCard 
          icon={CheckCircle} 
          label="เสร็จสิ้นแล้ว" 
          value={`${done} รายการ`} 
          sub={`${total > 0 ? Math.round((done / total) * 100) : 0}% ของงานทั้งหมด`} 
          colorClass="bg-success" 
        />
        <StatCard 
          icon={TrendingUp} 
          label="ยอดขายรวม" 
          value={`฿${totalRevenue.toLocaleString()}`} 
          sub={`รับแล้ว ฿${receivedRevenue.toLocaleString()}`} 
          colorClass="bg-primary" 
        />
      </div>

      {/* Charts Grid */}
      <div className="dashboard-charts-grid">
        {/* Status Bar Chart */}
        <div className="chart-card">
          <h3 className="chart-title">จำนวนออเดอร์แยกตามขั้นตอนการทำงาน</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip
                  formatter={(value) => [value, 'จำนวนรายการ']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontFamily: 'Sarabun' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Pie Chart */}
        <div className="chart-card">
          <h3 className="chart-title">การชำระเงินของออเดอร์ทั้งหมด</h3>
          {paymentData.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', height: 260, flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ flex: 1, minWidth: '160px', height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={paymentData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={55} 
                      outerRadius={80} 
                      dataKey="value"
                      paddingAngle={4}
                    >
                      {paymentData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(v) => [v, 'รายการ']} 
                      contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontFamily: 'Sarabun' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {paymentData.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                    <span className="dot" style={{ backgroundColor: d.color }} />
                    <span style={{ color: '#64748b', flex: 1 }}>{d.name}</span>
                    <span style={{ fontWeight: 600 }}>{d.value} รายการ</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260, color: '#94a3b8' }}>
              ยังไม่มีข้อมูลการเงินในระบบ
            </div>
          )}
        </div>
      </div>

      {/* Financial Details Table */}
      <div className="financial-summary-box">
        <h3 className="chart-title">สรุปภาพรวมการเงินร้านค้า</h3>
        <div className="financial-summary-grid">
          <div className="financial-item received">
            <span className="financial-item-label">เงินที่รับมาแล้ว</span>
            <span className="financial-item-value">฿{receivedRevenue.toLocaleString()}</span>
          </div>
          <div className="financial-item pending">
            <span className="financial-item-label">เงินค้างจ่าย (ค้างรับ)</span>
            <span className="financial-item-value">฿{pending.toLocaleString()}</span>
          </div>
          <div className="financial-item total">
            <span className="financial-item-label">ยอดขายทั้งหมด</span>
            <span className="financial-item-value">฿{totalRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
