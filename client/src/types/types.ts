// Contrats frontend alignés sur server/prisma/schema.prisma.

export type Role = "VISITEUR" | "UTILISATEUR" | "MODERATEUR" | "ADMINISTRATEUR";

export type TypeResource = "ARTICLE" | "EXERCICE" | "FICHE_PRATIQUE";
export type Visibilite = "PUBLIQUE" | "PRIVE";
export type StatutDemande = "EN_ATTENTE" | "ACCEPTEE" | "REJETEE";

export type ApiError = {
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
};

export type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Paginated<T> = { data: T[]; meta: Meta };

export type User = {
  id: string;
  username: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

export type AuthUser = Pick<User, "id" | "username" | "email" | "role">;

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type RegisterResponse = { user: AuthUser };

export type Activity = {
  id: string;
  nom: string;
  createdAt: string;
};

export type JournalActivity = {
  journalEntryId: string;
  activityId: string;
  createdAt: string;
  activity?: Activity;
};

export type JournalEntry = {
  id: string;
  date: string;
  humeur: number;
  energie: number;
  qualite_sommeil: number;
  anxiete_stress: number;
  evenements: string;
  gratitude: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  activities: JournalActivity[];
};

export type CreateJournalEntryInput = {
  date: string;
  humeur: number;
  energie: number;
  qualite_sommeil: number;
  anxiete_stress: number;
  evenements: string;
  gratitude?: string;
  activityIds?: string[];
};

export type UpdateJournalEntryInput = Partial<
  Omit<CreateJournalEntryInput, "date">
>;

// Données calculées à partir de JournalEntry; elles ne sont pas un modèle Prisma.
export type TrendSeriesPoint = Pick<
  JournalEntry,
  "date" | "humeur" | "energie" | "qualite_sommeil" | "anxiete_stress"
>;

export type MoyenneJourSemaine = {
  jour: number;
  humeur: number;
  energie: number;
  qualite_sommeil: number;
  anxiete_stress: number;
  total: number;
};

export type JournalStats = {
  series: TrendSeriesPoint[];
  moyennesParJour: MoyenneJourSemaine[];
};

export type TrendInsights = {
  observations: string[];
  correlations: string[];
};

export type Resource = {
  id: string;
  type: TypeResource;
  titre: string;
  url: string | null;
  contenu: string;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
};

export type Favorite = {
  userId: string;
  resourceId: string;
  createdAt: string;
};

export type Group = {
  id: string;
  nom: string;
  description: string;
  createdAt: string;
};

export type GroupMember = {
  userId: string;
  groupId: string;
  statutDemande: StatutDemande | null;
};

export type Post = {
  id: string;
  authorId: string;
  groupeId: string;
  titre: string;
  contenu: string;
  visibilite: Visibilite;
  createdAt: string;
  updatedAt: string;
  author?: AuthUser;
};

export type CreatePostInput = Pick<Post, "titre" | "contenu"> & {
  visibilite?: Visibilite;
};

export type Comment = {
  id: string;
  authorId: string;
  postId: string;
  contenu: string;
  createdAt: string;
  updatedAt: string;
  author?: AuthUser;
};

export type Message = {
  id: string;
  senderId: string;
  recipientId: string;
  titre: string;
  contenu: string;
  createdAt: string;
  updatedAt: string;
};

export type Report = {
  id: string;
  emetteurId: string;
  reportedUserId: string | null;
  postId: string | null;
  commentId: string | null;
  contenu: string;
  createdAt: string;
  updatedAt: string;
};
