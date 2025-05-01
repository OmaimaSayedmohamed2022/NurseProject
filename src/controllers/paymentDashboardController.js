import Transaction from "../models/transactionModel.js";
import catchAsync from "../utilites/catchAsync.js";
import moment from "moment";

// Statistics
export const getPaymentStats = catchAsync(async (req, res) => {
  const { range = "today" } = req.query;

  let start, end, hours = [];

  if (range === "today") {
    start = moment().startOf("day").toDate();
    end = moment().endOf("day").toDate();
    hours = Array.from({ length: 13 }, (_, i) => 10 + i); // 10AM - 10PM
  } else if (range === "week") {
    start = moment().startOf("week").toDate();
    end = moment().endOf("day").toDate(); 
    hours = Array.from({ length: 7 }, (_, i) => moment().startOf("week").add(i, 'days').format("dddd")); 
  } else {
    return res.status(400).json({ success: false, message: "Invalid range" });
  }

  const transactions = await Transaction.find({
    paymentStatus: "paid",
    createdAt: { $gte: start, $lte: end }
  });

  const result = hours.map((label) => ({ label, value: 0 }));

  transactions.forEach(tx => {
    const date = new Date(tx.createdAt);
    if (range === "today") {
      const hour = date.getHours();
      if (hour >= 10 && hour <= 22) {
        result[hour - 10].value += tx.amount;
      }
    } else {
      const day = moment(date).format("dddd");
      const idx = result.findIndex(r => r.label === day);
      if (idx !== -1) {
        result[idx].value += tx.amount;
      }
    }
  });

  res.status(200).json({ success: true, data: result });
});


// Detail Payments


