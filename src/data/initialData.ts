import { Test, TestSubmission, User, ClassDocument, ClassAnnouncement } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'teacher-1',
    name: 'Dr. Clara Vance',
    role: 'teacher',
    email: 'clara.vance@vantage.edu',
    password: 'password123',
    department: 'Science & AP Physics',
    title: 'Chair of STEM & Assessments',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'teacher-2',
    name: 'Mr. Marcus Sterling',
    role: 'teacher',
    email: 'm.sterling@vantage.edu',
    password: 'password123',
    department: 'Humanities & Social Sciences',
    title: 'Senior Humanities Instructor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'student-1',
    name: 'Alex Rivera',
    role: 'student',
    email: 'alex.rivera@students.vantage.edu',
    password: 'student123',
    grade: 'Grade 11 - Honors',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'student-2',
    name: 'Maya Lin',
    role: 'student',
    email: 'maya.lin@students.vantage.edu',
    password: 'student123',
    grade: 'Grade 11 - Advanced',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'student-3',
    name: 'Liam Chen',
    role: 'student',
    email: 'liam.chen@students.vantage.edu',
    password: 'student123',
    grade: 'Grade 11 - Standard',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'student-4',
    name: 'Sophia Zhang',
    role: 'student',
    email: 'sophia.z@students.vantage.edu',
    password: 'student123',
    grade: 'Grade 12 - AP Scholar',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_TESTS: Test[] = [
  {
    id: 'test-physics-101',
    title: 'AP Physics 1: Kinematics & Newton’s Laws',
    subject: 'Physics',
    grade: 'Grade 11-12 (AP)',
    description: 'Covers 1D/2D projectile motion, Newton’s second and third laws of motion, normal forces, and friction coefficients.',
    durationMinutes: 20,
    passingScore: 70,
    createdBy: 'Dr. Clara Vance',
    createdAt: '2026-09-28T10:00:00Z',
    deadline: '2026-10-14T23:59:00Z',
    allowLateSubmission: true,
    status: 'published',
    tags: ['AP Physics', 'Mechanics', 'Forces'],
    questions: [
      {
        id: 'q1',
        text: 'A 5.0 kg crate is pushed horizontally across a floor with a force of 30 N. If the coefficient of kinetic friction is μk = 0.20 and g = 9.8 m/s², what is the net acceleration of the crate?',
        type: 'single',
        options: [
          '4.04 m/s²',
          '6.00 m/s²',
          '2.04 m/s²',
          '1.96 m/s²',
        ],
        correctAnswer: '4.04 m/s²',
        points: 5,
        explanation: 'Frictional force Ff = μk * m * g = 0.20 * 5.0 * 9.8 = 9.8 N. The net force Fnet = 30 N - 9.8 N = 20.2 N. Therefore acceleration a = Fnet / m = 20.2 / 5.0 = 4.04 m/s².',
        difficulty: 'medium',
        hint: 'Calculate frictional resistance using normal force first.',
      },
      {
        id: 'q2',
        text: 'According to Newton\'s Third Law, if object A exerts a force on object B, object B exerts an equal and opposite force on object A. These two action-reaction forces cancel each other out.',
        type: 'boolean',
        options: ['True', 'False'],
        correctAnswer: 'False',
        points: 3,
        explanation: 'Action and reaction forces do NOT cancel each other out because they act on two different, distinct objects (one acts on A, the other acts on B). Cancellation only occurs when opposing forces act on the same body.',
        difficulty: 'easy',
      },
      {
        id: 'q3',
        text: 'Which of the following statements about projectile motion (ignoring air resistance) are TRUE? (Select all that apply)',
        type: 'multiple',
        options: [
          'Horizontal velocity remains constant throughout flight.',
          'Vertical acceleration is zero at the trajectory peak.',
          'Vertical velocity is zero at the apex of trajectory.',
          'Acceleration vector points vertically downward throughout flight.',
        ],
        correctAnswer: [
          'Horizontal velocity remains constant throughout flight.',
          'Vertical velocity is zero at the apex of trajectory.',
          'Acceleration vector points vertically downward throughout flight.',
        ],
        points: 6,
        explanation: 'In the absence of air resistance, ax = 0 so horizontal velocity is constant. The vertical acceleration ay = -g (-9.8 m/s²) continuously throughout the entire flight, even at the peak where vertical velocity vy momentarily drops to 0.',
        difficulty: 'hard',
      },
      {
        id: 'q4',
        text: 'State Newton’s First Law of Motion and briefly explain what property of matter resists changes in state of motion.',
        type: 'short_answer',
        correctAnswer: 'Inertia / An object at rest stays at rest and an object in motion remains in motion with constant velocity unless acted upon by a net external force; the property is inertia (measured by mass).',
        points: 6,
        explanation: 'Full credit requires mentioning that objects maintain constant velocity (or rest) unless a net external force acts, and identifying Inertia (mass) as the inherent property resisting acceleration.',
        difficulty: 'medium',
      },
      {
        id: 'q5',
        text: 'An elevator of mass 1200 kg is accelerating upward at 2.0 m/s². What is the tension in the hoisting cable? (Assume g = 9.8 m/s²)',
        type: 'single',
        options: [
          '14,160 N',
          '11,760 N',
          '9,360 N',
          '2,400 N',
        ],
        correctAnswer: '14,160 N',
        points: 5,
        explanation: 'T - mg = m*a => T = m*(g + a) = 1200 * (9.8 + 2.0) = 1200 * 11.8 = 14,160 N.',
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'test-history-201',
    title: 'World History: Enlightenment & Democratic Revolutions',
    subject: 'World History',
    grade: 'Grade 10-11',
    description: 'Examines social contracts, Enlightenment philosophers (Locke, Montesquieu, Rousseau), and the American and French Revolutions.',
    durationMinutes: 15,
    passingScore: 70,
    createdBy: 'Mr. Marcus Sterling',
    createdAt: '2026-10-01T14:30:00Z',
    deadline: '2026-10-09T17:00:00Z',
    allowLateSubmission: true,
    status: 'published',
    tags: ['Enlightenment', 'Revolutions', 'Social Contract'],
    questions: [
      {
        id: 'hq1',
        text: 'Which Enlightenment philosopher advocated for the doctrine of separation of powers into legislative, executive, and judicial branches?',
        type: 'single',
        options: [
          'Baron de Montesquieu',
          'Thomas Hobbes',
          'John Locke',
          'Voltaire',
        ],
        correctAnswer: 'Baron de Montesquieu',
        points: 4,
        explanation: 'Baron de Montesquieu in "The Spirit of the Laws" (1748) formulated the division of governmental power into executive, legislative, and judicial branches to prevent despotism.',
        difficulty: 'easy',
      },
      {
        id: 'hq2',
        text: 'John Locke argued that legitimate governance derives from the consent of the governed to protect natural rights of life, liberty, and property.',
        type: 'boolean',
        options: ['True', 'False'],
        correctAnswer: 'True',
        points: 3,
        explanation: 'Locke\'s Second Treatise of Government established that governments exist through social contract to safeguard natural rights; when violated, citizens possess the right to alter or abolish them.',
        difficulty: 'easy',
      },
      {
        id: 'hq3',
        text: 'Which documents directly reflected Enlightenment concepts of individual sovereignty and rights? (Select all that apply)',
        type: 'multiple',
        options: [
          'The Declaration of Independence (1776)',
          'The Declaration of the Rights of Man and of the Citizen (1789)',
          'The Edict of Nantes (1598)',
          'The United States Bill of Rights (1791)',
        ],
        correctAnswer: [
          'The Declaration of Independence (1776)',
          'The Declaration of the Rights of Man and of the Citizen (1789)',
          'The United States Bill of Rights (1791)',
        ],
        points: 5,
        explanation: 'The American Declaration, French Declaration of the Rights of Man, and US Bill of Rights are classic foundational Enlightenment legal texts. The Edict of Nantes was a 16th-century religious decree by Henry IV of France.',
        difficulty: 'medium',
      },
      {
        id: 'hq4',
        text: 'In 2-3 sentences, summarize how Jean-Jacques Rousseau defined the concept of the "General Will".',
        type: 'short_answer',
        correctAnswer: 'The General Will represents the collective sovereign interest and common good of all citizens in a community, distinct from mere individual selfish desires.',
        points: 5,
        explanation: 'Rousseau distinguished the General Will (aimed at common welfare) from the "will of all" (sum of private interests).',
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'test-cs-301',
    title: 'Computer Science: Data Structures & Algorithmic Complexity',
    subject: 'Computer Science',
    grade: 'Grade 11-12 (AP CS)',
    description: 'Evaluates Big-O time complexity, arrays, hash maps, binary search trees, and sorting algorithm trade-offs.',
    durationMinutes: 25,
    passingScore: 75,
    createdBy: 'Dr. Clara Vance',
    createdAt: '2026-10-02T08:00:00Z',
    deadline: '2026-10-04T12:00:00Z',
    allowLateSubmission: true,
    status: 'published',
    tags: ['AP CS', 'Data Structures', 'Big-O'],
    questions: [
      {
        id: 'cq1',
        text: 'What is the average-case and worst-case time complexity of searching an element in a balanced Binary Search Tree (such as an AVL or Red-Black Tree) containing n elements?',
        type: 'single',
        options: [
          'O(log n) average, O(log n) worst',
          'O(1) average, O(n) worst',
          'O(log n) average, O(n) worst',
          'O(n) average, O(n log n) worst',
        ],
        correctAnswer: 'O(log n) average, O(log n) worst',
        points: 5,
        explanation: 'In a self-balancing binary search tree, rotations ensure the height h remains strictly bounded by O(log n), guaranteeing both average and worst-case search times of O(log n).',
        difficulty: 'medium',
      },
      {
        id: 'cq2',
        text: 'Hash tables guarantee O(1) worst-case lookup time even in the presence of pathological hash collisions.',
        type: 'boolean',
        options: ['True', 'False'],
        correctAnswer: 'False',
        points: 3,
        explanation: 'Hash tables have O(1) average case lookup, but if all keys hash to the same bucket (collision), lookup degrades to O(n) unless balanced trees are used for bucket chains (O(log n)).',
        difficulty: 'easy',
      },
      {
        id: 'cq3',
        text: 'Which of the following sorting algorithms have an average time complexity of O(n log n)? (Select all that apply)',
        type: 'multiple',
        options: [
          'Merge Sort',
          'Quick Sort',
          'Heap Sort',
          'Bubble Sort',
        ],
        correctAnswer: [
          'Merge Sort',
          'Quick Sort',
          'Heap Sort',
        ],
        points: 6,
        explanation: 'Merge Sort, Quick Sort, and Heap Sort all exhibit O(n log n) average running time. Bubble Sort has O(n²) average time.',
        difficulty: 'medium',
      },
      {
        id: 'cq4',
        text: 'Explain why accessing an element by index in a contiguous array is O(1), whereas in a singly linked list it is O(n).',
        type: 'short_answer',
        correctAnswer: 'Arrays occupy contiguous memory allowing direct pointer arithmetic offset calculation (base + index * element_size) in constant time. Linked lists require sequential node traversal following pointers from head to target.',
        points: 6,
        explanation: 'Key points: contiguous memory layout allows direct mathematical index offset calculation in O(1); linked lists require pointer chasing along nodes in O(n).',
        difficulty: 'medium',
      },
    ],
  },
];

export const INITIAL_SUBMISSIONS: TestSubmission[] = [
  {
    id: 'sub-001',
    testId: 'test-physics-101',
    testTitle: 'AP Physics 1: Kinematics & Newton’s Laws',
    subject: 'Physics',
    studentId: 'student-1',
    studentName: 'Alex Rivera',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    submittedAt: '2026-10-03T11:24:00Z',
    timeSpentSeconds: 840,
    score: 23,
    maxScore: 25,
    percentage: 92,
    passed: true,
    status: 'graded',
    overallFeedback: 'Superb grasp of kinematics and Newton\'s laws. Clear explanation of inertia.',
    answers: [
      { questionId: 'q1', selectedAnswer: '4.04 m/s²', isCorrect: true, pointsAwarded: 5 },
      { questionId: 'q2', selectedAnswer: 'False', isCorrect: true, pointsAwarded: 3 },
      {
        questionId: 'q3',
        selectedAnswer: [
          'Horizontal velocity remains constant throughout flight.',
          'Vertical velocity is zero at the apex of trajectory.',
          'Acceleration vector points vertically downward throughout flight.',
        ],
        isCorrect: true,
        pointsAwarded: 6,
      },
      {
        questionId: 'q4',
        selectedAnswer: 'An object in motion remains in motion at constant velocity unless acted upon by an external net force. Inertia is the fundamental property of mass that resists changes.',
        isCorrect: true,
        pointsAwarded: 5,
        teacherComment: 'Very precise phrasing. Awarded 5/6.',
      },
      { questionId: 'q5', selectedAnswer: '14,160 N', isCorrect: true, pointsAwarded: 5 },
    ],
  },
  {
    id: 'sub-002',
    testId: 'test-physics-101',
    testTitle: 'AP Physics 1: Kinematics & Newton’s Laws',
    subject: 'Physics',
    studentId: 'student-2',
    studentName: 'Maya Lin',
    studentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    submittedAt: '2026-10-03T14:10:00Z',
    timeSpentSeconds: 1020,
    score: 21,
    maxScore: 25,
    percentage: 84,
    passed: true,
    status: 'graded',
    overallFeedback: 'Strong computational work on the elevator problem. Be careful with projectile acceleration at the peak.',
    answers: [
      { questionId: 'q1', selectedAnswer: '4.04 m/s²', isCorrect: true, pointsAwarded: 5 },
      { questionId: 'q2', selectedAnswer: 'False', isCorrect: true, pointsAwarded: 3 },
      {
        questionId: 'q3',
        selectedAnswer: [
          'Horizontal velocity remains constant throughout flight.',
          'Vertical acceleration is zero at the trajectory peak.',
        ],
        isCorrect: false,
        pointsAwarded: 2,
      },
      {
        questionId: 'q4',
        selectedAnswer: 'Newton\'s 1st law says things stay at rest or moving unless stopped. Mass gives objects inertia.',
        isCorrect: true,
        pointsAwarded: 6,
        teacherComment: 'Good intuitive summary.',
      },
      { questionId: 'q5', selectedAnswer: '14,160 N', isCorrect: true, pointsAwarded: 5 },
    ],
  },
  {
    id: 'sub-003',
    testId: 'test-physics-101',
    testTitle: 'AP Physics 1: Kinematics & Newton’s Laws',
    subject: 'Physics',
    studentId: 'student-3',
    studentName: 'Liam Chen',
    studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    submittedAt: '2026-10-04T09:45:00Z',
    timeSpentSeconds: 1190,
    score: 16,
    maxScore: 25,
    percentage: 64,
    passed: false,
    status: 'graded',
    overallFeedback: 'Review normal force calculations and how friction opposes applied horizontal forces.',
    answers: [
      { questionId: 'q1', selectedAnswer: '6.00 m/s²', isCorrect: false, pointsAwarded: 0 },
      { questionId: 'q2', selectedAnswer: 'False', isCorrect: true, pointsAwarded: 3 },
      {
        questionId: 'q3',
        selectedAnswer: [
          'Horizontal velocity remains constant throughout flight.',
          'Vertical velocity is zero at the apex of trajectory.',
        ],
        isCorrect: false,
        pointsAwarded: 4,
      },
      {
        questionId: 'q4',
        selectedAnswer: 'Things stay moving unless friction stops them. The property is weight.',
        isCorrect: false,
        pointsAwarded: 4,
        teacherComment: 'Remember that mass/inertia is the property, not gravitational weight.',
      },
      { questionId: 'q5', selectedAnswer: '11,760 N', isCorrect: false, pointsAwarded: 5 },
    ],
  },
  {
    id: 'sub-004',
    testId: 'test-history-201',
    testTitle: 'World History: Enlightenment & Democratic Revolutions',
    subject: 'World History',
    studentId: 'student-4',
    studentName: 'Sophia Zhang',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    submittedAt: '2026-10-04T16:15:00Z',
    timeSpentSeconds: 610,
    score: 17,
    maxScore: 17,
    percentage: 100,
    passed: true,
    status: 'graded',
    overallFeedback: 'Flawless test. Excellent articulation of Rousseau\'s General Will concept.',
    answers: [
      { questionId: 'hq1', selectedAnswer: 'Baron de Montesquieu', isCorrect: true, pointsAwarded: 4 },
      { questionId: 'hq2', selectedAnswer: 'True', isCorrect: true, pointsAwarded: 3 },
      {
        questionId: 'hq3',
        selectedAnswer: [
          'The Declaration of Independence (1776)',
          'The Declaration of the Rights of Man and of the Citizen (1789)',
          'The United States Bill of Rights (1791)',
        ],
        isCorrect: true,
        pointsAwarded: 5,
      },
      {
        questionId: 'hq4',
        selectedAnswer: 'Rousseau conceptualized the General Will as the holistic interest of the sovereign public body focused on collective moral and political good, prioritizing universal welfare over factional or individual self-interest.',
        isCorrect: true,
        pointsAwarded: 5,
      },
    ],
  },
  {
    id: 'sub-005',
    testId: 'test-cs-301',
    testTitle: 'Computer Science: Data Structures & Algorithmic Complexity',
    subject: 'Computer Science',
    studentId: 'student-1',
    studentName: 'Alex Rivera',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    submittedAt: '2026-10-04T18:30:00Z',
    timeSpentSeconds: 980,
    score: 20,
    maxScore: 20,
    percentage: 100,
    passed: true,
    status: 'graded',
    overallFeedback: 'Exemplary understanding of continuous memory addressing vs reference traversal.',
    answers: [
      { questionId: 'cq1', selectedAnswer: 'O(log n) average, O(log n) worst', isCorrect: true, pointsAwarded: 5 },
      { questionId: 'cq2', selectedAnswer: 'False', isCorrect: true, pointsAwarded: 3 },
      {
        questionId: 'cq3',
        selectedAnswer: ['Merge Sort', 'Quick Sort', 'Heap Sort'],
        isCorrect: true,
        pointsAwarded: 6,
      },
      {
        questionId: 'cq4',
        selectedAnswer: 'Arrays are stored in contiguous memory blocks, so indexing is computed directly via arithmetic in O(1). Singly linked lists have non-contiguous nodes linked by references, requiring linear traversal step-by-step.',
        isCorrect: true,
        pointsAwarded: 6,
      },
    ],
  },
];

export const INITIAL_DOCUMENTS: ClassDocument[] = [
  {
    id: 'doc-phys-001',
    title: 'AP Physics 1: Equations & Constants Reference Table',
    description: 'Standard College Board approved formulas for kinematics, Newtonian mechanics, work & energy, rotational motion, and harmonic oscillations.',
    subject: 'Physics',
    topic: 'Unit 1: Kinematics & Mechanics',
    type: 'pdf',
    fileSize: '1.4 MB',
    uploadedBy: 'Dr. Clara Vance',
    uploadedAt: '2026-09-27T08:30:00Z',
    isPinned: true,
    linkedTestId: 'test-physics-101',
    content: `# AP Physics 1 Formula Sheet

## Kinematics (Constant Acceleration)
- $v_x = v_{x0} + a_x t$
- $x = x_0 + v_{x0} t + \\frac{1}{2} a_x t^2$
- $v_x^2 = v_{x0}^2 + 2 a_x (x - x_0)$

## Newton's Laws & Dynamics
- $\\Sigma \\vec{F} = m \\vec{a}$
- $\\vec{F}_{friction} \\le \\mu_s |\\vec{F}_N|$
- $\\vec{F}_{friction, k} = \\mu_k |\\vec{F}_N|$

## Work, Energy & Power
- $W = F_\\parallel d = F d \\cos \\theta$
- $K = \\frac{1}{2} m v^2$
- $U_g = m g y$
- $P = \\frac{\\Delta E}{\\Delta t} = \\vec{F} \\cdot \\vec{v}$

Note: Permitted during all formal unit examinations. Keep printed or cached on your device.`,
  },
  {
    id: 'doc-phys-002',
    title: 'Kinematics & Free-Body Diagrams Problem Solving Guide',
    description: 'Step-by-step methodology for breaking vectors into orthogonal components and solving inclined planes with friction.',
    subject: 'Physics',
    topic: 'Unit 1: Kinematics & Mechanics',
    type: 'doc',
    fileSize: '840 KB',
    uploadedBy: 'Dr. Clara Vance',
    uploadedAt: '2026-09-29T14:15:00Z',
    isPinned: false,
    linkedTestId: 'test-physics-101',
    content: `# Problem Solving Protocol: Inclined Plane Dynamics

1. Identify All Contact and Field Forces:
   - Gravity: $F_g = mg$ acting straight downward.
   - Normal Force: perpendicular to the inclined surface ($F_N = mg \\cos\\theta$).
   - Friction: opposes instantaneous velocity or impending motion ($F_f = \\mu F_N$).

2. Choose Rotated Coordinate Axes:
   - Align the x-axis parallel to the incline.
   - Align the y-axis perpendicular to the incline.

3. Decompose Gravitational Force:
   - $F_{gx} = mg \\sin\\theta$ (down the slope)
   - $F_{gy} = mg \\cos\\theta$ (into the slope)`,
  },
  {
    id: 'doc-hist-001',
    title: 'Enlightenment Thinkers: Selected Excerpts (Locke, Rousseau, Montesquieu)',
    description: 'Curated primary source packet with side-by-side textual analysis questions for the democratic revolution unit.',
    subject: 'World History',
    topic: 'Unit 3: Age of Revolutions',
    type: 'pdf',
    fileSize: '2.8 MB',
    uploadedBy: 'Mr. Marcus Sterling',
    uploadedAt: '2026-10-01T11:00:00Z',
    isPinned: true,
    linkedTestId: 'test-history-201',
    content: `# Primary Source Dossier: Social Contract Theory

### John Locke: Second Treatise of Civil Government (1689)
"The state of nature has a law of nature to govern it, which obliges every one: and reason, which is that law, teaches all mankind, who will but consult it, that being all equal and independent, no one ought to harm another in his life, health, liberty, or possessions..."

### Jean-Jacques Rousseau: The Social Contract (1762)
"Man is born free; and everywhere he is in chains... What then is the General Will? It is not the mere aggregation of particular wills, but the constant will of all the members of the state."`,
  },
  {
    id: 'doc-cs-001',
    title: 'Data Structures Big-O Time & Space Complexity Matrix',
    description: 'Quick reference cheat-sheet for array, linked list, binary search tree, hash map, and heap operations.',
    subject: 'Computer Science',
    topic: 'Unit 2: Asymptotic Analysis',
    type: 'sheet',
    fileSize: '620 KB',
    uploadedBy: 'Dr. Clara Vance',
    uploadedAt: '2026-10-02T10:00:00Z',
    isPinned: true,
    linkedTestId: 'test-cs-301',
    content: `# Complexity Matrix Summary

- Array: Index Access O(1), Search O(n), Insertion/Deletion O(n)
- Singly Linked List: Access O(n), Prepend O(1), Delete with pointer O(1)
- Balanced BST (AVL/Red-Black): Search O(log n), Insert O(log n), Delete O(log n)
- Hash Table: Average Search O(1), Worst Case O(n) under full collision`,
  },
];

export const INITIAL_ANNOUNCEMENTS: ClassAnnouncement[] = [
  {
    id: 'ann-001',
    authorName: 'Dr. Clara Vance',
    authorRole: 'Head of STEM Assessments',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'AP Physics Kinematics Unit Test Published & Reference Sheet Uploaded to Drive',
    content: 'Good morning students. The AP Physics 1 Unit Test on Kinematics and Newton\'s Laws is now live. Please review the official College Board Formula Reference Sheet in the Class Drive before starting. Remember that you have a 20-minute countdown once you begin.',
    createdAt: '2026-10-03T09:00:00Z',
    subject: 'Physics',
    attachedDocIds: ['doc-phys-001', 'doc-phys-002'],
    attachedTestId: 'test-physics-101',
  },
  {
    id: 'ann-002',
    authorName: 'Mr. Marcus Sterling',
    authorRole: 'Senior Humanities Instructor',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'World History: Enlightenment Primary Source Documents Available',
    content: 'Hello class, I have posted the primary source excerpts for Locke, Rousseau, and Montesquieu into the Class Drive. Be sure to study Rousseau\'s concept of the General Will before taking the assessment.',
    createdAt: '2026-10-02T13:30:00Z',
    subject: 'World History',
    attachedDocIds: ['doc-hist-001'],
    attachedTestId: 'test-history-201',
  },
];
