const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic();

const SUMMARY_QUIZ_SCHEMA = {
  type: 'object',
  properties: {
    summary: {
      type: 'array',
      items: { type: 'string' },
    },
    quiz: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          options: { type: 'array', items: { type: 'string' } },
          correctIndex: { type: 'integer' },
        },
        required: ['question', 'options', 'correctIndex'],
        additionalProperties: false,
      },
    },
  },
  required: ['summary', 'quiz'],
  additionalProperties: false,
};

async function generateSummaryAndQuiz(noteContent) {
  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 2048,
    system:
      'You analyze study notes for the StudyMate app. Respond only with the structured JSON described by the schema.',
    messages: [
      {
        role: 'user',
        content: `Analyze the following study notes.

1. Produce exactly 3 concise bullet points summarizing the core ideas (plain strings, no leading dashes or bullet characters).
2. Generate exactly 3 multiple-choice questions that test understanding of the notes. Each question must have exactly 4 answer options and a zero-based "correctIndex" pointing at the correct option.

Notes:
"""
${noteContent}
"""`,
      },
    ],
    output_config: {
      format: { type: 'json_schema', schema: SUMMARY_QUIZ_SCHEMA },
    },
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  const parsed = JSON.parse(textBlock.text);

  return {
    summary: parsed.summary.slice(0, 3),
    quiz: parsed.quiz.slice(0, 3),
  };
}

module.exports = { generateSummaryAndQuiz };
