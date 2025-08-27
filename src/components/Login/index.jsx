
import { useNavigate } from "react-router-dom";
const Login = () => {
     const navigate = useNavigate();
    return (
        <>
            {/* Form de Login */}
            <form action="" className='d-flex flex-column gap-4'>
                <span className='title'>Login</span>
                <input type="text" required placeholder='Digite seu E-mail' />
                <input type="password"required placeholder='***************' />
                <button className='btn'>Entrar</button>
            </form>

            <div className='d-flex  flex-column gap-2'> 
                <button className='btn' onClick={() => navigate("/signup-contractor")}>Sou contratante</button>
                <button className='btn' onClick={() => navigate("/signup-service-provider")}>Sou Prestador de serviços</button>
                {/* <button className='btn'>Esqueci minha senha Senha</button> */}
            </div>
        </>
    )
}

export default Login