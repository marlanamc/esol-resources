import type { InteractiveGuideContent } from "@/types/activity";

export const futurePerfectContinuousProgressContent: InteractiveGuideContent = {
  "type": "interactive-guide",
  "tableOfContents": true,
  "sections": [
    {
      "id": "future-perfect-continuous-progress-s1",
      "title": "How long by then?",
      "explanation": "<p>Fabienne started this English class in September. She talks with her classmate Michael before their June class.</p><p><strong>Fabienne:</strong> By June, I will have been studying here for about nine months.</p><p><strong>Michael:</strong> By June, I will have been working at the restaurant for a year.</p><p><strong>Start → activity continues through now → count its duration at a future point</strong></p>",
      "tenseDiagram": {
        "title": "How long by then?",
        "elements": [
          {
            "id": "duration",
            "type": "solid-to-point",
            "zone": "future",
            "position": 35,
            "verbLabel": "will have been studying",
            "connectedTo": "reference"
          },
          {
            "id": "reference",
            "type": "single-dot",
            "zone": "future",
            "position": 75,
            "verbLabel": "future deadline"
          }
        ]
      },
      "exercises": [
        {
          "id": "future-perfect-continuous-progress-practice-1",
          "title": "Try the pattern",
          "answerExpectation": "missing-words",
          "items": [
            {
              "type": "text",
              "label": "By June, Fabienne ___ (study) here for about nine months. Use will have been + -ing.",
              "expectedAnswers": [
                "will have been studying"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "future-perfect-continuous-progress-s2",
      "title": "Build the sentence in chunks",
      "explanation": "<p><strong>Subject | will have been | verb-ing | for + duration</strong>.</p><p>Michael | will have been | working | for a year.</p><p>Keep the helper words together. They do not change with the subject. Start with familiar activities such as working, studying, and practicing.</p>",
      "tenseDiagram": {
        "title": "Build the sentence in chunks",
        "elements": [
          {
            "id": "duration",
            "type": "solid-to-point",
            "zone": "future",
            "position": 35,
            "verbLabel": "will have been working",
            "connectedTo": "reference"
          },
          {
            "id": "reference",
            "type": "single-dot",
            "zone": "future",
            "position": 75,
            "verbLabel": "future deadline"
          }
        ]
      },
      "exercises": [
        {
          "id": "future-perfect-continuous-progress-practice-2",
          "title": "Try the pattern",
          "answerExpectation": "missing-words",
          "items": [
            {
              "type": "text",
              "label": "By June, Michael ___ (work) at the restaurant for a year. Use the future perfect continuous.",
              "expectedAnswers": [
                "will have been working"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "future-perfect-continuous-progress-s3",
      "title": "Finished result or duration?",
      "explanation": "<p>W32: <strong>By June, I will have completed the course.</strong> Focus: the finished result.</p><p>Today: <strong>By June, I will have been studying for about nine months.</strong> Focus: how long the activity has continued up to that future point.</p><p>W25 counts duration up to now. W26 counts duration up to a past event. Today we count up to a future point.</p>",
      "tenseDiagram": {
        "title": "Finished result or duration?",
        "elements": [
          {
            "id": "duration",
            "type": "solid-to-point",
            "zone": "future",
            "position": 35,
            "verbLabel": "will have been practicing",
            "connectedTo": "reference"
          },
          {
            "id": "reference",
            "type": "single-dot",
            "zone": "future",
            "position": 75,
            "verbLabel": "future deadline"
          }
        ]
      },
      "exercises": [
        {
          "id": "future-perfect-continuous-progress-practice-3",
          "title": "Try the pattern",
          "answerExpectation": "missing-words",
          "items": [
            {
              "type": "text",
              "label": "By Friday, Lan ___ (practice) her presentation for two weeks. Emphasize duration with the future perfect continuous.",
              "expectedAnswers": [
                "will have been practicing"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "future-perfect-continuous-progress-s4",
      "title": "Say one sentence about progress",
      "explanation": "<p>Use a real or imagined activity with a clear starting point: <strong>By ___, I will have been ___ for ___.</strong></p><p>Say the helper words slowly, then add the activity and duration. A complete attempt earns effort credit; use feedback to revise.</p>",
      "tenseDiagram": {
        "title": "Say one sentence about progress",
        "elements": [
          {
            "id": "duration",
            "type": "solid-to-point",
            "zone": "future",
            "position": 35,
            "verbLabel": "will have been learning",
            "connectedTo": "reference"
          },
          {
            "id": "reference",
            "type": "single-dot",
            "zone": "future",
            "position": 75,
            "verbLabel": "future deadline"
          }
        ]
      },
      "exercises": [
        {
          "id": "future-perfect-continuous-progress-practice-4",
          "title": "Try the pattern",
          "answerExpectation": "missing-words",
          "items": [
            {
              "type": "text",
              "label": "By next month, I ___ (learn) English for a year. Use the future perfect continuous.",
              "expectedAnswers": [
                "will have been learning"
              ]
            }
          ]
        }
      ]
    }
  ],
  "miniQuiz": [
    {
      "id": "future-perfect-continuous-progress-q1",
      "type": "fill-blank",
      "topic": "future-perfect-continuous",
      "skill": "form",
      "skillTag": "form-future-perfect-continuous-positive",
      "question": "By June, Fabienne ___ (study) here for about nine months. Use will have been + -ing.",
      "correctAnswer": "will have been studying",
      "explanation": "will have been studying. Count duration up to the stated time."
    },
    {
      "id": "future-perfect-continuous-progress-q2",
      "type": "fill-blank",
      "topic": "future-perfect-continuous",
      "skill": "form",
      "skillTag": "form-future-perfect-continuous-positive",
      "question": "By June, Michael ___ (work) at the restaurant for a year. Use the future perfect continuous.",
      "correctAnswer": "will have been working",
      "explanation": "will have been working. Count duration up to the stated time."
    },
    {
      "id": "future-perfect-continuous-progress-q3",
      "type": "fill-blank",
      "topic": "future-perfect-continuous",
      "skill": "form",
      "skillTag": "form-future-perfect-continuous-positive",
      "question": "By Friday, Lan ___ (practice) her presentation for two weeks. Emphasize duration with the future perfect continuous.",
      "correctAnswer": "will have been practicing",
      "explanation": "will have been practicing. Count duration up to the stated time."
    },
    {
      "id": "future-perfect-continuous-progress-q4",
      "type": "fill-blank",
      "topic": "future-perfect-continuous",
      "skill": "form",
      "skillTag": "form-future-perfect-continuous-positive",
      "question": "By next month, I ___ (learn) English for a year. Use the future perfect continuous.",
      "correctAnswer": "will have been learning",
      "explanation": "will have been learning. Count duration up to the stated time."
    },
    {
      "id": "future-perfect-continuous-progress-q5",
      "type": "fill-blank",
      "topic": "future-perfect-continuous",
      "skill": "form",
      "skillTag": "form-future-perfect-continuous-positive",
      "question": "By next month, we ___ (study) together for a year. Use the future perfect continuous.",
      "correctAnswer": "will have been studying",
      "explanation": "Keep the helper words together: will have been studying."
    }
  ]
};
