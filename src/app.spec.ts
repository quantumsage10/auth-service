import { calculateDiscount } from './utils'

describe('App', () => {
    it('should return correct discount amount', () => {
        const discount = calculateDiscount(100, 10)
        expect(discount).toBe(10)
    })
})
