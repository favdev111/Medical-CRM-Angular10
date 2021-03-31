export const reviewStatusLookup = (status: string): string => {
  switch (status) {
    case ReviewStatus.APPROVED:
      return 'Approved';
    case ReviewStatus.DECLINED:
      return 'Reconsider';
    default:
      return 'Pending';
  }
}

export const enum ReviewStatus {
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED'
}