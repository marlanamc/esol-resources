import type { InteractiveGuideContent } from "@/types/activity";

export const futurePerfectGoalsContent: InteractiveGuideContent = {
  "type": "interactive-guide",
  "tableOfContents": true,
  "sections": [
    {
      "id": "future-perfect-goals-s1",
      "title": "Finished by a future date",
      "explanation": "<p>Beatriz works in a restaurant. She is making a small walking plan with her coworker Sarah.</p><p><strong>Beatriz:</strong> By the end of May, I will have completed my walking plan.</p><p><strong>Sarah:</strong> By Friday, I will have finished my activity log.</p><p><strong>Now → work on the goal → finished by the deadline</strong></p>",
      "tenseDiagram": {
        "title": "Finished by a future date",
        "elements": [
          {
            "id": "result",
            "type": "arc",
            "zone": "future",
            "position": 35,
            "verbLabel": "will have finished",
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
          "id": "future-perfect-goals-practice-1",
          "title": "Try the pattern",
          "answerExpectation": "missing-words",
          "items": [
            {
              "type": "text",
              "label": "By Friday, Sarah ___ (finish) her activity log. Use will have + past participle.",
              "expectedAnswers": [
                "will have finished"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "future-perfect-goals-s2",
      "title": "Build the sentence",
      "explanation": "<p><strong>Subject + will have + past participle (V3)</strong>.</p><p>Use familiar V3 forms: finished, completed, written, done. The helper words stay the same for every subject.</p><p>By Sunday, Tuan will have written his plan for the next week.</p>",
      "tenseDiagram": {
        "title": "Build the sentence",
        "elements": [
          {
            "id": "result",
            "type": "arc",
            "zone": "future",
            "position": 35,
            "verbLabel": "will have written",
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
          "id": "future-perfect-goals-practice-2",
          "title": "Try the pattern",
          "answerExpectation": "missing-words",
          "items": [
            {
              "type": "text",
              "label": "By Sunday, Tuan ___ (write) his plan. Use the future perfect.",
              "expectedAnswers": [
                "will have written"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "future-perfect-goals-s3",
      "title": "A plan or a completed milestone?",
      "explanation": "<p><strong>I am going to write my plan tonight.</strong> This tells us my intention.</p><p><strong>By tomorrow, I will have written my plan.</strong> This looks back from a future deadline at the completed result.</p><p><strong>By Friday</strong> means no later than Friday. A by-phrase does not always require the future perfect; today we are practicing that form.</p>",
      "tenseDiagram": {
        "title": "A plan or a completed milestone?",
        "elements": [
          {
            "id": "result",
            "type": "arc",
            "zone": "future",
            "position": 35,
            "verbLabel": "will have completed",
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
          "id": "future-perfect-goals-practice-3",
          "title": "Try the pattern",
          "answerExpectation": "missing-words",
          "items": [
            {
              "type": "text",
              "label": "By the end of May, Beatriz ___ (complete) her walking plan. Use the future perfect.",
              "expectedAnswers": [
                "will have completed"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "future-perfect-goals-s4",
      "title": "Your next small milestone",
      "explanation": "<p>Choose a realistic goal: finish a plan, write a list, complete a class activity. Tell a partner: <strong>By ___, I will have ___.</strong></p><p>Keep the goal small enough to fit around work and family. A complete practice attempt earns effort credit; check and revise after feedback.</p>",
      "tenseDiagram": {
        "title": "Your next small milestone",
        "elements": [
          {
            "id": "result",
            "type": "arc",
            "zone": "future",
            "position": 35,
            "verbLabel": "will have done",
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
          "id": "future-perfect-goals-practice-4",
          "title": "Try the pattern",
          "answerExpectation": "missing-words",
          "items": [
            {
              "type": "text",
              "label": "By Thursday, I ___ (do) my English homework. Use the future perfect.",
              "expectedAnswers": [
                "will have done"
              ]
            }
          ]
        }
      ]
    }
  ],
  "miniQuiz": [
    {
      "id": "future-perfect-goals-q1",
      "type": "fill-blank",
      "question": "By Friday, Sarah ___ (finish) her activity log. Use will have + past participle.",
      "correctAnswer": "will have finished",
      "explanation": "will have finished. Look at the completed result by a future deadline."
    },
    {
      "id": "future-perfect-goals-q2",
      "type": "fill-blank",
      "question": "By Sunday, Tuan ___ (write) his plan. Use the future perfect.",
      "correctAnswer": "will have written",
      "explanation": "will have written. Look at the completed result by a future deadline."
    },
    {
      "id": "future-perfect-goals-q3",
      "type": "fill-blank",
      "question": "By the end of May, Beatriz ___ (complete) her walking plan. Use the future perfect.",
      "correctAnswer": "will have completed",
      "explanation": "will have completed. Look at the completed result by a future deadline."
    },
    {
      "id": "future-perfect-goals-q4",
      "type": "fill-blank",
      "question": "By Thursday, I ___ (do) my English homework. Use the future perfect.",
      "correctAnswer": "will have done",
      "explanation": "will have done. Look at the completed result by a future deadline."
    },
    {
      "id": "future-perfect-goals-q5",
      "type": "fill-blank",
      "question": "By Monday, we ___ (finish) the plan. Use the future perfect.",
      "correctAnswer": "will have finished",
      "explanation": "Keep the helper words together: will have finished."
    }
  ]
};
