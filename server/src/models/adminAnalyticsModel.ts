import { pool } from "../db.js";

export interface AdminAnalytics {
  users: {
    total: number;
    newToday: number;
    newLast7Days: number;
    newLast30Days: number;
    activeNow: number;
  };
  activity: {
    totalAttempts: number;
    attemptsLast7Days: number;
    certificatesIssued: number;
    averageScore: number;
    averageTimeSeconds: number;
  };
  countries: Array<{ countryCode: string; countryName: string; attempts: number }>;
  topQuizzes: Array<{ quizId: string; quizTitle: string; attempts: number; averageScore: number }>;
}

export async function getAnalytics(filters: { from?: string; to?: string } = {}): Promise<AdminAnalytics> {
  const from = filters.from ? new Date(`${filters.from}T00:00:00.000Z`) : null;
  const to = filters.to ? new Date(`${filters.to}T23:59:59.999Z`) : null;
  const dateFilter = `${from ? " AND completed_at >= $1::timestamptz" : ""}${to ? ` AND completed_at <= $${from ? 2 : 1}::timestamptz` : ""}`;
  const dateValues = [from?.toISOString(), to?.toISOString()].filter((value): value is string => Boolean(value));
  const [users, activity, countries, topQuizzes] = await Promise.all([
    pool.query<{ total: string; newToday: string; newLast7Days: string; newLast30Days: string; activeNow: string }>(
      `SELECT
         (SELECT COUNT(*) FROM users)::text AS total,
         (SELECT COUNT(*) FROM users WHERE created_at >= CURRENT_DATE)::text AS "newToday",
         (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '7 days')::text AS "newLast7Days",
         (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '30 days')::text AS "newLast30Days",
         (SELECT COUNT(DISTINCT user_id) FROM sessions WHERE expires_at > NOW())::text AS "activeNow"`,
    ),
    pool.query<{ totalAttempts: string; attemptsLast7Days: string; certificatesIssued: string; averageScore: string | null; averageTimeSeconds: string | null }>(
      `SELECT
        (SELECT COUNT(*) FROM leaderboard WHERE TRUE${dateFilter})::text AS "totalAttempts",
        (SELECT COUNT(*) FROM leaderboard WHERE completed_at >= NOW() - INTERVAL '7 days'${dateFilter})::text AS "attemptsLast7Days",
        (SELECT COUNT(*) FROM certificates${dateFilter.replaceAll("completed_at", "issued_at")})::text AS "certificatesIssued",
        COALESCE((SELECT AVG(percentage) FROM leaderboard WHERE TRUE${dateFilter}), 0)::text AS "averageScore",
        COALESCE((SELECT AVG(time_spent_seconds) FROM leaderboard WHERE TRUE${dateFilter}), 0)::text AS "averageTimeSeconds"`,
      dateValues,
    ),
    pool.query<{ countryCode: string; countryName: string; attempts: string }>(
      `SELECT country_code AS "countryCode", MAX(country_name) AS "countryName", COUNT(*)::text AS attempts
       FROM leaderboard
      WHERE country_code IS NOT NULL${dateFilter}
       GROUP BY country_code
       ORDER BY COUNT(*) DESC
      LIMIT 10`,
      dateValues,
    ),
    pool.query<{ quizId: string; quizTitle: string; attempts: string; averageScore: string }>(
      `SELECT quiz_id AS "quizId", MAX(quiz_title) AS "quizTitle", COUNT(*)::text AS attempts,
              COALESCE(AVG(percentage), 0)::text AS "averageScore"
       FROM leaderboard
      WHERE TRUE${dateFilter}
      GROUP BY quiz_id
       ORDER BY COUNT(*) DESC
      LIMIT 5`,
      dateValues,
    ),
  ]);

  const userRow = users.rows[0];
  const activityRow = activity.rows[0];
  return {
    users: {
      total: Number(userRow?.total ?? 0),
      newToday: Number(userRow?.newToday ?? 0),
      newLast7Days: Number(userRow?.newLast7Days ?? 0),
      newLast30Days: Number(userRow?.newLast30Days ?? 0),
      activeNow: Number(userRow?.activeNow ?? 0),
    },
    activity: {
      totalAttempts: Number(activityRow?.totalAttempts ?? 0),
      attemptsLast7Days: Number(activityRow?.attemptsLast7Days ?? 0),
      certificatesIssued: Number(activityRow?.certificatesIssued ?? 0),
      averageScore: Math.round(Number(activityRow?.averageScore ?? 0)),
      averageTimeSeconds: Math.round(Number(activityRow?.averageTimeSeconds ?? 0)),
    },
    countries: countries.rows.map((row) => ({
      countryCode: row.countryCode,
      countryName: row.countryName,
      attempts: Number(row.attempts),
    })),
    topQuizzes: topQuizzes.rows.map((row) => ({
      quizId: row.quizId,
      quizTitle: row.quizTitle,
      attempts: Number(row.attempts),
      averageScore: Math.round(Number(row.averageScore)),
    })),
  };
}
