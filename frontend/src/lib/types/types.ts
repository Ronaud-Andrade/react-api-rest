// Tipo centralizado para Produto
export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
};

// Tipo para o formulário de Produto
export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  image_url: string;
};

export type Gallery = {
  id: number;
  title: string;
  description: string;
  image_url: string;
};

export type GalleryFormData = {
  title: string;
  description: string;
  image_url: string;
};

// Tipo de resposta de paginação da API (usado com React Query)
export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// Tipo para autenticação
export type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export type LoginFormInputs = {
  username: string;
  password: string;
};