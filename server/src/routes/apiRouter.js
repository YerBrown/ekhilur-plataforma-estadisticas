import { Router } from "express";
import apiCalls from "../controllers/apiCalls.js";
import { checkAuthorization } from "../helpers/middleware.js";

const router = Router();

router.get("/user-info", checkAuthorization, apiCalls.getUserInfo);
router.get("/user-accounts", checkAuthorization, apiCalls.getUserAccounts);
router.get("/total-cashbacks-by-month", checkAuthorization, apiCalls.getCashbacksIssuedByMonth);
router.get("/total-cashbacks-by-year", checkAuthorization, apiCalls.getCashbacksIssuedByYear);
router.get("/cashback-generated-by-month", checkAuthorization, apiCalls.getCashbackGeneratedByMonth);
router.get("/cashback-generated-by-year", checkAuthorization, apiCalls.getCashbackGeneratedByYear);
router.get("/category-expenses-by-month", checkAuthorization, apiCalls.getCategoryExpensesByMonth);
router.get("/incomes-and-expenses-by-month", checkAuthorization, apiCalls.getIncomesAndExpensesByMonth);
router.get("/incomes-and-expenses-by-year", checkAuthorization, apiCalls.getIncomesAndExpensesByYear);
router.get("/sales-by-month", checkAuthorization, apiCalls.getSalesByMonth);
router.get("/sales-by-year", checkAuthorization, apiCalls.getSalesByYear);

export default router;
