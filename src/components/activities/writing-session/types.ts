export type SessionStatus =
    | "waiting"
    | "writing"
    | "group-vote"
    | "class-vote"
    | "results"
    | "finished";

export interface SessionGroup {
    id: string;
    animalName: string;
    emoji: string;
    colorHex: string;
    members: { id: string; name: string }[];
}

export interface TeamSubmission {
    id: string;
    text: string;
    wordCount: number;
}

export interface GroupWinner {
    id: string;
    text: string;
    wordCount: number;
    groupName: string;
    groupEmoji: string;
    groupColor: string;
}

export interface StudentState {
    status: SessionStatus;
    currentRound: number;
    timerEndsAt: string | null;
    // Not set during the lobby (waiting before Start Round)
    myGroupName?: string;
    myGroupColor?: string;
    myGroupEmoji?: string;
    // writing phase
    promptText?: string;
    promptImageUrl?: string | null;
    mySubmission?: { text: string } | null;
    // group-vote phase
    teamSubmissions?: TeamSubmission[];
    myVote?: string | null;
    // class-vote phase
    groupWinners?: GroupWinner[];
    // results phase
    classWinner?: { text: string; groupName: string; groupEmoji: string } | null;
    isGroupWinner?: boolean;
}

export interface TeacherState {
    status: SessionStatus;
    currentRound: number;
    timerEndsAt: string | null;
    totalRounds: number;
    submittedCount: number;
    totalCount: number;
    groups: SessionGroup[];
    // Lobby check-ins (waiting phase, before groups are assigned)
    checkIns?: { id: string; name: string }[];
}
