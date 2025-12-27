import { schemas } from '../validations'

describe('Validation Schemas', () => {
  describe('User Registration Schema', () => {
    it('should validate valid user registration data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123',
      }

      expect(() => schemas.user.register.parse(validData)).not.toThrow()
    })

    it('should reject invalid email', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'SecurePass123',
      }

      expect(() => schemas.user.register.parse(invalidData)).toThrow()
    })

    it('should reject weak password', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'weak',
      }

      expect(() => schemas.user.register.parse(invalidData)).toThrow()
    })

    it('should reject name with invalid characters', () => {
      const invalidData = {
        name: 'John123',
        email: 'john@example.com',
        password: 'SecurePass123',
      }

      expect(() => schemas.user.register.parse(invalidData)).toThrow()
    })
  })

  describe('User Login Schema', () => {
    it('should validate valid login data', () => {
      const validData = {
        email: 'john@example.com',
        password: 'password123',
      }

      expect(() => schemas.user.login.parse(validData)).not.toThrow()
    })

    it('should reject empty password', () => {
      const invalidData = {
        email: 'john@example.com',
        password: '',
      }

      expect(() => schemas.user.login.parse(invalidData)).toThrow()
    })
  })

  describe('Career Chat Request Schema', () => {
    it('should validate valid chat request', () => {
      const validData = {
        messages: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi there!' },
        ],
        resumeText: 'Experienced developer...',
        ventText: 'I need career advice',
        temperature: 0.7,
      }

      expect(() => schemas.career.chat.parse(validData)).not.toThrow()
    })

    it('should reject empty messages array', () => {
      const invalidData = {
        messages: [],
        ventText: 'I need career advice',
      }

      expect(() => schemas.career.chat.parse(invalidData)).toThrow()
    })

    it('should reject invalid temperature', () => {
      const invalidData = {
        messages: [{ role: 'user', content: 'Hello' }],
        ventText: 'I need career advice',
        temperature: 3, // Too high
      }

      expect(() => schemas.career.chat.parse(invalidData)).toThrow()
    })
  })
})
