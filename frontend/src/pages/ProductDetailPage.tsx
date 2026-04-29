import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.get(`/api/v1/products/${id}/`).then((res) => res.data),
    enabled: !!id,
  });

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await api.delete(`/api/v1/products/${id}/`);
        navigate("/");
      } catch (error) {
        alert(`Erro ao excluir produto: ${error}.`);
      }
    }
  };

  if (isLoading)
    return <p className="text-center mt-10">Carregando produto...</p>;

  if (error)
    return (
      <p className="text-center mt-10 text-red-500">
        Erro ao carregar o produto.
      </p>
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition"
          >
            ← Voltar para Produtos
          </button>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Cabeçalho com gradiente */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32"></div>

            <div className="p-8 md:p-12 -mt-16 relative">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Imagem */}
                {product?.image_url && (
                  <div className="md:w-1/3">
                    <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-80 object-cover hover:scale-105 transition transform duration-300"
                      />
                    </div>
                  </div>
                )}

                {/* Informações */}
                <div className="md:w-2/3 space-y-6">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">{product?.name}</h1>
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                        ✓ Disponível
                      </span>
                    </div>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="text-gray-700 text-lg leading-relaxed">{product?.description}</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                    <p className="text-gray-600 text-sm mb-1">Preço</p>
                    <p className="text-4xl font-bold text-blue-600">R$ {Number(product?.price).toFixed(2)}</p>
                  </div>

                  {/* Botões de ação */}
                  <div className="flex flex-col md:flex-row gap-3 pt-4">
                    <button
                      onClick={() => navigate(`/products/${product?.id}/edit/`)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                      ✏️ Editar Produto
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

export default ProductDetailPage;
