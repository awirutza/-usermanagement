const {add, calculateDiscount} = require('./UnitTest');

describe('calculateDiscount', () => {
    it('should apply 10% discount for members', () => {
      const result = calculateDiscount(100, true, false);
      expect(result).toBe(90); // คาดหวังว่าจะได้ราคาหลังหักส่วนลดเป็น 90
    });
    it('should apply an additional 5% discount for special offers', () => {
        const result = calculateDiscount(100, true, true);
        expect(result).toBe(85); // คาดหวังว่าจะได้ราคาหลังหักส่วนลดเป็น 85
      });
    
      it('should not apply any discount for non-members without special offers', () => {
        const result = calculateDiscount(100, true, false);
        expect(result).toBe(80); // คาดหวังว่าราคาจะไม่เปลี่ยนแปลง
      });
    
      it('should apply only 5% discount for non-members with special offers', () => {
        const result = calculateDiscount(100, false, true);
        expect(result).toBe(95); // คาดหวังว่าจะได้ราคาหลังหักส่วนลดเป็น 95
      });
  });
