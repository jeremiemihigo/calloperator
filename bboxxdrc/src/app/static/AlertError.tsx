"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

type Props = {
  description?: string;
  title: string;
};
export function AlerteError({ description, title }: Props) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      {description && (
        <AlertDescription>
          <p>{description}</p>
        </AlertDescription>
      )}
    </Alert>
  );
}
