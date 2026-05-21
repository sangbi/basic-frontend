"use client";

import { useEffect, useMemo, useState } from "react";
import { getCodesByGroupCode } from "@repo/api";
import type { CodeResponse } from "@repo/types";

export function useCodes(groupCode: string) {
  const [codes, setCodes] = useState<CodeResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!groupCode) return;

    const load = async () => {
      setLoading(true);
      try {
        const result = await getCodesByGroupCode(groupCode);
        setCodes(result.data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [groupCode]);

  const options = useMemo(
    () =>
      codes.map((code) => ({
        label: code.codeNm,
        value: code.code,
      })),
    [codes],
  );

  const getCodeNm = (codeValue: string) => {
    return codes.find((code) => code.code === codeValue)?.codeNm ?? codeValue;
  };

  return {
    codes,
    options,
    loading,
    getCodeNm,
  };
}
