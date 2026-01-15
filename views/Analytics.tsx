import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  Download,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Wallet,
  PieChart,
  Briefcase,
  CalendarRange,
  Calendar,
  Megaphone,
  Cpu,
  Users,
  Building,
  Truck,
  X,
  Trash2,
  Save,
  CreditCard,
  Landmark,
  DollarSign,
  Smartphone,
  QrCode,
  UploadCloud,
  Check,
  CheckCircle,
  FileText,
  Paperclip,
  History,
  ArrowRight,
  Ban
} from 'lucide-react';
import { Transaction, CostCenter, User, AuditLogEntry } from '../types';

// --- MOCK DATA ---
const INITIAL_COST_CENTERS: CostCenter[] = [
  { id: '1', code: 'CC-101', name: 'Despesas Gerais', manager: 'Roberto A.', status: 'active', monthlyBudget: 15000, limitValue: 18000, budgetHistory: [] },
  { id: '2', code: 'CC-201', name: 'Marketing & Ads', manager: 'Ana Júlia', status: 'active', monthlyBudget: 45000, limitValue: 50000, budgetHistory: [] },
  { id: '3', code: 'CC-301', name: 'Tecnologia / TI', manager: 'Lucas S.', status: 'active', monthlyBudget: 12000, limitValue: 15000, budgetHistory: [] },
  { id: '4', code: 'CC-401', name: 'Recursos Humanos', manager: 'Sônia B.', status: 'active', monthlyBudget: 8000, limitValue: 10000, budgetHistory: [] },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  // October 2023
  { 
      id: '1', description: 'Google Cloud Platform', category: 'Software', amount: 4500.00, date: '2023-10-05', status: 'Pago', type: 'expense', receiptAttached: true, costCenterId: '3', createdByName: 'Lucas S.', createdByAvatar: 'https://i.pravatar.cc/150?u=lucas',
      auditLog: [
          { id: 'a1', date: '2023-10-01T10:00:00', action: 'created', userId: 'lucas', userName: 'Lucas S.', details: 'Despesa criada' },
          { id: 'a2', date: '2023-10-05T14:30:00', action: 'paid', userId: 'admin', userName: 'Admin', details: 'Marcado como pago' }
      ]
  },
  { 
      id: '2', description: 'Campanha Instagram Black Friday', category: 'Marketing', amount: 12000.00, date: '2023-10-10', status: 'Pago', type: 'expense', receiptAttached: true, costCenterId: '2', createdByName: 'Ana Júlia',
      auditLog: [
          { id: 'b1', date: '2023-10-02T09:00:00', action: 'created', userId: 'ana', userName: 'Ana Júlia', details: 'Lançamento de Campanha' },
          { id: 'b2', date: '2023-10-10T11:00:00', action: 'paid', userId: 'ana', userName: 'Ana Júlia', details: 'Pagamento via Cartão Corp' }
      ]
  },
  { 
      id: '3', description: 'Aluguel Sede', category: 'Aluguel', amount: 8500.00, date: '2023-10-01', status: 'Pendente', type: 'expense', receiptAttached: false, costCenterId: '1', createdByName: 'Roberto A.',
      auditLog: [
          { id: 'c1', date: '2023-09-25T16:00:00', action: 'created', userId: 'roberto', userName: 'Roberto A.', details: 'Despesa recorrente criada' }
      ]
  },
  { 
      id: '4', description: 'Reembolso KM Visita', category: 'Viagem', amount: 250.00, date: '2023-10-12', status: 'Pendente', type: 'expense', receiptAttached: true, costCenterId: '2', createdByName: 'Ana Júlia',
      auditLog: [
          { id: 'd1', date: '2023-10-11T18:00:00', action: 'created', userId: 'ana', userName: 'Ana Júlia', details: 'Solicitação de reembolso' }
      ]
  },
  
  // September 2023
  { id: '5', description: 'Google Ads Setembro', category: 'Marketing', amount: 15000.00, date: '2023-09-28', status: 'Pago', type: 'expense', receiptAttached: true, costCenterId: '2', createdByName: 'Ana Júlia', auditLog: [] },
  { id: '6', description: 'Manutenção Ar Condicionado', category: 'Manutenção', amount: 1200.00, date: '2023-09-15', status: 'Pago', type: 'expense', receiptAttached: true, costCenterId: '1', createdByName: 'Roberto A.', auditLog: [] },

  // Earlier in 2023 (for Yearly View)
  { id: '7', description: 'Renovação Licenças Anual', category: 'Software', amount: 25000.00, date: '2023-01-15', status: 'Pago', type: 'expense', receiptAttached: true, costCenterId: '3', createdByName: 'Lucas S.', auditLog: [] },
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

// Interface extended for the form state
interface TransactionFormState extends Partial<Transaction> {
  paymentMethod?: 'credit_card' | 'pix_transfer' | 'boleto' | 'cash';
  selectedCardId?: string;
  selectedAccountId?: string;
  file?: File | null;
}

interface AnalyticsProps {
    currentUser: User | null;
}

const Hub: React.FC<AnalyticsProps> = ({ currentUser }) => {
  // --- STATE ---
  const [currentDate, setCurrentDate] = useState(new Date(2023, 9, 1)); // Start at Oct 2023
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
  const [activeListTab, setActiveListTab] = useState<'all' | 'pending' | 'paid'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filters
  const [selectedCostCenterId, setSelectedCostCenterId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({ start: '', end: '' });

  // Data State (Editable)
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [costCenters] = useState<CostCenter[]>(INITIAL_COST_CENTERS);

  // Modal State
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<TransactionFormState>({});

  // Cancellation Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  // --- HELPERS ---

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const UserAvatar = ({ name, url, size = 'sm', className = '' }: { name: string, url?: string, size?: 'sm' | 'md', className?: string }) => {
    const sizeClasses = {
      sm: 'w-6 h-6 text-[10px]',
      md: 'w-8 h-8 text-xs',
    };
    const s = sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.sm;

    if (url) return <img src={url} alt={name} className={`${s} rounded-full border border-white shadow-sm object-cover ${className}`} />;
    return <div className={`${s} rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold border border-white shadow-sm ${className}`}>{getInitials(name)}</div>;
  };
  
  const getCostCenterIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('marketing')) return <Megaphone size={20} className="text-white" />;
    if (lowerName.includes('tecnologia') || lowerName.includes('ti')) return <Cpu size={20} className="text-white" />;
    if (lowerName.includes('humanos') || lowerName.includes('rh')) return <Users size={20} className="text-white" />;
    if (lowerName.includes('logística')) return <Truck size={20} className="text-white" />;
    return <Building size={20} className="text-white" />;
  };

  const getCostCenterColor = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('marketing')) return 'bg-purple-500 shadow-purple-200';
    if (lowerName.includes('tecnologia') || lowerName.includes('ti')) return 'bg-cyan-500 shadow-cyan-200';
    if (lowerName.includes('humanos') || lowerName.includes('rh')) return 'bg-rose-500 shadow-rose-200';
    return 'bg-blue-500 shadow-blue-200';
  };

  const handlePrev = () => {
    if (viewMode === 'month') {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
        setCurrentDate(new Date(currentDate.getFullYear() - 1, 0, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
        setCurrentDate(new Date(currentDate.getFullYear() + 1, 0, 1));
    }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  
  const getDateLabel = (date: Date) => {
    if (viewMode === 'year') return date.getFullYear().toString();
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const clearFilters = () => {
      setSelectedCostCenterId(null);
      setDateRange({ start: '', end: '' });
      setSearchTerm('');
  };

  // --- ACTIONS ---

  const handleRowClick = (t: Transaction) => {
    setSelectedTransaction(t);
    setEditForm({ 
        ...t, 
        paymentMethod: 'credit_card',
        selectedCardId: '',
        selectedAccountId: '',
        file: null
    });
    setIsModalOpen(true);
  };

  const handleUpdateTransaction = (updates: Partial<Transaction>) => {
    if (!selectedTransaction) return;
    
    const updatedTransactions = transactions.map(t => 
        t.id === selectedTransaction.id ? { ...t, ...updates } : t
    );
    
    setTransactions(updatedTransactions);
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleCancelTransaction = () => {
    if (!selectedTransaction || !cancellationReason) return;

    const cancelAudit: AuditLogEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        action: 'cancelled',
        userId: currentUser?.id || 'unknown',
        userName: currentUser?.name || 'Unknown',
        userAvatar: currentUser?.avatarUrl,
        details: `Cancelado: ${cancellationReason}`
    };

    const updatedAuditLog = selectedTransaction.auditLog ? [...selectedTransaction.auditLog, cancelAudit] : [cancelAudit];

    const updatedTransactions = transactions.map(t => 
        t.id === selectedTransaction.id ? { 
            ...t, 
            status: 'Cancelado' as const, 
            cancellationReason: cancellationReason,
            auditLog: updatedAuditLog
        } : t
    );

    setTransactions(updatedTransactions);
    setIsCancelModalOpen(false);
    setIsModalOpen(false);
    setSelectedTransaction(null);
    setCancellationReason('');
  };

  const handleMarkAsPaid = () => {
    const paymentDate = editForm.date || new Date().toISOString().split('T')[0];
    
    // Create Audit Entry for Payment
    const paymentAuditEntry: AuditLogEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        action: 'paid',
        userId: currentUser?.id || 'unknown',
        userName: currentUser?.name || 'Sistema',
        userAvatar: currentUser?.avatarUrl,
        details: `Pagamento realizado via ${editForm.paymentMethod === 'credit_card' ? 'Cartão' : editForm.paymentMethod}`
    };

    // Current Audit Log + New Entry
    const updatedAuditLog = selectedTransaction ? [...(selectedTransaction.auditLog || []), paymentAuditEntry] : [paymentAuditEntry];

    handleUpdateTransaction({ 
        status: 'Pago',
        date: paymentDate,
        receiptAttached: !!editForm.file,
        receiptFile: editForm.file,
        auditLog: updatedAuditLog
    });
  };

  // --- CALCULATIONS ---

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      
      // Cost Center Filter
      if (selectedCostCenterId && t.costCenterId !== selectedCostCenterId) {
          return false;
      }

      // Date Range Filter (Overrides Month/Year view if active)
      if (dateRange.start && dateRange.end) {
          const start = new Date(dateRange.start);
          const end = new Date(dateRange.end);
          // Set times to ensure inclusive range
          start.setHours(0,0,0,0);
          end.setHours(23,59,59,999);
          
          if (tDate < start || tDate > end) return false;
      } else {
          // Standard View Filter (Month/Year)
          const sameYear = tDate.getFullYear() === currentDate.getFullYear();
          if (viewMode === 'year') {
             if (!sameYear) return false;
          } else {
             if (!sameYear || tDate.getMonth() !== currentDate.getMonth()) return false;
          }
      }
      return true;
    });
  }, [currentDate, viewMode, transactions, selectedCostCenterId, dateRange]);

  const totals = useMemo(() => {
    // Only apply time filters for KPIs, disregard status filters
    // EXCLUDE CANCELLED TRANSACTIONS FROM TOTALS
    const kpiTransactions = filteredTransactions.filter(t => t.status !== 'Cancelado'); 
    
    const expenses = kpiTransactions.filter(t => t.type === 'expense');
    const totalSpent = expenses.reduce((acc, t) => acc + t.amount, 0);
    const paidAmount = expenses.filter(t => t.status === 'Pago').reduce((acc, t) => acc + t.amount, 0);
    const pendingAmount = expenses.filter(t => t.status === 'Pendente').reduce((acc, t) => acc + t.amount, 0);
    
    // Budget logic needs to adapt to filters
    let baseMonthlyBudget = 0;
    if (selectedCostCenterId) {
        const cc = costCenters.find(c => c.id === selectedCostCenterId);
        if (cc) baseMonthlyBudget = cc.monthlyBudget;
    } else {
        baseMonthlyBudget = costCenters.reduce((acc, cc) => acc + cc.monthlyBudget, 0);
    }
    
    // Adjust budget for Year view
    const totalBudget = viewMode === 'year' ? baseMonthlyBudget * 12 : baseMonthlyBudget;
    const budgetRemaining = totalBudget - totalSpent;

    return { totalSpent, paidAmount, pendingAmount, totalBudget, budgetRemaining };
  }, [filteredTransactions, viewMode, costCenters, selectedCostCenterId]);

  const costCenterMetrics = useMemo(() => {
    return costCenters.map(cc => {
      const spent = transactions
        .filter(t => {
            const tDate = new Date(t.date);
            const sameYear = tDate.getFullYear() === currentDate.getFullYear();
            const timeMatch = viewMode === 'year' ? sameYear : (sameYear && tDate.getMonth() === currentDate.getMonth());
            return t.costCenterId === cc.id && t.type === 'expense' && timeMatch && t.status !== 'Cancelado';
        })
        .reduce((acc, t) => acc + t.amount, 0);
      
      const periodBudget = viewMode === 'year' ? cc.monthlyBudget * 12 : cc.monthlyBudget;
      const percentage = periodBudget > 0 ? Math.min((spent / periodBudget) * 100, 100) : 0;
      const isOverBudget = spent > periodBudget;
      
      return { ...cc, spent, percentage, isOverBudget, periodBudget };
    }).sort((a, b) => b.percentage - a.percentage);
  }, [currentDate, viewMode, costCenters, transactions]);

  const listData = useMemo(() => {
    let data = filteredTransactions;
    if (activeListTab === 'pending') data = data.filter(t => t.status === 'Pendente');
    else if (activeListTab === 'paid') data = data.filter(t => t.status === 'Pago' || t.status === 'Recebido');

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      data = data.filter(t => t.description.toLowerCase().includes(lowerTerm) || t.category.toLowerCase().includes(lowerTerm));
    }
    return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredTransactions, activeListTab, searchTerm]);

  return (
    <div className="max-w-[1400px] mx-auto min-h-screen flex flex-col bg-slate-50">
      
      {/* ... (TOP BAR - UNCHANGED) ... */}
      <div className="bg-blue-900 text-white sticky top-0 z-30 shadow-lg">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-4">
                <div className="bg-white/10 p-2 rounded-lg"><Wallet size={24} className="text-blue-200" /></div>
                <div><h2 className="text-lg font-bold leading-tight">Controle de Despesas</h2><p className="text-blue-200 text-xs">Acompanhamento de fluxo</p></div>
            </div>
            
            <div className="flex md:hidden bg-blue-950/50 p-1 rounded-lg">
                <button onClick={() => setViewMode('month')} className={`p-1.5 rounded-md transition-all ${viewMode === 'month' ? 'bg-white text-blue-900 shadow-sm' : 'text-blue-300'}`}><Calendar size={18} /></button>
                <button onClick={() => setViewMode('year')} className={`p-1.5 rounded-md transition-all ${viewMode === 'year' ? 'bg-white text-blue-900 shadow-sm' : 'text-blue-300'}`}><CalendarRange size={18} /></button>
            </div>
          </div>

          <div className="flex items-center bg-blue-800 rounded-full p-1 border border-blue-700 shadow-inner">
            <button onClick={handlePrev} className="p-2 hover:bg-blue-700 rounded-full transition-colors text-blue-200 hover:text-white"><ChevronLeft size={20} /></button>
            <div className="px-6 min-w-[180px] text-center font-bold capitalize text-lg tracking-wide flex flex-col leading-none py-1">
              <span>{getDateLabel(currentDate)}</span>
              {viewMode === 'year' && <span className="text-[10px] text-blue-300 font-normal mt-0.5">Visão Acumulada</span>}
            </div>
            <button onClick={handleNext} className="p-2 hover:bg-blue-700 rounded-full transition-colors text-blue-200 hover:text-white"><ChevronRight size={20} /></button>
          </div>

          <div className="hidden md:flex items-center gap-3">
             <div className="flex bg-blue-800 p-1 rounded-lg border border-blue-700 mr-2">
                <button onClick={() => setViewMode('month')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'month' ? 'bg-white text-blue-900 shadow-sm' : 'text-blue-200 hover:text-white'}`}><Calendar size={14} /> Mês</button>
                <button onClick={() => setViewMode('year')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'year' ? 'bg-white text-blue-900 shadow-sm' : 'text-blue-200 hover:text-white'}`}><CalendarRange size={14} /> Ano</button>
             </div>
             <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-900 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors shadow-sm"><Download size={16} /> Relatório</button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-8 space-y-8 max-w-[1200px] w-full mx-auto animate-in slide-in-from-bottom-4 duration-500">
        
        {/* --- KPI CARDS (Unchanged) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
             <div className="relative z-10"><p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                {selectedCostCenterId ? 'Orçamento Filtrado' : (viewMode === 'year' ? 'Orçamento Anual (Meta)' : 'Orçamento Mensal (Meta)')}
             </p><h3 className="text-2xl font-black text-slate-900">{formatCurrency(totals.totalBudget)}</h3></div>
             <div className="mt-4 flex items-center gap-2 relative z-10"><div className={`h-2 flex-1 rounded-full bg-slate-100 overflow-hidden`}><div className="h-full bg-blue-600" style={{ width: `${Math.min((totals.totalSpent / totals.totalBudget) * 100, 100)}%` }}></div></div><span className="text-xs font-bold text-slate-600">{totals.totalBudget > 0 ? Math.round((totals.totalSpent / totals.totalBudget) * 100) : 0}%</span></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
             <div className="relative z-10"><div className="flex items-center gap-2 mb-2"><CheckCircle2 size={16} className="text-emerald-500" /><p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pago {selectedCostCenterId ? '(Filtrado)' : (viewMode === 'year' ? 'no Ano' : 'no Mês')}</p></div><h3 className="text-2xl font-black text-slate-900">{formatCurrency(totals.paidAmount)}</h3></div>
             <p className="text-xs text-slate-400 mt-2 relative z-10">Dinheiro que já saiu do caixa</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
             <div className={`absolute left-0 top-0 bottom-0 w-1 ${totals.pendingAmount > 0 ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
             <div className="relative z-10"><div className="flex items-center gap-2 mb-2"><Clock size={16} className={totals.pendingAmount > 0 ? "text-amber-500" : "text-emerald-500"} /><p className="text-slate-500 text-xs font-bold uppercase tracking-wider">A Pagar / Pendente</p></div><h3 className={`text-2xl font-black ${totals.pendingAmount > 0 ? "text-amber-600" : "text-emerald-600"}`}>{formatCurrency(totals.pendingAmount)}</h3></div>
             {totals.pendingAmount > 0 ? <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-50 text-amber-700 text-[10px] font-bold w-fit"><AlertTriangle size={10} /> Clique na lista para baixar</div> : <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold w-fit"><CheckCircle2 size={10} /> Tudo em dia</div>}
          </div>
          <div className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between relative overflow-hidden ${totals.budgetRemaining < 0 ? 'bg-red-50 border-red-200' : 'bg-slate-900 border-slate-800 text-white'}`}>
             <div className="relative z-10"><p className={`text-xs font-bold uppercase tracking-wider mb-2 ${totals.budgetRemaining < 0 ? 'text-red-600' : 'text-slate-400'}`}>{totals.budgetRemaining < 0 ? 'Estouro do Planejado' : 'Disponível no Orçamento'}</p><h3 className={`text-2xl font-black ${totals.budgetRemaining < 0 ? 'text-red-600' : 'text-white'}`}>{formatCurrency(totals.budgetRemaining)}</h3></div>
             <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center"><span className={`text-[10px] ${totals.budgetRemaining < 0 ? 'text-red-500' : 'text-slate-400'}`}>Saldo restante do Budget.</span></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COL: COST CENTERS --- */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-lg font-bold text-slate-900">{viewMode === 'year' ? 'Centros de Custo (Anual)' : 'Centros de Custo (Mês)'}</h3>
            </div>
            <div className="space-y-4">
              {costCenterMetrics.map((cc) => (
                <div 
                   key={cc.id} 
                   onClick={() => setSelectedCostCenterId(selectedCostCenterId === cc.id ? null : cc.id)}
                   className={`rounded-xl border p-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden cursor-pointer ${selectedCostCenterId === cc.id ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500 ring-offset-2' : 'bg-white border-slate-200'}`}
                >
                   {/* Icon Blob */}
                   <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-slate-50/50 rounded-full flex items-center justify-center z-0"></div>
                   
                   <div className="flex justify-between items-start mb-3 relative z-10">
                      <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg shadow-lg flex items-center justify-center ${getCostCenterColor(cc.name)}`}>
                             {getCostCenterIcon(cc.name)}
                          </div>
                          <div>
                             <p className="text-xs font-mono text-slate-400 mb-0.5">{cc.code}</p>
                             <p className="font-bold text-slate-800 text-sm">{cc.name}</p>
                          </div>
                      </div>
                      {selectedCostCenterId === cc.id && <div className="bg-blue-600 text-white rounded-full p-1"><Check size={12}/></div>}
                   </div>
                   
                   <div className="relative z-10 mt-4">
                     <div className="flex justify-between items-end mb-1">
                        <p className={`font-black text-lg ${cc.isOverBudget ? 'text-red-600' : 'text-slate-900'}`}>{formatCurrency(cc.spent)}</p>
                        <p className="text-[10px] text-slate-400 font-medium mb-1">Meta: {formatCurrency(cc.periodBudget)}</p>
                     </div>
                     <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${cc.percentage > 100 ? 'bg-red-500' : cc.percentage > 85 ? 'bg-amber-500' : 'bg-blue-600'}`} style={{ width: `${Math.min(cc.percentage, 100)}%` }}></div>
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- RIGHT COL: TRANSACTION LIST --- */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-[750px]">
             
             {/* List Header & Filters */}
             <div className="p-6 border-b border-slate-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                   <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                       {selectedCostCenterId ? 'Extrato Filtrado' : (viewMode === 'year' ? 'Extrato Anual Acumulado' : 'Extrato do Mês')}
                       {(selectedCostCenterId || dateRange.start) && (
                           <button onClick={clearFilters} className="text-[10px] bg-slate-100 px-2 py-1 rounded-full text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors">
                               <X size={10} /> Limpar Filtros
                           </button>
                       )}
                   </h3>
                   <div className="flex bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
                      <button onClick={() => setActiveListTab('pending')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeListTab === 'pending' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>A Pagar</button>
                      <button onClick={() => setActiveListTab('paid')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeListTab === 'paid' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Pago</button>
                      <button onClick={() => setActiveListTab('all')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeListTab === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Tudo</button>
                   </div>
                </div>
                
                {/* Advanced Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                   <div className="relative">
                       <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400" />
                   </div>
                   <div className="flex items-center gap-2">
                       <input type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none text-slate-600" />
                       <span className="text-slate-400 text-xs">até</span>
                       <input type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none text-slate-600" />
                   </div>
                </div>
             </div>

             {/* List Content */}
             <div className="overflow-y-auto flex-1 p-0">
                {listData.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8">
                     <Briefcase size={48} className="mb-4 opacity-20" /><p className="text-sm font-medium">Nenhum lançamento encontrado para este período.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
                      <tr className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                        <th className="px-6 py-4">Data</th>
                        <th className="px-6 py-4">Descrição / Categoria</th>
                        <th className="px-6 py-4">Centro de Custo</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4">Responsável</th>
                        <th className="px-6 py-4 text-right">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {listData.map((t) => (
                        <tr key={t.id} onClick={() => handleRowClick(t)} className={`cursor-pointer transition-colors group ${t.status === 'Cancelado' ? 'bg-slate-50 opacity-60' : 'hover:bg-blue-50/50'}`}>
                          <td className="px-6 py-4">
                             <div className={`text-slate-900 font-bold text-sm ${t.status === 'Cancelado' ? 'line-through text-slate-400' : ''}`}>{new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</div>
                             {viewMode === 'year' && <div className="text-[10px] text-slate-400">{new Date(t.date).getFullYear()}</div>}
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex flex-col">
                                <span className={`font-bold text-sm transition-colors ${t.status === 'Cancelado' ? 'line-through text-slate-400' : 'text-slate-700 group-hover:text-blue-600'}`}>{t.description}</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">{t.category}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <span className="inline-block bg-slate-100 text-slate-500 text-[10px] font-mono px-2 py-1 rounded">{costCenters.find(c => c.id === t.costCenterId)?.code || 'N/A'}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                             {t.status === 'Pago' || t.status === 'Recebido' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase"><CheckCircle2 size={12} /> Pago</span>
                             ) : t.status === 'Cancelado' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold uppercase"><Ban size={12} /> Canc.</span>
                             ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase"><Clock size={12} /> Aberto</span>
                             )}
                          </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                  <UserAvatar name={t.createdByName || 'N/A'} url={t.createdByAvatar} />
                                  <span className="text-xs font-medium text-slate-600 truncate max-w-[80px]">{t.createdByName ? t.createdByName.split(' ')[0] : '-'}</span>
                              </div>
                           </td>
                          <td className="px-6 py-4 text-right">
                             <span className={`font-black text-sm ${t.status === 'Cancelado' ? 'line-through text-slate-400' : t.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>{t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
             </div>
             
             {/* Harmonious High-Vis Footer */}
             <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Listado</span>
                    <span className="text-[10px] font-medium text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200 w-fit shadow-sm">
                        {listData.length} registros
                    </span>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-black text-slate-800 tracking-tighter">
                        {formatCurrency(listData.reduce((acc, t) => t.status === 'Cancelado' ? acc : acc + t.amount, 0))}
                    </p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- INTERACTIVE TRANSACTION MODAL (REDESIGNED) --- */}
      {isModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setIsModalOpen(false)}>
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              
              {/* Header with Title and Status */}
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/80 backdrop-blur flex justify-between items-start">
                 <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        {selectedTransaction.status === 'Pendente' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wide"><Clock size={14}/> Pendente</span>}
                        {selectedTransaction.status === 'Pago' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wide"><CheckCircle2 size={14}/> Pago</span>}
                        {selectedTransaction.status === 'Cancelado' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wide"><Ban size={14}/> Cancelado</span>}
                        
                        <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">#{selectedTransaction.id}</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">{selectedTransaction.description}</h2>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: Organized Details */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Block 1: Info Principal */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-50/50 px-4 py-2 border-b border-slate-100">
                                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Informações Gerais</h4>
                            </div>
                            <div className="p-5 grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs text-slate-400 font-medium mb-1">Categoria</p>
                                    <p className="text-sm font-bold text-slate-800">{selectedTransaction.category}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium mb-1">Centro de Custo</p>
                                    <span className="inline-block bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-mono font-bold">
                                        {costCenters.find(c => c.id === selectedTransaction.costCenterId)?.code || 'N/A'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium mb-1">Vencimento Original</p>
                                    <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                                        <Calendar size={14} className="text-blue-500" /> 
                                        {new Date(selectedTransaction.date).toLocaleDateString('pt-BR')}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium mb-1">Valor Total</p>
                                    <p className="text-xl font-black text-slate-900">{formatCurrency(selectedTransaction.amount)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Block 2: Documents */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-50/50 px-4 py-2 border-b border-slate-100">
                                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Documentos Anexados</h4>
                            </div>
                            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Quote */}
                                <div className={`flex items-center justify-between p-3 rounded-lg border ${selectedTransaction.quoteFile ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100 border-dashed'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${selectedTransaction.quoteFile ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-400'}`}>
                                            <Paperclip size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700">Orçamento</p>
                                            <p className="text-[10px] text-slate-400 max-w-[100px] truncate">{selectedTransaction.quoteFile ? selectedTransaction.quoteFile.name : 'Não anexado'}</p>
                                        </div>
                                    </div>
                                    {selectedTransaction.quoteFile && <button className="text-indigo-500 hover:text-indigo-700"><Download size={16}/></button>}
                                </div>

                                {/* Receipt */}
                                <div className={`flex items-center justify-between p-3 rounded-lg border ${selectedTransaction.receiptAttached || selectedTransaction.receiptFile ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100 border-dashed'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${selectedTransaction.receiptAttached || selectedTransaction.receiptFile ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                                            <UploadCloud size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700">Comprovante</p>
                                            <p className="text-[10px] text-slate-400 max-w-[100px] truncate">{selectedTransaction.receiptFile ? selectedTransaction.receiptFile.name : (selectedTransaction.receiptAttached ? 'Anexo Presente' : 'Pendente')}</p>
                                        </div>
                                    </div>
                                    {(selectedTransaction.receiptAttached || selectedTransaction.receiptFile) && <button className="text-emerald-500 hover:text-emerald-700"><Download size={16}/></button>}
                                </div>
                            </div>
                        </div>

                        {/* Block 3: Payment Action Area (If Pending) */}
                        {selectedTransaction.status === 'Pendente' && (
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 animate-in slide-in-from-bottom-2">
                                <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Wallet size={16} /> Realizar Baixa (Pagamento)
                                </h4>
                                
                                <div className="mb-4">
                                    <label className="text-xs font-bold uppercase text-slate-500 mb-2.5 block">Meio de Pagamento</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        <button onClick={() => setEditForm({...editForm, paymentMethod: 'credit_card'})} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${editForm.paymentMethod === 'credit_card' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                            <CreditCard size={18} />
                                            <span className="text-[10px] font-bold">Cartão</span>
                                        </button>
                                        <button onClick={() => setEditForm({...editForm, paymentMethod: 'pix_transfer'})} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${editForm.paymentMethod === 'pix_transfer' ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                            <Smartphone size={18} />
                                            <span className="text-[10px] font-bold">Pix/TED</span>
                                        </button>
                                        <button onClick={() => setEditForm({...editForm, paymentMethod: 'boleto'})} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${editForm.paymentMethod === 'boleto' ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                            <QrCode size={18} />
                                            <span className="text-[10px] font-bold">Boleto</span>
                                        </button>
                                        <button onClick={() => setEditForm({...editForm, paymentMethod: 'cash'})} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${editForm.paymentMethod === 'cash' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                            <DollarSign size={18} />
                                            <span className="text-[10px] font-bold">Dinheiro</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                     <div>
                                        <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block">Data do Pagamento</label>
                                        <input 
                                          type="date" 
                                          className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                                          value={editForm.date || selectedTransaction.date}
                                          onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                                        />
                                     </div>
                                     <div>
                                        <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block">Anexar Comprovante</label>
                                        <div className="border border-dashed border-slate-300 rounded-lg p-2 flex items-center gap-2 hover:bg-white cursor-pointer relative transition-colors h-[38px] px-3">
                                            <input 
                                                type="file" 
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => setEditForm({...editForm, file: e.target.files?.[0] || null})}
                                            />
                                            <UploadCloud size={14} className="text-slate-400" />
                                            <span className="text-xs text-slate-600 font-medium truncate">{editForm.file ? editForm.file.name : "Selecionar arquivo..."}</span>
                                        </div>
                                     </div>
                                </div>

                                <button onClick={handleMarkAsPaid} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
                                   <CheckCircle2 size={18} /> Confirmar Pagamento e Baixar
                                </button>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Audit Log (Timeline) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
                            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <History size={14} /> Histórico (Lastro)
                                </h3>
                            </div>
                            <div className="p-5 flex-1 overflow-y-auto max-h-[400px]">
                                <div className="relative pl-4 border-l-2 border-slate-100 space-y-8">
                                    {/* Map through Audit Log */}
                                    {selectedTransaction.auditLog?.map((log, index) => (
                                        <div key={log.id} className="relative">
                                            {/* Dot */}
                                            <div className={`absolute -left-[21px] top-0 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                                                log.action === 'created' ? 'bg-blue-500' : 
                                                log.action === 'paid' ? 'bg-emerald-500' : 
                                                log.action === 'cancelled' ? 'bg-red-500' : 'bg-slate-400'
                                            }`}></div>
                                            
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-mono text-slate-400">
                                                    {new Date(log.date).toLocaleString('pt-BR')}
                                                </span>
                                                <p className="text-xs font-bold text-slate-800">
                                                    {log.action === 'created' ? 'Criação do Lançamento' : 
                                                     log.action === 'paid' ? 'Pagamento Realizado' : 
                                                     log.action === 'cancelled' ? 'Cancelamento' : 'Atualização'}
                                                </p>
                                                <p className="text-xs text-slate-500 italic">"{log.details}"</p>
                                                
                                                <div className="flex items-center gap-2 mt-1 bg-slate-50 p-1.5 rounded-lg w-fit border border-slate-100">
                                                    <UserAvatar name={log.userName} url={log.userAvatar} size="sm" />
                                                    <span className="text-[10px] font-bold text-slate-600">{log.userName}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {(!selectedTransaction.auditLog || selectedTransaction.auditLog.length === 0) && (
                                        <p className="text-xs text-slate-400 italic pl-2">Nenhum histórico registrado.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                 </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                 {selectedTransaction.status !== 'Cancelado' ? (
                     <button onClick={() => setIsCancelModalOpen(true)} className="text-red-600 hover:text-red-700 text-sm font-bold flex items-center gap-2 px-4 py-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Ban size={16} /> Cancelar Despesa
                     </button>
                 ) : (
                     <span className="text-xs font-bold text-slate-400 px-4 py-2">Despesa Cancelada</span>
                 )}
                 
                 <button onClick={() => setIsModalOpen(false)} className="bg-white border border-slate-200 text-slate-600 hover:text-slate-800 text-sm font-bold px-6 py-2.5 rounded-lg shadow-sm hover:bg-slate-50 transition-all">
                    Fechar
                 </button>
              </div>

           </div>
        </div>
      )}

      {/* CANCELLATION MODAL */}
      {isCancelModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-6">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto text-red-600">
                          <AlertTriangle size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Cancelar Lançamento</h3>
                      <p className="text-sm text-slate-500 text-center mb-6">
                          O cancelamento mantém o registro para histórico (lastro), mas remove o valor dos cálculos financeiros. Esta ação é irreversível.
                      </p>
                      
                      <div className="space-y-2 mb-6">
                          <label className="text-xs font-bold uppercase text-slate-500">Motivo do Cancelamento</label>
                          <textarea 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none resize-none"
                              rows={3}
                              placeholder="Ex: Lançamento duplicado, erro de digitação..."
                              value={cancellationReason}
                              onChange={(e) => setCancellationReason(e.target.value)}
                          />
                      </div>

                      <div className="flex gap-3">
                          <button onClick={() => setIsCancelModalOpen(false)} className="flex-1 py-3 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Voltar</button>
                          <button 
                            onClick={handleCancelTransaction} 
                            disabled={!cancellationReason}
                            className="flex-1 py-3 font-bold text-white bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl transition-colors"
                          >
                              Confirmar Cancelamento
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default Hub;