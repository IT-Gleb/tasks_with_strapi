"use client";

const TotalOrderPrice = ({ totalPrice }: { totalPrice: number }) => {
  return (
    <div className="w-full mt-10 p-2 text-right">
      <span className="font-bold text-sm pr-5">Сумма заказа: </span>
      {Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(totalPrice)}
    </div>
  );
};

export default TotalOrderPrice;
