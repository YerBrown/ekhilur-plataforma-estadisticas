import { Router } from "express";
import apiCalls from "../controllers/apiCalls.js";
import { checkAuthorization } from "../helpers/middleware.js";

const router = Router();

router.get(
    "/total-transactions",
    checkAuthorization,
    apiCalls.getTotalTransactions
);
router.get(
    "/total-cashback-by-month",
    checkAuthorization,
    apiCalls.getCashbackIssuedByMonth
);
router.get(
    "/total-cashback-by-year",
    checkAuthorization,
    apiCalls.getCashbackIssuedByYear
);
router.get(
    "/cashback-generated-by-month",
    checkAuthorization,
    apiCalls.getCashbackGeneratedByMonth
);
router.get(
    "/cashback-generated-by-year",
    checkAuthorization,
    apiCalls.getCashbackGeneratedByYear
);

//////////////
router.get(
    "/incomes-and-expenses-by-month",
    checkAuthorization,
    apiCalls.getIncomesAndExpensesByMonth
);
router.get(
    "/incomes-and-expenses-by-year",
    checkAuthorization,
    apiCalls.getIncomesAndExpensesByYear
);
router.get(
    "/expenses-category-summary",
    checkAuthorization,
    apiCalls.getExpensesSummary
);
////////////
router.get("/sales-by-month", checkAuthorization, apiCalls.getSalesByMonth);
router.get("/sales-by-year", checkAuthorization, apiCalls.getSalesByYear);

export default router;
