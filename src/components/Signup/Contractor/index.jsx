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
  const [toggleZoneDocs, setToggleZoneDocs] = useState("zoneImageDocs");
  const [showCodigoInput, setShowCodigoInput] = useState(false);
  const [end, setEnd] = useState("d-flex");

  // edição inline
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    let interval;
    if (step === 5 && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
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

  const verificarNumeroCompleto = (numero) => {
    const numeros = numero.replace(/\D/g, '');
    const completo = numeros.length === 11;
    setShowCodigoInput(completo);
    return completo;
  };

  const validarNomeCompleto = (nome) => {
    if (!nome) return false;
    const palavras = nome.trim().split(/\s+/);
    if (palavras.length < 2) return false;
    for (let palavra of palavras) {
      if (!/^[A-Za-zÀ-ÿ]{2,}([-'][A-Za-zÀ-ÿ]{2,})?$/.test(palavra)) return false;
    }
    return true;
  };

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const buscarEndereco = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      if (data.erro) return showPopup("CEP não encontrado");
      setFormData(prev => ({
        ...prev,
        endereco: data.logradouro || '',
        complemento: data.complemento || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || ''
      }));
    } catch {
      showPopup("Erro ao buscar o CEP");
    }
  };

  const nextStep = (e) => {
    e.preventDefault();

    if (step === 1) {
      if (!validarNomeCompleto(formData.nome)) return showPopup("Digite seu nome completo válido");
      if (!formData.email) return showPopup("Email é obrigatório");
      if (!validarEmail(formData.email)) return showPopup("Email inválido");
      if (!formData.whatsapp) return showPopup("Número WhatsApp é obrigatório");
      if (showCodigoInput) {
        if (!formData.codigoWhats) return showPopup("Digite o código de verificação do WhatsApp");
        if (formData.codigoWhats !== "1234") return showPopup("Código de teste inválido. Use 1234");
      }
      if (!formData.cpf) return showPopup("CPF é obrigatório");
    }

    if (step === 2) {
      if (!formData.endereco) return showPopup("Endereço é obrigatório");
      if (!formData.cep) return showPopup("CEP é obrigatório");
      if (!formData.numero) return showPopup("Número é obrigatório");
      if (!formData.complemento) return showPopup("Complemento é obrigatório");
    }

    if (step === 3) {
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
      setEnd("d-none");
      setStep(4); // revisão
      return;
    }

    if (step === 4) {
      setStep(5); // confirmação email
      setTimer(30);
      return;
    }

    setStep(step + 1);
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
      {popup.message && <div className={`popup ${popup.type}`}>{popup.message}</div>}

      {/* Step 1 - Dados pessoais */}
      {step === 1 && (
        <form className='d-flex flex-column gap-4'>
          <span className='title'>Contratante</span>
          <input type="text" name="nome" placeholder="Nome completo *" onChange={handleChange} />
          <input type="email" name="email" placeholder="Email *" onChange={handleChange} />
          <IMaskInput
            mask="(00) 00000-0000"
            name="whatsapp"
            placeholder="Número WhatsApp *"
            onAccept={(value) => {
              setFormData({ ...formData, whatsapp: value });
              verificarNumeroCompleto(value);
            }}
          />
          {showCodigoInput && (
            <input type="text" name="codigoWhats" placeholder="Código de confirmação" onChange={handleChange} />
          )}
          <IMaskInput mask="000.000.000-00" name="cpf" placeholder="CPF *" onAccept={(value) => setFormData({ ...formData, cpf: value })} />
          <button className='btn' onClick={nextStep}>Próximo</button>
        </form>
      )}

      {/* Step 2 - Endereço */}
      {step === 2 && (
        <form className='d-flex flex-column gap-4 animate__animated animate__fadeIn'>
          <span className='title'>Endereço</span>
          <IMaskInput
            mask="00000-000"
            name="cep"
            placeholder="CEP *"
            value={formData.cep || ''}
            onAccept={(value) => setFormData({ ...formData, cep: value })}
            onBlur={(e) => buscarEndereco(e.target.value)}
          />
          <input type="text" name="endereco" placeholder="Endereço *" value={formData.endereco || ''} onChange={handleChange} />
          <input type="text" name="numero" placeholder="Número *" onChange={handleChange} />
          <input type="text" name="complemento" placeholder="Complemento *" value={formData.complemento || ''} onChange={handleChange} />
          <button className='btn' onClick={nextStep}>Próximo</button>
        </form>
      )}

      {/* Step 3 - Documento e senha */}
      {step === 3 && (
        <form className='d-flex flex-column gap-4 animate__animated animate__fadeIn'>
          <span className='title'>Documento e Senha</span>
          <label className={`${toggleZoneDocs}`}>
            <input
              type="file"
              className="d-none"
              name="docFoto"
              accept="image/*,application/pdf"
              onChange={(e) => {
                handleChange(e);
                setToggleZoneDocs("zoneImageDocsActive");
              }}
            />
          </label>
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
          <button className='btn' onClick={nextStep}>Próximo</button>
        </form>
      )}

      {/* Step 4 - Revisão */}
      {step === 4 && (
        <form className='d-flex flex-column gap-4 animate__animated animate__fadeIn'>
          <span className='title'>Revise seus dados</span>
          {Object.entries(formData).map(([key, value]) => {
            if (["senha","confirmarSenha","docFoto","codigoWhats"].includes(key)) return null;
            return (
              <div key={key} className="review-field d-flex align-items-center justify-content-between">
                {editField === key ? (
                  <input
                    type="text"
                    value={editValue}
                    autoFocus
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => { setFormData(prev => ({ ...prev, [key]: editValue })); setEditField(null); }}
                    onKeyDown={(e) => { if(e.key==='Enter'){ setFormData(prev => ({ ...prev, [key]: editValue })); setEditField(null); } }}
                  />
                ) : (
                  <span>{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`}</span>
                )}
                {editField !== key && (
                  <span className="edit-icon" style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={() => { setEditField(key); setEditValue(value); }}>✏️</span>
                )}
              </div>
            )
          })}
          <button className='btn' onClick={nextStep}>Confirmar e Continuar</button>
        </form>
      )}

      {/* Step 5 - Confirmação de e-mail */}
      {step === 5 && (
        <form className='d-flex flex-column gap-4 animate__animated animate__fadeIn' onSubmit={handleSubmitCode}>
          <span className='title'>Confirmação de E-mail</span>
          <p>Enviamos um código de verificação para o seu e-mail. Digite abaixo:</p>
          <input type="text" name="codigo" placeholder="Digite o código" onChange={handleChange} />
          <button className='btn' type="submit">Confirmar Código</button>
          <button type="button" className='btn btn-secondary' disabled={timer>0} onClick={reenviarCodigo}>
            {timer>0? `Reenviar em ${timer}s` : "Reenviar Código"}
          </button>
        </form>
      )}

      <div className={`${end} flex-column gap-2`}>
        <button className='btn' onClick={() => navigate("/")}>Login</button>
        <button className='btn' onClick={() => navigate("/signup-service-provider")}>Sou prestador de serviço</button>
      </div>
    </>
  );
};

export default SignupContractor;
