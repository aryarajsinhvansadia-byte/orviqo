"use client";

import { useState } from "react";

/**
 * Automation ROI calculator — live, client-side, honest.
 * All outputs are labelled estimates; no guaranteed-savings claims.
 */
const fmt = new Intl.NumberFormat("en-IN");

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-ash">{label}</span>
        <span className="mono-s tabular-nums text-moon">
          {fmt.format(value)}
          {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[#ff8b3d]"
      />
    </label>
  );
}

export default function RoiCalculator() {
  const [employees, setEmployees] = useState(10);
  const [hours, setHours] = useState(6);
  const [rate, setRate] = useState(400);
  const [auto, setAuto] = useState(50);

  const hoursSaved = Math.round(employees * hours * 52 * (auto / 100));
  const value = Math.round(hoursSaved * rate);
  const fte = hoursSaved / 2080;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-7">
        <Slider label="People doing repetitive work" value={employees} onChange={setEmployees} min={1} max={200} step={1} unit="" />
        <Slider label="Repetitive hours per person, per week" value={hours} onChange={setHours} min={1} max={30} step={1} unit=" h" />
        <Slider label="Average hourly cost" value={rate} onChange={setRate} min={100} max={3000} step={50} unit=" ₹" />
        <Slider label="Portion realistically automatable" value={auto} onChange={setAuto} min={10} max={90} step={5} unit=" %" />
      </div>
      <div className="rounded-[3px] border border-hairline bg-night/60 p-8">
        <p className="eyebrow">Estimated yearly impact</p>
        <dl className="mt-6 space-y-6">
          <div>
            <dd className="display light-text text-4xl tabular-nums md:text-5xl">
              {fmt.format(hoursSaved)} hours
            </dd>
            <dt className="mt-1 text-ash">of repetitive work removed per year</dt>
          </div>
          <div>
            <dd className="display text-3xl tabular-nums text-moon md:text-4xl">
              ₹{fmt.format(value)}
            </dd>
            <dt className="mt-1 text-ash">of team time redirected to real work</dt>
          </div>
          <div>
            <dd className="display text-2xl tabular-nums text-moon">
              ≈ {fte.toFixed(1)} full-time roles
            </dd>
            <dt className="mt-1 text-ash">worth of capacity, refocused</dt>
          </div>
        </dl>
        <p className="mono-s mt-8 text-ash">
          Estimates only — real numbers depend on your processes. We scope them
          honestly before any build.
        </p>
      </div>
    </div>
  );
}
