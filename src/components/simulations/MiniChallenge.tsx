"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { useUserProgress } from "@/context/UserProgressContext";
import { type TopicChallenge } from "@/data/topics";
import styles from "./MiniChallenge.module.css";

interface MiniChallengeProps {
  challenge: TopicChallenge;
  topicTitle: string;
}

export default function MiniChallenge({ challenge, topicTitle }: MiniChallengeProps) {
  const { addXP } = useUserProgress();
  const [selectedSingleIndex, setSelectedSingleIndex] = useState<number | null>(null);
  const [orderedIndices, setOrderedIndices] = useState<number[]>(
    challenge.type === "ordering" ? challenge.options.map((_, i) => i) : []
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedSingleIndex(index);
  };

  const moveOrder = (fromIdx: number, toIdx: number) => {
    if (isSubmitted) return;
    const next = [...orderedIndices];
    const item = next.splice(fromIdx, 1)[0];
    next.splice(toIdx, 0, item);
    setOrderedIndices(next);
  };

  const handleSubmit = () => {
    let pass = false;
    if (challenge.type === "multiple-choice") {
      pass = selectedSingleIndex === challenge.correctOrderOrIndex;
    } else if (challenge.type === "ordering") {
      const correctArr = challenge.correctOrderOrIndex as number[];
      pass = orderedIndices.every((val, idx) => val === correctArr[idx]);
    }

    setIsCorrect(pass);
    setIsSubmitted(true);

    if (pass) {
      addXP(challenge.xpReward);
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#4F46E5", "#10B981", "#F59E0B", "#EC4899"],
      });
    }
  };

  const handleRetry = () => {
    setIsSubmitted(false);
    setSelectedSingleIndex(null);
    if (challenge.type === "ordering") {
      setOrderedIndices(challenge.options.map((_, i) => i));
    }
  };

  return (
    <div className={styles.challengeBox} id="topic-mini-challenge">
      <div className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.challengeBadge}>Interactive Challenge</span>
          <span className={styles.xpReward}>+{challenge.xpReward} XP</span>
        </div>
        <h3 className={styles.question}>{challenge.question}</h3>
      </div>

      <div className={styles.content}>
        {/* ── Multiple Choice Mode ─────────────────── */}
        {challenge.type === "multiple-choice" && (
          <div className={styles.optionsList}>
            {challenge.options.map((opt, idx) => {
              const isSelected = selectedSingleIndex === idx;
              let stateClass = "";
              if (isSubmitted) {
                if (idx === challenge.correctOrderOrIndex) {
                  stateClass = styles.optCorrect;
                } else if (isSelected) {
                  stateClass = styles.optWrong;
                }
              } else if (isSelected) {
                stateClass = styles.optSelected;
              }

              return (
                <button
                  key={idx}
                  className={`${styles.optionBtn} ${stateClass}`}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isSubmitted}
                  id={`challenge-opt-${idx}`}
                >
                  <span className={styles.optLetter}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className={styles.optText}>{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Ordering Mode ────────────────────────── */}
        {challenge.type === "ordering" && (
          <div className={styles.orderingList}>
            {orderedIndices.map((origIdx, currentPos) => (
              <div key={origIdx} className={styles.orderingItem}>
                <div className={styles.orderNumber}>{currentPos + 1}</div>
                <div className={styles.orderLabel}>{challenge.options[origIdx]}</div>
                {!isSubmitted && (
                  <div className={styles.orderActions}>
                    <button
                      className={styles.moveBtn}
                      disabled={currentPos === 0}
                      onClick={() => moveOrder(currentPos, currentPos - 1)}
                      aria-label="Move up"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15" /></svg>
                    </button>
                    <button
                      className={styles.moveBtn}
                      disabled={currentPos === orderedIndices.length - 1}
                      onClick={() => moveOrder(currentPos, currentPos + 1)}
                      aria-label="Move down"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Submit / Feedback Actions ────────────── */}
        <div className={styles.footer}>
          {!isSubmitted ? (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={challenge.type === "multiple-choice" && selectedSingleIndex === null}
              id="submit-challenge-btn"
            >
              Verify Answer
            </button>
          ) : (
            <div className={styles.resultFeedback}>
              <div className={`${styles.feedbackCard} ${isCorrect ? styles.feedbackSuccess : styles.feedbackError}`}>
                <div className={styles.feedbackIcon}>
                  {isCorrect ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--color-success)" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      Correct Architecture!
                    </span>
                  ) : (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--color-danger)" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      Sequence Incomplete
                    </span>
                  )}
                </div>
                <p className={styles.feedbackText}>{challenge.explanation}</p>
                {!isCorrect && (
                  <button
                    className={`btn btn-outline ${styles.retryBtn}`}
                    onClick={handleRetry}
                    id="retry-challenge-btn"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
