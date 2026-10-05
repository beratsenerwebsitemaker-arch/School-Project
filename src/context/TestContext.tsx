import React, { createContext, useContext, useState, useEffect } from 'react';
import { Test, TestSubmission, User, UserRole, ClassDocument, ClassAnnouncement } from '../types';
import {
  INITIAL_TESTS,
  INITIAL_SUBMISSIONS,
  INITIAL_USERS,
  INITIAL_DOCUMENTS,
  INITIAL_ANNOUNCEMENTS,
} from '../data/initialData';

interface TestContextType {
  tests: Test[];
  submissions: TestSubmission[];
  documents: ClassDocument[];
  announcements: ClassAnnouncement[];
  currentUser: User | null;
  users: User[];
  isLoggedIn: boolean;
  login: (email: string, password?: string, role?: UserRole) => { success: boolean; error?: string };
  registerUser: (userData: { name: string; email: string; role: UserRole; grade?: string; department?: string; password?: string }) => User;
  logout: () => void;
  switchUser: (userId: string) => void;
  createTest: (testData: Omit<Test, 'id' | 'createdAt'>) => Test;
  updateTest: (test: Test) => void;
  updateTestDeadline: (testId: string, deadline: string | undefined) => void;
  deleteTest: (testId: string) => void;
  submitTest: (subData: Omit<TestSubmission, 'id' | 'submittedAt'>) => TestSubmission;
  updateSubmissionGrade: (submissionId: string, updates: Partial<TestSubmission>) => void;
  addDocument: (docData: Omit<ClassDocument, 'id' | 'uploadedAt'>) => ClassDocument;
  updateDocument: (doc: ClassDocument) => void;
  deleteDocument: (docId: string) => void;
  addAnnouncement: (annData: Omit<ClassAnnouncement, 'id' | 'createdAt'>) => ClassAnnouncement;
  deleteAnnouncement: (annId: string) => void;
  generateAITest: (params: {
    topic: string;
    subject: string;
    grade: string;
    numQuestions: number;
    difficulty: string;
    deadline?: string;
    customInstructions?: string;
  }) => Promise<Test>;
  resetToDefaults: () => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

const STORAGE_KEY_TESTS = 'vantage_tests_v1';
const STORAGE_KEY_SUBMISSIONS = 'vantage_submissions_v1';
const STORAGE_KEY_DOCUMENTS = 'vantage_documents_v1';
const STORAGE_KEY_ANNOUNCEMENTS = 'vantage_announcements_v1';
const STORAGE_KEY_USER_ID = 'vantage_active_user_v1';
const STORAGE_KEY_USERS = 'vantage_users_v1';

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading users from local storage', e);
    }
    return INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_USER_ID) || INITIAL_USERS[0].id;
  });

  const currentUser = users.find((u) => u.id === currentUserId) || null;
  const isLoggedIn = currentUser !== null;

  const [tests, setTests] = useState<Test[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TESTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading tests from local storage', e);
    }
    return INITIAL_TESTS;
  });

  const [submissions, setSubmissions] = useState<TestSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading submissions from local storage', e);
    }
    return INITIAL_SUBMISSIONS;
  });

  const [documents, setDocuments] = useState<ClassDocument[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DOCUMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading documents from local storage', e);
    }
    return INITIAL_DOCUMENTS;
  });

  const [announcements, setAnnouncements] = useState<ClassAnnouncement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ANNOUNCEMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading announcements from local storage', e);
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TESTS, JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DOCUMENTS, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(STORAGE_KEY_USER_ID, currentUserId);
    } else {
      localStorage.removeItem(STORAGE_KEY_USER_ID);
    }
  }, [currentUserId]);

  const login = (
    email: string,
    password?: string,
    role?: UserRole
  ): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      return {
        success: false,
        error: 'No account found with this email. Please check your credentials or create a new profile.',
      };
    }

    if (role && found.role !== role) {
      return {
        success: false,
        error: `This account is registered as a ${found.role}. Please switch to the ${found.role} tab to sign in.`,
      };
    }

    if (password && found.password && found.password !== password) {
      return {
        success: false,
        error: 'Incorrect password. Please verify and try again.',
      };
    }

    setCurrentUserId(found.id);
    return { success: true };
  };

  const registerUser = (userData: {
    name: string;
    email: string;
    role: UserRole;
    grade?: string;
    department?: string;
    password?: string;
  }): User => {
    const newUser: User = {
      ...userData,
      id: `${userData.role}-${Date.now()}`,
      avatar:
        userData.role === 'teacher'
          ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    return newUser;
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  const createTest = (testData: Omit<Test, 'id' | 'createdAt'>): Test => {
    const newTest: Test = {
      ...testData,
      id: `test-${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: currentUser ? currentUser.name : 'Faculty Staff',
    };
    setTests((prev) => [newTest, ...prev]);
    return newTest;
  };

  const updateTest = (updated: Test) => {
    setTests((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const updateTestDeadline = (testId: string, deadline: string | undefined) => {
    setTests((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, deadline } : t))
    );
  };

  const deleteTest = (testId: string) => {
    setTests((prev) => prev.filter((t) => t.id !== testId));
  };

  const submitTest = (subData: Omit<TestSubmission, 'id' | 'submittedAt'>): TestSubmission => {
    const test = tests.find((t) => t.id === subData.testId);
    let isLate = false;
    if (test?.deadline) {
      isLate = new Date() > new Date(test.deadline);
    }

    const newSub: TestSubmission = {
      ...subData,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      isLate,
    };
    setSubmissions((prev) => [newSub, ...prev]);
    return newSub;
  };

  const updateSubmissionGrade = (submissionId: string, updates: Partial<TestSubmission>) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id !== submissionId) return sub;
        const merged = { ...sub, ...updates };
        if (updates.answers) {
          const newScore = updates.answers.reduce((acc, a) => acc + (a.pointsAwarded || 0), 0);
          merged.score = newScore;
          merged.percentage = Math.round((newScore / merged.maxScore) * 100);
          merged.passed = merged.percentage >= 70;
        }
        return merged;
      })
    );
  };

  // Class Drive Document Actions
  const addDocument = (docData: Omit<ClassDocument, 'id' | 'uploadedAt'>): ClassDocument => {
    const newDoc: ClassDocument = {
      ...docData,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser ? currentUser.name : 'Faculty Staff',
    };
    setDocuments((prev) => [newDoc, ...prev]);
    return newDoc;
  };

  const updateDocument = (doc: ClassDocument) => {
    setDocuments((prev) => prev.map((d) => (d.id === doc.id ? doc : d)));
  };

  const deleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  // Class Stream Announcement Actions
  const addAnnouncement = (
    annData: Omit<ClassAnnouncement, 'id' | 'createdAt'>
  ): ClassAnnouncement => {
    const newAnn: ClassAnnouncement = {
      ...annData,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString(),
      authorName: currentUser ? currentUser.name : 'Faculty Staff',
      authorRole: currentUser?.title || (currentUser?.role === 'teacher' ? 'Instructor' : 'Student'),
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    return newAnn;
  };

  const deleteAnnouncement = (annId: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== annId));
  };

  const generateAITest = async (params: {
    topic: string;
    subject: string;
    grade: string;
    numQuestions: number;
    difficulty: string;
    deadline?: string;
    customInstructions?: string;
  }): Promise<Test> => {
    const res = await fetch('/api/ai/generate-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`AI generation failed: ${res.statusText}`);
    }

    const test: Test = await res.json();
    test.createdBy = currentUser ? currentUser.name : 'Faculty Staff';
    if (params.deadline) {
      test.deadline = params.deadline;
      test.allowLateSubmission = true;
    }
    setTests((prev) => [test, ...prev]);
    return test;
  };

  const resetToDefaults = () => {
    setTests(INITIAL_TESTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setDocuments(INITIAL_DOCUMENTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setUsers(INITIAL_USERS);
    setCurrentUserId(INITIAL_USERS[0].id);
    localStorage.removeItem(STORAGE_KEY_TESTS);
    localStorage.removeItem(STORAGE_KEY_SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEY_DOCUMENTS);
    localStorage.removeItem(STORAGE_KEY_ANNOUNCEMENTS);
    localStorage.removeItem(STORAGE_KEY_USERS);
  };

  return (
    <TestContext.Provider
      value={{
        tests,
        submissions,
        documents,
        announcements,
        currentUser,
        users,
        isLoggedIn,
        login,
        registerUser,
        logout,
        switchUser,
        createTest,
        updateTest,
        updateTestDeadline,
        deleteTest,
        submitTest,
        updateSubmissionGrade,
        addDocument,
        updateDocument,
        deleteDocument,
        addAnnouncement,
        deleteAnnouncement,
        generateAITest,
        resetToDefaults,
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export const useTests = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTests must be used within a TestProvider');
  }
  return context;
};
