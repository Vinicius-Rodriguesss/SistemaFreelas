import { useState, useEffect } from 'react';
import './index.css';
import 'animate.css';
import { useNavigate } from "react-router-dom";
import { IMaskInput } from 'react-imask';

const SignupServiceProvider = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [popup, setPopup] = useState({ message: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [end, setEnd] = useState("d-flex");

  // timer para reenviar código
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval;
    if (step === 5 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const showPopup = (message, type = 'error') => {
    setPopup({ message, type });
    setTimeout(() => setPopup({ message: '', type: '' }), 3000);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const nextStep = (e) => {
    e.preventDefault();

    if (step === 1) {
      if (!formData.nome) return showPopup("Nome completo é obrigatório");
      if (!formData.whatsapp) return showPopup("Número WhatsApp é obrigatório");
      if (!formData.especialidade) return showPopup("Especialidade é obrigatória");
    }

    if (step === 2) {
      if (!formData.descricao) return showPopup("Descrição é obrigatória");
      if (!formData.cpf) return showPopup("CPF é obrigatório");
    }

    if (step === 3) {
      if (!formData.endereco) return showPopup("Endereço é obrigatório");
      if (!formData.cep) return showPopup("CEP é obrigatório");
      if (!formData.numero) return showPopup("Número é obrigatório");
      if (!formData.complemento) return showPopup("Complemento é obrigatório");

      setEnd("d-none");
    }

    if (step === 4) {
      if (!formData.docFoto) return showPopup("Foto do documento é obrigatória");
      if (!formData.nascimento) return showPopup("Data de nascimento é obrigatória");

      const nascimento = new Date(formData.nascimento);
      const hoje = new Date();
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const ajuste = hoje < new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate());
      if (idade - (ajuste ? 1 : 0) < 18) return showPopup("Você precisa ter mais de 18 anos");

      if (!formData.senha) return showPopup("Senha é obrigatória");
      if (!formData.confirmarSenha) return showPopup("Confirme a senha");
      if (formData.senha !== formData.confirmarSenha) return showPopup("As senhas não coincidem");
    }

    setStep(step + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    showPopup("Cadastro realizado com sucesso!", "success");
    setStep(5); // vai para confirmação de e-mail
    setTimer(30); // reinicia timer ao chegar no step 5
  };

  const reenviarCodigo = () => {
    showPopup("Novo código enviado para o seu e-mail!", "success");
    setTimer(30); // reinicia o contador
  };

  return (
    <>
      {/* popup */}
      {popup.message && (
        <div className={`popup ${popup.type}`}>
          {popup.message}
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <form className='d-flex flex-column gap-4'>
          <span className='title'>Prestador de serviços</span>
          <input type="text" name="nome" placeholder='Nome completo *' onChange={handleChange} />

          {/* whatsapp com máscara */}
          <IMaskInput
            mask="(00) 00000-0000"
            name="whatsapp"
            placeholder='Número WhatsApp *'
            onAccept={(value) => setFormData({ ...formData, whatsapp: value })}
          />

          <input type="text" name="especialidade" placeholder='Especialidade *' onChange={handleChange} />
          <input type="text" name="cursos" placeholder='Cursos (opcional)' onChange={handleChange} />
          <button className='btn' onClick={nextStep}>Próximo</button>
        </form>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <form className='d-flex flex-column gap-4 animate__animated animate__fadeIn'>
          <span className='title'>Sobre mim e CPF</span>
          <textarea name="descricao" placeholder='Sobre mim *' onChange={handleChange}></textarea>

          {/* CPF com máscara */}
          <IMaskInput
            mask="000.000.000-00"
            name="cpf"
            placeholder='CPF *'
            onAccept={(value) => setFormData({ ...formData, cpf: value })}
          />

          <button className='btn' onClick={nextStep}>Próximo</button>
        </form>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <form className='d-flex flex-column gap-4 animate__animated animate__fadeIn'>
          <span className='title'>Endereço</span>
          <input type="text" name="endereco" placeholder='Endereço *' onChange={handleChange} />

          {/* CEP com máscara */}
          <IMaskInput
            mask="00000-000"
            name="cep"
            placeholder='CEP *'
            onAccept={(value) => setFormData({ ...formData, cep: value })}
          />

          <input type="text" name="numero" placeholder='Número *' onChange={handleChange} />
          <input type="text" name="complemento" placeholder='Complemento *' onChange={handleChange} />
          <button className='btn' onClick={nextStep}>Próximo</button>
        </form>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <form className='d-flex flex-column gap-4 animate__animated animate__fadeIn' onSubmit={handleSubmit}>
          <span className='title'>Finalização</span>
          <label>Foto do Documento *</label>
          <input type="file" name="docFoto" onChange={handleChange} />
          <label>Data de Nascimento *</label>
          <input type="date" name="nascimento" onChange={handleChange} />
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="senha"
              placeholder='Senha *'
              onChange={handleChange}
            />
            <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmarSenha"
              placeholder='Confirmar Senha *'
              onChange={handleChange}
            />
            <span className="toggle-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? '🙈' : '👁️'}
            </span>
          </div>
          <button className='btn' type="submit">Cadastrar</button>
        </form>
      )}

      {/* Step 5 */}
      {step === 5 && (
        <form className='d-flex flex-column gap-4 animate__animated animate__fadeIn'>
          <span className='title'>Confirmação de E-mail</span>
          <p>Enviamos um código de verificação para o seu e-mail. Digite abaixo para confirmar:</p>

          <input type="text" name="codigo" placeholder='Digite o código recebido' onChange={handleChange} />

          <button className='btn'>Confirmar Código</button>

          {/* botão só habilita quando timer chega a 0 */}
          <button
            type="button"
            className='btn btn-secondary'
            disabled={timer > 0}
            onClick={reenviarCodigo}
          >
            {timer > 0 ? `Reenviar em ${timer}s` : "Reenviar Código"}
          </button>
        </form>
      )}

      <div className={`${end} flex-column gap-2`}>
        <button className='btn' onClick={() => navigate("/")}>Login</button>
        <button className='btn' onClick={() => navigate("/signup-contractor")}>Sou Contratante</button>
      </div>
    </>
  );
};

export default SignupServiceProvider;
