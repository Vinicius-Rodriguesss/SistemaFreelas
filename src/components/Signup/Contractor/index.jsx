import { useState, useEffect } from 'react';
import './index.css';
import 'animate.css';
import { IMaskInput } from 'react-imask';
import { useNavigate } from "react-router-dom";

const SignupContractor = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [popup, setPopup] = useState({ message: '', type: '' });
  const [timer, setTimer] = useState(30);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const showPopup = (message, type = 'error') => {
    setPopup({ message, type });
    setTimeout(() => setPopup({ message: '', type: '' }), 3000);
  };

  useEffect(() => {
    let interval;
    if (step === 4 && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const nextStep = (e) => {
    e.preventDefault();

    if (step === 1) {
      if (!formData.nome) return showPopup("Nome completo é obrigatório");
      if (!formData.whatsapp) return showPopup("Número WhatsApp é obrigatório");
      if (!formData.cpf) return showPopup("CPF é obrigatório");
      if (!formData.nascimento) return showPopup("Data de nascimento é obrigatória");

      const nascimento = new Date(formData.nascimento);
      const hoje = new Date();
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const ajuste = hoje < new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate());
      if (idade - (ajuste ? 1 : 0) < 18) return showPopup("Você precisa ter mais de 18 anos");
    }

    if (step === 2) {
      if (!formData.endereco) return showPopup("Endereço é obrigatório");
      if (!formData.cep) return showPopup("CEP é obrigatório");
      if (!formData.numero) return showPopup("Número é obrigatório");
      if (!formData.complemento) return showPopup("Complemento é obrigatório");
    }

    if (step === 3) {
      if (!formData.docFoto) return showPopup("Foto do documento é obrigatória");
      if (!formData.senha) return showPopup("Senha é obrigatória");
      if (!formData.confirmarSenha) return showPopup("Confirme a senha");
      if (formData.senha !== formData.confirmarSenha) return showPopup("As senhas não coincidem");
    }

    setStep(step + 1);
    if (step + 1 === 4) setTimer(30); // inicia timer para reenviar código
  };

  const handleSubmitCode = (e) => {
    e.preventDefault();
    if (!formData.codigo) return showPopup("Digite o código enviado para seu e-mail");
    if (formData.codigo !== "123456") return showPopup("Código incorreto");

    showPopup("Cadastro concluído com sucesso!", "success");
    console.log("Dados finais:", formData);
  };

  const reenviarCodigo = () => {
    showPopup("Novo código enviado para seu e-mail!", "success");
    setTimer(30);
  };

  return (
    <>
      {popup.message && (
        <div className={`popup ${popup.type}`}>
          {popup.message}
        </div>
      )}

      {/* Step 1 - Dados pessoais */}
      {step === 1 && (
        <form className='d-flex flex-column gap-4'>
          <span className='title'>Contratante</span>
          <input type="text" name="nome" placeholder="Nome completo *" onChange={handleChange} />

          <IMaskInput
            mask="(00) 00000-0000"
            name="whatsapp"
            placeholder="Número WhatsApp *"
            onAccept={(value) => setFormData({ ...formData, whatsapp: value })}
          />

          <IMaskInput
            mask="000.000.000-00"
            name="cpf"
            placeholder="CPF *"
            onAccept={(value) => setFormData({ ...formData, cpf: value })}
          />

          <input type="date" name="nascimento" onChange={handleChange} />
          <button className='btn' onClick={nextStep}>Próximo</button>
        </form>
      )}

      {/* Step 2 - Endereço */}
      {step === 2 && (
        <form className='d-flex flex-column gap-4 animate__animated animate__fadeIn'>
          <span className='title'>Endereço</span>
          <input type="text" name="endereco" placeholder="Endereço *" onChange={handleChange} />

          <IMaskInput
            mask="00000-000"
            name="cep"
            placeholder="CEP *"
            onAccept={(value) => setFormData({ ...formData, cep: value })}
          />

          <input type="text" name="numero" placeholder="Número *" onChange={handleChange} />
          <input type="text" name="complemento" placeholder="Complemento *" onChange={handleChange} />
          <button className='btn' onClick={nextStep}>Próximo</button>
        </form>
      )}

      {/* Step 3 - Documento e Senha */}
      {step === 3 && (
        <form className='d-flex flex-column gap-4 animate__animated animate__fadeIn'>
          <span className='title'>Documento e Senha</span>
          <label>Envie uma foto do seu documento *</label>
          <input type="file" name="docFoto" onChange={handleChange} />

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

          <button className='btn' onClick={nextStep}>Próximo</button>
        </form>
      )}

      {/* Step 4 - Confirmação de e-mail */}
      {step === 4 && (
        <form className='d-flex flex-column gap-4 animate__animated animate__fadeIn' onSubmit={handleSubmitCode}>
          <span className='title'>Confirmação de E-mail</span>
          <p>Enviamos um código de verificação para o seu e-mail. Digite abaixo:</p>
          <input type="text" name="codigo" placeholder="Digite o código" onChange={handleChange} />
          <button className='btn' type="submit">Confirmar Código</button>
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

      <div className='d-flex flex-column gap-2'>
        <button className='btn' onClick={() => navigate("/")}>Login</button>
        <button className='btn' onClick={() => navigate("/signup-service-provider")}>Sou prestador de serviço</button>
      </div>
    </>
  );
};

export default SignupContractor;
