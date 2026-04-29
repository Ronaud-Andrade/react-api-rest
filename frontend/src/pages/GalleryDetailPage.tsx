import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import type { Gallery } from "../lib/types/types";

function GalleryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: gallery, isLoading, error } = useQuery<Gallery>({
    queryKey: ["gallery", id],
    queryFn: () => api.get(`/api/v1/galleries/${id}/`).then((res) => res.data),
    enabled: !!id,
  });

  const handleDelete = async () => {
    if (!id) return;

    if (confirm("Tem certeza que deseja excluir esta imagem?")) {
      try {
        await api.delete(`/api/v1/galleries/${id}/`);
        navigate("/galleries");
      } catch (error) {
        alert(`Erro ao excluir imagem: ${error}.`);
      }
    }
  };

  if (isLoading) return <p className="text-center mt-10">Carregando imagem...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Erro ao carregar a imagem.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/galleries")}
          className="mb-6 flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition"
        >
          ← Voltar para Galeria
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cabeçalho com gradiente */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-32"></div>

          <div className="p-8 md:p-12 -mt-16 relative">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Imagem */}
              {gallery?.image_url && (
                <div className="md:w-1/3">
                  <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={gallery.image_url}
                      alt={gallery.title}
                      className="w-full h-80 object-cover hover:scale-105 transition transform duration-300"
                    />
                  </div>
                </div>
              )}

              {/* Informações */}
              <div className="md:w-2/3 space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">{gallery?.title}</h1>
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-4 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                      🖼️ Imagem Ativa
                    </span>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="text-gray-700 text-lg leading-relaxed">{gallery?.description}</p>
                </div>

                {/* Botões de ação */}
                <div className="flex flex-col md:flex-row gap-3 pt-4">
                  <button
                    onClick={() => navigate(`/galleries/${gallery?.id}/edit`)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition transform hover:scale-105 active:scale-95 shadow-lg"
                  >
                    ✏️ Editar Imagem
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition transform hover:scale-105 active:scale-95 shadow-lg"
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GalleryDetailPage;
