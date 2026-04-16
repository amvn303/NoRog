// ============================================================
// History Controller — Returns recent history entries
// ============================================================

import { getHistory } from "../services/historyService.js";

export const fetchHistory = (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  return res.json({
    success: true,
    data: getHistory().slice(-limit).reverse()
  });
};