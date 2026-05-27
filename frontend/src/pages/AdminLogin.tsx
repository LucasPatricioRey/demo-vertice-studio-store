import { Lock, LogIn } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../api";
import { BRAND_NAME } from "../utils";

export const AdminLogin = () => {
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("Admin1234!");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await adminApi.login(email, password);
      localStorage.setItem("vs-admin-token", response.token);
      localStorage.setItem("vs-admin-user", JSON.stringify(response.user));
      navigate("/admin");
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "No se pudo iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="admin-login">
      <section className="admin-login__card">
        <a className="brand" href="/">
          <span>Vértice</span>
          <small>Studio</small>
        </a>
        <div className="admin-login__heading">
          <Lock size={24} />
          <h1>Panel admin</h1>
          <p>{BRAND_NAME}: catálogo, stock y pedidos por WhatsApp.</p>
        </div>
        <form onSubmit={submit} className="admin-form">
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
          </label>
          <label>
            Password
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="btn btn--primary btn--full" disabled={isLoading}>
            <LogIn size={18} /> {isLoading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
        <p className="admin-login__hint">Demo: admin@demo.com / Admin1234!</p>
      </section>
    </main>
  );
};
