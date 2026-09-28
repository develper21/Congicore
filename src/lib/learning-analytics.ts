import { Memory } from '@/models';
import connectDB from '@/lib/mongodb';

export interface LearningMetrics {
  totalMemories: number;
  reviewedToday: number;
  retentionRate: number;
  averageEaseFactor: number;
  streakDays: number;
  categories: CategoryStats[];
  weeklyProgress: WeeklyProgress[];
}

export interface CategoryStats {
  category: string;
  count: number;
  averageRetention: number;
}

export interface WeeklyProgress {
  date: string;
  reviews: number;
  retention: number;
}

/**
 * Calculate learning analytics for a user
 */
export async function calculateLearningAnalytics(userId: string): Promise<LearningMetrics> {
  try {
    await connectDB();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Get all memories for the user
    const memories = await Memory.find({ userId });

    // Calculate total memories
    const totalMemories = memories.length;

    // Calculate memories reviewed today
    const reviewedToday = memories.filter((mem) => {
      const lastReviewed = mem.lastReviewed ? new Date(mem.lastReviewed) : null;
      return lastReviewed && lastReviewed >= todayStart;
    }).length;

    // Calculate overall retention rate
    const totalRetention = memories.reduce((sum, mem) => sum + (mem.retentionRate || 0), 0);
    const retentionRate = totalMemories > 0 ? Math.round(totalRetention / totalMemories) : 0;

    // Calculate average ease factor
    const totalEaseFactor = memories.reduce((sum, mem) => sum + (mem.easeFactor || 2.5), 0);
    const averageEaseFactor = totalMemories > 0 ? Math.round((totalEaseFactor / totalMemories) * 100) / 100 : 2.5;

    // Calculate streak days
    const streakDays = await calculateStreakDays(userId, memories);

    // Calculate category stats
    const categoryMap = new Map<string, { count: number; totalRetention: number }>();
    memories.forEach((mem) => {
      const category = mem.category || 'uncategorized';
      const existing = categoryMap.get(category) || { count: 0, totalRetention: 0 };
      existing.count++;
      existing.totalRetention += mem.retentionRate || 0;
      categoryMap.set(category, existing);
    });

    const categories: CategoryStats[] = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      count: data.count,
      averageRetention: data.count > 0 ? Math.round(data.totalRetention / data.count) : 0,
    }));

    // Calculate weekly progress
    const weeklyProgress: WeeklyProgress[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dateEnd = new Date(dateStart.getTime() + 24 * 60 * 60 * 1000);

      const dayMemories = memories.filter((mem) => {
        const lastReviewed = mem.lastReviewed ? new Date(mem.lastReviewed) : null;
        return lastReviewed && lastReviewed >= dateStart && lastReviewed < dateEnd;
      });

      const dayRetention = dayMemories.length > 0
        ? Math.round(dayMemories.reduce((sum, mem) => sum + (mem.retentionRate || 0), 0) / dayMemories.length)
        : 0;

      weeklyProgress.push({
        date: dateStart.toISOString().split('T')[0],
        reviews: dayMemories.length,
        retention: dayRetention,
      });
    }

    return {
      totalMemories,
      reviewedToday,
      retentionRate,
      averageEaseFactor,
      streakDays,
      categories,
      weeklyProgress,
    };
  } catch (error) {
    console.error('Learning analytics calculation error:', error);
    throw new Error('Failed to calculate learning analytics');
  }
}

/**
 * Calculate streak days for a user
 */
async function calculateStreakDays(userId: string, memories: Array<{ lastReviewed?: Date }>): Promise<number> {
  const now = new Date();
  let streak = 0;
  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  while (true) {
    const dateStart = new Date(currentDate);
    const dateEnd = new Date(dateStart.getTime() + 24 * 60 * 60 * 1000);

    const hasReview = memories.some((mem) => {
      const lastReviewed = mem.lastReviewed ? new Date(mem.lastReviewed) : null;
      return lastReviewed && lastReviewed >= dateStart && lastReviewed < dateEnd;
    });

    if (hasReview) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // Check if today has no review yet, don't break streak
      if (streak === 0 && currentDate.getTime() === new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) {
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      }
      break;
    }
  }

  return streak;
}

/**
 * Get learning insights and recommendations
 */
export async function getLearningInsights(userId: string): Promise<string[]> {
  try {
    const analytics = await calculateLearningAnalytics(userId);
    const insights: string[] = [];

    // Retention insights
    if (analytics.retentionRate < 50) {
      insights.push('Your retention rate is below 50%. Consider reviewing more frequently to improve memory retention.');
    } else if (analytics.retentionRate > 80) {
      insights.push('Excellent retention rate! You\'re doing great with spaced repetition.');
    }

    // Streak insights
    if (analytics.streakDays >= 7) {
      insights.push(`Amazing! You've maintained a ${analytics.streakDays}-day review streak. Keep it up!`);
    } else if (analytics.streakDays === 0) {
      insights.push('Start reviewing today to build your learning streak!');
    }

    // Category insights
    const weakCategories = analytics.categories.filter((cat) => cat.averageRetention < 50);
    if (weakCategories.length > 0) {
      insights.push(`Focus on improving retention in: ${weakCategories.map((c) => c.category).join(', ')}`);
    }

    // Weekly progress insights
    const recentReviews = analytics.weeklyProgress.slice(-3).reduce((sum, day) => sum + day.reviews, 0);
    if (recentReviews === 0) {
      insights.push('You haven\'t reviewed any memories in the last 3 days. Time to catch up!');
    } else if (recentReviews < 5) {
      insights.push('Try to review at least 5 memories per day for optimal learning.');
    }

    return insights;
  } catch (error) {
    console.error('Learning insights error:', error);
    return ['Unable to generate learning insights at this time.'];
  }
}
