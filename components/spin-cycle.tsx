"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthProfile } from "../auth/provider";
import { canAccessSpinCycle } from "../lib/access-control";
import { PRODUCTS } from "../lib/products";

type Focus = "release" | "renew" | "integrate";

type Ephemeris = {
  generatedAt: string;
  focus: Focus;
  solarGate: string;
  lunarPhase: string;
  cycleDay: number;
  prompt: string;
};

const FOCUS_OPTIONS: Array<{ value: Focus; label: string; description: string }> = [
  {
    value: "release",
    label: "Release",
    description: "Close the loop on what has already taught its lesson.",
  },
  {
    value: "renew",
    label: "Renew",
    description: "Commit to the smallest action that starts the next turn.",
  },
  {
    value: "integrate",
    label: "Integrate",
    description: "Carry the lesson forward without carrying the old weight.",
  },
];

function PublicCaseStudy({
  allowMemberPreview,
  onEnablePreview,
}: {
  allowMemberPreview: boolean;
  onEnablePreview: () => Promise<void>;
}) {
  const [isEnabling, setIsEnabling] = useState(false);

  async function handleEnablePreview() {
    setIsEnabling(true);
    try {
      await onEnablePreview();
    } finally {
      setIsEnabling(false);
    }
  }

  return (
    <section className="panel public-case-study" aria-labelledby="spin-cycle-case-study">
      <p className="eyebrow">{PRODUCTS.spinCycle.publicLabel}</p>
      <h2 id="spin-cycle-case-study">Spin Cycle turns timing into a readable ritual.</h2>
      <p>
        The public case study shows how Adinkrarota frames change as a cycle: release the completed
        pattern, renew the next intention, and integrate the lesson through a concrete practice.
      </p>
      <div className="case-study-grid" aria-label="Spin Cycle public case study">
        {FOCUS_OPTIONS.map((option, index) => (
          <article className="case-study-card" key={option.value}>
            <span className="step-number">{index + 1}</span>
            <h3>{option.label}</h3>
            <p>{option.description}</p>
          </article>
        ))}
      </div>
      <div className="member-callout">
        <h3>Members unlock the interactive workflow.</h3>
        <p>
          Active members can generate the current cycle reading, choose a focus, and receive a
          structured prompt from the protected ephemeris route.
        </p>
        {allowMemberPreview ? (
          <button className="primary-action" disabled={isEnabling} onClick={handleEnablePreview}>
            {isEnabling ? "Unlocking..." : "Enable member preview"}
          </button>
        ) : (
          <p className="muted">Member access is managed by the production membership provider.</p>
        )}
      </div>
    </section>
  );
}

function MemberWorkflow({ onClearPreview }: { onClearPreview: () => Promise<void> }) {
  const [focus, setFocus] = useState<Focus>("release");
  const [ephemeris, setEphemeris] = useState<Ephemeris | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function loadEphemeris(selectedFocus: Focus) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/spin-cycle-ephemeris?focus=${selectedFocus}`, {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Unable to load Spin Cycle ephemeris");
      }

      setEphemeris(data as Ephemeris);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load ephemeris");
      setEphemeris(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadEphemeris(focus);
  }, [focus]);

  return (
    <section className="panel member-workflow" aria-labelledby="spin-cycle-workflow">
      <p className="eyebrow">{PRODUCTS.spinCycle.memberLabel}</p>
      <div className="workflow-header">
        <div>
          <h2 id="spin-cycle-workflow">Spin Cycle interactive workflow</h2>
          <p>Choose a focus and generate the current cycle prompt from the protected API route.</p>
        </div>
        <button className="secondary-action" onClick={() => void onClearPreview()}>
          Return to public view
        </button>
      </div>

      <div className="focus-options" role="radiogroup" aria-label="Spin Cycle focus">
        {FOCUS_OPTIONS.map((option) => (
          <button
            aria-checked={focus === option.value}
            className={focus === option.value ? "focus-card active" : "focus-card"}
            key={option.value}
            onClick={() => setFocus(option.value)}
            role="radio"
            type="button"
          >
            <strong>{option.label}</strong>
            <span>{option.description}</span>
          </button>
        ))}
      </div>

      <div className="ephemeris-card" aria-live="polite">
        {isLoading ? <p>Loading the current cycle...</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
        {ephemeris ? (
          <>
            <dl>
              <div>
                <dt>Solar gate</dt>
                <dd>{ephemeris.solarGate}</dd>
              </div>
              <div>
                <dt>Lunar phase</dt>
                <dd>{ephemeris.lunarPhase}</dd>
              </div>
              <div>
                <dt>Cycle day</dt>
                <dd>{ephemeris.cycleDay}</dd>
              </div>
            </dl>
            <blockquote>{ephemeris.prompt}</blockquote>
            <p className="muted">
              Generated {new Date(ephemeris.generatedAt).toLocaleString()}.
            </p>
          </>
        ) : null}
      </div>
    </section>
  );
}

export function SpinCycle() {
  const {
    profile,
    isLoading,
    allowMemberPreview,
    enableMemberPreview,
    clearMemberPreview,
  } = useAuthProfile();

  const access = useMemo(() => canAccessSpinCycle(profile), [profile]);

  if (isLoading) {
    return (
      <section className="panel" aria-live="polite">
        <p className="eyebrow">Spin Cycle</p>
        <h2>Checking membership...</h2>
      </section>
    );
  }

  if (!access.allowed) {
    return (
      <PublicCaseStudy
        allowMemberPreview={allowMemberPreview}
        onEnablePreview={enableMemberPreview}
      />
    );
  }

  return <MemberWorkflow onClearPreview={clearMemberPreview} />;
}
