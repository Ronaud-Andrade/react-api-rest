import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import type { Gallery, PaginatedResponse } from "../lib/types/types";

function GalleryDashboardPage() {
  const navigate = useNavigate();
  // Estado que armazena a página atual que o usuário está visualizando.
  const [page, setPage] = useState(1);

  // React Query busca os dados de galeria com paginação.
  // O `queryKey` inclui `page` para que o cache seja diferente para cada página.
  const { data, isLoading, error } = useQuery({
    queryKey: ["galleries", page],
    queryFn: () =>
      api.get<PaginatedResponse<Gallery>>(`/api/v1/galleries/?page=${page}`).then((res) => res.data),
  });

  if (isLoading) return <p className="text-center mt-10">Carregando imagens...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Erro ao carregar a galeria.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Galeria de Imagens
            </h1>
            <p className="text-gray-600">Explore e gerencie sua coleção de imagens</p>
          </div>
          <button
            onClick={() => navigate("/galleries/new")}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 w-fit"
          >
            ➕ Nova Imagem
          </button>
        </div>

        {/* Grid de Imagens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {data?.results.map((gallery) => (
            <div
              key={gallery.id}
              className="bg-white rounded-xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-2 cursor-pointer overflow-hidden group"
              onClick={() => navigate(`/galleries/${gallery.id}`)}
            >
              <div className="relative overflow-hidden bg-gray-200 h-48">
                <img
                  src={gallery.image_url}
                  alt={gallery.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{gallery.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{gallery.description}</p>

                <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
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
            Página <span className="text-purple-600">{page}</span> de{" "}
            <span className="text-purple-600">{Math.ceil((data?.count || 0) / 3)}</span> |
            <span className="ml-2 text-gray-800">Total de imagens: <span className="font-bold text-purple-600">{data?.count || 0}</span></span>
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
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:text-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105 disabled:scale-100"
            >
              Próximo →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GalleryDashboardPage;
