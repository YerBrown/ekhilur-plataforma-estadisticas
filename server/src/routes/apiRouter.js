import { Router } from "express";
import apiCalls from "../controllers/apiCalls.js";
import { checkAuthorization } from "../helpers/middleware.js";

const router = Router();

router.get("/total-transactions", checkAuthorization, apiCalls.getTotalTransactions);
router.get("/cashback-issued-by-month-and-year", checkAuthorization, apiCalls.getCashbackIssuedByMonthAndYear);
router.get("/cashback-generated-by-type-month-and-year", checkAuthorization, apiCalls.getCashbackGeneratedByTypeMonthAndYear);
router.get("/total-cashback-by-month-and-year", checkAuthorization, apiCalls.getTotalCashbackByMonthAndYear);
router.get("/incomes-and-expenses-by-month", checkAuthorization, apiCalls.getIncomesAndExpensesByMonth);
router.get("/incomes-and-expenses-summary", checkAuthorization, apiCalls.getIncomesAndExpensesSummary);
router.get("/sales-by-month-and-year", checkAuthorization, apiCalls.getSalesByMonthAndYear);
router.get("/sales-by-type-and-year", checkAuthorization, apiCalls.getSalesByTypeAndYear);
router.get("/sales-by-type-month-and-year", checkAuthorization, apiCalls.getSalesByTypeMonthAndYear);

export default router;