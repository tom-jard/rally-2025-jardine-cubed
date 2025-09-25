import { companyActions } from '../../lib/data';
import { authenticateRequest } from '../../lib/auth';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const company = authenticateRequest(req);
  if (!company) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const actions = companyActions.filter(a => a.companyId === company.id);
  res.json({
    actions,
    company
  });
}