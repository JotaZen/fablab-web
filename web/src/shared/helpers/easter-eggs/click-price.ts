import { useEffect, useState } from "react";

type ClickPriceOptions = {
  initialPrice?: number;
  onPrice?: () => void;
  resetPrice?: boolean;
};
const useClickPrice = ({
  initialPrice = 100,
  onPrice,
  resetPrice = false,
}: ClickPriceOptions) => {
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    if (clicks > initialPrice && onPrice) {
      onPrice();
      if (resetPrice) {
        setClicks(0);
      }
    }
  }, [clicks, initialPrice, onPrice, resetPrice]);

  return {
    clicks,
    price: initialPrice + clicks * 10,
    handleClick: () => setClicks(clicks + 1),
  };
};

export default useClickPrice;
