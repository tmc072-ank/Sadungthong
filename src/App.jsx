import React, { useState, useEffect } from 'react';
import { getOrders, addOrder, updateOrder, deleteOrder } from './utils/db';
import Dashboard from './components/Dashboard';
import OrderForm from './components/OrderForm';
import KanbanBoard from './components/KanbanBoard';
import OrderList from './components/OrderList';
import OrderDetailModal from './components/OrderDetailModal';
import { LayoutDashboard, PlusCircle, KanbanSquare, ClipboardList, Phone } from 'lucide-react';

export default function App() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState(0); // 0: Dashboard, 1: New Order, 2: Kanban, 3: All List
  const [editingOrder, setEditingOrder] = useState(null);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState(null);

  // Load orders on mount
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      // Sort orders by ID descending (most recent first)
      const sortedData = data.sort((a, b) => b.id - a.id);
      setOrders(sortedData);
    } catch (err) {
      console.error('Error loading orders from IndexedDB:', err);
    }
  };

  const handleSaveOrder = async (orderData) => {
    try {
      if (orderData.id) {
        // Edit mode
        await updateOrder(orderData);
        alert('แก้ไขข้อมูลออเดอร์เรียบร้อยแล้วครับ');
      } else {
        // Create mode
        await addOrder(orderData);
        alert('บันทึกออเดอร์ใหม่เข้าสู่ระบบเรียบร้อยแล้วครับ');
      }
      
      setEditingOrder(null);
      await loadOrders();
      
      // Navigate to Kanban board after save
      setActiveTab(2);
    } catch (err) {
      console.error('Error saving order:', err);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleStatusChange = async (updatedOrder) => {
    try {
      await updateOrder(updatedOrder);
      await loadOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setActiveTab(1); // Switch to New/Edit Order tab
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm('คุณต้องการลบข้อมูลออเดอร์นี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
      try {
        await deleteOrder(id);
        alert('ลบข้อมูลออเดอร์เรียบร้อยแล้ว');
        await loadOrders();
      } catch (err) {
        console.error('Error deleting order:', err);
        alert('เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
    setActiveTab(3); // Go back to order list
  };

  return (
    <div className="app-container">
      
      {/* App Header */}
      <header className="app-header">
        <div className="header-logo-section">
          <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="สดึงทองโลโก้" className="header-logo" />
          <div className="header-title-section">
            <h1>สดึงทอง</h1>
            <p>ระบบจัดการและติดตามออเดอร์สั่งตัดเสื้อวินมอเตอร์ไซค์</p>
          </div>
        </div>
        <div className="header-contact-section">
          <p>
            <Phone size={16} />
            TEL 086 017 4068
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 0 ? 'active' : ''}`}
          onClick={() => { setActiveTab(0); setEditingOrder(null); }}
        >
          <LayoutDashboard size={18} />
          สรุปภาพรวมแดชบอร์ด
        </button>
        <button 
          className={`tab-button ${activeTab === 1 ? 'active' : ''}`}
          onClick={() => setActiveTab(1)}
        >
          <PlusCircle size={18} />
          {editingOrder ? 'แก้ไขข้อมูลออเดอร์' : 'สร้างออเดอร์ใหม่'}
        </button>
        <button 
          className={`tab-button ${activeTab === 2 ? 'active' : ''}`}
          onClick={() => { setActiveTab(2); setEditingOrder(null); }}
        >
          <KanbanSquare size={18} />
          Kanban ติดตามงาน
        </button>
        <button 
          className={`tab-button ${activeTab === 3 ? 'active' : ''}`}
          onClick={() => { setActiveTab(3); setEditingOrder(null); }}
        >
          <ClipboardList size={18} />
          รายการออเดอร์ทั้งหมด
        </button>
      </nav>

      {/* Tab Contents */}
      <main className="tab-content-container">
        
        {/* Tab 0: Dashboard */}
        {activeTab === 0 && (
          <div className="tab-panel">
            <Dashboard orders={orders} />
          </div>
        )}

        {/* Tab 1: New / Edit Order Form */}
        {activeTab === 1 && (
          <div className="tab-panel">
            <div className="card-container" style={{ border: 'none', boxShadow: 'none', padding: 0, background: 'transparent' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {editingOrder ? 'แก้ไขออเดอร์งานสั่งตัด' : 'สร้างรายการออเดอร์ใหม่'}
                </h2>
                {editingOrder && (
                  <button 
                    onClick={handleCancelEdit}
                    className="btn-secondary"
                  >
                    ยกเลิกการแก้ไข
                  </button>
                )}
              </div>
              <OrderForm onSave={handleSaveOrder} initialOrder={editingOrder} />
            </div>
          </div>
        )}

        {/* Tab 2: Kanban Board */}
        {activeTab === 2 && (
          <div className="tab-panel">
            <h2 className="section-title">
              <KanbanSquare className="text-primary" size={24} />
              ติดตามความคืบหน้าการทำงานตัดเสื้อวิน
            </h2>
            <KanbanBoard 
              orders={orders} 
              onStatusChange={handleStatusChange}
              onViewDetails={(order) => {
                setSelectedOrderForModal(order);
              }}
              onDelete={handleDeleteOrder}
            />
          </div>
        )}

        {/* Tab 3: Order List Table */}
        {activeTab === 3 && (
          <div className="tab-panel">
            <h2 className="section-title">
              <ClipboardList className="text-primary" size={24} />
              จัดการข้อมูลออเดอร์และพิมพ์ใบงาน
            </h2>
            <OrderList 
              orders={orders} 
              onDelete={handleDeleteOrder} 
              onEdit={handleEditOrder} 
            />
          </div>
        )}

      </main>

      {/* Global Order Details Modal */}
      {selectedOrderForModal && (
        <OrderDetailModal 
          order={selectedOrderForModal} 
          onClose={() => setSelectedOrderForModal(null)} 
        />
      )}

    </div>
  );
}

