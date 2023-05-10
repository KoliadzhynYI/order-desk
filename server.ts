import { getHourlyOrders } from "./api";

getHourlyOrders().then((res) => {
  console.log(res);
  res.forEach((i) => console.log({ shipping: i.shipping, id: i.id }));
});
