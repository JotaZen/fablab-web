import { useEffect, useState } from "react";

type ClickPriceOptions = {
  initialPrice?: number;
};
const useClickPrice = ({ initialPrice = 100 }: ClickPriceOptions) => {
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    if (clicks > initialPrice) {
      alert("¡Has alcanzado el precio máximo!");
    }
  }, [clicks, initialPrice]);

  return {
    clicks,
    price: initialPrice + clicks * 10,
    handleClick: () => setClicks(clicks + 1),
  };
};

export default useClickPrice;
