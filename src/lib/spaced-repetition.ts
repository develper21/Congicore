export interface SM2Card {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
}

export interface ReviewResult {
  quality: number; // 0-5: 0=complete blackout, 5=perfect response
  newCardData: SM2Card;
}

/**
 * SM-2 Algorithm implementation
 * Based on SuperMemo SM-2 algorithm for spaced repetition
 * 
 * Quality scale:
 * 0 - Complete blackout
 * 1 - Incorrect, but recognized
 * 2 - Incorrect, but easy correction
 * 3 - Correct, but difficult
 * 4 - Correct, with hesitation
 * 5 - Perfect response
 */
export function calculateNextReview(
  quality: number,
  currentData: SM2Card
): SM2Card {
  let { easeFactor, interval, repetitions } = currentData;

  // If quality is less than 3, reset repetitions
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    // Increment repetitions
    repetitions += 1;

    // Calculate new interval based on repetitions
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }

  // Calculate new ease factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Ensure ease factor doesn't go below 1.3
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    easeFactor,
    interval,
    repetitions,
    nextReviewDate,
  };
}

/**
 * Initialize a new card with default SM-2 values
 */
export function initializeCard(): SM2Card {
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + 1); // Review tomorrow

  return {
    easeFactor: 2.5, // Default ease factor
    interval: 1, // First interval is 1 day
    repetitions: 0, // No repetitions yet
    nextReviewDate,
  };
}

/**
 * Calculate retention rate based on review history
 */
export function calculateRetentionRate(
  reviews: Array<{ quality: number; date: Date }>
): number {
  if (reviews.length === 0) return 0;

  // Calculate average quality (weighted towards recent reviews)
  let weightedSum = 0;
  let weightSum = 0;

  reviews.forEach((review, index) => {
    const weight = index + 1; // More recent reviews have higher weight
    weightedSum += review.quality * weight;
    weightSum += weight;
  });

  const averageQuality = weightedSum / weightSum;
  
  // Convert to percentage (quality 0-5 maps to 0-100%)
  return Math.round((averageQuality / 5) * 100);
}

/**
 * Get due cards for review
 */
export function getDueCards(cards: Array<{ nextReviewDate: Date }>): Array<{ nextReviewDate: Date }> {
  const now = new Date();
  return cards.filter(card => card.nextReviewDate <= now);
}

/**
 * Calculate difficulty level based on ease factor
 */
export function getDifficultyLevel(easeFactor: number): 'easy' | 'medium' | 'hard' {
  if (easeFactor >= 2.5) return 'easy';
  if (easeFactor >= 1.8) return 'medium';
  return 'hard';
}
