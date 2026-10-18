import type { InteractiveGuideContent } from "@/types/activity";

export const pastPerfectContinuousWorkContent: InteractiveGuideContent = {
  "type": "interactive-guide",
  "tableOfContents": true,
  "sections": [
    {
      "id": "past-perfect-continuous-work-s1",
      "title": "Before that day",
      "explanation": "<p>Last year, Nadine worked in a hotel laundry. Her supervisor Jennifer announced a new schedule.</p><p><strong>Nadine:</strong> I had been working nights for two years when the schedule changed.</p><p><strong>Jennifer:</strong> You had been working nights for a long time!</p><p>Look back from a past event. Describe the activity leading up to it.</p><p><strong>Start working → two years of night shifts → schedule changed → now</strong></p>",
      "tenseDiagram": {
        "title": "Before that day",
        "elements": [
          {
            "id": "duration",
            "type": "solid-to-point",
            "zone": "past-earlier",
            "position": 35,
            "verbLabel": "had been working",
            "connectedTo": "reference"
          },
          {
            "id": "reference",
            "type": "single-dot",
            "zone": "past-later",
            "position": 75,
            "verbLabel": "past event"
          }
        ]
      },
      "exercises": [
        {
          "id": "past-perfect-continuous-work-practice-1",
          "title": "Try the pattern",
          "answerExpectation": "missing-words",
          "items": [
            {
              "type": "text",
              "label": "Nadine ___ (work) nights for two years when the schedule changed. Use had been + -ing.",
              "expectedAnswers": [
                "had been working"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "past-perfect-continuous-work-s2",
      "title": "Build the sentence",
      "explanation": "<p><strong>Subject + had been + verb-ing</strong>. Use the same helper words with I, you, he, she, we, and they.</p><p>Minh had been cleaning rooms for three hours when his break started.</p><p><strong>For</strong> gives a length of time. <strong>Since</strong> gives a starting point: He had been cleaning since 8 a.m.</p>",
      "tenseDiagram": {
        "title": "Build the sentence",
        "elements": [
          {
            "id": "duration",
            "type": "solid-to-point",
            "zone": "past-earlier",
            "position": 35,
            "verbLabel": "had been cleaning",
            "connectedTo": "reference"
          },
          {
            "id": "reference",
            "type": "single-dot",
            "zone": "past-later",
            "position": 75,
            "verbLabel": "past event"
          }
        ]
      },
      "exercises": [
        {
          "id": "past-perfect-continuous-work-practice-2",
          "title": "Try the pattern",
          "answerExpectation": "missing-words",
          "items": [
            {
              "type": "text",
              "label": "Minh ___ (clean) rooms for three hours when his break started. Use the past perfect continuous.",
              "expectedAnswers": [
                "had been cleaning"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "past-perfect-continuous-work-s3",
      "title": "Now or a past event?",
      "explanation": "<p>W25: <strong>I have been working here for two years.</strong> Count the time up to now.</p><p>Today: <strong>I had been working there for two years when the hotel closed.</strong> Count the time up to a past event.</p><p>W20: <strong>I had finished my shift when Jennifer called.</strong> This emphasizes a completed action, rather than its duration.</p>",
      "tenseDiagram": {
        "title": "Now or a past event?",
        "elements": [
          {
            "id": "duration",
            "type": "solid-to-point",
            "zone": "past-earlier",
            "position": 35,
            "verbLabel": "had been waiting",
            "connectedTo": "reference"
          },
          {
            "id": "reference",
            "type": "single-dot",
            "zone": "past-later",
            "position": 75,
            "verbLabel": "past event"
          }
        ]
      },
      "exercises": [
        {
          "id": "past-perfect-continuous-work-practice-3",
          "title": "Try the pattern",
          "answerExpectation": "missing-words",
          "items": [
            {
              "type": "text",
              "label": "I ___ (wait) for an hour when the manager finally arrived yesterday. Emphasize the duration with had been + -ing.",
              "expectedAnswers": [
                "had been waiting"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "past-perfect-continuous-work-s4",
      "title": "Tell a short work story",
      "explanation": "<p>Use familiar activities: working, waiting, cleaning, studying. Start with a model, then say a true or imagined sentence to a partner.</p><p><strong>I had been ___ for ___ when ___.</strong></p><p>Try your sentence, check the helpers, then revise. A complete practice attempt earns effort credit even if you need corrections.</p>",
      "tenseDiagram": {
        "title": "Tell a short work story",
        "elements": [
          {
            "id": "duration",
            "type": "solid-to-point",
            "zone": "past-earlier",
            "position": 35,
            "verbLabel": "had been studying",
            "connectedTo": "reference"
          },
          {
            "id": "reference",
            "type": "single-dot",
            "zone": "past-later",
            "position": 75,
            "verbLabel": "past event"
          }
        ]
      },
      "exercises": [
        {
          "id": "past-perfect-continuous-work-practice-4",
          "title": "Try the pattern",
          "answerExpectation": "missing-words",
          "items": [
            {
              "type": "text",
              "label": "Complete the model: I ___ (study) English for six months when I started my new job. Use the past perfect continuous.",
              "expectedAnswers": [
                "had been studying"
              ]
            }
          ]
        }
      ]
    }
  ],
  "miniQuiz": [
    {
      "id": "past-perfect-continuous-work-q1",
      "type": "fill-blank",
      "question": "Nadine ___ (work) nights for two years when the schedule changed. Use had been + -ing.",
      "correctAnswer": "had been working",
      "explanation": "had been working. Count duration up to the stated time."
    },
    {
      "id": "past-perfect-continuous-work-q2",
      "type": "fill-blank",
      "question": "Minh ___ (clean) rooms for three hours when his break started. Use the past perfect continuous.",
      "correctAnswer": "had been cleaning",
      "explanation": "had been cleaning. Count duration up to the stated time."
    },
    {
      "id": "past-perfect-continuous-work-q3",
      "type": "fill-blank",
      "question": "I ___ (wait) for an hour when the manager finally arrived yesterday. Emphasize the duration with had been + -ing.",
      "correctAnswer": "had been waiting",
      "explanation": "had been waiting. Count duration up to the stated time."
    },
    {
      "id": "past-perfect-continuous-work-q4",
      "type": "fill-blank",
      "question": "Complete the model: I ___ (study) English for six months when I started my new job. Use the past perfect continuous.",
      "correctAnswer": "had been studying",
      "explanation": "had been studying. Count duration up to the stated time."
    },
    {
      "id": "past-perfect-continuous-work-q5",
      "type": "fill-blank",
      "question": "Before the hotel closed, we ___ (work) there for a year. Use the past perfect continuous.",
      "correctAnswer": "had been working",
      "explanation": "Keep the helper words together: had been working."
    }
  ]
};
