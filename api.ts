import axios from "axios";
// can be get from .env file
const storeId = "53642";
const apiKey = "wgLNjnE8zLZwPQXFeC7mPcEkdh3ripk5WvemgBFQp2yXzFjvRx";
axios.defaults.baseURL = "https://app.orderdesk.me/api/v2";

// main function that fires with crone job
export const getHourlyOrders = async () => {
  let allOrders: any[] = [];
  // date we should get now, but hard code for testing time when cron probably start "May 10, 2023 18:01:18"
  const date = new Date("May 10, 2023 18:01:18");
  // can be more readable using momentjs
  const search_start_date = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours() - 1,
    0,
    0
  );
  // can be more readable using momentjs
  const search_end_date = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours() - 1,
    59,
    59
  );
  let initialTaken = 0;
  const getAllOrders = async (offset = 0, limit = 500) => {
    initialTaken += limit;
    try {
      const { data } = await axios.get("/orders", {
        headers: {
          "ORDERDESK-STORE-ID": storeId,
          "ORDERDESK-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        params: {
          // range We can extend the range and search_start_date will be  a couple of mins behind to be sure that we didn`t miss any orders          search_start_date,
          search_start_date,
          search_end_date,
          limit,
          offset,
        },
      });

      const orders = data.orders;
      allOrders.push(...orders);
      // to know if we should take more
      const isNextPage = data.total_records > initialTaken;
      const newOffset = offset + limit;
      if (isNextPage) {
        await getAllOrders(newOffset, limit);
      }
    } catch (error) {
      console.error("Error retrieving orders:", error);
    }
  };
  await getAllOrders(0, 1);
  return allOrders;
};
