// Imports para trabalhar com formulários, validação e navegação.
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import type { ProductFormData } from "../lib/types/types";
import api from "../services/api";

// Normaliza a URL da imagem para incluir https:// se o usuário não digitar.
const normalizeUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

// Schema de validação com Yup.
// Ele define as regras de validação para cada campo do formulário.
const schema = yup.object().shape({
  name: yup.string().trim().required("Nome obrigatório"),
  description: yup.string().trim().required("Descrição obrigatória"),
  price: yup
    .number()
    .typeError("Preço deve ser um número")
    .positive("Preço deve ser positivo")
    .required("Preço obrigatório"),
  image_url: yup
    .string()
    .transform((value) => (typeof value === "string" ? value.trim() : value))
    .url("URL inválida")
    .required("Imagem obrigatória"),
});

function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Inicializa o formulário com React Hook Form.
  // O resolver do Yup integra a validação definida no schema.
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
  });

  // Se houver ID na rota, estamos editando um produto existente.
  // Buscamos os dados no backend e preenchemos os campos do formulário.
  useEffect(() => {
    if (id) {
      api.get(`/api/v1/products/${id}/`).then((res) => {
        const product = res.data;
        setValue("name", product.name);
        setValue("description", product.description);
        setValue("price", Number(product.price)); // Garantindo tipo numérico
        setValue("image_url", product.image_url);
      });
    }
  }, [id, setValue]);

  // Função chamada quando o formulário é submetido com sucesso.
  // O React Hook Form já garantiu a validação do schema antes de chamar aqui.
  const onSubmit = async (data: ProductFormData) => {
    const payload = {
      ...data,
      image_url: normalizeUrl(data.image_url),
    };

    try {
      if (id) {
        await api.put(`/api/v1/products/${id}/`, payload);
      } else {
        await api.post("/api/v1/products/", payload);
      }
      navigate("/");
    } catch (error: any) {
      // Extrai mensagens de validação do backend e as exibe ao usuário.
      const backendMessage =
        error.response?.data && typeof error.response.data === "object"
          ? Object.entries(error.response.data)
              .map(([field, value]) => `${field}: ${Array.isArray(value) ? value.join(", ") : value}`)
              .join("\n")
          : error.message || String(error);

      alert(`Erro ao salvar produto:\n${backendMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 md:p-12"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {id ? "✏️ Editar Produto" : "➕ Novo Produto"}
          </h1>
          <p className="text-gray-600">Preencha todos os campos para continuar</p>
        </div>

        <div className="space-y-6">
          {/* Campo: Nome */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Produto</label>
            <input
              {...register("name")}
              placeholder="Digite o nome do produto"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition placeholder-gray-400 text-gray-900"
            />
            {/* Exibe mensagem de erro do Yup para o campo name */}
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.name.message}</p>
            )}
          </div>

          {/* Campo: Descrição */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
            <textarea
              {...register("description")}
              placeholder="Digite uma descrição detalhada"
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition placeholder-gray-400 resize-none text-gray-900"
            />
            {/* Exibe mensagem de erro do Yup para o campo description */}
            {errors.description && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campo: Preço */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Preço (R$)</label>
              <input
                {...register("price")}
                type="number"
                step="0.01"
                placeholder="0,00"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition placeholder-gray-400 text-gray-900"
              />
              {/* Exibe mensagem de erro do Yup para o campo price */}
              {errors.price && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.price.message}</p>
              )}
            </div>

            {/* Campo: URL da Imagem */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">URL da Imagem</label>
              <input
                {...register("image_url")}
                placeholder="https://exemplo.com/imagem.jpg"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition placeholder-gray-400 text-gray-900"
              />
              {/* Exibe mensagem de erro do Yup para o campo image_url */}
              {errors.image_url && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.image_url.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col md:flex-row gap-4 mt-10">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-lg font-bold transition transform hover:scale-105 active:scale-95 shadow-lg"
          >
            {id ? "💾 Atualizar Produto" : "💾 Cadastrar Produto"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-6 rounded-lg font-bold transition"
          >
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductFormPage;
