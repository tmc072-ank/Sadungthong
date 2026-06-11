import React, { useState, useEffect } from 'react';
import { Save, Info, User, MapPin, CreditCard, Shield } from 'lucide-react';

const SHIRT_TYPES = [
  { id: 1, name: 'เสื้อวินหน้านวนคร (เสื้อวินทั่วไป)', color: 'orange', code: 'shirt1' },
  { id: 2, name: 'เสื้อวินกรีนแคมปัส (ธรรมศาสตร์)', color: 'lime', code: 'shirt2' },
  { id: 3, name: 'เสื้อวินอยุธยา', color: 'orange', code: 'shirt3' }
];

export default function OrderForm({ onSave, initialOrder = null }) {
  // 1. Vest Type
  const [selectedType, setSelectedType] = useState(1);

  // 2. Letters & Materials
  const [letterType, setLetterType] = useState('ปัก');
  const [reflectiveStrip, setReflectiveStrip] = useState('เขียว-เทา');
  const [customReflective, setCustomReflective] = useState('');
  const [fabricType, setFabricType] = useState('ผ้าโซล่อน');

  // 3. Embroidery details
  const [embWinName, setEmbWinName] = useState('');
  const [embArea, setEmbArea] = useState('');
  const [embNumber, setEmbNumber] = useState('');

  // 4. Sizing & Base Prices
  const [size, setSize] = useState('M');
  const [basePrice, setBasePrice] = useState(450);
  const [quantity, setQuantity] = useState(1);

  // 5. Extra Options Toggle & Cost Overrides
  const [hasNameTag, setHasNameTag] = useState(true);
  const [nameTagPrice, setNameTagPrice] = useState(20);

  const [hasFlag, setHasFlag] = useState(true);
  const [flagPrice, setFlagPrice] = useState(20);

  const [hasSizeExtra, setHasSizeExtra] = useState(true);
  const [sizeExtraPrice, setSizeExtraPrice] = useState(10);

  const [hasReflectiveExtra, setHasReflectiveExtra] = useState(true);
  const [reflectivePrice, setReflectivePrice] = useState(10);

  // Zip details
  const [zipType, setZipType] = useState('nylon'); // nylon or bone
  const [zipNylonPrice, setZipNylonPrice] = useState(0);
  const [zipBonePrice, setZipBonePrice] = useState(50);

  // 6. Dates & Customer details
  const [deliveryDate, setDeliveryDate] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactDate, setContactDate] = useState(new Date().toISOString().split('T')[0]);

  // Shipping details
  const [sameAsContact, setSameAsContact] = useState(false);
  const [shippingName, setShippingName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');

  // Payment details
  const [paymentType, setPaymentType] = useState('deposit'); // paid_full, deposit, cod
  const [paidAmount, setPaidAmount] = useState(0);

  // Pre-fill if editing
  useEffect(() => {
    if (initialOrder) {
      const type = SHIRT_TYPES.find(t => t.name === initialOrder.shirtType);
      if (type) setSelectedType(type.id);
      
      setLetterType(initialOrder.letterType || 'ปัก');
      setFabricType(initialOrder.fabricType || 'ผ้าโซล่อน');
      
      // Reflective
      if (['เขียว-เทา', 'แถบ PVC'].includes(initialOrder.reflectiveStrip)) {
        setReflectiveStrip(initialOrder.reflectiveStrip);
      } else {
        setReflectiveStrip('อื่นๆ');
        setCustomReflective(initialOrder.reflectiveStrip || '');
      }

      setEmbWinName(initialOrder.embWinName || '');
      setEmbArea(initialOrder.embArea || '');
      setEmbNumber(initialOrder.embNumber || '');
      setSize(initialOrder.size || 'M');
      setBasePrice(initialOrder.basePrice || 450);
      setQuantity(initialOrder.quantity || 1);

      setHasNameTag(initialOrder.hasNameTag !== undefined ? initialOrder.hasNameTag : true);
      setNameTagPrice(initialOrder.nameTagPrice !== undefined ? initialOrder.nameTagPrice : 20);
      
      setHasFlag(initialOrder.hasFlag !== undefined ? initialOrder.hasFlag : true);
      setFlagPrice(initialOrder.flagPrice !== undefined ? initialOrder.flagPrice : 20);

      setHasSizeExtra(initialOrder.hasSizeExtra !== undefined ? initialOrder.hasSizeExtra : true);
      setSizeExtraPrice(initialOrder.sizeExtraPrice !== undefined ? initialOrder.sizeExtraPrice : 10);

      setHasReflectiveExtra(initialOrder.hasReflectiveExtra !== undefined ? initialOrder.hasReflectiveExtra : true);
      setReflectivePrice(initialOrder.reflectivePrice !== undefined ? initialOrder.reflectivePrice : 10);

      setZipType(initialOrder.zipType || 'nylon');
      if (initialOrder.zipType === 'nylon') setZipNylonPrice(initialOrder.zipPrice || 0);
      else setZipBonePrice(initialOrder.zipPrice || 50);

      setDeliveryDate(initialOrder.deliveryDate || '');
      setContactName(initialOrder.contactName || '');
      setContactAddress(initialOrder.contactAddress || '');
      setContactPhone(initialOrder.contactPhone || '');
      setContactDate(initialOrder.contactDate || new Date().toISOString().split('T')[0]);

      setSameAsContact(initialOrder.sameAsContact || false);
      setShippingName(initialOrder.shippingName || '');
      setShippingAddress(initialOrder.shippingAddress || '');
      setShippingPhone(initialOrder.shippingPhone || '');

      setPaymentType(initialOrder.paymentType || 'deposit');
      setPaidAmount(initialOrder.paidAmount || 0);
    }
  }, [initialOrder]);

  // Sync shipping fields if sameAsContact checkbox is checked
  useEffect(() => {
    if (sameAsContact) {
      setShippingName(contactName);
      setShippingAddress(contactAddress);
      setShippingPhone(contactPhone);
    }
  }, [sameAsContact, contactName, contactAddress, contactPhone]);

  // Live calculations
  const calculateSinglePrice = () => {
    let price = Number(basePrice) || 0;
    if (hasNameTag) price += Number(nameTagPrice) || 0;
    if (hasFlag) price += Number(flagPrice) || 0;
    if (hasSizeExtra) price += Number(sizeExtraPrice) || 0;
    if (hasReflectiveExtra) price += Number(reflectivePrice) || 0;
    
    if (zipType === 'nylon') price += Number(zipNylonPrice) || 0;
    else price += Number(zipBonePrice) || 0;

    return price;
  };

  const singlePrice = calculateSinglePrice();
  const totalPrice = singlePrice * (Number(quantity) || 1);

  // Sync paidAmount with total if paymentType is paid_full
  useEffect(() => {
    if (paymentType === 'paid_full') {
      setPaidAmount(totalPrice);
    } else if (paymentType === 'cod') {
      setPaidAmount(0);
    }
  }, [paymentType, totalPrice]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contactName || !contactPhone) {
      alert('กรุณากรอกข้อมูลติดต่อผู้ว่าจ้าง (ชื่อและเบอร์โทร) ให้ครบถ้วน');
      return;
    }
    if (!deliveryDate) {
      alert('กรุณาระบุกำหนดส่งมอบสินค้า');
      return;
    }

    const orderData = {
      shirtType: SHIRT_TYPES.find(t => t.id === selectedType).name,
      letterType,
      reflectiveStrip: reflectiveStrip === 'อื่นๆ' ? customReflective : reflectiveStrip,
      fabricType,
      embWinName,
      embArea,
      embNumber,
      size,
      basePrice: Number(basePrice),
      quantity: Number(quantity),
      hasNameTag,
      nameTagPrice: Number(nameTagPrice),
      hasFlag,
      flagPrice: Number(flagPrice),
      hasSizeExtra,
      sizeExtraPrice: Number(sizeExtraPrice),
      hasReflectiveExtra,
      reflectivePrice: Number(reflectivePrice),
      zipType,
      zipPrice: zipType === 'nylon' ? Number(zipNylonPrice) : Number(zipBonePrice),
      total: totalPrice,
      deliveryDate,
      contactName,
      contactAddress,
      contactPhone,
      contactDate,
      sameAsContact,
      shippingName: sameAsContact ? contactName : shippingName,
      shippingAddress: sameAsContact ? contactAddress : shippingAddress,
      shippingPhone: sameAsContact ? contactPhone : shippingPhone,
      paymentType,
      paidAmount: Number(paidAmount),
      status: initialOrder ? initialOrder.status : 'new',
      createdDate: initialOrder ? initialOrder.createdDate : new Date().toISOString()
    };

    if (initialOrder?.id) {
      orderData.id = initialOrder.id;
    }

    onSave(orderData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* 1. เสื้อวินวินมอเตอร์ไซค์ */}
      <div className="card-container">
        <h2 className="section-title">
          <Shield className="text-primary" size={24} />
          ประเภทเสื้อวินมอเตอร์ไซค์
        </h2>
        
        <div className="form-grid form-grid-three-col">
          <div className="space-y-4">
            <label className="form-group label">เลือกประเภทเสื้อวิน</label>
            <div className="shirt-options-list">
              {SHIRT_TYPES.map((t) => (
                <div 
                  key={t.id} 
                  className={`shirt-option-card ${selectedType === t.id ? 'selected' : ''}`}
                  onClick={() => setSelectedType(t.id)}
                >
                  <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t.name.split(' (')[0]}</p>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {t.id === 1 ? 'สีส้มสะท้อนแสง' : t.id === 2 ? 'สีเขียวสกรีนกรีนแคมปัส' : 'สีส้มอยุธยา'}
                  </p>
                  <span className={`shirt-option-badge ${t.color}`}>
                    {t.color === 'orange' ? 'ส้ม' : 'เขียว'}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="form-group-row" style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label>แบบตัวหนังสือ</label>
                <select className="form-select" value={letterType} onChange={(e) => setLetterType(e.target.value)}>
                  <option value="ปัก">แบบปัก</option>
                  <option value="สกรีน">แบบสกรีน</option>
                </select>
              </div>
              <div className="form-group">
                <label>ชนิดผ้า</label>
                <select className="form-select" value={fabricType} onChange={(e) => setFabricType(e.target.value)}>
                  <option value="ผ้าโซล่อน">ผ้าโซล่อน</option>
                  <option value="ลีวาย">ลีวาย</option>
                  <option value="มองตากูร์">มองตากูร์</option>
                  <option value="เสื้อวินแบบใหม่ผ้าตาข่าย">เสื้อวินแบบใหม่ผ้าตาข่าย</option>
                </select>
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label>แถบสีสะท้อนแสง</label>
                <select 
                  className="form-select" 
                  value={reflectiveStrip} 
                  onChange={(e) => setReflectiveStrip(e.target.value)}
                >
                  <option value="เขียว-เทา">เขียว-เทา</option>
                  <option value="แถบ PVC">แถบ PVC</option>
                  <option value="อื่นๆ">แถบสีอื่นๆ (โปรดระบุ)</option>
                </select>
              </div>
              {reflectiveStrip === 'อื่นๆ' && (
                <div className="form-group">
                  <label>ระบุแถบสีอื่นๆ</label>
                  <input 
                    type="text" 
                    placeholder="เช่น สีส้มล้วน, แถบ 3M" 
                    className="form-input" 
                    value={customReflective} 
                    onChange={(e) => setCustomReflective(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="shirt-preview-box">
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>ตัวอย่างลายเสื้อวินที่เลือก</span>
              <div className="shirt-preview-images">
                <div className="shirt-preview-image-wrapper">
                  <p>ด้านหน้า</p>
                  <img 
                    src={`/shirt${selectedType}-front.jpg`} 
                    alt="เสื้อด้านหน้า" 
                    className="shirt-preview-img"
                    onError={(e) => { e.target.src = 'https://placehold.co/150x200?text=Front'; }}
                  />
                </div>
                <div className="shirt-preview-image-wrapper">
                  <p>ด้านหลัง</p>
                  <img 
                    src={`/shirt${selectedType === 2 ? '2-front' : `${selectedType}-back`}.jpg`} 
                    alt="เสื้อด้านหลัง" 
                    className="shirt-preview-img"
                    onError={(e) => { e.target.src = 'https://placehold.co/150x200?text=Back'; }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. รายละเอียดงานปัก & ขนาด */}
      <div className="card-container">
        <h2 className="section-title">
          <Info className="text-primary" size={24} />
          รายละเอียดงานปัก & ขนาดเสื้อ
        </h2>
        
        <div className="form-group-row">
          <div className="form-group">
            <label>ชื่อวิน</label>
            <input 
              type="text" 
              placeholder="กรอกชื่อวินที่จะปัก เช่น หน้านวนคร" 
              className="form-input" 
              value={embWinName} 
              onChange={(e) => setEmbWinName(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>เขตพื้นที่ / อำเภอ</label>
            <input 
              type="text" 
              placeholder="ระบุเขตพื้นที่ เช่น คลองหลวง" 
              className="form-input" 
              value={embArea} 
              onChange={(e) => setEmbArea(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>หมายเลขเสื้อ</label>
            <input 
              type="text" 
              placeholder="ระบุหมายเลขเสื้อ (เช่น 01-50)" 
              className="form-input" 
              value={embNumber} 
              onChange={(e) => setEmbNumber(e.target.value)} 
            />
          </div>
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label>ขนาด / Size</label>
            <select className="form-select" value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="S">S: รอบอก (34 - 36) นิ้ว</option>
              <option value="M">M: รอบอก (38 - 40) นิ้ว</option>
              <option value="L">L: รอบอก (42 - 44) นิ้ว</option>
              <option value="XL">XL: รอบอก (46 - 48) นิ้ว</option>
              <option value="2XL">2XL: รอบอก (48 - 50) นิ้ว</option>
            </select>
          </div>
          <div className="form-group">
            <label>ราคาตัวหลักเริ่มต้น (บาท/ตัว)</label>
            <input 
              type="number" 
              className="form-input" 
              value={basePrice} 
              onChange={(e) => setBasePrice(Number(e.target.value))} 
              min="0"
            />
          </div>
          <div className="form-group">
            <label>จำนวนเสื้อ (ตัว)</label>
            <input 
              type="number" 
              className="form-input" 
              value={quantity} 
              onChange={(e) => setQuantity(Number(e.target.value))} 
              min="1"
            />
          </div>
        </div>
      </div>

      {/* 3. รายการเพิ่มเติมและเงื่อนไขราคา */}
      <div className="card-container">
        <h2 className="section-title">
          <Info className="text-primary" size={24} />
          ส่วนเสริม & เงื่อนไขราคาสินค้าเพิ่มเติม
        </h2>
        <p className="form-section-header">เลือกส่วนเสริมที่ต้องการและกำหนดราคาต่อชิ้น</p>

        <div className="options-checkbox-grid">
          <div className="checkbox-card">
            <div className="checkbox-card-info">
              <input 
                type="checkbox" 
                id="opt-nametag" 
                checked={hasNameTag} 
                onChange={(e) => setHasNameTag(e.target.checked)} 
              />
              <label htmlFor="opt-nametag" className="checkbox-card-label">ซองป้ายชื่อ หน้าหลัง (฿)</label>
            </div>
            <input 
              type="number" 
              className="checkbox-card-price-input" 
              value={nameTagPrice} 
              onChange={(e) => setNameTagPrice(Number(e.target.value))}
              disabled={!hasNameTag}
              min="0"
            />
          </div>

          <div className="checkbox-card">
            <div className="checkbox-card-info">
              <input 
                type="checkbox" 
                id="opt-flag" 
                checked={hasFlag} 
                onChange={(e) => setHasFlag(e.target.checked)} 
              />
              <label htmlFor="opt-flag" className="checkbox-card-label">ธงชาติ (฿)</label>
            </div>
            <input 
              type="number" 
              className="checkbox-card-price-input" 
              value={flagPrice} 
              onChange={(e) => setFlagPrice(Number(e.target.value))}
              disabled={!hasFlag}
              min="0"
            />
          </div>

          <div className="checkbox-card">
            <div className="checkbox-card-info">
              <input 
                type="checkbox" 
                id="opt-size" 
                checked={hasSizeExtra} 
                onChange={(e) => setHasSizeExtra(e.target.checked)} 
              />
              <label htmlFor="opt-size" className="checkbox-card-label">เพิ่มตาม Size (฿)</label>
            </div>
            <input 
              type="number" 
              className="checkbox-card-price-input" 
              value={sizeExtraPrice} 
              onChange={(e) => setSizeExtraPrice(Number(e.target.value))}
              disabled={!hasSizeExtra}
              min="0"
            />
          </div>

          <div className="checkbox-card">
            <div className="checkbox-card-info">
              <input 
                type="checkbox" 
                id="opt-refl" 
                checked={hasReflectiveExtra} 
                onChange={(e) => setHasReflectiveExtra(e.target.checked)} 
              />
              <label htmlFor="opt-refl" className="checkbox-card-label">เพิ่มสะท้อนแสง (฿)</label>
            </div>
            <input 
              type="number" 
              className="checkbox-card-price-input" 
              value={reflectivePrice} 
              onChange={(e) => setReflectivePrice(Number(e.target.value))}
              disabled={!hasReflectiveExtra}
              min="0"
            />
          </div>
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label>ชนิดของซิปเสื้อ</label>
            <div style={{ display: 'flex', gap: '20px', padding: '8px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500 }}>
                <input 
                  type="radio" 
                  name="zipType" 
                  value="nylon" 
                  checked={zipType === 'nylon'}
                  onChange={() => setZipType('nylon')}
                  style={{ accentColor: 'var(--primary)' }}
                />
                ฟันไนล่อน (ราคาปกติ ฿0)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500 }}>
                <input 
                  type="radio" 
                  name="zipType" 
                  value="bone" 
                  checked={zipType === 'bone'}
                  onChange={() => setZipType('bone')}
                  style={{ accentColor: 'var(--primary)' }}
                />
                ฟันกระดูก (ส่วนต่าง ฿50)
              </label>
            </div>
          </div>
          <div className="form-group">
            <label>ค่าซิปฟันกระดูก (฿)</label>
            <input 
              type="number" 
              className="form-input" 
              value={zipBonePrice} 
              onChange={(e) => setZipBonePrice(Number(e.target.value))} 
              disabled={zipType !== 'bone'}
              min="0"
            />
          </div>
        </div>
      </div>

      {/* 4. ข้อมูลติดต่อและผู้ติดต่อ */}
      <div className="card-container">
        <h2 className="section-title">
          <User className="text-primary" size={24} />
          ข้อมูลการติดต่อและจัดส่งสินค้า
        </h2>

        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          
          {/* ฝั่งผู้ติดต่อ / ผู้สั่งซื้อ */}
          <div className="space-y-4">
            <p className="form-section-header">ข้อมูลผู้ติดต่อ / ลูกค้า</p>
            <div className="form-group">
              <label>ชื่อลูกค้า / ผู้สั่งซื้อ *</label>
              <input 
                type="text" 
                placeholder="กรอกชื่อ-นามสกุล ผู้ว่าจ้าง" 
                className="form-input" 
                value={contactName} 
                onChange={(e) => setContactName(e.target.value)} 
                required
              />
            </div>
            <div className="form-group">
              <label>เบอร์โทรศัพท์ติดต่อ *</label>
              <input 
                type="text" 
                placeholder="กรอกเบอร์โทรติดต่อลูกค้า" 
                className="form-input" 
                value={contactPhone} 
                onChange={(e) => setContactPhone(e.target.value)} 
                required
              />
            </div>
            <div className="form-group">
              <label>ที่อยู่ลูกค้า</label>
              <textarea 
                placeholder="กรอกที่อยู่ผู้ว่าจ้าง" 
                className="form-textarea" 
                value={contactAddress} 
                onChange={(e) => setContactAddress(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>วันที่สั่งจอง</label>
              <input 
                type="date" 
                className="form-input" 
                value={contactDate} 
                onChange={(e) => setContactDate(e.target.value)} 
              />
            </div>
          </div>

          {/* ฝั่งจัดส่ง */}
          <div className="space-y-4">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginTop: '12px', marginBottom: '18px' }}>
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary-hover)', flex: 1 }}>สถานที่จัดส่งสินค้า</p>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <input 
                  type="checkbox" 
                  checked={sameAsContact} 
                  onChange={(e) => setSameAsContact(e.target.checked)} 
                  style={{ accentColor: 'var(--primary)' }}
                />
                ใช้ข้อมูลเดียวกับลูกค้า
              </label>
            </div>

            <div className="form-group">
              <label>ชื่อผู้รับสินค้า</label>
              <input 
                type="text" 
                placeholder="กรอกชื่อผู้รับปลายทาง" 
                className="form-input" 
                value={shippingName} 
                onChange={(e) => setShippingName(e.target.value)} 
                disabled={sameAsContact}
              />
            </div>
            <div className="form-group">
              <label>เบอร์โทรศัพท์ผู้รับ</label>
              <input 
                type="text" 
                placeholder="กรอกเบอร์โทรศัพท์ผู้รับ" 
                className="form-input" 
                value={shippingPhone} 
                onChange={(e) => setShippingPhone(e.target.value)} 
                disabled={sameAsContact}
              />
            </div>
            <div className="form-group">
              <label>สถานที่จัดส่งอย่างละเอียด</label>
              <textarea 
                placeholder="ระบุที่อยู่จัดส่งและเงื่อนไขการส่งโดยละเอียด" 
                className="form-textarea" 
                value={shippingAddress} 
                onChange={(e) => setShippingAddress(e.target.value)}
                disabled={sameAsContact}
              />
            </div>
            
            <div className="form-group">
              <label>กำหนดส่งงาน (วัน/เดือน/ปี) *</label>
              <input 
                type="date" 
                className="form-input" 
                value={deliveryDate} 
                onChange={(e) => setDeliveryDate(e.target.value)} 
                required
              />
            </div>
          </div>

        </div>
      </div>

      {/* 5. การชำระเงินและบันทึกออเดอร์ */}
      <div className="card-container">
        <h2 className="section-title">
          <CreditCard className="text-primary" size={24} />
          เงื่อนไขการชำระเงิน & คำนวณราคา
        </h2>
        
        <div className="form-group-row">
          <div className="form-group">
            <label>รูปแบบการชำระเงิน</label>
            <select 
              className="form-select" 
              value={paymentType} 
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <option value="paid_full">จ่ายหมดแล้ว</option>
              <option value="deposit">จ่ายมัดจำ</option>
              <option value="cod">เก็บเงินปลายทาง</option>
            </select>
          </div>
          <div className="form-group">
            <label>ยอดเงินที่จ่ายเข้ามาแล้ว (บาท)</label>
            <input 
              type="number" 
              className="form-input" 
              value={paidAmount} 
              onChange={(e) => setPaidAmount(Number(e.target.value))} 
              disabled={paymentType === 'paid_full' || paymentType === 'cod'}
              min="0"
            />
          </div>
        </div>

        {/* Live Calculation Display */}
        <div className="price-calculation-summary">
          <div className="price-breakdown">
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>สรุปเงื่อนไขราคาเสื้อวินต่อตัว:</span>
            <span className="price-breakdown-item">ราคาเริ่มต้น ฿{basePrice}</span>
            {hasNameTag && <span className="price-breakdown-item">+ ซองป้ายชื่อ ฿{nameTagPrice}</span>}
            {hasFlag && <span className="price-breakdown-item">+ ธงชาติ ฿{flagPrice}</span>}
            {hasSizeExtra && <span className="price-breakdown-item">+ ไซส์เพิ่มเติม ฿{sizeExtraPrice}</span>}
            {hasReflectiveExtra && <span className="price-breakdown-item">+ สะท้อนแสง ฿{reflectivePrice}</span>}
            <span className="price-breakdown-item">
              + ซิปแบบ{zipType === 'nylon' ? 'ไนล่อน' : 'ฟันกระดูก'} ฿{zipType === 'nylon' ? zipNylonPrice : zipBonePrice}
            </span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '4px' }}>
              รวมเป็นเงินเฉลี่ยต่อตัว: ฿{singlePrice.toLocaleString()} บาท
            </span>
          </div>

          <div className="price-total-display">
            <p>ราคารวมทั้งหมด ({quantity} ตัว)</p>
            <span className="price-total-value">฿{totalPrice.toLocaleString()}</span>
            <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>
              {paymentType === 'paid_full' 
                ? 'ชำระเต็มจำนวนแล้ว' 
                : paymentType === 'deposit' 
                ? `ชำระแล้ว ฿${paidAmount.toLocaleString()} (ค้างจ่าย ฿${(totalPrice - paidAmount).toLocaleString()})`
                : 'รอเรียกเก็บเงินปลายทาง'
              }
            </span>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          <Save size={20} />
          {initialOrder ? 'บันทึกการแก้ไขออเดอร์' : 'บันทึกข้อมูลออเดอร์เข้าวิน'}
        </button>
      </div>

      {/* 6. ตัวอย่างลายเสื้อวินทั้งหมด */}
      <div className="card-container" style={{ background: '#f8fafc' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', textAlign: 'center', color: '#334155' }}>
          ประเภทเสื้อวินมอเตอร์ไซค์ทั้งหมดที่มีในร้าน
        </h3>
        <div className="sample-references-grid">
          {SHIRT_TYPES.map((t) => (
            <div key={t.id} className="sample-reference-card">
              <span className="sample-reference-title">{t.name}</span>
              <div className="sample-reference-images">
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>หน้า</span>
                  <img 
                    src={`/shirt${t.id}-front.jpg`} 
                    alt={`${t.name} หน้า`} 
                    style={{ width: '100%', height: 'auto', border: '1px solid #e2e8f0', borderRadius: '4px', background: '#fff' }} 
                  />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>หลัง</span>
                  <img 
                    src={`/shirt${t.id === 2 ? '2-front' : `${t.id}-back`}.jpg`} 
                    alt={`${t.name} หลัง`} 
                    style={{ width: '100%', height: 'auto', border: '1px solid #e2e8f0', borderRadius: '4px', background: '#fff' }} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </form>
  );
}
