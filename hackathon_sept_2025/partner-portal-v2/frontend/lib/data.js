// In-memory data store for the application
export const companies = [
  {
    id: 1,
    name: 'Acme Corp',
    email: 'acme@company.com',
    password: 'password'
  },
  {
    id: 2,
    name: 'TechStart Inc',
    email: 'admin@techstart.com',
    password: 'password'
  }
];

export const companyActions = [
  { id: 1, companyId: 1, name: 'Open Savings Account', value: '50.00', description: 'Customer opens a new savings account with minimum deposit' },
  { id: 2, companyId: 1, name: 'Open Checking Account', value: '25.00', description: 'Customer opens a new checking account' },
  { id: 3, companyId: 1, name: 'Set Up Direct Deposit', value: '75.00', description: 'Customer sets up direct deposit into their account' },
  { id: 4, companyId: 1, name: 'Open IRA Account', value: '100.00', description: 'Customer opens a new Individual Retirement Account' },
  { id: 5, companyId: 1, name: 'Open CD Account', value: '80.00', description: 'Customer opens a Certificate of Deposit with $1,000+ deposit' },
  { id: 6, companyId: 1, name: 'Login Daily Streak', value: '5.00', description: 'Customer logs into mobile app for 7 consecutive days' },
  { id: 7, companyId: 1, name: 'Set Up Auto-Save', value: '30.00', description: 'Customer enables automatic savings transfers' },
  { id: 8, companyId: 1, name: 'Credit Card Application', value: '125.00', description: 'Customer applies for and is approved for credit card' },
  { id: 9, companyId: 1, name: 'Investment Account', value: '150.00', description: 'Customer opens investment/brokerage account with initial funding' },
  { id: 10, companyId: 1, name: 'Mortgage Application', value: '500.00', description: 'Customer completes mortgage application process' },
  { id: 11, companyId: 1, name: 'Bill Pay Setup', value: '20.00', description: 'Customer sets up automatic bill pay for utilities/services' },
  { id: 12, companyId: 1, name: 'Referral Program', value: '25.00', description: 'Customer refers a friend who opens an account' },
  { id: 13, companyId: 2, name: 'Account Creation', value: '20.00', description: 'New account created' },
  { id: 14, companyId: 2, name: 'First Transaction', value: '35.00', description: 'First transaction completed' }
];

export let transactions = [
  { id: 1, companyId: 1, actionId: 8, actionName: 'Credit Card Application', value: '125', user: 'Amanda White', timestamp: '2024-01-18T06:15:00Z' },
  { id: 2, companyId: 1, actionId: 1, actionName: 'Open Savings Account', value: '50', user: 'Ryan Thomas', timestamp: '2024-01-18T04:30:00Z' },
  { id: 3, companyId: 1, actionId: 12, actionName: 'Referral Program', value: '25', user: 'Jessica Martinez', timestamp: '2024-01-17T12:10:00Z' },
  { id: 4, companyId: 1, actionId: 3, actionName: 'Set Up Direct Deposit', value: '75', user: 'Chris Taylor', timestamp: '2024-01-17T10:25:00Z' },
  { id: 5, companyId: 1, actionId: 9, actionName: 'Investment Account', value: '150', user: 'Lisa Anderson', timestamp: '2024-01-17T08:40:00Z' },
  { id: 6, companyId: 1, actionId: 4, actionName: 'Open IRA Account', value: '100', user: 'Alex Rodriguez', timestamp: '2024-01-17T05:15:00Z' },
  { id: 7, companyId: 1, actionId: 2, actionName: 'Open Checking Account', value: '25', user: 'Emily Davis', timestamp: '2024-01-17T03:20:00Z' },
  { id: 8, companyId: 1, actionId: 5, actionName: 'Open CD Account', value: '80', user: 'David Brown', timestamp: '2024-01-16T11:30:00Z' },
  { id: 9, companyId: 1, actionId: 7, actionName: 'Set Up Auto-Save', value: '30', user: 'Sarah Wilson', timestamp: '2024-01-16T06:45:00Z' },
  { id: 10, companyId: 1, actionId: 6, actionName: 'Login Daily Streak', value: '5', user: 'Michael Johnson', timestamp: '2024-01-16T14:20:00Z' },
  { id: 11, companyId: 1, actionId: 11, actionName: 'Bill Pay Setup', value: '20', user: 'Ashley Chen', timestamp: '2024-01-15T09:45:00Z' },
  { id: 12, companyId: 1, actionId: 10, actionName: 'Mortgage Application', value: '500', user: 'Robert Garcia', timestamp: '2024-01-15T16:30:00Z' }
];
export let nextTransactionId = 13;

export function addTransaction(transaction) {
  const newTransaction = {
    ...transaction,
    id: nextTransactionId++,
    timestamp: new Date().toISOString()
  };
  transactions.push(newTransaction);
  return newTransaction;
}

export function addCompany(company) {
  const newCompany = {
    ...company,
    id: companies.length + 1
  };
  companies.push(newCompany);
  return newCompany;
}

export function addAction(action) {
  const newAction = {
    ...action,
    id: Math.max(...companyActions.map(a => a.id), 0) + 1
  };
  companyActions.push(newAction);
  return newAction;
}