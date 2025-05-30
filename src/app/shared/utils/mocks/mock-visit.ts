export const MOCK_VISIT = {
    sellerId: 1,
    propertyId: 1,
    location: 'Ciudad Test',
    startDate: '2024-03-20T10:00:00Z',
    endDate: '2024-03-20T11:00:00Z'
  };

  export const MOCK_VISIT_RESPONSE = {
    content: [MOCK_VISIT],
    page: 0,
    size: 10,
    totalElements: 1,
    totalPages: 1
  };

  export const MOCK_VISIT_RESPONSE_LIST = {
    id: 1,
    sellerId: 1,
    propertyId: 1,
    propertyName: 'Test Property',
    city: 'Test City',
    neighborhood: 'Test Neighborhood',
    address: 'Test Address',
    startDate: new Date('2024-03-20T10:00:00'),
    endDate: new Date('2024-03-20T11:00:00')
  };
  export const MOCK_VISIT_RESPONSE_PAGE = {
    content: [MOCK_VISIT_RESPONSE_LIST],
    page: 0,
    size: 10,
    totalElements: 1,
    totalPages: 1
  };
  export const MOCK_VISIT_QUERY_PARAMS = {
    startDate: new Date('2024-03-20').toISOString(),
    endDate: new Date('2024-03-21').toISOString(),
    location: 'Test Location'
  };
