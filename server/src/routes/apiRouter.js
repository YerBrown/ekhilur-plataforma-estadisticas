import { Router } from "express";
import apiCalls from "../controllers/apiCalls.js";

const router = Router();

router.get("/total-transactions", apiCalls.getTotalTransactions);
router.get("/cashback-issued-by-month-and-year", apiCalls.getCashbackIssuedByMonthAndYear);
router.get("/cashback-generated-by-type-month-and-year", apiCalls.getCashbackGeneratedByTypeMonthAndYear);
router.get("/total-cashback-by-month-and-year", apiCalls.getTotalCashbackByMonthAndYear);
router.get("/incomes-and-expenses-by-month", apiCalls.getIncomesAndExpensesByMonth);
router.get("/incomes-and-expenses-summary", apiCalls.getIncomesAndExpensesSummary);
router.get("/sales-by-month-and-year", apiCalls.getSalesByMonthAndYear);
router.get("/sales-by-type-and-year", apiCalls.getSalesByTypeAndYear);
router.get("/sales-by-type-month-and-year", apiCalls.getSalesByTypeMonthAndYear);

export default router;