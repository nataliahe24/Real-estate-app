export const MOCK_ROLE = {
  id: 3,
  name: 'Seller'
};

export const MOCK_USER = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phoneNumber: '+573001234567',
  identityDocument: 1234567890,
  birthDate: new Date('1990-01-01'),
  password: 'password123'
};

export const MOCK_USER_RESPONSE = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phoneNumber: '+573001234567',
  identityDocument: 1234567890,
  birthDate: new Date('1990-01-01'),
  password: 'password123',
  role: MOCK_ROLE
};
