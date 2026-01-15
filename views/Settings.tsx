import React, { useState } from 'react';
import { 
  PlusCircle, 
  CreditCard, 
  Building2, 
  Wallet, 
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Activity,
  History,
  Shield,
  Settings as SettingsIcon,
  CheckCircle,
  X,
  Check,
  MoreVertical,
  Power,
  AlertTriangle,
  Users,
  Briefcase,
  Hash,
  DollarSign,
  TrendingUp,
  Lock,
  Wifi,
  Landmark,
  Tag
} from 'lucide-react';
import { CorporateCard, Company, CostCenter, BudgetHistory, BankAccount, ExpenseCategory } from '../types';

type Tab = 'cards' | 'costCenters' | 'companies' | 'bankAccounts' | 'categories';

// Enhanced Color map for card gradients
const CARD_COLORS = {
  blue: 'from-blue-900 via-blue-800 to-blue-600',
  black: 'from-zinc-900 via-zinc-800 to-zinc-700',
  purple: 'from-purple-900 via-purple-800 to-purple-600',
  emerald: 'from-emerald-900 via-emerald-800 to-emerald-600',
  rose: 'from-rose-900 via-rose-800 to-rose-600',
  amber: 'from-amber-700 via-amber-600 to-amber-500',
  cyan: 'from-cyan-900 via-cyan-700 to-cyan-500',
  indigo: 'from-indigo-900 via-indigo-800 to-indigo-600',
  slate: 'from-slate-800 via-slate-600 to-slate-500',
  zinc: 'from-zinc-800 via-stone-700 to-stone-500',
};

// Brand Logo Mock Components (Text based for simplicity)
const BrandLogo = ({ brand }: { brand: string }) => {
  switch(brand) {
    case 'visa': return <span className="font-black italic text-2xl tracking-tighter">VISA</span>;
    case 'mastercard': return (
      <div className="flex relative">
        <div className="w-6 h-6 rounded-full bg-red-500/90"></div>
        <div className="w-6 h-6 rounded-full bg-yellow-500/90 -ml-3"></div>
      </div>
    );
    case 'amex': return <span className="font-bold text-xs border border-white px-1 py-3 bg-blue-500 tracking-tighter">AMEX</span>;
    case 'elo': return <div className="font-black w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[8px] border border-white">elo</div>;
    case 'hipercard': return <span className="font-bold italic text-sm text-red-500 bg-white px-1 rounded">Hiper</span>;
    default: return <span className="font-bold uppercase text-sm">{brand}</span>;
  }
};

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('cards');
  
  // Modals State
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isCostCenterModalOpen, setIsCostCenterModalOpen] = useState(false);
  const [isBankAccountModalOpen, setIsBankAccountModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: 'delete_company' | 'toggle_status_company' | 'delete_costCenter' | 'toggle_status_costCenter' | 'delete_card' | 'delete_bankAccount' | 'toggle_status_bankAccount' | 'delete_category' | 'toggle_status_category' | null;
    itemId: string | null;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: null,
    itemId: null,
    title: '',
    message: ''
  });

  // Action Menu State (ID of the item with open menu)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // --- DATA STATES ---

  // Cards State
  const [cards, setCards] = useState<CorporateCard[]>([
    {
      id: '1',
      alias: 'Santander Unique',
      holder: 'ALEX RIVERA',
      last4: '4523',
      expiry: '12/26',
      company: 'Matriz São Paulo',
      status: 'active',
      brand: 'visa',
      color: 'black',
      limit: 50000
    },
    {
      id: '2',
      alias: 'Nubank Corporativo',
      holder: 'JORDAN SMITH',
      last4: '8812',
      expiry: '05/25',
      company: 'Filial Sul - Curitiba',
      status: 'active',
      brand: 'mastercard',
      color: 'purple',
      limit: 25000
    }
  ]);

  // Companies State
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: '1',
      tradeName: 'Matriz São Paulo',
      legalName: 'Expensify Brasil Ltda',
      cnpj: '12.345.678/0001-99',
      address: 'Av. Paulista, 1000 - Bela Vista, SP',
      status: 'active'
    },
    {
      id: '2',
      tradeName: 'Filial Sul - Curitiba',
      legalName: 'Expensify Sul Comércio e Serviços',
      cnpj: '12.345.678/0002-88',
      address: 'Rua XV de Novembro, 450 - Centro, PR',
      status: 'active'
    },
    {
      id: '3',
      tradeName: 'Centro de Distribuição',
      legalName: 'Expensify Logística S.A.',
      cnpj: '98.765.432/0001-11',
      address: 'Rodovia Anhanguera, km 30 - Cajamar, SP',
      status: 'inactive'
    }
  ]);

  // Cost Centers State
  const [costCenters, setCostCenters] = useState<CostCenter[]>([
    { id: '1', code: 'CC-001', name: 'Despesas Gerais', manager: 'Roberto Almeida', status: 'active', monthlyBudget: 15000, limitValue: 20000, budgetHistory: [] },
    { id: '2', code: 'CC-002', name: 'Marketing & Publicidade', manager: 'Ana Júlia', status: 'active', monthlyBudget: 45000, limitValue: 50000, budgetHistory: [] },
    { id: '3', code: 'CC-003', name: 'TI & Infraestrutura', manager: 'Lucas Silva', status: 'active', monthlyBudget: 12000, limitValue: 15000, budgetHistory: [] },
    { id: '4', code: 'CC-004', name: 'P&D (Pesquisa e Desenv.)', manager: 'Felipe Costa', status: 'active', monthlyBudget: 30000, limitValue: 30000, budgetHistory: [] },
    { id: '5', code: 'CC-005', name: 'Logística e Fretes', manager: 'Pedro Santos', status: 'active', monthlyBudget: 8000, limitValue: 10000, budgetHistory: [] },
    { id: '6', code: 'CC-006', name: 'Treinamento e Capacitação', manager: 'Sônia Braga', status: 'inactive', monthlyBudget: 5000, limitValue: 5000, budgetHistory: [] },
  ]);

  // Bank Accounts State
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    { id: '1', name: 'Conta Principal', bankName: 'Banco Itaú', company: 'Matriz São Paulo', status: 'active' },
    { id: '2', name: 'Conta Investimento', bankName: 'Banco Safra', company: 'Matriz São Paulo', status: 'active' },
    { id: '3', name: 'Movimento Filial', bankName: 'Banco do Brasil', company: 'Filial Sul - Curitiba', status: 'active' },
  ]);

  // Categories State
  const [categories, setCategories] = useState<ExpenseCategory[]>([
    { id: '1', name: 'Aluguel de Imóvel', description: 'Pagamento mensal da sede e filiais', status: 'active' },
    { id: '2', name: 'Energia Elétrica', description: 'Contas de luz (Enel/Copel)', status: 'active' },
    { id: '3', name: 'Folha de Pagamento', description: 'Salários e Adiantamentos', status: 'active' },
    { id: '4', name: 'Software / SaaS', description: 'Licenças de uso de software', status: 'active' },
    { id: '5', name: 'Viagens e Estadias', description: 'Despesas de deslocamento e hotel', status: 'active' },
    { id: '6', name: 'Material de Escritório', description: 'Insumos e papelaria', status: 'active' },
  ]);

  // --- FORM STATES ---

  const [newCard, setNewCard] = useState<Partial<CorporateCard>>({
    id: '',
    alias: '',
    holder: '',
    last4: '',
    expiry: '',
    company: '',
    brand: 'visa',
    color: 'black',
    status: 'active',
    limit: 0
  });

  const [companyForm, setCompanyForm] = useState<Partial<Company>>({
    id: '',
    tradeName: '',
    legalName: '',
    cnpj: '',
    address: '',
    status: 'active'
  });

  const [costCenterForm, setCostCenterForm] = useState<Partial<CostCenter>>({
    id: '',
    code: '',
    name: '',
    manager: '',
    status: 'active',
    monthlyBudget: 0,
    limitValue: 0
  });

  const [bankAccountForm, setBankAccountForm] = useState<Partial<BankAccount>>({
    id: '',
    name: '',
    bankName: '',
    company: '',
    status: 'active'
  });

  const [categoryForm, setCategoryForm] = useState<Partial<ExpenseCategory>>({
    id: '',
    name: '',
    description: '',
    status: 'active'
  });

  // --- HELPERS ---

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '').substring(0, 14);
    return numbers
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  };

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}`;
    }
    return numbers;
  };

  const formatCurrency = (val: number | undefined) => {
    if (val === undefined) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Cost Center Sequential Code Generator
  const generateNextCostCenterCode = () => {
    if (costCenters.length === 0) return 'CC-001';
    
    // Find highest number in codes like "CC-005"
    const maxNum = costCenters.reduce((max, cc) => {
      const match = cc.code.match(/CC-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 0);

    const nextNum = maxNum + 1;
    return `CC-${String(nextNum).padStart(3, '0')}`;
  };

  // --- HANDLERS ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, formType: 'card' | 'company' | 'costCenter' | 'bankAccount' | 'category') => {
    let value: string | number = e.target.value;

    // Apply Masks & Conversions
    if (formType === 'company' && e.target.name === 'cnpj') {
      value = formatCNPJ(value as string);
    }

    if (formType === 'card' && e.target.name === 'expiry') {
      if (value.toString().length > 5) return;
      value = formatExpiry(value as string);
    }

    if (formType === 'card') {
      if (e.target.name === 'limit') {
         value = parseFloat(value as string) || 0;
      }
      setNewCard({ ...newCard, [e.target.name]: value });
    } else if (formType === 'company') {
      setCompanyForm({ ...companyForm, [e.target.name]: value });
    } else if (formType === 'costCenter') {
      if (e.target.name === 'monthlyBudget' || e.target.name === 'limitValue') {
         value = parseFloat(value as string) || 0;
      }
      setCostCenterForm({ ...costCenterForm, [e.target.name]: value });
    } else if (formType === 'bankAccount') {
      setBankAccountForm({ ...bankAccountForm, [e.target.name]: value });
    } else if (formType === 'category') {
      setCategoryForm({ ...categoryForm, [e.target.name]: value });
    }
  };

  // Card Logic
  const openCardModal = (card?: CorporateCard) => {
    if (card) {
      setNewCard(card);
    } else {
      setNewCard({ id: '', alias: '', holder: '', last4: '', expiry: '', company: '', brand: 'visa', color: 'black', status: 'active', limit: 0 });
    }
    setIsCardModalOpen(true);
  };

  const handleSaveCard = () => {
    if (!newCard.alias || !newCard.last4 || !newCard.holder) return;

    if (newCard.id) {
       // Edit
       setCards(cards.map(c => c.id === newCard.id ? (newCard as CorporateCard) : c));
    } else {
       // Create
       const card: CorporateCard = {
        ...(newCard as CorporateCard),
        id: Date.now().toString(),
        holder: newCard.holder!.toUpperCase(),
        expiry: newCard.expiry || '12/28',
        brand: (newCard.brand as any) || 'visa',
        color: (newCard.color as any) || 'blue',
      };
      setCards([...cards, card]);
    }
    setIsCardModalOpen(false);
  };

  // Bank Account Logic
  const openBankAccountModal = (account?: BankAccount) => {
    if (account) {
      setBankAccountForm(account);
    } else {
      setBankAccountForm({ id: '', name: '', bankName: '', company: '', status: 'active' });
    }
    setIsBankAccountModalOpen(true);
    setOpenMenuId(null);
  };

  const handleSaveBankAccount = () => {
    if (!bankAccountForm.name || !bankAccountForm.bankName) return;

    if (bankAccountForm.id) {
      setBankAccounts(bankAccounts.map(b => b.id === bankAccountForm.id ? (bankAccountForm as BankAccount) : b));
    } else {
      const newAccount: BankAccount = {
        ...(bankAccountForm as BankAccount),
        id: Date.now().toString(),
      };
      setBankAccounts([...bankAccounts, newAccount]);
    }
    setIsBankAccountModalOpen(false);
  };

  // Category Logic
  const openCategoryModal = (cat?: ExpenseCategory) => {
    if (cat) {
      setCategoryForm(cat);
    } else {
      setCategoryForm({ id: '', name: '', description: '', status: 'active' });
    }
    setIsCategoryModalOpen(true);
    setOpenMenuId(null);
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name) return;

    if (categoryForm.id) {
      setCategories(categories.map(c => c.id === categoryForm.id ? (categoryForm as ExpenseCategory) : c));
    } else {
      const newCategory: ExpenseCategory = {
        ...(categoryForm as ExpenseCategory),
        id: Date.now().toString(),
      };
      setCategories([...categories, newCategory]);
    }
    setIsCategoryModalOpen(false);
  };

  // Company Logic
  const openCompanyModal = (company?: Company) => {
    if (company) {
      setCompanyForm(company);
    } else {
      setCompanyForm({ id: '', tradeName: '', legalName: '', cnpj: '', address: '', status: 'active' });
    }
    setIsCompanyModalOpen(true);
    setOpenMenuId(null);
  };

  const handleSaveCompany = () => {
    if (!companyForm.tradeName || !companyForm.cnpj) return;

    if (companyForm.id) {
      setCompanies(companies.map(c => c.id === companyForm.id ? (companyForm as Company) : c));
    } else {
      const newCompany: Company = {
        ...(companyForm as Company),
        id: Date.now().toString(),
      };
      setCompanies([...companies, newCompany]);
    }
    setIsCompanyModalOpen(false);
  };

  // Cost Center Logic
  const openCostCenterModal = (cc?: CostCenter) => {
    if (cc) {
      setCostCenterForm(cc);
    } else {
      // Auto-generate code for new entries
      const nextCode = generateNextCostCenterCode();
      setCostCenterForm({ 
          id: '', 
          code: nextCode, 
          name: '', 
          manager: '', 
          status: 'active',
          monthlyBudget: 0,
          limitValue: 0,
          budgetHistory: []
      });
    }
    setIsCostCenterModalOpen(true);
    setOpenMenuId(null);
  };

  const handleSaveCostCenter = () => {
    if (!costCenterForm.name || !costCenterForm.code) return;

    if (costCenterForm.id) {
      const existingCC = costCenters.find(c => c.id === costCenterForm.id);
      let updatedHistory = existingCC?.budgetHistory || [];

      if (existingCC && existingCC.monthlyBudget !== costCenterForm.monthlyBudget) {
         const historyItem: BudgetHistory = {
             date: new Date().toISOString(),
             previousBudget: existingCC.monthlyBudget,
             newBudget: costCenterForm.monthlyBudget || 0,
             reason: 'Alteração manual no cadastro'
         };
         updatedHistory = [historyItem, ...updatedHistory];
      }

      setCostCenters(costCenters.map(c => c.id === costCenterForm.id ? ({
          ...costCenterForm,
          budgetHistory: updatedHistory
      } as CostCenter) : c));
    } else {
      const newCC: CostCenter = {
        ...(costCenterForm as CostCenter),
        id: Date.now().toString(),
        budgetHistory: [] 
      };
      setCostCenters([...costCenters, newCC]);
    }
    setIsCostCenterModalOpen(false);
  };

  // Confirmation Logic
  const confirmAction = () => {
    if (!confirmationModal.itemId) return;

    if (confirmationModal.type === 'delete_company') {
      setCompanies(companies.filter(c => c.id !== confirmationModal.itemId));
    } else if (confirmationModal.type === 'toggle_status_company') {
      setCompanies(companies.map(c => {
        if (c.id === confirmationModal.itemId) {
          return { ...c, status: c.status === 'active' ? 'inactive' : 'active' };
        }
        return c;
      }));
    } else if (confirmationModal.type === 'delete_costCenter') {
      setCostCenters(costCenters.filter(c => c.id !== confirmationModal.itemId));
    } else if (confirmationModal.type === 'toggle_status_costCenter') {
      setCostCenters(costCenters.map(c => {
        if (c.id === confirmationModal.itemId) {
          return { ...c, status: c.status === 'active' ? 'inactive' : 'active' };
        }
        return c;
      }));
    } else if (confirmationModal.type === 'delete_card') {
      setCards(cards.filter(c => c.id !== confirmationModal.itemId));
    } else if (confirmationModal.type === 'delete_bankAccount') {
      setBankAccounts(bankAccounts.filter(b => b.id !== confirmationModal.itemId));
    } else if (confirmationModal.type === 'toggle_status_bankAccount') {
      setBankAccounts(bankAccounts.map(b => {
        if (b.id === confirmationModal.itemId) {
          return { ...b, status: b.status === 'active' ? 'inactive' : 'active' };
        }
        return b;
      }));
    } else if (confirmationModal.type === 'delete_category') {
      setCategories(categories.filter(c => c.id !== confirmationModal.itemId));
    } else if (confirmationModal.type === 'toggle_status_category') {
      setCategories(categories.map(c => {
        if (c.id === confirmationModal.itemId) {
          return { ...c, status: c.status === 'active' ? 'inactive' : 'active' };
        }
        return c;
      }));
    }

    setConfirmationModal({ ...confirmationModal, isOpen: false });
    setOpenMenuId(null);
  };

  const openConfirmation = (type: any, id: string) => {
    let title = '';
    let message = '';
    
    if (type === 'delete_card') {
        title = 'Excluir Cartão';
        message = 'Tem certeza que deseja excluir este cartão corporativo? Essa ação não pode ser desfeita.';
    } else if (type === 'delete_bankAccount') {
        title = 'Excluir Conta Bancária';
        message = 'Tem certeza que deseja excluir esta conta?';
    } else if (type === 'delete_category') {
        title = 'Excluir Categoria';
        message = 'Tem certeza que deseja excluir esta categoria?';
    } else {
        if (type.includes('delete')) title = 'Confirmar Exclusão'; else title = 'Alterar Status';
        message = 'Tem certeza que deseja realizar esta ação?';
    }
    
    setConfirmationModal({ isOpen: true, type, itemId: id, title, message });
    setOpenMenuId(null);
  };

  const getRecordCount = () => {
    if (activeTab === 'companies') return companies.length;
    if (activeTab === 'costCenters') return costCenters.length;
    if (activeTab === 'cards') return cards.length;
    if (activeTab === 'bankAccounts') return bankAccounts.length;
    if (activeTab === 'categories') return categories.length;
    return 0;
  };

  return (
    <div className="flex flex-1 justify-center py-8 animate-in slide-in-from-bottom-4 duration-500 relative" onClick={() => setOpenMenuId(null)}>
      <div className="flex flex-col w-full max-w-[1200px] px-4 md:px-10">
        
        {/* Header Title Section */}
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
              <SettingsIcon size={16} />
              Administração do Sistema
            </div>
            <h1 className="text-slate-900 text-4xl font-black leading-tight tracking-tight">
              {activeTab === 'companies' ? 'Empresas Cadastradas' : 
               activeTab === 'costCenters' ? 'Centros de Custo' : 
               activeTab === 'bankAccounts' ? 'Contas Bancárias' : 
               activeTab === 'categories' ? 'Categorias de Despesa' : 'Gestão de Cartões'}
            </h1>
            <p className="text-slate-500 text-base max-w-xl">
              {activeTab === 'cards' ? 'Gerencie os cartões de crédito corporativos, limites e vinculações.' : 
               activeTab === 'bankAccounts' ? 'Administre as contas correntes e vínculos bancários da empresa.' :
               activeTab === 'categories' ? 'Configure as categorias e naturezas de despesa para lançamentos.' :
               'Gerencie as configurações e cadastros auxiliares do sistema.'}
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (activeTab === 'cards') openCardModal();
                if (activeTab === 'companies') openCompanyModal();
                if (activeTab === 'costCenters') openCostCenterModal();
                if (activeTab === 'bankAccounts') openBankAccountModal();
                if (activeTab === 'categories') openCategoryModal();
              }}
              className="flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-blue-600 text-white text-sm font-bold tracking-tight hover:bg-blue-700 transition-all shadow-sm"
            >
              <PlusCircle size={18} />
              <span>
                  {activeTab === 'companies' ? 'Nova Empresa' : 
                   activeTab === 'costCenters' ? 'Novo Centro de Custo' : 
                   activeTab === 'bankAccounts' ? 'Nova Conta' : 
                   activeTab === 'categories' ? 'Nova Categoria' : 'Novo Cartão'}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 mb-6">
          <div className="flex gap-8 px-2 overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveTab('cards')} className={`flex items-center gap-2 border-b-2 pb-4 font-medium text-sm whitespace-nowrap transition-all ${activeTab === 'cards' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-slate-500 hover:text-blue-600'}`}><CreditCard size={20} /> Cartões</button>
            <button onClick={() => setActiveTab('bankAccounts')} className={`flex items-center gap-2 border-b-2 pb-4 font-medium text-sm whitespace-nowrap transition-all ${activeTab === 'bankAccounts' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-slate-500 hover:text-blue-600'}`}><Landmark size={20} /> Contas Bancárias</button>
            <button onClick={() => setActiveTab('companies')} className={`flex items-center gap-2 border-b-2 pb-4 font-medium text-sm whitespace-nowrap transition-all ${activeTab === 'companies' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-slate-500 hover:text-blue-600'}`}><Building2 size={20} /> Empresas</button>
            <button onClick={() => setActiveTab('costCenters')} className={`flex items-center gap-2 border-b-2 pb-4 font-medium text-sm whitespace-nowrap transition-all ${activeTab === 'costCenters' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-slate-500 hover:text-blue-600'}`}><Wallet size={20} /> Centros de Custo</button>
            <button onClick={() => setActiveTab('categories')} className={`flex items-center gap-2 border-b-2 pb-4 font-medium text-sm whitespace-nowrap transition-all ${activeTab === 'categories' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-slate-500 hover:text-blue-600'}`}><Tag size={20} /> Categorias</button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap justify-end items-center gap-4 mb-6 h-9">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
            Exibindo {getRecordCount()} {
                activeTab === 'companies' ? 'Empresas' : 
                activeTab === 'costCenters' ? 'Centros de Custo' :
                activeTab === 'bankAccounts' ? 'Contas' : 
                activeTab === 'categories' ? 'Categorias' : 'Registros'
            }
          </p>
        </div>

        {/* Content Grid */}
        <div className={activeTab === 'categories' ? "flex flex-col gap-4 mb-8" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"}>
          
          {/* CARDS RENDER */}
          {activeTab === 'cards' && cards.map((card) => (
            <div key={card.id} className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br ${CARD_COLORS[card.color]} text-white shadow-xl transition-all hover:scale-[1.02] cursor-pointer aspect-[1.586/1] overflow-hidden`}>
              
              {/* Card Texture/Shine Effect */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

              {/* Top Row: Chip and Contactless */}
              <div className="flex justify-between items-start relative z-10">
                <div className="w-12 h-9 rounded-md bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 border border-yellow-600/50 shadow-sm relative overflow-hidden flex items-center justify-center">
                    <div className="w-full h-[1px] bg-black/20 absolute top-1/2 -translate-y-1/2"></div>
                    <div className="h-full w-[1px] bg-black/20 absolute left-1/3"></div>
                    <div className="h-full w-[1px] bg-black/20 absolute right-1/3"></div>
                </div>
                <Wifi size={24} className="rotate-90 text-white/70" />
              </div>

              {/* Middle: Number */}
              <div className="relative z-10 mt-2">
                <div className="flex items-center gap-4 text-xl md:text-2xl font-mono tracking-widest drop-shadow-md">
                   <span className="text-white/40 text-lg">•••• •••• ••••</span>
                   <span>{card.last4}</span>
                </div>
              </div>

              {/* Bottom Info */}
              <div className="flex justify-between items-end relative z-10 mt-auto">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase opacity-70 font-medium tracking-widest mb-0.5">Card Holder</span>
                  <span className="text-sm font-bold tracking-widest uppercase truncate max-w-[140px]">{card.holder}</span>
                  <span className="text-[10px] font-medium opacity-80 mt-1">{card.alias}</span>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <div className="text-right">
                      <span className="text-[8px] uppercase opacity-70 font-bold block">Valid Thru</span>
                      <span className="text-sm font-mono">{card.expiry}</span>
                   </div>
                   <div className="opacity-90">
                     <BrandLogo brand={card.brand} />
                   </div>
                </div>
              </div>

              {/* Edit/Delete Overlay (Hover) */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-4 z-20">
                 <div className="text-center px-6 w-full">
                    <p className="text-xs uppercase font-bold text-slate-300 mb-1">Limite Disponível</p>
                    <p className="text-xl font-bold text-white mb-2">{formatCurrency(card.limit)}</p>
                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-400 w-3/4"></div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 text-left">Empresa: {card.company}</p>
                 </div>
                 <div className="flex gap-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openCardModal(card); }}
                      className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-slate-100"
                    >
                       <Edit2 size={14} /> Editar
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); openConfirmation('delete_card', card.id); }}
                      className="bg-red-500/20 border border-red-500 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-red-500"
                    >
                       <Trash2 size={14} /> Excluir
                    </button>
                 </div>
              </div>

            </div>
          ))}

          {/* BANK ACCOUNTS RENDER */}
          {activeTab === 'bankAccounts' && bankAccounts.map((account) => (
             <div key={account.id} className="group relative flex flex-col p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
               <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 flex items-center justify-center bg-purple-50 rounded-xl text-purple-600">
                  <Landmark size={24} />
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${account.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {account.status === 'active' ? 'Ativo' : 'Inativo'}
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-slate-900 font-bold text-lg leading-tight mb-1">{account.name}</h3>
                <p className="text-slate-500 text-sm font-medium">{account.bankName}</p>
              </div>
              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                 <span className="text-[10px] font-bold uppercase text-slate-400 max-w-[140px] truncate" title={account.company}>{account.company}</span>
                 <div className="flex gap-2 relative">
                    <button onClick={(e) => { e.stopPropagation(); openBankAccountModal(account); }} className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"><Edit2 size={20} /></button>
                    <div className="relative">
                      <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === account.id ? null : account.id); }} className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"><SettingsIcon size={20} /></button>
                      {openMenuId === account.id && (
                        <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                          <button onClick={(e) => { e.stopPropagation(); openConfirmation('toggle_status_bankAccount', account.id); }} className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Power size={16} /> {account.status === 'active' ? 'Inativar' : 'Ativar'}</button>
                          <button onClick={(e) => { e.stopPropagation(); openConfirmation('delete_bankAccount', account.id); }} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-100"><Trash2 size={16} /> Excluir</button>
                        </div>
                      )}
                    </div>
                  </div>
              </div>
             </div>
          ))}

          {/* CATEGORIES RENDER (LIST MODE) */}
          {activeTab === 'categories' && (
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                      <th className="px-6 py-4">Categoria</th>
                      <th className="px-6 py-4">Descrição</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                                  <Tag size={16} />
                              </div>
                              <span className="font-bold text-slate-700 text-sm">{cat.name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 max-w-md truncate">
                            {cat.description || '-'}
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${cat.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                              {cat.status === 'active' ? 'Ativo' : 'Inativo'}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={(e) => { e.stopPropagation(); openCategoryModal(cat); }} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                                  <Edit2 size={16} />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); openConfirmation('delete_category', cat.id); }} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-600 transition-colors">
                                  <Trash2 size={16} />
                              </button>
                            </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          )}

          {/* COMPANIES RENDER */}
          {activeTab === 'companies' && companies.map((comp) => (
            <div key={comp.id} className="group relative flex flex-col p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-xl text-blue-600">
                  <Building2 size={28} />
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${comp.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {comp.status === 'active' ? 'Ativo' : 'Inativo'}
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-slate-900 font-bold text-lg leading-tight mb-1">{comp.tradeName}</h3>
                <p className="text-slate-500 text-xs font-mono">{comp.legalName}</p>
                <p className="text-slate-400 text-[10px] font-mono mt-1">CNPJ: {comp.cnpj}</p>
              </div>
              <div className="flex flex-col gap-2 mb-6">
                <p className="text-sm text-slate-600">{comp.address}</p>
              </div>
              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded uppercase">Corporativo</span>
                <div className="flex gap-2 relative">
                  <button onClick={(e) => { e.stopPropagation(); openCompanyModal(comp); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Edit2 size={20} /></button>
                  <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === comp.id ? null : comp.id); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><SettingsIcon size={20} /></button>
                    {openMenuId === comp.id && (
                      <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                        <button onClick={(e) => { e.stopPropagation(); openConfirmation('toggle_status_company', comp.id); }} className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Power size={16} /> {comp.status === 'active' ? 'Inativar' : 'Ativar'}</button>
                        <button onClick={(e) => { e.stopPropagation(); openConfirmation('delete_company', comp.id); }} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-100"><Trash2 size={16} /> Excluir</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* COST CENTERS RENDER */}
          {activeTab === 'costCenters' && costCenters.map((cc) => (
             <div key={cc.id} className="group relative flex flex-col p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 rounded-xl text-indigo-600">
                  <Hash size={24} />
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${cc.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {cc.status === 'active' ? 'Ativo' : 'Inativo'}
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-slate-900 font-bold text-lg leading-tight mb-1">{cc.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                   <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">{cc.code}</span>
                   <span className="text-slate-400 text-xs">•</span>
                   <p className="text-slate-500 text-sm font-medium">{cc.manager}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-50">
                    <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Mensal</p>
                        <p className="text-sm font-black text-slate-700">{formatCurrency(cc.monthlyBudget)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Limite (Cap)</p>
                        <p className="text-sm font-black text-red-600">{formatCurrency(cc.limitValue)}</p>
                    </div>
                </div>
              </div>
              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                   <Wallet size={12} />
                   <span className="text-[10px] font-bold uppercase">Anual: {formatCurrency(cc.monthlyBudget * 12)}</span>
                </div>
                <div className="flex gap-2 relative">
                  <button onClick={(e) => { e.stopPropagation(); openCostCenterModal(cc); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"><Edit2 size={20} /></button>
                  <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === cc.id ? null : cc.id); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"><SettingsIcon size={20} /></button>
                    {openMenuId === cc.id && (
                      <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                        <button onClick={(e) => { e.stopPropagation(); openConfirmation('toggle_status_costCenter', cc.id); }} className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Power size={16} /> {cc.status === 'active' ? 'Inativar' : 'Ativar'}</button>
                        <button onClick={(e) => { e.stopPropagation(); openConfirmation('delete_costCenter', cc.id); }} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-100"><Trash2 size={16} /> Excluir</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
             </div>
          ))}

        </div>

        {/* Pagination (Simplified) */}
        <div className="flex items-center justify-between mt-6 px-4">
           <p className="text-sm text-slate-500">
             Mostrando todos os registros
           </p>
          <div className="flex items-center gap-1">
            <button className="flex w-10 h-10 items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
              <ChevronLeft size={20} />
            </button>
            <button className="text-sm font-bold flex w-9 h-9 items-center justify-center text-white rounded-lg bg-blue-600 shadow-sm">1</button>
            <button className="flex w-10 h-10 items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">{categoryForm.id ? 'Editar Categoria' : 'Nova Categoria'}</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">Nome da Categoria</label>
                <input 
                  type="text" 
                  name="name"
                  value={categoryForm.name}
                  onChange={(e) => handleInputChange(e, 'category')}
                  placeholder="Ex: Aluguel, Combustível, Alimentação" 
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">Descrição / Detalhes</label>
                <textarea 
                  name="description"
                  rows={3}
                  value={categoryForm.description}
                  onChange={(e) => handleInputChange(e, 'category')}
                  placeholder="Ex: Despesas mensais recorrentes de locação..." 
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none placeholder:text-slate-400"
                />
              </div>

               <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-500">Status</label>
                  <select 
                    name="status"
                    value={categoryForm.status}
                    onChange={(e) => handleInputChange(e, 'category')}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button 
                onClick={handleSaveCategory}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-200"
              >
                Salvar Categoria
              </button>
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Modal */}
      {isCardModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">{newCard.id ? 'Editar Cartão' : 'Novo Cartão Corporativo'}</h3>
              <button onClick={() => setIsCardModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">Apelido do Cartão</label>
                <input 
                  type="text" 
                  name="alias"
                  value={newCard.alias}
                  onChange={(e) => handleInputChange(e, 'card')}
                  placeholder="Ex: Santander Black, Nubank RH" 
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">Nome no Cartão (Portador)</label>
                <input 
                  type="text" 
                  name="holder"
                  value={newCard.holder}
                  onChange={(e) => handleInputChange(e, 'card')}
                  placeholder="NOME COMO IMPRESSO" 
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-500">Últimos 4 Dígitos</label>
                  <input 
                    type="text" 
                    name="last4"
                    maxLength={4}
                    value={newCard.last4}
                    onChange={(e) => handleInputChange(e, 'card')}
                    placeholder="1234" 
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-500">Vencimento (MM/AA)</label>
                  <input 
                    type="text" 
                    name="expiry"
                    maxLength={5}
                    value={newCard.expiry}
                    onChange={(e) => handleInputChange(e, 'card')}
                    placeholder="MM/AA" 
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-500">Bandeira</label>
                  <select 
                    name="brand"
                    value={newCard.brand}
                    onChange={(e) => handleInputChange(e, 'card')}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="amex">American Express</option>
                    <option value="elo">Elo</option>
                    <option value="hipercard">Hipercard</option>
                    <option value="diners">Diners Club</option>
                    <option value="alelo">Alelo</option>
                    <option value="ticket">Ticket</option>
                    <option value="sodexo">Sodexo</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-500">Empresa Vinculada</label>
                  <select
                    name="company"
                    value={newCard.company}
                    onChange={(e) => handleInputChange(e, 'card')}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="">Selecione a empresa...</option>
                    {companies.map((comp) => (
                      <option key={comp.id} value={comp.tradeName}>{comp.tradeName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-500">Limite de Crédito</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="number" 
                      name="limit"
                      value={newCard.limit}
                      onChange={(e) => handleInputChange(e, 'card')}
                      placeholder="0.00" 
                      className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase text-slate-500">Cor de Identificação</label>
                <div className="flex gap-2 flex-wrap">
                  {Object.keys(CARD_COLORS).map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewCard({...newCard, color: color as any})}
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${CARD_COLORS[color as keyof typeof CARD_COLORS]} ring-offset-2 transition-all ${newCard.color === color ? 'ring-2 ring-slate-900 scale-110 shadow-md' : 'hover:scale-110 opacity-80 hover:opacity-100'}`}
                    >
                      {newCard.color === color && <Check size={14} className="text-white mx-auto" />}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button 
                onClick={handleSaveCard}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-200"
              >
                {newCard.id ? 'Salvar Alterações' : 'Cadastrar Cartão'}
              </button>
              <button 
                onClick={() => setIsCardModalOpen(false)}
                className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bank Account Modal */}
      {isBankAccountModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">{bankAccountForm.id ? 'Editar Conta' : 'Nova Conta Bancária'}</h3>
              <button onClick={() => setIsBankAccountModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">Nome da Conta</label>
                <input 
                  type="text" 
                  name="name"
                  value={bankAccountForm.name}
                  onChange={(e) => handleInputChange(e, 'bankAccount')}
                  placeholder="Ex: Conta Movimento, Aplicação" 
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">Instituição Financeira (Banco)</label>
                <input 
                  type="text" 
                  name="bankName"
                  value={bankAccountForm.bankName}
                  onChange={(e) => handleInputChange(e, 'bankAccount')}
                  placeholder="Ex: Banco Itaú, Bradesco" 
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-500">Empresa Vinculada</label>
                  <select
                    name="company"
                    value={bankAccountForm.company}
                    onChange={(e) => handleInputChange(e, 'bankAccount')}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="">Selecione a empresa...</option>
                    {companies.map((comp) => (
                      <option key={comp.id} value={comp.tradeName}>{comp.tradeName}</option>
                    ))}
                  </select>
                </div>
                 
               <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-500">Status</label>
                  <select 
                    name="status"
                    value={bankAccountForm.status}
                    onChange={(e) => handleInputChange(e, 'bankAccount')}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>

            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button 
                onClick={handleSaveBankAccount}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-200"
              >
                Salvar Conta
              </button>
              <button 
                onClick={() => setIsBankAccountModalOpen(false)}
                className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cost Center Modal (Updated with auto code) */}
      {isCostCenterModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">
                {costCenterForm.id ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}
              </h3>
              <button onClick={() => setIsCostCenterModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Código</label>
                    <input 
                      type="text" 
                      name="code"
                      readOnly={!costCenterForm.id} // Lock code for creation if auto-generated, or generally lock it
                      disabled
                      value={costCenterForm.code}
                      onChange={(e) => handleInputChange(e, 'costCenter')}
                      placeholder="Ex: CC-101" 
                      className="w-full bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed rounded-lg px-3 py-2.5 text-sm outline-none transition-all font-mono placeholder:text-slate-400"
                    />
                </div>
                <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-bold uppercase text-slate-500">Nome / Descrição</label>
                    <input 
                      type="text" 
                      name="name"
                      value={costCenterForm.name}
                      onChange={(e) => handleInputChange(e, 'costCenter')}
                      placeholder="Ex: Marketing Digital" 
                      className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                    />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">Responsável</label>
                <input 
                  type="text" 
                  name="manager"
                  value={costCenterForm.manager}
                  onChange={(e) => handleInputChange(e, 'costCenter')}
                  placeholder="Nome do responsável" 
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-3">
                 <div className="space-y-1.5">
                    <label className="flex items-center gap-1 text-xs font-bold uppercase text-slate-500">
                       <DollarSign size={12} />
                       Orç. Mensal
                    </label>
                    <input 
                      type="number" 
                      name="monthlyBudget"
                      value={costCenterForm.monthlyBudget}
                      onChange={(e) => handleInputChange(e, 'costCenter')}
                      placeholder="0.00" 
                      className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="flex items-center gap-1 text-xs font-bold uppercase text-slate-500">
                       <TrendingUp size={12} />
                       Anual (Est.)
                    </label>
                    <input 
                      type="text" 
                      disabled
                      value={formatCurrency((costCenterForm.monthlyBudget || 0) * 12)}
                      className="w-full bg-slate-100 border border-slate-200 text-slate-600 rounded-lg px-3 py-2.5 text-sm outline-none font-medium cursor-not-allowed"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="flex items-center gap-1 text-xs font-bold uppercase text-slate-500 text-red-500">
                       <Lock size={12} />
                       Limite (Cap)
                    </label>
                    <input 
                      type="number" 
                      name="limitValue"
                      value={costCenterForm.limitValue}
                      onChange={(e) => handleInputChange(e, 'costCenter')}
                      placeholder="0.00" 
                      className="w-full bg-white border border-red-200 text-red-900 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-slate-400"
                    />
                 </div>
              </div>

              <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-500">Status</label>
                  <select 
                    name="status"
                    value={costCenterForm.status}
                    onChange={(e) => handleInputChange(e, 'costCenter')}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>

            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button 
                onClick={handleSaveCostCenter}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-200"
              >
                Salvar Centro de Custo
              </button>
              <button 
                onClick={() => setIsCostCenterModalOpen(false)}
                className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-6 text-center">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${confirmationModal.type?.includes('delete') ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                   <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{confirmationModal.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  {confirmationModal.message}
                </p>
                <div className="flex gap-3">
                   <button 
                     onClick={confirmAction}
                     className={`flex-1 font-bold py-3 rounded-xl text-white transition-colors ${confirmationModal.type?.includes('delete') ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                   >
                     Confirmar
                   </button>
                   <button 
                     onClick={() => setConfirmationModal({...confirmationModal, isOpen: false})}
                     className="flex-1 font-bold py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                   >
                     Cancelar
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Company/Department Modals */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">{companyForm.id ? 'Editar Empresa' : 'Nova Empresa'}</h3>
              <button onClick={() => setIsCompanyModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
               <div className="space-y-1.5"><label className="text-xs font-bold uppercase text-slate-500">Nome Fantasia</label><input type="text" name="tradeName" value={companyForm.tradeName} onChange={(e) => handleInputChange(e, 'company')} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none" /></div>
               <div className="space-y-1.5"><label className="text-xs font-bold uppercase text-slate-500">Razão Social</label><input type="text" name="legalName" value={companyForm.legalName} onChange={(e) => handleInputChange(e, 'company')} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none" /></div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="text-xs font-bold uppercase text-slate-500">CNPJ</label><input type="text" name="cnpj" value={companyForm.cnpj} onChange={(e) => handleInputChange(e, 'company')} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none" /></div>
                  <div className="space-y-1.5"><label className="text-xs font-bold uppercase text-slate-500">Status</label><select name="status" value={companyForm.status} onChange={(e) => handleInputChange(e, 'company')} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none"><option value="active">Ativo</option><option value="inactive">Inativo</option></select></div>
               </div>
               <div className="space-y-1.5"><label className="text-xs font-bold uppercase text-slate-500">Endereço</label><input type="text" name="address" value={companyForm.address} onChange={(e) => handleInputChange(e, 'company')} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none" /></div>
            </div>
            <div className="p-6 pt-0 flex gap-3"><button onClick={handleSaveCompany} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl">Salvar</button><button onClick={() => setIsCompanyModalOpen(false)} className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl">Cancelar</button></div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SettingsView;