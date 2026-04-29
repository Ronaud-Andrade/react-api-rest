import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Product, PaginatedResponse } from "../lib/types/types";

function DashboardPage() {
  const navigate = useNavigate();
  // Estado para controlar qual página está sendo visualizada.
  const [page, setPage] = useState(1);

  // Hook do React Query que busca os produtos com paginação.
  // Quando o `page` muda, uma nova requisição é feita automaticamente.
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", page],
    queryFn: () =>
      api.get<PaginatedResponse<Product>>(`/api/v1/products/?page=${page}`).then((res) => res.data),
  });

  if (isLoading) return <p className="text-center mt-10">Carregando produtos...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Erro ao carregar os produtos.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
              Produtos
            </h1>
            <p className="text-gray-600">Gerencie seu catálogo de produtos</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/products/new")}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
            >
              ➕ Novo Produto
            </button>
            <button
              onClick={() => navigate("/galleries")}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
            >
              🖼️ Ver Galeria
            </button>
          </div>
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {data?.results.map((product: Product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-2 cursor-pointer overflow-hidden group"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <div className="relative overflow-hidden bg-gray-200 h-48">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-2xl font-bold text-blue-600">R$ {Number(product.price).toFixed(2)}</span>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    Ver mais →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginação */}
        <div className="flex flex-col items-center gap-6 bg-white rounded-2xl p-8 shadow-lg">
          <p className="text-gray-700 font-semibold text-lg">
            Página <span className="text-blue-600">{page}</span> de{" "}
            <span className="text-blue-600">{Math.ceil((data?.count || 0) / 3)}</span> |
            <span className="ml-2 text-gray-800">Total de produtos: <span className="font-bold text-blue-600">{data?.count || 0}</span></span>
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105 disabled:scale-100"
            >
              ← Anterior
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!data?.next}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105 disabled:scale-100"
            >
              Próximo →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
