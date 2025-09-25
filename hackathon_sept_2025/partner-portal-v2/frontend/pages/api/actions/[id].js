import { companyActions } from '../../../lib/data';
import { authenticateRequest } from '../../../lib/auth';

export default function handler(req, res) {
  const { id } = req.query;
  const company = authenticateRequest(req);

  if (!company) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'PUT') {
    const { value, name, description } = req.body;

    const actionIndex = companyActions.findIndex(a =>
      a.id === parseInt(id) && a.companyId === company.id
    );

    if (actionIndex === -1) {
      return res.status(404).json({ error: 'Action not found' });
    }

    companyActions[actionIndex] = {
      ...companyActions[actionIndex],
      value: value || companyActions[actionIndex].value,
      name: name || companyActions[actionIndex].name,
      description: description || companyActions[actionIndex].description
    };

    res.json({ action: companyActions[actionIndex] });
  } else if (req.method === 'DELETE') {
    const actionIndex = companyActions.findIndex(a =>
      a.id === parseInt(id) && a.companyId === company.id
    );

    if (actionIndex === -1) {
      return res.status(404).json({ error: 'Action not found' });
    }

    companyActions.splice(actionIndex, 1);
    res.json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}