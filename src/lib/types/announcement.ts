export enum AnnouncementKind {
  NEW_FEATURE = "new_feature",
  ANNOUNCEMENT = "announcement",
  IMPROVEMENT = "improvement",
}

export type AudienceRole = "veterinarian" | "pet_parent";
export type ReactionValue = "positive" | "negative" | "neutral";

export interface IAnnouncementReaction {
  user: string;
  role: AudienceRole;
  value: ReactionValue;
  reactedAt: Date;
}

export interface IAnnouncementRead {
  user: string;
  role: AudienceRole;
  readAt: Date;
}

export interface IAnnouncementDTO {
  kind: AnnouncementKind;
  title: string;
  details: string;
  audience: AudienceRole[];
  publishedAt?: Date | null;
  expiresAt?: Date | null;
  isDeleted?: boolean;
}
