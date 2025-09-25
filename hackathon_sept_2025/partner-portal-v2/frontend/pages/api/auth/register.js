import { companies, addCompany } from '../../../lib/data';
import { createToken } from '../../../lib/auth';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const existing = companies.find(c => c.email === email);
  if (existing) {
    return res.status(400).json({ error: 'Company already exists' });
  }

  const newCompany = addCompany({ name, email, password });
  const token = createToken(newCompany);

  res.json({
    token,
    company: { id: newCompany.id, email: newCompany.email, name: newCompany.name }
  });
}