"use client"

import { RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "../ui/button";

interface Props {
  onClick: () => void;
}

export default function RefreshButton(props: Props) {
  const [isSpinning, setIsSpinning] = useState(false);
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onRefresh = () => {
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }

    setIsSpinning(true);

    spinTimeoutRef.current = setTimeout(() => {
      setIsSpinning(false);
      spinTimeoutRef.current = null;
    }, 1000);
    props.onClick()
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onRefresh}
    >
      <RotateCcw className={`w-5 h-5 ${isSpinning ? 'spin' : ''}`} />
    </Button>
  );
};
