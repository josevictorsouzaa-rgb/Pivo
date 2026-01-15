import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  PieChart, 
  Settings, 
  Bell, 
  Search, 
  Plus,
  Wallet,
  X,
  User,
  Building2,
  Calendar,
  CreditCard,
  DollarSign,
  Briefcase,
  FileText,
  UploadCloud,
  LayoutGrid,
  Check,
  CheckCircle,
  Landmark,
  Smartphone,
  QrCode,
  Store,
  Tag,
  Users,
  LogOut,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Camera,
  Paperclip
} from 'lucide-react';
import Analytics from './views/Analytics';
import SettingsView from './views/Settings';
import { ViewState, User as UserType, AuditLogEntry } from './types';

// Mock Data for the App Context
const FIXED_CATEGORIES = [
  'Aluguel de Imóvel',
  'Condomínio',
  'Energia Elétrica',
  'Água e Esgoto',
  'Internet e Telefonia',
  'Folha de Pagamento',
  'Pró-labore',
  'Impostos (DAS/DARF/ISS)',
  'FGTS / INSS',
  'Empréstimo Bancário',
  'Financiamento de Veículo',
  'Seguros',
  'Manutenção Predial',
  'Limpeza e Conservação',
  'Software / Licenças (SaaS)',
  'Marketing / Publicidade',
  'Equipamentos / Hardware',
  'Mobiliário / Decoração',
  'Outros Fornecedores'
];

const MOCK_CARDS = [
  { id: '1', alias: 'Santander Unique', last4: '4523', brand: 'Visa' },
  { id: '2', alias: 'Nubank Corp', last4: '8812', brand: 'Mastercard' },
  { id: '3', alias: 'Amex Platinum', last4: '1001', brand: 'Amex' },
];

const MOCK_ACCOUNTS = [
  { id: '1', name: 'Conta Principal', bank: 'Banco Itaú' },
  { id: '2', name: 'Conta Investimento', bank: 'Banco Safra' },
  { id: '3', name: 'Movimento Filial', bank: 'Banco do Brasil' },
];

// --- MOCK USERS DATABASE ---
const MOCK_USERS_DB = [
  { 
    id: '1', 
    name: 'Administrador Pivô', 
    email: 'admin@pivo.com', 
    password: 'admin', 
    role: 'admin', 
    isFirstLogin: false,
    avatarUrl: '' // Empty to test initials
  },
  { 
    id: '2', 
    name: 'Novo Usuário', 
    email: 'user@pivo.com', 
    password: '123', 
    role: 'user', 
    isFirstLogin: true, 
    avatarUrl: 'https://i.pravatar.cc/150?u=user'
  }
];

const App: React.FC = () => {
  // --- AUTH STATE ---
  const [authStage, setAuthStage] = useState<'login' | 'new_password' | 'authenticated'>('login');
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loginError, setLoginError] = useState('');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // New Password State (First Login)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- APP STATE ---
  const [currentView, setCurrentView] = useState<ViewState>('hub');
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Profile Modal State
  const [profileTab, setProfileTab] = useState<'password' | 'avatar'>('password');
  const [profileOldPassword, setProfileOldPassword] = useState('');
  const [profileNewPassword, setProfileNewPassword] = useState('');
  const [profileConfirmPassword, setProfileConfirmPassword] = useState('');
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Mock Data for Dropdowns
  const mockCompanies = ['Matriz São Paulo', 'Filial Sul', 'Logística S.A.'];
  const mockCostCenters = ['CC-101 (Geral)', 'CC-201 (Marketing)', 'CC-301 (TI)', 'CC-401 (RH)'];

  // Form State for New Expense
  const [expenseForm, setExpenseForm] = useState({
    type: 'corporate' as 'corporate' | 'reimbursement',
    category: '', 
    payee: '', 
    description: '', 
    details: '', 
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending' as 'paid' | 'pending',
    paymentMethod: 'credit_card' as 'credit_card' | 'pix_transfer' | 'boleto' | 'cash',
    selectedCardId: '',
    installments: '1x',
    selectedAccountId: '',
    company: '',
    costCenter: '',
    quoteFile: null as File | null, // ORÇAMENTO
    receiptFile: null as File | null // COMPROVANTE (Only if paid immediately)
  });

  // --- HELPERS ---

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const UserAvatar = ({ name, url, size = 'md', className = '' }: { name: string, url?: string, size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) => {
    const sizeClasses = {
      sm: 'w-6 h-6 text-[10px]',
      md: 'w-9 h-9 text-xs',
      lg: 'w-16 h-16 text-lg',
      xl: 'w-24 h-24 text-2xl'
    };

    if (url) {
      return <img src={url} alt={name} className={`${sizeClasses[size]} rounded-full border-2 border-white shadow-sm object-cover ${className}`} />;
    }

    return (
      <div className={`${sizeClasses[size]} rounded-full bg-blue-600 text-white flex items-center justify-center font-bold border-2 border-white shadow-sm ${className}`}>
        {getInitials(name)}
      </div>
    );
  };

  // --- AUTH HANDLERS ---

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const user = MOCK_USERS_DB.find(u => u.email === loginEmail && u.password === loginPassword);

    if (user) {
      // In a real app, password wouldn't be stored in plain text in state like this
      const userSafeData: UserType = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as 'admin' | 'user',
        isFirstLogin: user.isFirstLogin,
        avatarUrl: user.avatarUrl,
        password: user.password // Keeping for mock validation
      };

      setCurrentUser(userSafeData);

      if (user.isFirstLogin) {
        setAuthStage('new_password');
      } else {
        setAuthStage('authenticated');
      }
    } else {
      setLoginError('E-mail ou senha inválidos.');
    }
  };

  const handleChangePasswordFirstLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      setLoginError('A nova senha deve ter pelo menos 4 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setLoginError('As senhas não coincidem.');
      return;
    }
    if (currentUser) {
      const updatedUser = { ...currentUser, isFirstLogin: false, password: newPassword };
      setCurrentUser(updatedUser);
      setAuthStage('authenticated');
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage({ type: '', text: '' });

    if (profileTab === 'password') {
        // Validation: Check Old Password
        if (profileOldPassword !== currentUser?.password) {
             setProfileMessage({ type: 'error', text: 'A senha atual está incorreta.' });
             return;
        }

        if (profileNewPassword.length < 4) {
            setProfileMessage({ type: 'error', text: 'A nova senha deve ter no mínimo 4 caracteres.' });
            return;
        }
        if (profileNewPassword !== profileConfirmPassword) {
            setProfileMessage({ type: 'error', text: 'A confirmação de senha não confere.' });
            return;
        }
        
        // Update Mock User
        if (currentUser) {
            setCurrentUser({ ...currentUser, password: profileNewPassword });
        }

        setProfileMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
        setProfileOldPassword('');
        setProfileNewPassword('');
        setProfileConfirmPassword('');
    }
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && currentUser) {
        const file = e.target.files[0];
        // Create a fake local URL for the image
        const imageUrl = URL.createObjectURL(file);
        
        setCurrentUser({ ...currentUser, avatarUrl: imageUrl });
        setProfileMessage({ type: 'success', text: 'Foto de perfil atualizada com sucesso!' });
    }
  };

  const handleLogout = () => {
    setAuthStage('login');
    setCurrentUser(null);
    setLoginEmail('');
    setLoginPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setLoginError('');
  };

  // --- APP HANDLERS ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setExpenseForm({ ...expenseForm, [e.target.name]: e.target.value });
  };

  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create Audit Log Initial Entry
    const initialAudit: AuditLogEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        action: 'created',
        userId: currentUser?.id || '0',
        userName: currentUser?.name || 'Unknown',
        userAvatar: currentUser?.avatarUrl,
        details: 'Despesa criada no sistema'
    };

    const newTransactionPayload = {
        ...expenseForm,
        createdById: currentUser?.id,
        createdByName: currentUser?.name,
        createdByAvatar: currentUser?.avatarUrl,
        receiptAttached: !!expenseForm.receiptFile,
        auditLog: [initialAudit]
    };
    
    console.log("Submitting expense:", newTransactionPayload);
    // Note: In a real app, we would add this to the Analytics state or trigger a refresh
    
    setIsNewExpenseModalOpen(false);
    // Reset Form
    setExpenseForm({
        type: 'corporate',
        category: '',
        payee: '',
        description: '',
        details: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        paymentMethod: 'credit_card',
        selectedCardId: '',
        installments: '1x',
        selectedAccountId: '',
        company: '',
        costCenter: '',
        quoteFile: null,
        receiptFile: null
    });
  };

  // --- RENDER: LOGIN & FIRST LOGIN SCREENS (UNCHANGED LOGIC) ---
  if (authStage === 'login') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
           <div className="bg-blue-600 p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-blue-500 opacity-20">
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full opacity-10"></div>
                 <div className="absolute top-20 -left-10 w-20 h-20 bg-white rounded-full opacity-10"></div>
              </div>
              <div className="relative z-10 flex flex-col items-center">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
                    <Wallet className="text-blue-600" size={32} />
                 </div>
                 <h1 className="text-3xl font-black text-white tracking-tight">Pivô</h1>
                 <p className="text-blue-100 text-sm font-medium mt-1">Gestão Financeira Inteligente</p>
              </div>
           </div>
           <div className="p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Acesse sua conta</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                   <label className="text-xs font-bold uppercase text-slate-500 ml-1">E-mail Corporativo</label>
                   <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="email" 
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="seu@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                   </div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-xs font-bold uppercase text-slate-500 ml-1">Senha</label>
                   <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-10 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                         {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                   </div>
                </div>
                {loginError && (
                  <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                     {loginError}
                  </div>
                )}
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 mt-2">
                  Entrar no Sistema <ArrowRight size={18} />
                </button>
              </form>
              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                 <p className="text-xs text-slate-400">Ainda não tem acesso? <span className="text-blue-600 font-bold cursor-help" title="Procure o setor de TI ou RH da sua empresa">Contate o Administrador</span></p>
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (authStage === 'new_password') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
           <div className="p-8 border-b border-slate-100 text-center">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Lock size={24} />
              </div>
              <h2 className="text-xl font-black text-slate-900">Primeiro Acesso</h2>
              <p className="text-slate-500 text-sm mt-1">Por segurança, defina sua nova senha pessoal.</p>
           </div>
           <div className="p-8">
              <form onSubmit={handleChangePasswordFirstLogin} className="space-y-4">
                 <div className="space-y-1.5">
                   <label className="text-xs font-bold uppercase text-slate-500 ml-1">Nova Senha</label>
                   <input type="password" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none transition-all" placeholder="Nova senha pessoal" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-xs font-bold uppercase text-slate-500 ml-1">Confirmar Senha</label>
                   <input type="password" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none transition-all" placeholder="Repita a senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                 </div>
                 {loginError && (<div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg">{loginError}</div>)}
                 <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-amber-200 transition-all flex items-center justify-center gap-2 mt-2">
                  <CheckCircle size={18} /> Salvar Nova Senha
                </button>
              </form>
           </div>
        </div>
      </div>
    );
  }

  // --- RENDER: MAIN APP (AUTHENTICATED) ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans animate-in fade-in duration-500">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between transition-all">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-blue-600 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setCurrentView('hub')}>
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm shadow-blue-300">
              <Wallet size={20} className="text-white" />
            </div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">Pivô</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full">
            <button onClick={() => setCurrentView('hub')} className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${currentView === 'hub' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
              <LayoutGrid size={16} /> Hub
            </button>
            <button onClick={() => setCurrentView('settings')} className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${currentView === 'settings' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
              <Settings size={16} /> Configurações
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsNewExpenseModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-200 active:scale-95"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Nova Despesa</span>
          </button>

          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="hidden md:flex flex-col items-end mr-1 cursor-pointer" onClick={() => setIsProfileModalOpen(true)}>
               <span className="text-xs font-bold text-slate-700">{currentUser?.name}</span>
               <span className="text-[10px] text-slate-400 uppercase tracking-wide">{currentUser?.role === 'admin' ? 'Administrador' : 'Usuário'}</span>
            </div>
            
            <button onClick={() => setIsProfileModalOpen(true)} className="transition-transform hover:scale-105 active:scale-95">
               <UserAvatar name={currentUser?.name || ''} url={currentUser?.avatarUrl} size="md" />
            </button>
            
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1" title="Sair">
               <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {currentView === 'hub' && <Analytics currentUser={currentUser} />}
        {currentView === 'settings' && <SettingsView />}
      </main>

      {/* NEW EXPENSE MODAL */}
      {isNewExpenseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                   <h2 className="text-xl font-black text-slate-900 tracking-tight">Nova Despesa</h2>
                   <p className="text-sm text-slate-500">
                     {expenseForm.type === 'corporate' ? 'Lançamento de despesas fixas e fornecedores.' : 'Reembolso ou acerto com colaboradores.'}
                   </p>
                </div>
                <button onClick={() => setIsNewExpenseModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-full transition-colors"><X size={24} /></button>
              </div>
              {/* Body */}
              <div className="overflow-y-auto p-8 custom-scrollbar">
                <form id="expenseForm" onSubmit={handleSubmitExpense} className="space-y-8">
                  {/* Scenario Toggle */}
                  <div className="bg-slate-100 p-1.5 rounded-xl flex gap-1">
                     <button type="button" onClick={() => setExpenseForm({...expenseForm, type: 'corporate'})} className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${expenseForm.type === 'corporate' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Building2 size={16} /> Despesa Corporativa</button>
                     <button type="button" onClick={() => setExpenseForm({...expenseForm, type: 'reimbursement'})} className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${expenseForm.type === 'reimbursement' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><User size={16} /> Reembolso / Acerto</button>
                  </div>

                  {/* Identification Fields based on Type */}
                  {expenseForm.type === 'corporate' ? (
                     <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2"><Briefcase size={14} /> Categoria</label>
                              <select name="category" value={expenseForm.category} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium">
                                 <option value="">Selecione...</option>
                                 {FIXED_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2"><Tag size={14} /> Título da Despesa (O que é?)</label>
                              <input type="text" name="description" value={expenseForm.description} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:font-normal" placeholder="Ex: Painel de LED, Compra de Material..." />
                           </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2"><Store size={14} /> Favorecido (Quem recebe?)</label>
                              <input type="text" name="payee" value={expenseForm.payee} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Ex: Loja do LED Ltda" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2"><DollarSign size={14} /> Valor Total</label>
                              <input type="number" name="amount" value={expenseForm.amount} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold placeholder:font-normal" placeholder="0,00" />
                           </div>
                        </div>
                     </>
                  ) : (
                     <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2"><User size={14} /> Nome do Colaborador</label>
                              <input type="text" name="payee" value={expenseForm.payee} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Ex: João Silva" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2"><DollarSign size={14} /> Valor a Reembolsar</label>
                              <input type="number" name="amount" value={expenseForm.amount} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold placeholder:font-normal" placeholder="0,00" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2"><FileText size={14} /> Motivo / Descrição</label>
                           <input type="text" name="description" value={expenseForm.description} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:font-normal" placeholder="Ex: Almoço com cliente, Uber para reunião..." />
                        </div>
                     </>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2"><Calendar size={14} /> Data (Vencimento/Pagamento)</label>
                        <input type="date" name="date" value={expenseForm.date} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2"><FileText size={14} /> Observações / Detalhes (Opcional)</label>
                        <input type="text" name="details" value={expenseForm.details} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:font-normal" placeholder="Informações adicionais..." />
                     </div>
                  </div>

                  <div className="h-px bg-slate-100 w-full"></div>

                  {/* Payment Details */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-slate-900">Situação do Pagamento</h3>
                      <div className="flex bg-slate-100 rounded-lg p-1">
                          <button type="button" onClick={() => setExpenseForm({...expenseForm, status: 'paid'})} className={`px-4 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1 transition-all ${expenseForm.status === 'paid' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Check size={12} /> Já foi pago</button>
                          <button type="button" onClick={() => setExpenseForm({...expenseForm, status: 'pending'})} className={`px-4 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1 transition-all ${expenseForm.status === 'pending' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Pendente (A Pagar)</button>
                      </div>
                    </div>

                    {expenseForm.status === 'paid' && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 animate-in slide-in-from-top-2">
                            <label className="text-xs font-bold uppercase text-slate-500 mb-3 block">Meio de Pagamento Utilizado</label>
                            
                            {/* Updated Selection Design */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                                <button type="button" onClick={() => setExpenseForm({...expenseForm, paymentMethod: 'credit_card'})} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${expenseForm.paymentMethod === 'credit_card' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}>
                                    <CreditCard size={24} />
                                    <span className="text-xs font-bold">Cartão Corp</span>
                                </button>
                                <button type="button" onClick={() => setExpenseForm({...expenseForm, paymentMethod: 'pix_transfer'})} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${expenseForm.paymentMethod === 'pix_transfer' ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}>
                                    <Smartphone size={24} />
                                    <span className="text-xs font-bold">Pix / TED</span>
                                </button>
                                <button type="button" onClick={() => setExpenseForm({...expenseForm, paymentMethod: 'boleto'})} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${expenseForm.paymentMethod === 'boleto' ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}>
                                    <QrCode size={24} />
                                    <span className="text-xs font-bold">Boleto</span>
                                </button>
                                <button type="button" onClick={() => setExpenseForm({...expenseForm, paymentMethod: 'cash'})} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${expenseForm.paymentMethod === 'cash' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}>
                                    <DollarSign size={24} />
                                    <span className="text-xs font-bold">Dinheiro</span>
                                </button>
                            </div>

                            {expenseForm.paymentMethod === 'credit_card' && (
                               <div className="mt-4 animate-in fade-in slide-in-from-top-1 bg-white p-4 rounded-xl border border-slate-200">
                                  <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Selecione o Cartão</label>
                                  <select name="selectedCardId" value={expenseForm.selectedCardId} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                    <option value="">Selecione...</option>
                                    {MOCK_CARDS.map(card => (<option key={card.id} value={card.id}>{card.alias} (Final {card.last4})</option>))}
                                  </select>
                                </div>
                            )}

                            {['pix_transfer', 'boleto', 'cash'].includes(expenseForm.paymentMethod) && (
                               <div className="mt-4 animate-in fade-in slide-in-from-top-1 bg-white p-4 rounded-xl border border-slate-200">
                                  <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Conta de Saída</label>
                                  <select name="selectedAccountId" value={expenseForm.selectedAccountId} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                    <option value="">Selecione...</option>
                                    {MOCK_ACCOUNTS.map(acc => (<option key={acc.id} value={acc.id}>{acc.name} - {acc.bank}</option>))}
                                  </select>
                               </div>
                            )}
                        </div>
                    )}
                  </div>

                  {/* Classification */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Classificação de Custo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2"><Building2 size={14} /> Empresa / Filial</label>
                          <select name="company" value={expenseForm.company} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                             <option value="">Selecione...</option>
                             {mockCompanies.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2"><Briefcase size={14} /> Centro de Custo</label>
                          <select name="costCenter" value={expenseForm.costCenter} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                             <option value="">Selecione...</option>
                             {mockCostCenters.map(cc => <option key={cc} value={cc}>{cc}</option>)}
                          </select>
                       </div>
                    </div>
                  </div>
                  
                  {/* Files Upload Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Quote File */}
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group relative">
                          <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setExpenseForm({...expenseForm, quoteFile: e.target.files?.[0] || null})} />
                          <div className="bg-indigo-50 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform"><Paperclip className="text-indigo-600" size={24} /></div>
                          <p className="text-sm font-bold text-slate-700">Anexar Orçamento / Cotação</p>
                          <p className="text-xs text-slate-400 mt-1">Opcional para pendentes</p>
                          {expenseForm.quoteFile && (
                            <div className="mt-3 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold flex items-center gap-2 relative z-10"><CheckCircle size={12} /> {expenseForm.quoteFile.name}</div>
                          )}
                      </div>

                      {/* Receipt File */}
                      <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors group relative ${expenseForm.status === 'paid' ? 'border-slate-300 hover:bg-slate-50 cursor-pointer' : 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'}`}>
                          {expenseForm.status === 'paid' && (
                             <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setExpenseForm({...expenseForm, receiptFile: e.target.files?.[0] || null})} />
                          )}
                          <div className={`p-3 rounded-full mb-3 transition-transform ${expenseForm.status === 'paid' ? 'bg-emerald-50 group-hover:scale-110' : 'bg-slate-200'}`}><UploadCloud className={expenseForm.status === 'paid' ? "text-emerald-600" : "text-slate-400"} size={24} /></div>
                          <p className="text-sm font-bold text-slate-700">Comprovante de Pagamento</p>
                          <p className="text-xs text-slate-400 mt-1">{expenseForm.status === 'paid' ? 'PDF, JPG ou PNG' : 'Disponível apenas se Pago'}</p>
                          {expenseForm.receiptFile && (
                            <div className="mt-3 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-2 relative z-10"><CheckCircle size={12} /> {expenseForm.receiptFile.name}</div>
                          )}
                      </div>
                  </div>

                </form>
              </div>
              {/* Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                 <button onClick={() => setIsNewExpenseModalOpen(false)} className="px-6 py-2 rounded-lg text-slate-500 font-bold hover:bg-slate-200 transition-colors">Cancelar</button>
                 <button onClick={handleSubmitExpense} className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2"><Check size={18} /> Salvar Lançamento</button>
              </div>
           </div>
        </div>
      )}

      {/* PROFILE SETTINGS MODAL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setIsProfileModalOpen(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                    <UserAvatar name={currentUser?.name || ''} url={currentUser?.avatarUrl} size="lg" />
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">{currentUser?.name}</h3>
                        <p className="text-sm text-slate-500">{currentUser?.email}</p>
                    </div>
                </div>
                
                <div className="flex border-b border-slate-100">
                    <button onClick={() => setProfileTab('password')} className={`flex-1 py-3 text-sm font-bold transition-all ${profileTab === 'password' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Alterar Senha</button>
                    <button onClick={() => setProfileTab('avatar')} className={`flex-1 py-3 text-sm font-bold transition-all ${profileTab === 'avatar' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Foto de Perfil</button>
                </div>

                <div className="p-6">
                    {profileMessage.text && (
                        <div className={`mb-4 p-3 rounded-lg text-xs font-bold ${profileMessage.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {profileMessage.text}
                        </div>
                    )}

                    {profileTab === 'password' ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-slate-500">Senha Atual</label>
                                <input type="password" value={profileOldPassword} onChange={(e) => setProfileOldPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Digite sua senha atual" required />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-slate-500">Nova Senha</label>
                                <input type="password" value={profileNewPassword} onChange={(e) => setProfileNewPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nova senha" required />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-slate-500">Confirmar Nova Senha</label>
                                <input type="password" value={profileConfirmPassword} onChange={(e) => setProfileConfirmPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Confirme a senha" required />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-all">Salvar Nova Senha</button>
                        </form>
                    ) : (
                        <div className="text-center space-y-6">
                            <div className="relative inline-block">
                                <UserAvatar name={currentUser?.name || ''} url={currentUser?.avatarUrl} size="xl" />
                                <div 
                                    className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white cursor-pointer hover:bg-blue-700 shadow-sm border-2 border-white"
                                    onClick={() => avatarInputRef.current?.click()}
                                >
                                    <Camera size={16} />
                                </div>
                                {/* Hidden File Input */}
                                <input 
                                    type="file" 
                                    ref={avatarInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleAvatarFileChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-bold text-slate-800">Alterar Foto de Perfil</p>
                                <p className="text-xs text-slate-500 max-w-xs mx-auto">Clique na câmera acima para enviar uma nova foto. (Formato JPG ou PNG, max 2MB).</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button onClick={() => setIsProfileModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Fechar</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default App;