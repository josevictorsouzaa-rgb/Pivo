export interface AuditLogEntry {
  id: string;
  date: string;
  action: 'created' | 'updated' | 'paid' | 'cancelled' | 'comment' | 'attachment';
  userId: string;
  userName: string;
  userAvatar?: string;
  details?: string;
}

export interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  status: 'Pago' | 'Recebido' | 'Pendente' | 'Cancelado';
  type: 'income' | 'expense';
  
  cancellationReason?: string; // Reason for cancellation

  // Files
  quoteFile?: File | null; // Orçamento (Optional at creation)
  receiptFile?: File | null; // Comprovante (Added when paid)
  receiptAttached: boolean; // Computed or legacy flag
  
  isReimbursement?: boolean;
  reimbursementUser?: string;
  costCenterId?: string;
  companyId?: string;
  
  createdByName?: string;
  createdByAvatar?: string;
  createdById?: string;
  
  auditLog: AuditLogEntry[]; // The timeline
}

export interface ExpenseStat {
  label: string;
  value: string;
  subtext: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
}

export interface SectorData {
  name: string;
  value: number;
  color: string;
}

export interface CorporateCard {
  id: string;
  alias: string;
  last4: string;
  holder: string;
  expiry: string;
  company: string; 
  status: 'active' | 'inactive';
  brand: 'visa' | 'mastercard' | 'amex' | 'elo' | 'hipercard' | 'diners' | 'alelo' | 'ticket' | 'sodexo';
  color: 'blue' | 'black' | 'purple' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'indigo' | 'slate' | 'zinc';
  limit: number;
}

export interface BankAccount {
  id: string;
  name: string; 
  bankName: string; 
  company: string; 
  status: 'active' | 'inactive';
}

export interface Company {
  id: string;
  tradeName: string; 
  legalName: string; 
  cnpj: string;
  address: string;
  status: 'active' | 'inactive';
}

export interface BudgetHistory {
  date: string;
  previousBudget: number;
  newBudget: number;
  reason?: string;
}

export interface CostCenter {
  id: string;
  code: string;
  name: string;
  manager: string;
  status: 'active' | 'inactive';
  monthlyBudget: number;
  limitValue: number; 
  budgetHistory: BudgetHistory[];
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Added for verification logic
  role: 'admin' | 'user';
  isFirstLogin: boolean;
  avatarUrl?: string;
}

export type ViewState = 'hub' | 'settings';