function add(a, b) {
    return a + b;
}

function calculateDiscount(price, isMember, isSpecialOffer) {
    let discount = 0;
    
    if (isMember) {
      discount = price * 0.1; // สมาชิกได้ส่วนลด 10%
    }
    
    if (isSpecialOffer) {
      discount += price * 0.05; // ข้อเสนอพิเศษเพิ่มเติม 5%
    }
    
    return Math.max(0, price - discount);
  }

  
module.exports = { add, calculateDiscount}