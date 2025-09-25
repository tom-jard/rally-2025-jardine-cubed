import { transactions, companyActions, addTransaction } from '../../lib/data';
import { authenticateRequest } from '../../lib/auth';

export default function handler(req, res) {
  const company = authenticateRequest(req);
  if (!company) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const companyTransactions = transactions
      .filter(t => t.companyId === company.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ transactions: companyTransactions });
  } else if (req.method === 'POST') {
    const { actionId, metadata } = req.body;

    const action = companyActions.find(a =>
      a.id === actionId && a.companyId === company.id
    );

    if (!action) {
      return res.status(400).json({ error: 'Action not found' });
    }

    const transaction = addTransaction({
      value: action.value,
      companyId: company.id,
      actionId: action.id,
      actionName: action.name,
      metadata: metadata || {}
    });

    res.json({ transaction });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}