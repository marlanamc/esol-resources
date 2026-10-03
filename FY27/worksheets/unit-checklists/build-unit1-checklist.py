"""Build the Unit 1 student handout from the current Unit 1 vocabulary sources."""
from pathlib import Path
from xml.sax.saxutils import escape
import json, subprocess
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, Spacer, Flowable
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
FONT_DIR = Path('/System/Library/Fonts/Supplemental')
for name, file in [('Arial', 'Arial.ttf'), ('Arial-Bold', 'Arial Bold.ttf'), ('Arial-Italic', 'Arial Italic.ttf'), ('Arial-BoldItalic', 'Arial Bold Italic.ttf')]:
 pdfmetrics.registerFont(TTFont(name, str(FONT_DIR / file)))
pdfmetrics.registerFontFamily('Arial', normal='Arial', bold='Arial-Bold', italic='Arial-Italic', boldItalic='Arial-BoldItalic')

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / 'output/pdf/fy27-unit-1-checklist.pdf'
words = json.loads(subprocess.check_output(['node','-e', "const {weeklyVocabData:d}=require('./scripts/vocab/weekly-vocab-data'); console.log(JSON.stringify(['sep-w1','sep-w2','sep-w4'].map(k=>d[k].words)))"], cwd=ROOT))
styles = {
 'title': ParagraphStyle('title',fontName='Arial-Bold',fontSize=23,leading=26),
 'sub': ParagraphStyle('sub',fontName='Arial',fontSize=10,leading=13),
 'h': ParagraphStyle('h',fontName='Arial-Bold',fontSize=12,leading=15,spaceBefore=8,spaceAfter=4),
 'body': ParagraphStyle('body',fontName='Arial',fontSize=10.5,leading=14),
 'word': ParagraphStyle('word',fontName='Arial',fontSize=9.7,leading=12),
 'small': ParagraphStyle('small',fontName='Arial',fontSize=9,leading=12),
}
def p(text,style='body'): return Paragraph(text,styles[style])
class Box(Flowable):
 def __init__(self): Flowable.__init__(self);self.width=8;self.height=11
 def draw(self): self.canv.setLineWidth(.65);self.canv.rect(0,1,7,7)
def check(text,width=540,style='body'):
 t=Table([[Box(),p(text,style)]],colWidths=[14,width-14],hAlign='LEFT')
 t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),1),('BOTTOMPADDING',(0,0),(-1,-1),1)]))
 return t
story=[p('Unit 1: Getting to Know You','title'),p('MY END-OF-UNIT CHECKLIST  |  Weeks 1-3  |  September','sub'),Spacer(1,10),p('Name: __________________________________   Date: __________________','body'),
p('Our goal: Introduce ourselves and get to know our classmates.','h'),p('Check what you can do. Circle anything you want to practice again. Using help counts!','sub')]
for s in ['I can introduce myself and share something about my life.', 'I can ask a classmate a question and listen to their answer.', 'I can tell someone one thing I learned about a classmate.']:story.append(check(s))
story += [p('1. Our vocabulary: 18 words','h'),p('Check words you can explain or use. All of these words are verbs in our lessons.','sub'),Spacer(1,5)]
heads=['Week 1: Introductions','Week 2: Say It & Spell It','Week 3: Personal Journey']
short_defs = {
'introduce':'present yourself or another person', 'greet':'say hello to someone',
'share':'tell ideas, feelings, or information', 'describe':'say what someone or something is like',
'prefer':'like one thing more than another', 'catch up':'talk and share news',
'pronounce':'say a word correctly', 'spell':'say or write letters in order',
'identify':'recognize and name something', 'categorize':'put things into groups',
'practice':'do something often to improve', 'repeat':'do or say something again',
'relocate':'move to a new place to live or work', 'motivate':'give a reason to do something',
'achieve':'reach a goal through hard work', 'overcome':'successfully deal with a challenge',
'immigrate':'come to live in a new country permanently', 'belong':'feel accepted in a group or place',
}
cols=[]
for title,group in zip(heads,words):
 content=[p(title,'h')]
 for w in group:
  content.append(check('<b>'+escape(w['term'])+'</b><br/>'+escape(short_defs[w['term']]),172,'word'))
 cols.append(content)
t=Table([cols],colWidths=[180,180,180],hAlign='LEFT')
t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),0)]))
story.append(t)
story.append(p('2. Grammar we practiced','h'))
for s in ['<b>Nouns:</b> name a person, place, thing, or idea. <i>classmate, school, goal</i>', '<b>Verbs:</b> show an action or state. <i>share, practice, belong</i>', '<b>Adjectives:</b> describe a noun. <i>a friendly classmate</i>', '<b>Simple and continuous review:</b> habits vs. actions happening now.', '<b>Past-time review:</b> what happened vs. what was happening.']:
 story.append(check(s))
story += [p('3. Games and practice from our unit','h'),p('Check the ones you tried. You can return to them for more practice.','sub')]
left=[check(s,270) for s in ['Vocabulary flashcards','Vocabulary matching','Vocabulary fill in the blank']]
right=[check(s,270) for s in ['Timeline Tenses: Easy Start','Word Sort: Verbs','Action or Description?','Word Jobs: Nouns and Verbs']]
t=Table([[left,right]],colWidths=[270,270]);t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),0)]));story.append(t)
story += [p('Optional extras: more Timeline Tenses, Grammar Hospital: First Aid, Word Sort: Nouns / Pronouns / Articles, and more Word Jobs lessons.','small'),p('4. Look at your progress','h'),p('One thing I learned about a classmate: _________________________________________'),Spacer(1,6),p('Something I am proud of: ____________________________________________________'),Spacer(1,6),p('Next, I want to practice: _____________________________________________________'),Spacer(1,3),p('Your effort matters. Every conversation, attempt, and correction helps you learn.','small')]
OUT.parent.mkdir(parents=True,exist_ok=True)
SimpleDocTemplate(str(OUT),pagesize=(612,792),leftMargin=36,rightMargin=36,topMargin=24,bottomMargin=20,title='Unit 1: Getting to Know You - Student Checklist',author='ESOL Class Companion').build(story)
print(OUT)
