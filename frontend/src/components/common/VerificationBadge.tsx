"use client";

import React from "react";
import { ShieldCheck, AlertCircle, Clock, ExternalLink } from "lucide-react";
import { ContentStatus, Source } from "@/lib/types";
import { useI18n } from "@/lib/i18n/context";

interface Props {
  status: ContentStatus;
  lastVerifiedAt?: string;
  source?: Source;
  compact?: boolean;
}

export const VerificationBadge: React.FC<Props> = () => {
  return null;
};
