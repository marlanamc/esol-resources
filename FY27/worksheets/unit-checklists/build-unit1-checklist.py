"""Build the Unit 1 student handout from the current Unit 1 vocabulary sources."""
import json
import subprocess
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Flowable,
    HRFlowable,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

DIVIDER = HRFlowable(width='100%', thickness=0.6, color=colors.HexColor('#999999'), spaceBefore=5, spaceAfter=5)

ATKINSON_DIR = Path(__file__).resolve().parent / 'fonts'
FONT_DIR = Path('/System/Library/Fonts/Supplemental')
pdfmetrics.registerFont(TTFont('Body', str(ATKINSON_DIR / 'AtkinsonHyperlegibleNext-Regular.ttf')))
pdfmetrics.registerFont(TTFont('Body-Bold', str(ATKINSON_DIR / 'AtkinsonHyperlegibleNext-Bold.ttf')))
# Atkinson Hyperlegible Next ships no italic as a TrueType file; Arial covers the occasional <i> run.
pdfmetrics.registerFont(TTFont('Body-Italic', str(FONT_DIR / 'Arial Italic.ttf')))
pdfmetrics.registerFont(TTFont('Body-BoldItalic', str(FONT_DIR / 'Arial Bold Italic.ttf')))
pdfmetrics.registerFontFamily(
    'Body', normal='Body', bold='Body-Bold', italic='Body-Italic', boldItalic='Body-BoldItalic'
)

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / 'output/pdf/fy27-unit-1-checklist.pdf'

words = json.loads(subprocess.check_output(
    ['node', '-e', (
        "const {weeklyVocabData:d}=require('./scripts/vocab/weekly-vocab-data'); "
        "console.log(JSON.stringify(['sep-w1','sep-w2','sep-w4'].map(k=>d[k].words)))"
    )],
    cwd=ROOT,
))

styles = {
    'title': ParagraphStyle('title', fontName='Body-Bold', fontSize=23, leading=26, alignment=TA_CENTER),
    'subtitle': ParagraphStyle('subtitle', fontName='Body', fontSize=10, leading=13, alignment=TA_CENTER),
    'sub': ParagraphStyle('sub', fontName='Body', fontSize=10, leading=13),
    'h': ParagraphStyle('h', fontName='Body-Bold', fontSize=12, leading=15, spaceBefore=4, spaceAfter=6),
    'body': ParagraphStyle('body', fontName='Body', fontSize=10.5, leading=14),
    'word': ParagraphStyle('word', fontName='Body', fontSize=9.7, leading=12),
    'small': ParagraphStyle('small', fontName='Body', fontSize=9, leading=12),
}


def p(text, style='body'):
    return Paragraph(text, styles[style])


def blank(label, width=528, style='body'):
    font = styles[style].fontName
    size = styles[style].fontSize
    prefix = label + ': '
    avail = width - stringWidth(prefix, font, size)
    underscore_w = stringWidth('_', font, size)
    n = max(10, int(avail / underscore_w))
    return p(prefix + '_' * n, style)


class Box(Flowable):
    def __init__(self):
        Flowable.__init__(self)
        self.width = 10
        self.height = 14

    def draw(self):
        self.canv.setLineWidth(.8)
        self.canv.rect(0, 1, 9, 9)


def check(text, width=540, style='body'):
    t = Table([[Box(), p(text, style)]], colWidths=[16, width - 16], hAlign='LEFT')
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    return t


story = [
    p('Unit 1: Getting to Know You', 'title'),
    p('MY END-OF-UNIT CHECKLIST  |  Weeks 1-3  |  September', 'subtitle'),
    Spacer(1, 3),
    p('Our goal: Introduce ourselves and get to know our classmates.', 'h'),
    p('Check what you can do. Circle anything you want to practice again. Using help counts!', 'sub'),
]
for s in [
    'I can introduce myself and share something about my life.',
    'I can ask a classmate a question and listen to their answer.',
    'I can tell someone one thing I learned about a classmate.',
]:
    story.append(check(s))

story += [
    DIVIDER,
    p('1. Our vocabulary: 18 words', 'h'),
    p('Check words you can explain or use. All of these words are verbs in our lessons.', 'sub'),
    Spacer(1, 5),
]

heads = ['Week 1: Introductions', 'Week 2: Say It & Spell It', 'Week 3: Personal Journey']
short_defs = {
    'introduce': 'present yourself or another person',
    'greet': 'say hello to someone',
    'share': 'tell ideas, feelings, or information',
    'describe': 'say what someone or something is like',
    'prefer': 'like one thing more than another',
    'catch up': 'talk and share news',
    'pronounce': 'say a word correctly',
    'spell': 'say or write letters in order',
    'identify': 'recognize and name something',
    'categorize': 'put things into groups',
    'practice': 'do something often to improve',
    'repeat': 'do or say something again',
    'relocate': 'move to a new place to live or work',
    'motivate': 'give a reason to do something',
    'achieve': 'reach a goal through hard work',
    'overcome': 'successfully deal with a challenge',
    'immigrate': 'come to live in a new country permanently',
    'belong': 'feel accepted in a group or place',
}

cols = []
for title, group in zip(heads, words):
    content = [p(title, 'h')]
    for w in group:
        content.append(check('<b>' + escape(w['term']) + '</b><br/>' + escape(short_defs[w['term']]), 172, 'word'))
    cols.append(content)

t = Table([cols], colWidths=[180, 180, 180], hAlign='LEFT')
t.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('LEFTPADDING', (0, 0), (-1, -1), 0),
    ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ('TOPPADDING', (0, 0), (-1, -1), 0),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
]))
story.append(t)

story.append(DIVIDER)
story.append(p('2. Grammar we practiced', 'h'))
for s in [
    '<b>Nouns:</b> name a person, place, thing, or idea. <i>classmate, school, goal</i>',
    '<b>Verbs:</b> show an action or state. <i>share, practice, belong</i>',
    '<b>Adjectives:</b> describe a noun. <i>a friendly classmate</i>',
    '<b>Present Simple Review:</b> actions vs. descriptions.',
    '<b>Third-person -s:</b> add -s to the verb for he, she, and it. <i>she shares, he practices</i>',
]:
    story.append(check(s))

story += [
    DIVIDER,
    p('3. Games and practice from our unit', 'h'),
    p('Check the ones you tried. You can return to them for more practice.', 'sub'),
]
left = [check(s, 270) for s in ['Vocabulary flashcards', 'Vocabulary matching', 'Vocabulary fill in the blank']]
right = [check(s, 270) for s in [
    'Timeline Tenses: Easy Start',
    'Word Sort: Verbs',
    'Action or Description?',
    'Word Jobs: Nouns and Verbs',
]]
t = Table([[left, right]], colWidths=[270, 270])
t.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('LEFTPADDING', (0, 0), (-1, -1), 0),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
]))
story.append(t)

story += [
    p(
        'Optional extras: more Timeline Tenses, Grammar Hospital: First Aid, '
        'Word Sort: Nouns / Pronouns / Articles, and more Word Jobs lessons.',
        'small',
    ),
    DIVIDER,
    p('4. Look at your progress', 'h'),
    Spacer(1, 6),
    p('Something I am proud of: ' + '_' * 96),
    Spacer(1, 6),
    p('Next, I want to practice: ' + '_' * 98),
    Spacer(1, 4),
    p('Your effort matters. Every conversation, attempt, and correction helps you learn.', 'small'),
]

story += [
    PageBreak(),
    p('Classmate Interview', 'title'),
    p('ASK, LISTEN, AND WRITE  |  Unit 1 practice', 'subtitle'),
    Spacer(1, 10),
    p(
        'Ask two classmates these questions in English. Write short answers. '
        'No classmates around? Ask a family member or neighbor at home.',
        'sub',
    ),
    Spacer(1, 14),
]

interview_questions = [
    'What is your name? How do you spell it?',
    'Where are you from?',
    'What do you do for work? Or what do you want to do for work?',
    'Do you prefer mornings or evenings? Why?',
    'What is one thing you want to do this year?',
    'What is something that was difficult for you, but you did it?',
    'What do you like about this class so far?',
]
for i, q in enumerate(interview_questions, start=1):
    story.append(p(f'<b>{i}.</b> {escape(q)}', 'body'))
    story.append(Spacer(1, 8))
    story.append(blank('Classmate 1', style='small'))
    story.append(Spacer(1, 10))
    story.append(blank('Classmate 2', style='small'))
    story.append(Spacer(1, 20))

story += [
    DIVIDER,
    Spacer(1, 6)
]

OUT.parent.mkdir(parents=True, exist_ok=True)
SimpleDocTemplate(
    str(OUT),
    pagesize=(612, 792),
    leftMargin=36,
    rightMargin=36,
    topMargin=16,
    bottomMargin=10,
    title='Unit 1: Getting to Know You - Student Checklist',
    author='My ESOL App',
).build(story)
print(OUT)
