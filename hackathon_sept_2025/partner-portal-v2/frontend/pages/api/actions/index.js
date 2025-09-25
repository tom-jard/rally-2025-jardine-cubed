import { addAction } from '../../../lib/data';
import { authenticateRequest } from '../../../lib/auth';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const company = authenticateRequest(req);
  if (!company) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { name, value, description } = req.body;

  if (!name || !value) {
    return res.status(400).json({ error: 'Missing name or value' });
  }

  const newAction = addAction({
    companyId: company.id,
    name,
    value,
    description: description || ''
  });

  res.json({ action: newAction });
}