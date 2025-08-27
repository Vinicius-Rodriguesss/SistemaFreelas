import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './index.css'; // arquivo de css que vamos criar

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <form className='d-flex flex-column gap-4'>
                <span className='title'>Login</span>
                <input type="text" required placeholder='Digite seu E-mail' />

                <div className="password-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder='***************'
                        name="senha"
                    />
                    <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? '🙈' : '👁️'}
                    </span>
                </div>

                <button className='btn'>Entrar</button>
            </form>

            <div className='d-flex flex-column gap-2'>
                <button className='btn' onClick={() => navigate("/signup-contractor")}>Sou contratante</button>
                <button className='btn' onClick={() => navigate("/signup-service-provider")}>Sou Prestador de serviços</button>
            </div>
        </>
    )
}

export default Login;
