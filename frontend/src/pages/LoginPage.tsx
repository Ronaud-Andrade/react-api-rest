import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useAuth } from "../lib/context/AuthContext";
import type { LoginFormInputs } from "../lib/types/types";

// Schema de validação com Yup
const schema = yup.object().shape({
  username: yup.string().required("Usuário obrigatório"),
  password: yup.string().min(5, "Mínimo 5 caracteres").required("Senha obrigatória"),
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data.username, data.password);
      navigate("/");
    } catch (error) {
      alert("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl w-full max-w-md transform transition hover:shadow-3xl"
      >
        <h2 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Marketplace
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm">Acesse sua conta para continuar</p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Usuário</label>
            <input
              {...register("username")}
              placeholder="Digite seu usuário"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition placeholder-gray-400"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                ⚠️ {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <input
              {...register("password")}
              type="password"
              placeholder="Digite sua senha"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition placeholder-gray-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                ⚠️ {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-bold transition transform hover:scale-105 active:scale-95 shadow-lg"
        >
          🚀 Entrar
        </button>
      </form>
    </div>
  );  
}

export default LoginPage;
