// Hand-authored reading chunks. Keep the English spelling visible; the audio and
// language-specific sound tips explain how those letters are pronounced.
// Spaces separate words; middle dots separate chunks within a word.
const entries = `
ac-cess
ac-com-plish
a-chieve
a-chieve-ment
ad-just
ad-vice
ad-vo-cate
af-ford
a-gree
ail-ment
al-lowed
an-a-lyze
ap-ply
ap-point-ment
ap-pre-ci-ate
ar-rive
as-sist
at-tend
a-void
bal-ance
be-long
ben-e-fits
break
bud-get
cal-cu-late
call out
cam-paign
can
catch up
cat-e-go-rize
chal-lenge
charge
check-up
chron-ic
clar-i-fy
clock in
clock out
clog
col-lab-o-rate
com-mit-ment
com-mute
com-pare
com-plete
com-ply
con-fi-dent
con-firm
con-nect
con-se-quence
con-tact
con-ta-gious
con-trib-ute
cop-ing skills
cor-rect
cor-rect-ly
cough
cour-te-sy
cov-er let-ter
cross
dead-line
de-ci-sion
de-cline
de-duc-tions
de-part
de-pos-it
de-pressed
de-scribe
di-ag-no-sis
dis-pute
doc-u-ment
do-nate
dose
e-con-o-my
e-lect
e-mer-gen-cy fund
e-val-u-ate
ex-change
ex-er-cise
ex-pe-ri-ence
feed-back
fe-ver
find out
flex-i-ble
flu-ids
fo-cus
fol-low
fol-low up
goal
greet
gross pay
growth
hab-it
help out
i-den-ti-fy
im-mi-grate
im-prove
in-fect-ed
in-fla-tion
in-spect
in-ter-est rate
in-tro-duce
join
leak
lease
life-style
lis-ten
lo-cate
log in
look for-ward to
main-tain
mind-ful
mo-ti-vate
move
must
nav-i-gate
ne-go-ti-ate
no-tice
no-ti-fy
nu-tri-ent
oc-cu-py
o-ver-come
own
par-tic-i-pate
pe-ti-tion
post-pone
prac-tice
pre-fer
pre-pare
pre-scribe
pre-scrip-tion
pre-vent
pri-ces
pri-or-i-ty
pro-cessed
prog-ress
pro-hib-it-ed
pro-mo-tion
pro-nounce
pro-pose
pro-tect
proud
pur-chase
qual-i-fy
quit
rec-om-mend
re-cov-er
ref-er-ence
re-flect
re-flec-tion
re-fund
reg-is-ter
re-im-burse
re-lax
re-li-a-ble
re-lieve
re-lo-cate
rem-e-dy
re-mem-ber
rent
re-pair
re-peat
re-port
rep-re-sent
re-quest
re-quired
re-solve
re-spond
re-su-me
re-view
right
safe-ty
save
sched-ule
se-lect
self~care
share
shift
should
show up
sign
soothe
spell
spend
strict
sub-mit
suc-cess
sug-gest
su-per-vi-sor
sup-port
symp-tom
team
tem-per-a-ture
through
time off
trans-fer
un-em-ployed
up-date
ver-i-fy
vi-o-late
vol-un-teer
vote
wa-ges
well-ness
with-draw
`;

export const RESCUE_WORD_PARTS: Record<string, string> = Object.fromEntries(
  entries.trim().split('\n').map(parts => [
    parts.replaceAll('-', '').replaceAll('~', '-'),
    parts.replaceAll('-', ' · ').replaceAll('~', '-'),
  ]),
);
