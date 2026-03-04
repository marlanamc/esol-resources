type UpdateManyResult = { count: number };

type SubmissionPointsAwardDelegate = {
  updateMany(args: {
    where: {
      id: string;
      userId?: string;
      pointsAwarded: 0;
    };
    data: {
      pointsAwarded: number;
    };
  }): Promise<UpdateManyResult>;
  findUnique(args: {
    where: { id: string };
    select: { pointsAwarded: true };
  }): Promise<{ pointsAwarded: number } | null>;
};

export async function claimSubmissionPointsOnce(params: {
  submission: SubmissionPointsAwardDelegate;
  submissionId: string;
  userId?: string;
  pointsAwarded: number;
}): Promise<{ claimed: boolean; existingPointsAwarded: number }> {
  const { submission, submissionId, userId, pointsAwarded } = params;

  const claim = await submission.updateMany({
    where: {
      id: submissionId,
      userId,
      pointsAwarded: 0,
    },
    data: {
      pointsAwarded,
    },
  });

  if (claim.count === 1) {
    return { claimed: true, existingPointsAwarded: pointsAwarded };
  }

  const latest = await submission.findUnique({
    where: { id: submissionId },
    select: { pointsAwarded: true },
  });
  return { claimed: false, existingPointsAwarded: latest?.pointsAwarded ?? 0 };
}
