#!/usr/bin/env python3
"""
Script to help create the remaining comparison guides.
This is a helper script - the actual guides will be created manually.
"""

guides = [
    {
        'filename': 'past-simple-vs-past-continuous-complete-guide.html',
        'title': 'Past Simple vs Past Continuous - Complete Guide',
        'description': 'Complete guide comparing Past Simple and Past Continuous tenses with explanations and practice exercises.',
        'color1': '#f97316',  # orange for past simple
        'color2': '#ec4899',  # pink for continuous
        'tense1': 'Past Simple',
        'tense2': 'Past Continuous',
        'key_diff': 'Past Simple = completed actions. Past Continuous = actions in progress at a specific time.'
    },
    {
        'filename': 'past-simple-vs-present-perfect-complete-guide.html',
        'title': 'Past Simple vs Present Perfect - Complete Guide',
        'description': 'Complete guide comparing Past Simple and Present Perfect tenses with explanations and practice exercises.',
        'color1': '#f97316',  # orange for past simple
        'color2': '#6366f1',  # indigo for present perfect
        'tense1': 'Past Simple',
        'tense2': 'Present Perfect',
        'key_diff': 'Past Simple = specific past time. Present Perfect = connection to now.'
    },
    {
        'filename': 'past-perfect-vs-past-simple-complete-guide.html',
        'title': 'Past Perfect vs Past Simple - Complete Guide',
        'description': 'Complete guide comparing Past Perfect and Past Simple tenses with explanations and practice exercises.',
        'color1': '#8b5cf6',  # purple for past perfect
        'color2': '#f97316',  # orange for past simple
        'tense1': 'Past Perfect',
        'tense2': 'Past Simple',
        'key_diff': 'Past Perfect = before another past action. Past Simple = completed past action.'
    },
    {
        'filename': 'will-vs-going-to-complete-guide.html',
        'title': 'Will vs Going to - Complete Guide',
        'description': 'Complete guide comparing Will and Going to for future expressions with explanations and practice exercises.',
        'color1': '#06b6d4',  # cyan for will
        'color2': '#10b981',  # green for going to
        'tense1': 'Will',
        'tense2': 'Going to',
        'key_diff': 'Will = spontaneous decisions, predictions. Going to = plans, intentions.'
    },
    {
        'filename': 'present-continuous-future-vs-going-to-complete-guide.html',
        'title': 'Present Continuous for Future vs Going to - Complete Guide',
        'description': 'Complete guide comparing Present Continuous for future and Going to with explanations and practice exercises.',
        'color1': '#ec4899',  # pink for present continuous
        'color2': '#10b981',  # green for going to
        'tense1': 'Present Continuous (Future)',
        'tense2': 'Going to',
        'key_diff': 'Present Continuous = arranged future. Going to = planned future.'
    },
    {
        'filename': 'plans-vs-predictions-complete-guide.html',
        'title': 'Plans vs Predictions - Complete Guide',
        'description': 'Complete guide explaining the difference between plans and predictions in future expressions.',
        'color1': '#10b981',  # green for plans
        'color2': '#06b6d4',  # cyan for predictions
        'tense1': 'Plans',
        'tense2': 'Predictions',
        'key_diff': 'Plans = intentions/arrangements. Predictions = what will happen.'
    },
    {
        'filename': 'simple-vs-continuous-tenses-complete-guide.html',
        'title': 'Simple vs Continuous Tenses - Complete Guide',
        'description': 'Complete guide comparing Simple and Continuous tenses across all time periods.',
        'color1': '#6366f1',  # indigo for simple
        'color2': '#ec4899',  # pink for continuous
        'tense1': 'Simple Tenses',
        'tense2': 'Continuous Tenses',
        'key_diff': 'Simple = habits/completed actions. Continuous = actions in progress.'
    },
    {
        'filename': 'simple-vs-perfect-tenses-complete-guide.html',
        'title': 'Simple vs Perfect Tenses - Complete Guide',
        'description': 'Complete guide comparing Simple and Perfect tenses across all time periods.',
        'color1': '#6366f1',  # indigo for simple
        'color2': '#8b5cf6',  # purple for perfect
        'tense1': 'Simple Tenses',
        'tense2': 'Perfect Tenses',
        'key_diff': 'Simple = single actions/habits. Perfect = completed actions with connection to another time.'
    },
    {
        'filename': 'continuous-vs-perfect-continuous-tenses-complete-guide.html',
        'title': 'Continuous vs Perfect Continuous Tenses - Complete Guide',
        'description': 'Complete guide comparing Continuous and Perfect Continuous tenses across all time periods.',
        'color1': '#ec4899',  # pink for continuous
        'color2': '#8b5cf6',  # purple for perfect continuous
        'tense1': 'Continuous Tenses',
        'tense2': 'Perfect Continuous Tenses',
        'key_diff': 'Continuous = actions in progress. Perfect Continuous = duration up to a point.'
    },
]

print(f"Total guides to create: {len(guides)}")
for i, guide in enumerate(guides, 1):
    print(f"{i}. {guide['filename']}")
    print(f"   Title: {guide['title']}")
    print(f"   Key Difference: {guide['key_diff']}")
    print()
