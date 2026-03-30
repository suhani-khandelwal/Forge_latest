import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUploadContext } from "@/context/UploadContext";

const steps = [
  { label: "Harvesting live consumer signals from Amazon, Nykaa & Reddit", duration: 3500 },
  { label: "Identifying complaint frequency & trending ingredients", duration: 3000 },
  { label: "AI Architect designing novel concepts from real signals", duration: 4000 },
  { label: "Grounding every score in harvested market data", duration: 3000 },
  { label: "Synthesizing analytics: sentiment, trends & gap matrix", duration: 3000 },
];

const MoleculeOrb = ({ size, x, y, delay, color }: { size: number; x: string; y: string; delay: number; color: string }) => (
  <div
    className="absolute rounded-full opacity-20 blur-2xl animate-pulse"
    style={{
      width: size,
      height: size,
      left: x,
      top: y,
      background: color,
      animationDelay: `${delay}s`,
      animationDuration: `${3 + delay}s`,
    }}
  />
);

const Flask = ({ hue, delay, label }: { hue: string; delay: number; label: string }) => {
  return (
    <div className="flex flex-col items-center gap-2" style={{ animationDelay: `${delay}s` }}>
      <div className="relative animate-float" style={{ animationDelay: `${delay}s` }}>
        <svg width="52" height="72" viewBox="0 0 52 72" fill="none">
          {/* Flask body */}
          <path
            d="M19 4 L19 28 L4 55 Q0 68 13 70 L39 70 Q52 68 48 55 L33 28 L33 4 Z"
            fill={`${hue}18`}
            stroke={hue}
            strokeWidth="1.5"
          />
          {/* Liquid fill */}
          <path d="M7 53 Q2 65 13 68 L39 68 Q50 65 45 53 Z" fill={`${hue}55`} />
          {/* Shimmer line */}
          <path d="M11 56 Q18 52 26 56" stroke={`${hue}99`} strokeWidth="1" strokeLinecap="round" />
          {/* Bubble 1 */}
          <circle cx="18" cy="60" r="2.5" fill={`${hue}80`} className="animate-bounce" style={{ animationDelay: `${delay + 0.2}s`, animationDuration: "1.4s" }} />
          {/* Bubble 2 */}
          <circle cx="30" cy="55" r="1.8" fill={`${hue}80`} className="animate-bounce" style={{ animationDelay: `${delay + 0.6}s`, animationDuration: "1.8s" }} />
          {/* Bubble 3 */}
          <circle cx="38" cy="62" r="2" fill={`${hue}80`} className="animate-bounce" style={{ animationDelay: `${delay + 0.9}s`, animationDuration: "2s" }} />
          {/* Neck */}
          <rect x="19" y="2" width="14" height="5" rx="2.5" fill={hue} opacity="0.7" />
          {/* Stopper */}
          <rect x="21" y="0" width="10" height="3" rx="1.5" fill={hue} />
          {/* Glow dot */}
          <circle cx="23" cy="58" r="1" fill="white" opacity="0.6" />
        </svg>

        {/* Glow ring */}
        <div
          className="absolute inset-0 rounded-full opacity-30 blur-md animate-pulse"
          style={{ background: hue, animationDelay: `${delay}s` }}
        />
      </div>
      <span className="text-xs font-body font-semibold opacity-60 tracking-widest uppercase" style={{ color: hue }}>{label}</span>
    </div>
  );
};

const ConnectorLine = () => (
  <div className="flex items-center pb-8 opacity-30">
    <div className="w-8 h-px bg-gradient-to-r from-transparent via-sage to-transparent" />
  </div>
);

const LoadingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const source = searchParams.get("source") || "upload";
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);
  const { generatedResults } = useUploadContext();
  const navigatedRef = useRef(false);

  // Run the animation steps
  useEffect(() => {
    let stepIndex = 0;
    let totalElapsed = 0;
    const totalDuration = steps.reduce((s, st) => s + st.duration, 0);

    const runStep = () => {
      if (stepIndex >= steps.length) {
        setAnimationDone(true);
        return;
      }
      setCurrentStep(stepIndex);
      const stepDuration = steps[stepIndex].duration;
      const stepStart = totalElapsed;

      const interval = setInterval(() => {
        totalElapsed += 50;
        setProgress(Math.min((totalElapsed / totalDuration) * 100, 100));
      }, 50);

      setTimeout(() => {
        clearInterval(interval);
        totalElapsed = stepStart + stepDuration;
        stepIndex++;
        runStep();
      }, stepDuration);
    };

    runStep();
  }, [source]);

  // Navigate only when BOTH animation is done AND data is ready
  useEffect(() => {
    if (animationDone && generatedResults && !navigatedRef.current) {
      navigatedRef.current = true;
      setProgress(100);
      setTimeout(() => navigate("/results?source=" + source), 500);
    }
  }, [animationDone, generatedResults, navigate, source]);

  return (
    <div className="min-h-screen bg-hero flex flex-col items-center justify-center relative overflow-hidden">
      {/* Soft glowing orbs background */}
      <MoleculeOrb size={400} x="-10%" y="-10%" delay={0} color="hsl(142 71% 45%)" />
      <MoleculeOrb size={300} x="70%" y="60%" delay={1} color="hsl(100 18% 61%)" />
      <MoleculeOrb size={250} x="40%" y="80%" delay={2} color="hsl(158 50% 40%)" />
      <MoleculeOrb size={200} x="80%" y="5%" delay={0.5} color="hsl(100 30% 55%)" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(100 18% 61%) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-lg w-full mx-auto px-6 text-center">
        {/* Logo */}
        <div className="mb-10">
          <div className="font-display font-bold text-4xl text-white tracking-[0.3em] mb-2">FORGE</div>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-sage opacity-60" />
            <div className="w-1.5 h-1.5 rounded-full bg-sage" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-sage opacity-60" />
          </div>
        </div>

        {/* Flasks row */}
        <div className="flex items-end justify-center gap-2 mb-10">
          <Flask hue="hsl(100, 18%, 61%)" delay={0} label="Extract" />
          <ConnectorLine />
          <Flask hue="hsl(158, 60%, 50%)" delay={0.5} label="Analyse" />
          <ConnectorLine />
          <Flask hue="hsl(142, 71%, 45%)" delay={1} label="Forge" />
          <ConnectorLine />
          <Flask hue="hsl(100, 30%, 55%)" delay={1.5} label="Validate" />
        </div>

        <h2 className="font-display text-3xl font-bold text-white mb-2">
          Forging Innovation from Raw Data
        </h2>
        <p className="text-white/50 font-body text-sm mb-8">
          {source === "mine" ? "Mining live internet signals across platforms" : "Processing your uploaded datasets"}
        </p>

        {/* Progress bar */}
        <div className="relative bg-white/10 rounded-full h-2.5 mb-8 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, hsl(100 18% 61%), hsl(142 71% 45%), hsl(158 60% 50%))",
            }}
          />
          {/* Shimmer */}
          <div
            className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
            style={{ left: `${Math.max(0, progress - 8)}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-2.5 text-left bg-white/5 rounded-2xl p-5 border border-white/10">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 transition-all duration-500 ${i <= currentStep ? "opacity-100" : "opacity-25"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  i < currentStep
                    ? "bg-sage shadow-[0_0_10px_hsl(100_18%_61%/0.6)]"
                    : i === currentStep
                    ? "bg-white/10 ring-2 ring-sage ring-offset-1 ring-offset-transparent"
                    : "bg-white/10"
                }`}
              >
                {i < currentStep ? (
                  <svg className="w-3 h-3 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : i === currentStep ? (
                  <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
                ) : null}
              </div>
              <span className={`font-body text-sm flex-1 ${i <= currentStep ? "text-white" : "text-white/30"}`}>
                {step.label}
              </span>
              {i === currentStep && (
                <div className="flex gap-1">
                  {[...Array(3)].map((_, j) => (
                    <div
                      key={j}
                      className="w-1.5 h-1.5 rounded-full bg-sage animate-bounce"
                      style={{ animationDelay: `${j * 0.15}s` }}
                    />
                  ))}
                </div>
              )}
              {i < currentStep && (
                <span className="text-sage text-xs font-body font-semibold">Done</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 text-white/30 font-body text-xs tracking-widest">
          {Math.round(progress)}% COMPLETE
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
