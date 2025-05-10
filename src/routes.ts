import { Router, Request, Response } from 'express';
import { checkWord } from './domain';

export const router = Router();

router.get('/api', (req: Request, res: Response) => {
  const guess = req.query.guess!.toString();
  res.json({ result: checkWord(guess) });
});
