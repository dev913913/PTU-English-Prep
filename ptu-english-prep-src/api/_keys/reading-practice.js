// PRIVATE: this folder starts with "_" so Vercel never serves it as a web address.
// Only api/evaluate-reading.js reads it. Keep the passage and question text
// identical to src/content/theory/unit3/reading/reading-practice.json.
export default {
  title: 'Reading Practice: The Value of Listening',
  maxMarksPerQuestion: 2,
  passage:
    'Most people think that good communication means speaking well. In reality, listening is at least as important. A good listener does not simply wait for his turn to talk; he pays full attention, notices the speaker\'s tone, and asks questions when something is unclear. This habit prevents misunderstandings that often waste time in offices and classrooms. It also makes the speaker feel respected, which builds trust. Poor listeners, on the other hand, interrupt, check their phones, and answer before the speaker has finished. Such behaviour sends a message that the other person is not worth the time. Fortunately, listening can be practised. A person can begin by making eye contact, summarising what was heard, and resisting the urge to interrupt.',
  questions: [
    {
      id: 'q1',
      text: 'According to the passage, why is listening at least as important as speaking?',
      modelAnswer:
        'Listening prevents misunderstandings and builds trust, so communication works properly; speaking alone is not enough.',
      keyPoints: [
        'Listening prevents misunderstandings (and saves time).',
        'It makes the speaker feel respected and builds trust.',
      ],
    },
    {
      id: 'q2',
      text: 'What does a good listener do?',
      modelAnswer:
        'A good listener pays full attention, notices the speaker\'s tone, and asks questions when something is unclear instead of just waiting to talk.',
      keyPoints: [
        'Pays full attention / does not just wait for a turn to talk.',
        'Notices tone.',
        'Asks questions when something is unclear.',
      ],
    },
    {
      id: 'q3',
      text: 'Name two habits of a poor listener.',
      modelAnswer:
        'A poor listener interrupts the speaker and checks the phone; he may also answer before the speaker has finished.',
      keyPoints: [
        'Interrupts.',
        'Checks the phone.',
        'Answers before the speaker finishes (any two habits earn full marks).',
      ],
    },
    {
      id: 'q4',
      text: 'What message does poor listening send to the speaker?',
      modelAnswer:
        'It tells the speaker that he or she is not worth the listener\'s time.',
      keyPoints: ['The other person is not worth the time / is not respected.'],
    },
    {
      id: 'q5',
      text: 'How can a person improve their listening skills?',
      modelAnswer:
        'A person can improve by making eye contact, summarising what was heard, and resisting the urge to interrupt.',
      keyPoints: [
        'Make eye contact.',
        'Summarise what was heard.',
        'Resist the urge to interrupt.',
      ],
    },
  ],
}
