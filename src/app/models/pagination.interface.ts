export interface IPagination {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'DESC' | 'ASC';
}

export interface IPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
