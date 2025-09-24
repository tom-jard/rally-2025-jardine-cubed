# SoFi Integration Workflow (Frontend + Backend)

## 1. User Initiates Connection (Frontend)
User clicks "Connect SoFi" in your app.

Frontend (React, Vue, iOS, Android, etc.) calls your backend to request a link token.

## 2. Backend Creates Link Token
Backend calls Plaid `/link/token/create` with your Sandbox credentials:

```json
{
  "client_id": "68d44d11d58efa00251413e1",
  "secret": "047a640b4e33dc44257278f7f9a718",
  "user": {
    "client_user_id": "unique-user-id"
  },
  "client_name": "MyApp",
  "products": ["transactions", "balance", "identity"],
  "country_codes": ["US"],
  "language": "en",
  "institution_id": "ins_3"  // SoFi only
}
```

Plaid returns a short-lived `link_token`.

Backend sends this `link_token` back to the frontend.

## 3. Launch Plaid Link (Frontend)
Frontend launches Plaid Link UI with the `link_token`.

User logs in to SoFi via Plaid's secure UI.

Plaid handles MFA if required.

⚡ **Your app never sees the user's credentials — Plaid manages this securely.**

## 4. Plaid Returns public_token (Frontend → Backend)
On successful login, Plaid sends a `public_token` to the frontend.

Frontend immediately sends `public_token` to your backend.

## 5. Backend Exchanges for access_token
Backend calls Plaid `/item/public_token/exchange` with `public_token`.

Plaid responds with:
- `access_token` → long-lived token for querying account data
- `item_id` → Plaid's unique ID for this connection

Store `access_token` securely (encrypted).

**Never send `access_token` to frontend.**

## 6. Fetch Account Data (Backend → Plaid)
With `access_token`, backend can call Plaid APIs:

- `/accounts/get` → account details (SoFi checking/savings/investment/credit)
- `/accounts/balance/get` → real-time balances
- `/transactions/get` → transaction history
- `/identity/get` → account holder name, email, phone, address
- `/investments/holdings/get` → SoFi Invest holdings

## 7. Backend Returns Data to Frontend
Backend parses Plaid API responses.

Sends only necessary data to frontend (e.g., balances, recent transactions).

Frontend displays account info in your app.