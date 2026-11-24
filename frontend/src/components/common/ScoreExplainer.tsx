"use client";

import React, { useState } from "react";
import { Info, HelpCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface Props {
  untThreshold?: number;
  instThreshold?: number;
  historicalCutoff?: number;
  academicYear?: string;
}

export const ScoreExplainer: React.FC<Props> = ({
  untThreshold = 50,
  instThreshold,
  historicalCutoff,
  academicYear = "2024–2025",
}) => {
  const { lang, t } = useI18n();
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm shadow-xs">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-zinc-900 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-zinc-500" />
          {lang === "kz" ? "Балдар мен шектер түсіндірмесі" : "Пояснение баллов и порогов"}
        </h4>
        <button
          type="button"
          onClick={() => setShowDetail(!showDetail)}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          {showDetail ? (lang === "kz" ? "Жасыру" : "Скрыть") : (lang === "kz" ? "Айырмашылығы қандай?" : "В чем разница?")}
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* National threshold */}
        <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
          <div className="text-xs text-zinc-500 font-medium">{t.common.passingScore} (ҰТО)</div>
          <div className="text-xl font-bold text-zinc-900 mt-1">{untThreshold} <span className="text-xs font-normal text-zinc-400">/ 140</span></div>
          <p className="text-[11px] text-zinc-500 mt-1">
            {lang === "kz" ? "Құжат тапсыруға рұқсат беретін республикалық ең төменгі шек." : "Минимальный порог НЦТ для подачи документов."}
          </p>
        </div>

        {/* Institution threshold */}
        <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
          <div className="text-xs text-zinc-500 font-medium">{lang === "kz" ? "ЖОО ішкі шегі" : "Внутренний порог вуза"}</div>
          <div className="text-xl font-bold text-zinc-900 mt-1">
            {instThreshold ? `${instThreshold}` : "—"}{" "}
            <span className="text-xs font-normal text-zinc-400">/ 140</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">
            {instThreshold
              ? (lang === "kz" ? "Аталған университетке ақылы/грантқа түсудің ішкі талабы." : "Требование вуза для участия в приеме.")
              : t.verification.unknownInfo}
          </p>
        </div>

        {/* Historical score */}
        <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100">
          <div className="text-xs text-blue-800 font-medium">
            {t.common.historicalScore} ({academicYear})
          </div>
          <div className="text-xl font-bold text-blue-900 mt-1">
            {historicalCutoff ? `${historicalCutoff}` : "—"}{" "}
            <span className="text-xs font-normal text-blue-600/70">/ 140</span>
          </div>
          <p className="text-[11px] text-blue-700/80 mt-1">
            {historicalCutoff
              ? (lang === "kz" ? "Өткен жылғы грант алған ең соңғы үміткердің балы." : "Балл последнего поступившего на грант в прошлом году.")
              : t.verification.unknownInfo}
          </p>
        </div>
      </div>

      {showDetail && (
        <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 leading-relaxed">
          <strong>{lang === "kz" ? "Маңызды ескерту:" : "Важное предупреждение:"}</strong>{" "}
          {t.verification.notGuaranteedNote} {lang === "kz" 
            ? "Шекті баллдан өту тек конкурсқа қатысуға мүмкіндік береді. Грант нәтижесі сол жылғы талапкерлердің жалпы конкурсына байланысты қалыптасады." 
            : "Преодоление порогового балла дает право участвовать в конкурсе. Проходной балл на грант формируется динамически среди абитуриентов текущего года."}
        </div>
      )}
    </div>
  );
};
