// ============================================================
// FADIMA — Types TypeScript globaux
// ============================================================

export type PaymentMethod = 'cash' | 'mobile_money' | 'other' | 'credit';
export type PaymentStatus = 'paid' | 'partial' | 'unpaid';
export type DebtStatus = 'unpaid' | 'partial' | 'paid';
export type CategoryType = 'product' | 'expense';
export type UserPlan = 'free' | 'pro' | 'business';

export interface Business {
  id: string;
  user_id: string;
  name: string;
  activity?: string;
  city?: string;
  phone?: string;
  email?: string;
  currency: string;
  country: string;
  logo_url?: string;
  description?: string;
  opening_hours?: string;
  is_public: boolean;
  plan: UserPlan;
  plan_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: CategoryType;
  color: string;
  icon?: string;
  is_default: boolean;
  created_at: string;
}

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  phone?: string;
  email?: string;
  city?: string;
  notes?: string;
  total_purchases: number;
  total_debt: number;
  last_transaction_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  category_id?: string;
  category?: Category;
  name: string;
  description?: string;
  purchase_price: number;
  selling_price: number;
  stock_quantity: number;
  min_stock_alert: number;
  unit: string;
  sku?: string;
  image_url?: string;
  is_active: boolean;
  margin?: number; // computed: selling_price - purchase_price
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string;
  user_id: string;
  customer_id?: string;
  customer?: Customer;
  sale_number?: string;
  total_amount: number;
  paid_amount: number;
  discount_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_transaction_id?: string;
  payment_gateway?: string;
  payment_phone?: string;
  notes?: string;
  items?: SaleItem[];
  sold_at: string;
  created_at: string;
  updated_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  user_id: string;
  product_id?: string;
  product?: Product;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  category_id?: string;
  category?: Category;
  category_name?: string;
  amount: number;
  description?: string;
  payment_method: string;
  spent_at: string;
  created_at: string;
  updated_at: string;
}

export interface Debt {
  id: string;
  user_id: string;
  customer_id?: string;
  customer?: Customer;
  sale_id?: string;
  customer_name: string;
  initial_amount: number;
  paid_amount: number;
  remaining_amount: number;
  due_date?: string;
  status: DebtStatus;
  notes?: string;
  payments?: DebtPayment[];
  created_at: string;
  updated_at: string;
}

export interface DebtPayment {
  id: string;
  debt_id: string;
  user_id: string;
  amount: number;
  payment_method: string;
  payment_transaction_id?: string;
  payment_gateway?: string;
  payment_phone?: string;
  notes?: string;
  paid_at: string;
  created_at: string;
}

export interface DailySummary {
  id: string;
  user_id: string;
  summary_date: string;
  total_sales: number;
  total_expenses: number;
  sales_count: number;
  profit_estimate: number;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Dashboard KPIs
// ============================================================
export interface DashboardStats {
  todaySales: number;
  todayExpenses: number;
  todayProfit: number;
  todaySalesCount: number;
  monthSales: number;
  monthExpenses: number;
  monthProfit: number;
  totalDebt: number;
  lowStockProducts: Product[];
  unpaidDebts: Debt[];
  recentSales: Sale[];
  recentExpenses: Expense[];
  chartData: ChartDataPoint[];
}

export interface ChartDataPoint {
  date: string;
  ventes: number;
  depenses: number;
}

// ============================================================
// Forms
// ============================================================
export interface SaleFormData {
  product_name: string;
  product_id?: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  customer_id?: string;
  customer_name?: string;
  payment_method: PaymentMethod;
  notes?: string;
  sold_at: string;
}

export interface ExpenseFormData {
  category_name: string;
  category_id?: string;
  amount: number;
  description?: string;
  payment_method: string;
  spent_at: string;
}

export interface DebtFormData {
  customer_name: string;
  customer_id?: string;
  initial_amount: number;
  due_date?: string;
  notes?: string;
}

export interface ProductFormData {
  name: string;
  category_id?: string;
  purchase_price: number;
  selling_price: number;
  stock_quantity: number;
  min_stock_alert: number;
  unit: string;
  description?: string;
}

// ============================================================
// Parser Conversationnel
// ============================================================
export type ParsedOperationType = 'sale' | 'expense' | 'debt' | 'unknown';

export interface ParsedOperation {
  type: ParsedOperationType;
  confidence: number; // 0-1
  data: Partial<SaleFormData | ExpenseFormData | DebtFormData>;
  rawText: string;
  displayText: string;
}

// ============================================================
// Supabase Database Types
// ============================================================
export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: Business;
        Insert: Omit<Business, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Business, 'id' | 'created_at'>>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at'>;
        Update: Partial<Omit<Category, 'id' | 'created_at'>>;
      };
      customers: {
        Row: Customer;
        Insert: Omit<Customer, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Customer, 'id' | 'created_at'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category' | 'margin'>;
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'category' | 'margin'>>;
      };
      sales: {
        Row: Sale;
        Insert: Omit<Sale, 'id' | 'created_at' | 'updated_at' | 'customer' | 'items'>;
        Update: Partial<Omit<Sale, 'id' | 'created_at' | 'customer' | 'items'>>;
      };
      sale_items: {
        Row: SaleItem;
        Insert: Omit<SaleItem, 'id' | 'created_at' | 'product'>;
        Update: Partial<Omit<SaleItem, 'id' | 'created_at'>>;
      };
      expenses: {
        Row: Expense;
        Insert: Omit<Expense, 'id' | 'created_at' | 'updated_at' | 'category'>;
        Update: Partial<Omit<Expense, 'id' | 'created_at' | 'category'>>;
      };
      debts: {
        Row: Debt;
        Insert: Omit<Debt, 'id' | 'created_at' | 'updated_at' | 'customer' | 'payments'>;
        Update: Partial<Omit<Debt, 'id' | 'created_at' | 'customer' | 'payments'>>;
      };
      debt_payments: {
        Row: DebtPayment;
        Insert: Omit<DebtPayment, 'id' | 'created_at'>;
        Update: Partial<Omit<DebtPayment, 'id' | 'created_at'>>;
      };
    };
  };
}
