// Imports necessários para formulário, validação e navegação.
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import api from "../services/api";
import type { GalleryFormData } from "../lib/types/types";

// Normaliza a URL da imagem para incluir https:// se o usuário não digitar.
const normalizeUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

// Validação do formulário de galeria usando Yup.
// Define regras de campo e mensagens de erro.
const schema = yup.object().shape({
  title: yup.string().trim().required("Título obrigatório"),
  description: yup.string().trim().required("Descrição obrigatória"),
  image_url: yup
    .string()
    .transform((value) => (typeof value === "string" ? value.trim() : value))
    .url("URL inválida")
    .required("Imagem obrigatória"),
});

function GalleryFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Inicializa o React Hook Form com o schema do Yup.
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GalleryFormData>({
    resolver: yupResolver(schema),
  });

  // Modo edição: carrega os dados existentes e preenche o formulário.
  useEffect(() => {
    if (id) {
      api.get(`/api/v1/galleries/${id}/`).then((res) => {
        const gallery = res.data;
        setValue("title", gallery.title);
        setValue("description", gallery.description);
        setValue("image_url", gallery.image_url);
      });
    }
  }, [id, setValue]);

  // Função executada quando o formulário passa na validação e é enviado.
  const onSubmit = async (data: GalleryFormData) => {
    const payload = {
      ...data,
      image_url: normalizeUrl(data.image_url),
    };

    try {
      if (id) {
        await api.put(`/api/v1/galleries/${id}/`, payload);
      } else {
        await api.post("/api/v1/galleries/", payload);
      }
      navigate("/galleries");
    } catch (error: any) {
      const backendMessage =
        error.response?.data && typeof error.response.data === "object"
          ? Object.entries(error.response.data)
              .map(([field, value]) => `${field}: ${Array.isArray(value) ? value.join(", ") : value}`)
              .join("\n")
          : error.message || String(error);

      alert(`Erro ao salvar imagem:\n${backendMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 md:p-12"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {id ? "✏️ Editar Imagem" : "➕ Nova Imagem"}
          </h1>
          <p className="text-gray-600">Preencha todos os campos para continuar</p>
        </div>

        <div className="space-y-6">
          {/* Campo: Título */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
            <input
              {...register("title")}
              placeholder="Digite o título da imagem"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition placeholder-gray-400 text-gray-900"
            />
            {/* Mensagem de validação do Yup para o título. */}
            {errors.title && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.title.message}</p>
            )}
          </div>

          {/* Campo: Descrição */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
            <textarea
              {...register("description")}
              placeholder="Digite uma descrição detalhada"
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition placeholder-gray-400 resize-none text-gray-900"
            />
            {/* Mensagem de validação do Yup para a descrição. */}
            {errors.description && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.description.message}</p>
            )}
          </div>

          {/* Campo: URL da Imagem */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">URL da Imagem</label>
            <input
              {...register("image_url")}
              placeholder="https://exemplo.com/imagem.jpg"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition placeholder-gray-400 text-gray-900"
            />
            {/* Mensagem de validação do Yup para a URL da imagem. */}
            {errors.image_url && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.image_url.message}</p>
            )}
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col md:flex-row gap-4 mt-10">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-6 rounded-lg font-bold transition transform hover:scale-105 active:scale-95 shadow-lg"
          >
            {id ? "💾 Atualizar Imagem" : "💾 Cadastrar Imagem"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/galleries")}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-6 rounded-lg font-bold transition"
          >
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default GalleryFormPage;
