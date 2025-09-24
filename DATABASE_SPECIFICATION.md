# SoFi Rewards App - Database & API Specification

## Project Overview

**App Purpose**: Connect financial accounts (SoFi, etc.) to popular mobile games (Monopoly GO, Madden Mobile) and reward users with in-game items for positive financial behaviors.

**Demo Scope**: In-memory database with realistic sample data to demonstrate core functionality without external API dependencies.

---

## Core Database Schema

### 1. Users Table
Stores basic user information and preferences.

```typescript
interface User {
  user_id: string;           // UUID
  email: string;             // Unique identifier
  full_name?: string;        // Optional display name
  created_at: Date;          // Account creation timestamp
  subscription_tier: 'free' | 'premium' | 'pro';
  total_rewards_earned: number;  // Lifetime count for gamification
  last_active: Date;         // For engagement tracking
}
```

### 2. Connected Accounts
Simulates financial accounts connected via Plaid (SoFi, Chase, etc.)

```typescript
interface ConnectedAccount {
  account_id: string;        // UUID
  user_id: string;           // References User
  institution_name: string;  // "SoFi", "Chase", "Wells Fargo"
  account_type: 'checking' | 'savings' | 'credit' | 'investment' | 'loan';
  account_name: string;      // "SoFi High Yield Savings"
  current_balance: number;   // Current account balance
  last_updated: Date;        // When balance was last synced
  connection_status: 'active' | 'error' | 'requires_reauth';
}
```

### 3. Financial Transactions
Raw transaction data that feeds into action detection.

```typescript
interface FinancialTransaction {
  transaction_id: string;    // UUID
  account_id: string;        // References ConnectedAccount
  user_id: string;           // References User
  amount: number;            // Positive for deposits, negative for withdrawals
  description: string;       // "Direct Deposit", "Transfer to Savings"
  category: string[];        // ["Transfer", "Deposit"] - Plaid-style categories
  transaction_date: Date;    // When transaction occurred
  pending: boolean;          // Is transaction still pending
  merchant_name?: string;    // If applicable
}
```

### 4. Financial Actions
Processed events that trigger rewards (derived from transactions).

```typescript
interface FinancialAction {
  action_id: string;         // UUID
  user_id: string;           // References User
  source_transaction_id?: string; // Optional reference to triggering transaction
  action_type: string;       // Defined action types (see below)
  action_value: number;      // Dollar amount or relevant metric
  source_platform: string;  // "sofi", "chase", "wells_fargo"
  detected_at: Date;         // When our system detected this action
  metadata: Record<string, any>; // Additional context
  reward_eligible: boolean;  // Whether this qualifies for rewards
}
```

### 5. Game Rewards
Rewards earned and their delivery status.

```typescript
interface GameReward {
  reward_id: string;         // UUID
  user_id: string;           // References User
  source_action_id: string;  // References FinancialAction
  target_game: string;       // Game identifier (see supported games)
  reward_type: string;       // Game-specific reward type
  quantity: number;          // How many of this reward
  conversion_rate: number;   // How much $ earned this reward
  status: 'pending' | 'delivered' | 'expired' | 'failed';
  created_at: Date;
  delivered_at?: Date;
  delivery_method: 'api' | 'promo_code' | 'gift_card' | 'manual';
  delivery_reference?: string; // Promo code or transaction ID
}
```

### 6. Reward Conversion Rules
Business logic for converting financial actions to game rewards.

```typescript
interface RewardRule {
  rule_id: string;           // UUID
  rule_name: string;         // Human-readable name
  source_platform: string;  // Which bank/platform
  action_type: string;       // Which financial action
  target_game: string;       // Which game
  reward_type: string;       // What type of reward
  conversion_rate: number;   // $ amount per 1 reward unit
  minimum_amount: number;    // Minimum $ to trigger reward
  maximum_daily: number;     // Max rewards per day (0 = unlimited)
  is_active: boolean;        // Can be toggled on/off
  created_at: Date;
}
```

---

## Supported Financial Action Types

### SoFi Specific Actions
```typescript
type SoFiActionType = 
  | 'sofi_savings_deposit'      // Money moved to savings
  | 'sofi_investment_purchase'  // Stock/ETF purchase
  | 'sofi_loan_payment'         // Student/personal loan payment
  | 'sofi_direct_deposit'       // Paycheck deposit
  | 'sofi_credit_payment'       // Credit card payment
  | 'sofi_recurring_save'       // Automated savings transfer
```

### Universal Actions (Any Bank)
```typescript
type UniversalActionType = 
  | 'emergency_fund_contribution' // Building emergency savings
  | 'debt_payment_extra'          // Paying more than minimum
  | 'investment_increase'         // Increasing investment amount
  | 'bill_autopay_setup'         // Setting up automatic payments
  | 'high_balance_maintain'      // Keeping high balance for X days
```

---

## Supported Games & Rewards

### Monopoly GO
```typescript
interface MonopolyGORewards {
  dice_rolls: number;        // Primary currency
  cash: number;              // In-game money
  stickers: number;          // Collection items
  energy: number;            // Action points
  shields: number;           // Protection items
}
```

### Madden Mobile
```typescript
interface MaddenMobileRewards {
  coins: number;             // Primary currency
  cash: number;              // Premium currency
  stamina: number;           // Energy for playing
  player_packs: number;      // Loot boxes
  training_points: number;   // Upgrade currency
}
```

### Future Games (Placeholder)
```typescript
interface GenericGameRewards {
  primary_currency: number;
  premium_currency: number;
  energy: number;
  loot_boxes: number;
}
```

---

## Sample Data Requirements

### Demo Users (5-10 users)
```typescript
const demoUsers: User[] = [
  {
    user_id: "user_1",
    email: "john.smith@email.com",
    full_name: "John Smith",
    subscription_tier: "premium",
    total_rewards_earned: 1250,
    created_at: new Date("2024-01-15"),
    last_active: new Date("2024-01-24")
  },
  {
    user_id: "user_2", 
    email: "sarah.jones@email.com",
    full_name: "Sarah Jones",
    subscription_tier: "free",
    total_rewards_earned: 340,
    created_at: new Date("2024-01-18"),
    last_active: new Date("2024-01-25")
  }
  // ... more users
];
```

### Connected Accounts (Multiple per user)
```typescript
const demoAccounts: ConnectedAccount[] = [
  {
    account_id: "acc_1",
    user_id: "user_1",
    institution_name: "SoFi",
    account_type: "savings",
    account_name: "SoFi High Yield Savings",
    current_balance: 12500.50,
    last_updated: new Date("2024-01-25T08:00:00Z"),
    connection_status: "active"
  },
  {
    account_id: "acc_2",
    user_id: "user_1", 
    institution_name: "SoFi",
    account_type: "checking",
    account_name: "SoFi Checking",
    current_balance: 2340.75,
    last_updated: new Date("2024-01-25T08:00:00Z"),
    connection_status: "active"
  }
  // ... more accounts across different users and institutions
];
```

### Recent Transactions (Last 30 days)
Include realistic transaction patterns:
- Direct deposits (payroll)
- Transfers to savings
- Investment purchases  
- Loan payments
- Credit card payments
- Regular spending (groceries, gas, etc.)

### Financial Actions (Reward-eligible events)
```typescript
const demoActions: FinancialAction[] = [
  {
    action_id: "action_1",
    user_id: "user_1",
    source_transaction_id: "txn_123",
    action_type: "sofi_savings_deposit",
    action_value: 500.00,
    source_platform: "sofi",
    detected_at: new Date("2024-01-24T10:30:00Z"),
    metadata: { 
      account_type: "high_yield_savings",
      is_automated: false,
      previous_balance: 12000.50
    },
    reward_eligible: true
  }
  // ... more actions
];
```

### Earned Rewards (Mix of delivered and pending)
Show various reward states and games to demonstrate the full system.

---

## API Endpoints Specification

### User Management
```typescript
// Get user profile with summary stats
GET /api/users/{user_id}
Response: User & { 
  total_accounts: number,
  total_rewards_pending: number,
  total_rewards_delivered: number
}

// Get all users (for demo dashboard)
GET /api/users
Response: User[]
```

### Account Management  
```typescript
// Get user's connected accounts
GET /api/users/{user_id}/accounts
Response: ConnectedAccount[]

// Get account balance history (simulated)
GET /api/accounts/{account_id}/balance-history
Response: { date: Date, balance: number }[]
```

### Transaction & Action Tracking
```typescript
// Get user's recent transactions
GET /api/users/{user_id}/transactions?limit=50&offset=0
Response: FinancialTransaction[]

// Get user's financial actions (reward-eligible events)
GET /api/users/{user_id}/actions?days=30
Response: FinancialAction[]

// Simulate new financial action (for demo purposes)
POST /api/simulate-action
Body: {
  user_id: string,
  action_type: string,
  amount: number,
  platform: string
}
Response: { action: FinancialAction, rewards: GameReward[] }
```

### Rewards System
```typescript
// Get user's earned rewards
GET /api/users/{user_id}/rewards?status=all&game=all
Response: GameReward[]

// Get rewards summary by game
GET /api/users/{user_id}/rewards/summary
Response: {
  [game: string]: {
    total_rewards: number,
    pending_rewards: number,
    total_value: number
  }
}

// Simulate reward delivery (for demo)
POST /api/rewards/{reward_id}/deliver
Response: { success: boolean, delivery_reference?: string }
```

### Analytics & Insights
```typescript
// User dashboard data
GET /api/users/{user_id}/dashboard
Response: {
  recent_actions: FinancialAction[],
  pending_rewards: GameReward[],
  monthly_savings: number,
  reward_streak: number,
  next_milestone: { target: number, progress: number }
}

// Admin analytics (for demo)
GET /api/analytics/overview
Response: {
  total_users: number,
  total_rewards_delivered: number,
  total_value_delivered: number,
  top_performing_actions: { action_type: string, count: number }[],
  popular_games: { game: string, reward_count: number }[]
}
```

---

## Frontend Integration Requirements

### React Component Props
```typescript
// User Dashboard Component
interface UserDashboardProps {
  user: User;
  accounts: ConnectedAccount[];
  recentActions: FinancialAction[];
  pendingRewards: GameReward[];
  onSimulateAction: (actionType: string, amount: number) => void;
}

// Rewards Component  
interface RewardsComponentProps {
  rewards: GameReward[];
  onClaimReward: (rewardId: string) => void;
  onFilterByGame: (game: string) => void;
  games: string[];
}

// Account List Component
interface AccountListProps {
  accounts: ConnectedAccount[];
  onRefreshAccount: (accountId: string) => void;
  showBalances: boolean;
}
```

### State Management
```typescript
// Global App State
interface AppState {
  currentUser: User | null;
  accounts: ConnectedAccount[];
  transactions: FinancialTransaction[];
  actions: FinancialAction[];
  rewards: GameReward[];
  rewardRules: RewardRule[];
  loading: boolean;
  error: string | null;
}

// Actions
type AppAction = 
  | { type: 'SET_USER', payload: User }
  | { type: 'SET_ACCOUNTS', payload: ConnectedAccount[] }
  | { type: 'ADD_ACTION', payload: FinancialAction }
  | { type: 'UPDATE_REWARD', payload: GameReward }
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_ERROR', payload: string }
```

---

## Database Implementation Notes

### File Structure
```
src/
  database/
    schema.ts           // TypeScript interfaces
    mockData.ts         // Sample data
    database.ts         // In-memory database class
    queries.ts          // Common query functions
    seedData.ts         // Data initialization
```

### In-Memory Database Class
```typescript
class MockDatabase {
  private users: Map<string, User>
  private accounts: Map<string, ConnectedAccount>
  private transactions: Map<string, FinancialTransaction>
  private actions: Map<string, FinancialAction>
  private rewards: Map<string, GameReward>
  private rules: Map<string, RewardRule>

  // CRUD operations for each entity
  // Relationship queries (get user's accounts, etc.)
  // Search and filter methods
  // Simulation methods (add new actions, process rewards)
}
```

### Key Methods Required
```typescript
// User operations
getUser(userId: string): User | null
getUserByEmail(email: string): User | null
createUser(userData: Partial<User>): User

// Account operations  
getUserAccounts(userId: string): ConnectedAccount[]
getAccount(accountId: string): ConnectedAccount | null
updateAccountBalance(accountId: string, balance: number): void

// Transaction operations
getUserTransactions(userId: string, limit?: number): FinancialTransaction[]
getAccountTransactions(accountId: string): FinancialTransaction[]
addTransaction(transaction: Omit<FinancialTransaction, 'transaction_id'>): FinancialTransaction

// Action & Reward operations
getUserActions(userId: string, days?: number): FinancialAction[]
processAction(actionData: Omit<FinancialAction, 'action_id'>): { action: FinancialAction, rewards: GameReward[] }
getUserRewards(userId: string, status?: string, game?: string): GameReward[]
claimReward(rewardId: string): boolean

// Analytics
getAnalytics(): AnalyticsData
getUserDashboard(userId: string): DashboardData
```

---

## Demo Scenarios

### Scenario 1: New User Journey
1. User signs up and connects SoFi account
2. System shows current balance and recent transactions
3. User transfers $200 to savings
4. System detects action and awards Monopoly GO dice
5. User claims reward and sees delivery confirmation

### Scenario 2: Power User Dashboard
1. Show user with multiple accounts and games
2. Display reward history and totals
3. Show streak counters and milestones
4. Demonstrate different reward types

### Scenario 3: Admin Analytics View
1. Show system-wide statistics
2. Most popular actions and games
3. Total value delivered
4. User engagement metrics

---

## Error Handling & Edge Cases

### Database Errors
- Handle missing users/accounts gracefully
- Validate data integrity (e.g., rewards reference valid actions)
- Prevent duplicate rewards for same action

### Business Logic
- Daily reward limits
- Minimum action amounts
- Invalid action types
- Expired reward rules

### UI States
- Loading states for async operations
- Empty states (no rewards, no accounts)
- Error states with retry options
- Success confirmations

---

## Future Production Considerations

### Migration Path
- Schema is designed to be compatible with PostgreSQL
- All UUIDs can be replaced with database-generated IDs
- JSON metadata fields map to JSONB columns
- Indexes can be added for performance

### Security Additions
- User authentication and authorization
- Encrypted sensitive data fields
- Rate limiting on reward claims
- Audit logging for all actions

### Scalability Features
- Connection pooling
- Read replicas for analytics
- Caching layer for frequently accessed data
- Background job processing for reward calculations

---

This specification provides everything needed to build a fully functional demo database that showcases the SoFi rewards concept while being easily extensible to a production system.
