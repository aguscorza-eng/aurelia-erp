import { ReactNode } from "react";

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
}: Props) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-stone-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-3 tracking-tight">
            {value}
          </h2>

          {subtitle && (
            <p className="text-sm text-stone-400 mt-2">
              {subtitle}
            </p>
          )}

        </div>

        <div className="h-14 w-14 rounded-2xl bg-[#F7F2EA] text-[#B08D57] flex items-center justify-center">
          {icon}
        </div>

      </div>

    </div>
  );
}