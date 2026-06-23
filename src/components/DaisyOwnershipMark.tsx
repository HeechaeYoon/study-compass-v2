import { useRef, useState } from "react";
import { DAISY_COPYRIGHT_TEXT } from "../data/ownership";

const HIDDEN_ADMIN_CLICK_COUNT = 7;
const HIDDEN_ADMIN_WINDOW_MS = 4000;

type DaisyOwnershipMarkProps = {
  onAdminRequest: () => void;
};

export function DaisyOwnershipMark({ onAdminRequest }: DaisyOwnershipMarkProps) {
  const firstActivationAtRef = useRef(0);
  const [activationCount, setActivationCount] = useState(0);

  function handleActivate(): void {
    const now = Date.now();
    const withinWindow =
      firstActivationAtRef.current > 0 &&
      now - firstActivationAtRef.current <= HIDDEN_ADMIN_WINDOW_MS;
    const nextCount = withinWindow ? activationCount + 1 : 1;

    firstActivationAtRef.current = withinWindow ? firstActivationAtRef.current : now;
    setActivationCount(nextCount);

    if (nextCount >= HIDDEN_ADMIN_CLICK_COUNT) {
      firstActivationAtRef.current = 0;
      setActivationCount(0);
      onAdminRequest();
    }
  }

  return (
    <button
      className="daisyOwnershipMark"
      type="button"
      aria-label={DAISY_COPYRIGHT_TEXT}
      onClick={handleActivate}
    >
      {DAISY_COPYRIGHT_TEXT}
    </button>
  );
}
