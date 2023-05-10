import { getHourlyOrders } from "./api";

getHourlyOrders().then((res) =>
  res.forEach((i) => console.log({ name: i.name, id: i.id }))
);
