export type QuestionType = 'single' | 'multiple' | 'boolean' | 'short_answer';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // for single, multiple, boolean
  correctAnswer: string | string[]; // string for single/boolean/short_answer; string[] for multiple
  points: number;
  explanation: string;
  hint?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Test {
  id: string;
  title: string;
  subject: string;
  grade: string;
  description: string;
  durationMinutes: number;
  passingScore: number; // e.g. 70
  questions: Question[];
  createdBy: string;
  createdAt: string;
  deadline?: string; // ISO date-time string e.g. 2026-10-15T23:59
  allowLateSubmission?: boolean; // defaults to true with late warning
  status: 'published' | 'draft';
  tags?: string[];
}

export interface StudentAnswer {
  questionId: string;
  selectedAnswer: string | string[];
  isCorrect?: boolean;
  pointsAwarded?: number;
  teacherComment?: string;
}

export interface TestSubmission {
  id: string;
  testId: string;
  testTitle: string;
  subject: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  submittedAt: string;
  timeSpentSeconds: number;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  isLate?: boolean;
  answers: StudentAnswer[];
  status: 'graded' | 'needs_review';
  overallFeedback?: string;
}

export type UserRole = 'teacher' | 'student';

export interface ClassDocument {
  id: string;
  title: string;
  description?: string;
  subject: string;
  topic?: string; // e.g. "Unit 1: Kinematics", "Reference Materials"
  type: 'pdf' | 'doc' | 'sheet' | 'slide' | 'note' | 'link';
  fileSize?: string;
  uploadedBy: string;
  uploadedAt: string;
  content?: string; // Text or markdown notes
  fileData?: string; // Base64 data or data URL for uploaded files
  fileName?: string;
  externalUrl?: string;
  tags?: string[];
  isPinned?: boolean;
  linkedTestId?: string;
}

export interface ClassAnnouncement {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  title: string;
  content: string;
  createdAt: string;
  subject: string;
  attachedDocIds?: string[];
  attachedTestId?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  password?: string;
  grade?: string;
  avatar: string;
  title?: string; // e.g. "Lead Physics Instructor"
  department?: string;
}
