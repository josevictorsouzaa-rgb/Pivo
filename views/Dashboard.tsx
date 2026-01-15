import React, { useState, useMemo } from 'react';
import { 
  Save, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  FileText, 
  Calendar,
  DollarSign,
  Tag,
  Briefcase,
  MoreHorizontal
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '../types';

const Dashboard: React.FC = () => {
  // Mock Data with Income and Expenses
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', description: 'Recebimento NF-1020', category: 'Vendas', amount: 5400.00, date: '2023-10-24', status: 'Recebido', type: 'income', receiptAttached: true, auditLog: [] },
    { id: '2', description: 'Assinatura Adobe Cloud', category: 'Software', amount: 175.00, date: '2023-10-24', status: 'Pago', type: 'expense', receiptAttached: true, auditLog: [] },
    { id: '3', description: 'Consultoria Técnica', category: 'Serviços', amount: 3200.00, date: '2023-10-25', status: 'Pendente', type: 'income', receiptAttached: false, auditLog: [] },
    { id: '4', description: 'Uber - Aeroporto', category: 'Viagem', amount: 82.00, date: '2023-10-23', status: 'Pago', type: 'expense', receiptAttached: true, auditLog: [] },
    { id: '5', description: 'Material de Escritório', category: 'Manutenção', amount: 450.00, date: '2023-10-22', status: 'Pendente', type: 'expense', receiptAttached: true, auditLog: [] },
  ]);

  // Form State
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    status: 'Pendente'
  });

  // Calculate Indicators
  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const balance = income - expense;
    
    // Future/Pending stats
    const pendingIncome = transactions.filter(t => t.type === 'income' && t.status === 'Pendente').reduce((acc, curr) => acc + curr.amount, 0);
    const pendingExpense = transactions.filter(t => t.type === 'expense' && t.status === 'Pendente').reduce((acc, curr) => acc + curr.amount, 0);

    return { income, expense, balance, pendingIncome, pendingExpense };
  }, [transactions]);

  // Chart Data Mock
  const chartData = [
    { name: 'Seg', Entradas: 4000, Saidas: 2400 },
    { name: 'Ter', Entradas: 3000, Saidas: 1398 },
    { name: 'Qua', Entradas: 2000, Saidas: 9800 },
    { name: 'Qui', Entradas: 2780, Saidas: 3908 },
    { name: 'Sex', Entradas: 1890, Saidas: 4800 },
    { name: 'Sab', Entradas: 2390, Saidas: 3800 },
    { name: 'Dom', Entradas: 3490, Saidas: 4300 },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!formData.description || !formData.amount) return;
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description: formData.description,
      category: formData.category || 'Outros',
      amount: parseFloat(formData.amount),
      date: formData.date,
      status: formData.status as 'Pendente' | 'Pago' | 'Recebido',
      type: transactionType,
      receiptAttached: false,
      auditLog: []
    };

    setTransactions([newTransaction, ...transactions]);
    setFormData({ ...formData, description: '', amount: '' });
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
      
      {/* LEFT COLUMN: Registration Panel */}
      <section className="w-full md:w-[400px] xl:w-[450px] bg-white border-r border-slate-200 flex flex-col z-20 shadow-xl overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Novo Lançamento</h2>
            <p className="text-slate-500 text-sm">Registre suas movimentações para manter o fluxo de caixa atualizado.</p>
          </div>

          {/* Type Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button 
              onClick={() => { setTransactionType('expense'); setFormData({...formData, status: 'Pendente'}) }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                transactionType === 'expense' 
                  ? 'bg-white text-red-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ArrowDownCircle size={18} />
              Despesa (A Pagar)
            </button>
            <button 
              onClick={() => { setTransactionType('income'); setFormData({...formData, status: 'Pendente'}) }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                transactionType === 'income' 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ArrowUpCircle size={18} />
              Receita (A Receber)
            </button>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Briefcase size={14} /> Descrição
              </label>
              <input 
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none transition-all font-medium placeholder:font-normal"
                placeholder={transactionType === 'income' ? "Ex: Venda de Consultoria" : "Ex: Conta de Luz"}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <DollarSign size={14} /> Valor
                </label>
                <input 
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-50 border border-slate-200 text-sm rounded-lg focus:ring-2 block p-3 outline-none transition-all font-bold ${
                    transactionType === 'income' ? 'text-emerald-600 focus:ring-emerald-500' : 'text-red-600 focus:ring-red-500'
                  }`}
                  placeholder="0,00"
                  step="0.01"
                />
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Calendar size={14} /> Vencimento
                </label>
                <input 
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 block p-3 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Tag size={14} /> Categoria
                </label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 block p-3 outline-none appearance-none"
                >
                  <option value="">Selecione...</option>
                  {transactionType === 'income' ? (
                    <>
                      <option>Vendas</option>
                      <option>Serviços</option>
                      <option>Rendimentos</option>
                    </>
                  ) : (
                    <>
                      <option>Operacional</option>
                      <option>Marketing</option>
                      <option>Pessoal</option>
                      <option>Impostos</option>
                    </>
                  )}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status
                </label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 block p-3 outline-none appearance-none"
                >
                  <option>Pendente</option>
                  <option>{transactionType === 'income' ? 'Recebido' : 'Pago'}</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button 
                onClick={handleSave}
                className={`flex-1 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2 ${
                  transactionType === 'income' 
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' 
                    : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                }`}
              >
                <Save size={18} />
                {transactionType === 'income' ? 'Registrar Receita' : 'Registrar Despesa'}
              </button>
              <button 
                onClick={() => setFormData({...formData, description: '', amount: ''})}
                className="p-3.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </form>
        </div>
        
        {/* Helper Box */}
        <div className="mt-auto p-6 bg-slate-50 border-t border-slate-200">
           <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
              <Wallet className="text-blue-600 shrink-0" size={20} />
              <div>
                <p className="text-xs font-bold text-blue-800 mb-1">Dica Financeira</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Mantenha as datas de vencimento atualizadas para receber alertas de contas a pagar antes do prazo.
                </p>
              </div>
           </div>
        </div>
      </section>

      {/* RIGHT COLUMN: Dashboard Analytics */}
      <section className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-end">
             <div>
               <h1 className="text-3xl font-black text-slate-900 mb-1">Visão Geral</h1>
               <p className="text-slate-500 font-medium">Fluxo de caixa e movimentações recentes.</p>
             </div>
             <div className="hidden sm:flex gap-2">
                <div className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                  Hoje: {new Date().toLocaleDateString('pt-BR')}
                </div>
             </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Income Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <TrendingUp size={80} className="text-emerald-500" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                    <ArrowUpCircle size={20} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Entradas Totais</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(stats.income)}</h3>
                <p className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
                  <span className="bg-emerald-50 px-1.5 py-0.5 rounded text-emerald-700">+{formatCurrency(stats.pendingIncome)}</span> 
                  <span className="text-slate-400">a receber</span>
                </p>
              </div>
            </div>

            {/* Expense Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <TrendingDown size={80} className="text-red-500" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-red-100 rounded-lg text-red-600">
                    <ArrowDownCircle size={20} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Saídas Totais</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(stats.expense)}</h3>
                <p className="text-xs font-medium text-red-600 mt-2 flex items-center gap-1">
                  <span className="bg-red-50 px-1.5 py-0.5 rounded text-red-700">+{formatCurrency(stats.pendingExpense)}</span> 
                  <span className="text-slate-400">a pagar</span>
                </p>
              </div>
            </div>

            {/* Balance Card */}
            <div className="bg-slate-900 p-6 rounded-2xl shadow-lg shadow-slate-300 relative overflow-hidden text-white">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Saldo Consolidado</span>
                  <h3 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">{formatCurrency(stats.balance)}</h3>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
                  <span className="text-xs text-slate-400">Fluxo Projetado</span>
                  <span className={`text-sm font-bold ${stats.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stats.balance >= 0 ? 'Positivo' : 'Atenção'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="h-[300px] w-full bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <h4 className="text-sm font-bold text-slate-900 mb-6">Evolução Financeira (7 Dias)</h4>
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <RechartsTooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    labelStyle={{color: '#64748b', marginBottom: '0.5rem', fontWeight: 600}}
                  />
                  <Area type="monotone" dataKey="Entradas" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="Saidas" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>

          {/* Recent Transactions List */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h4 className="text-base font-bold text-slate-900">Últimas Transações</h4>
              <button className="text-slate-400 hover:text-blue-600 transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Descrição</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Valor</th>
                    <th className="px-6 py-4 text-center">Comp.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                            {tx.type === 'income' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                          </div>
                          <span className="font-semibold text-slate-700 text-sm">{tx.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs font-medium uppercase tracking-wide">{tx.category}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                      <td className="px-6 py-4">
                         <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                           tx.status === 'Pendente' 
                             ? 'bg-amber-50 text-amber-600 border-amber-100' 
                             : 'bg-slate-100 text-slate-600 border-slate-200'
                         }`}>
                           {tx.status}
                         </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-bold text-sm ${
                        tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {tx.receiptAttached ? (
                          <FileText size={16} className="mx-auto text-blue-500 cursor-pointer hover:text-blue-700" />
                        ) : (
                          <span className="text-slate-300 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {transactions.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-sm">
                Nenhuma transação registrada. Utilize o formulário ao lado.
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
};

export default Dashboard;