import { companies } from '../../../lib/data';
import { createToken } from '../../../lib/auth';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  const company = companies.find(c => c.email === email && c.password === password);
  if (!company) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = createToken(company);

  res.json({
    token,
    company: { id: company.id, email: company.email, name: company.name }
  });
}