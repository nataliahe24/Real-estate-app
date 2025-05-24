
export const MOCK_PROPERTY_PUBLISHED = {
  id: 1,
  name: 'Test Property',
  description: 'Test Description',
  price: 100000,
  category: 1,
  location: 1,
  address: 'Test Address',
  rooms: 1,
  bathrooms: 1,
  activePublicationDate: new Date().toISOString(),
  sellerId: 3,
}
export const MOCK_PROPERTIES = [
  {
    id: 1,
    name: 'Property 1',
    address: 'Address 1',
    description: 'Description 1',
    category: 'Casa',
    rooms: 3,
    bathrooms: 2,
    price: 200000,
    city: 'City B',
    department: 'Department C',
    neighborhood: 'Neighborhood A',
    activePublicationDate: '2024-01-01',
    publicationStatus: 'PUBLISHED',
    sellerId: 3
  },
  {
    id: 2,
    name: 'Property 2',
    address: 'Address 2',
    description: 'Description 2',
    category: 'Apartamento',
    rooms: 2,
    bathrooms: 1,
    price: 150000,
    city: 'City A',
    department: 'Department C',
    neighborhood: 'Neighborhood B',
    activePublicationDate: '2024-01-02',
    publicationStatus: 'PUBLISHED',
    sellerId: 3
  }
];

export const MOCK_PAGINATED_PROPERTIES = {
  content: MOCK_PROPERTIES,
  page: 0,
  size: 20,
  totalElements: 1,
  totalPages: 1
};