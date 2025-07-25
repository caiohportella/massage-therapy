import { loadStripe } from "@stripe/stripe-js";
import { useCallback, useRef, useState } from "react";
import { Button } from "../ui/button";

const BuyButton = () => {
  if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined)
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");

  const [showCheckout, setShowCheckout] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  const fetchClientSecret = useCallback(() => {
    return fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: "" })
    })
  }, [])

  const handleCheckout = () => {
    setShowCheckout(true);

    modalRef.current?.showModal();
  }

  const handleCloseModal = () => {
    setShowCheckout(false);

    modalRef.current?.close();
  }

  return <div id="checkout">
    <Button onClick={handleCheckout}>Comprar</Button>
  </div>;
};
export default BuyButton;
