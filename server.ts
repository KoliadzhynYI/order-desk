import { getHourlyOrders } from "./api";
var cron = require("node-cron");
// can be set to hourly
const schedule = "*/10 * * * * *"; // Runs every 10 seconds

var task = cron.schedule(
  schedule,
  () => {
    getHourlyOrders().then((res) => {
      console.log(res);
      res.forEach((i) => console.log({ shipping: i.shipping, id: i.id }));
    });
  },
  {
    scheduled: false,
  }
);

task.start();
