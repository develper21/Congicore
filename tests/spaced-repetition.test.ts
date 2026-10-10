import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  initializeCard,
  calculateNextReview,
  calculateRetentionRate,
  getDueCards,
  getDifficultyLevel,
  SM2Card,
} from "../src/lib/spaced-repetition";

describe("spaced-repetition - SM2 algorithm", () => {
  it("initializeCard() creates card with proper defaults", () => {
    const card = initializeCard();
    assert.equal(card.easeFactor, 2.5);
    assert.equal(card.interval, 1);
    assert.equal(card.repetitions, 0);
    assert.ok(card.nextReviewDate instanceof Date);
  });

  it("calculateNextReview() resets repetitions when quality < 3", () => {
    const card: SM2Card = {
      easeFactor: 2.5,
      interval: 10,
      repetitions: 3,
      nextReviewDate: new Date(),
    };

    const updated = calculateNextReview(2, card);
    assert.equal(updated.repetitions, 0);
    assert.equal(updated.interval, 1);
  });

  it("calculateNextReview() increments repetitions and handles progression for quality >= 3", () => {
    const baseCard = initializeCard();

    // 1st successful repetition: interval = 1
    const rep1 = calculateNextReview(4, baseCard);
    assert.equal(rep1.repetitions, 1);
    assert.equal(rep1.interval, 1);

    // 2nd successful repetition: interval = 6
    const rep2 = calculateNextReview(5, rep1);
    assert.equal(rep2.repetitions, 2);
    assert.equal(rep2.interval, 6);

    // 3rd successful repetition: interval = Math.round(interval * easeFactor)
    const rep3 = calculateNextReview(5, rep2);
    assert.equal(rep3.repetitions, 3);
    assert.equal(rep3.interval, Math.round(6 * rep2.easeFactor));
  });

  it("calculateNextReview() ensures ease factor does not drop below 1.3", () => {
    let card: SM2Card = {
      easeFactor: 1.35,
      interval: 1,
      repetitions: 0,
      nextReviewDate: new Date(),
    };

    // Low quality repeatedly
    card = calculateNextReview(0, card);
    card = calculateNextReview(0, card);
    assert.ok(card.easeFactor >= 1.3);
  });

  it("calculateRetentionRate() calculates weighted percentage correctly", () => {
    assert.equal(calculateRetentionRate([]), 0);

    const reviews = [
      { quality: 5, date: new Date() },
      { quality: 5, date: new Date() },
    ];
    assert.equal(calculateRetentionRate(reviews), 100);

    const mixed = [
      { quality: 2, date: new Date() },
      { quality: 4, date: new Date() },
    ];
    // weight 1 * 2 + weight 2 * 4 = 2 + 8 = 10; weightSum = 3; avg = 10 / 3 = 3.333; (3.333 / 5) * 100 = 67%
    assert.equal(calculateRetentionRate(mixed), 67);
  });

  it("getDueCards() filters overdue and current cards correctly", () => {
    const pastDate = new Date(Date.now() - 3600 * 1000);
    const futureDate = new Date(Date.now() + 3600 * 1000);

    const cards = [{ nextReviewDate: pastDate }, { nextReviewDate: futureDate }];

    const due = getDueCards(cards);
    assert.equal(due.length, 1);
    assert.equal(due[0].nextReviewDate, pastDate);
  });

  it("getDifficultyLevel() maps easeFactor to appropriate category", () => {
    assert.equal(getDifficultyLevel(2.6), "easy");
    assert.equal(getDifficultyLevel(2.5), "easy");
    assert.equal(getDifficultyLevel(2.0), "medium");
    assert.equal(getDifficultyLevel(1.8), "medium");
    assert.equal(getDifficultyLevel(1.5), "hard");
    assert.equal(getDifficultyLevel(1.2), "hard");
  });
});
