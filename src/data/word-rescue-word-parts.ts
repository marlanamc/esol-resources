// Hand-authored reading chunks. Keep the English spelling visible; the audio and
// language-specific sound tips explain how those letters are pronounced.
// Spaces separate words; middle dots separate chunks within a word.
const entries = `
ac-cess
ac-com-plish
a-chieve
a-chieve-ment
ad-just
ad-just to
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
a-vail-a-bil-i-ty
a-void
bal-ance
be-long
ben-e-fits
break
bud-get
build up
buy in bulk
cal-cu-late
call in sick
call out
cam-paign
can
catch up
cat-e-go-rize
chal-lenge
charge
check out
check-up
chron-ic
clar-i-fy
clock in
clock out
clog
clogged
col-lab-o-rate
com-mit-ment
com-mute
com-pare
com-par-i-son shop
com-plete
com-ply
con-fi-dent
con-firm
con-nect
con-se-quence
con-struc-tive crit-i-cism
con-tact
con-ta-gious
con-trib-ute
cop-ing skills
cor-rect
cor-rect-ly
cost of liv-ing
cough
cour-te-sy
cov-er a shift
cov-er let-ter
cross
cut back on
dead-line
de-ci-sion
de-cline
de-duc-tions
de-lay
de-part
de-pos-it
de-pressed
de-scribe
de-tour
di-ag-no-sis
dis-pute
doc-u-ment
do-nate
dos-age
dose
ease up
e-con-o-my
e-lect
e-mer-gen-cy fund
e-val-u-ate
ex-change
ex-er-cise
ex-pe-ri-ence
feed-back
fe-ver
file a com-plaint
find out
flex-i-ble
flu-ids
fo-cus
fol-low
fol-low up
fol-low~up ap-point-ment
get off at
go bad
goal
greet
gross pay
growth
hab-it
help out
home rem-e-dy
i-den-ti-fy
im-mi-grate
im-prove
in-fect-ed
in-fla-tion
in-spect
in-ter-ac-tion
in-ter-est rate
in-tro-duce
job du-ties
join
keep track of
leak
lease
life-style
lis-ten
lo-cate
log in
look back
look for-ward to
main-tain
main-te-nance re-quest
make a de-ci-sion
make prog-ress
mile-stone
mind-ful
miss a con-nec-tion
mo-ti-vate
move
move in
must
nav-i-gate
ne-go-ti-ate
no-tice
no-ti-fy
nu-tri-ent
oc-cu-py
o-ver~the~coun-ter
o-ver-come
o-ver-come a chal-lenge
own
par-tic-i-pate
per-sis-tent
pe-ti-tion
phar-ma-cist
post-pone
prac-tice
pre-fer
pre-pare
pre-scribe
pre-scrip-tion
pre-vent
pre-vi-ous po-si-tion
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
pur-chase price
put some-one through
qual-i-fy
qual-i-fy for
quit
raise a con-cern
reach an a-gree-ment
rec-om-mend
re-cov-er
re-cov-er from
re-cov-er your en-er-gy
ref-er-ence
re-fill
re-flect
re-flec-tion
re-fund
reg-is-ter
reg-is-ter to vote
re-im-burse
re-lax
re-li-a-ble
re-lieve
re-lo-cate
rem-e-dy
re-mem-ber
rent
rent-al ap-pli-ca-tion
re-pair
re-peat
re-port
re-port a prob-lem
rep-re-sent
re-quest
re-quest a re-pair
re-quired
re-sched-ule
re-solve
re-spond
re-spon-si-bil-i-ty
re-su-me
re-view
right
run out of
safe-ty
safe-ty pro-ce-dure
save
sched-ule
se-cu-ri-ty de-pos-it
seek care
se-lect
self~care
serv-ing size
set a goal
set a-side
set bound-a-ries
share
shift
should
show up
side ef-fect
sign
sign up for
soothe
spell
spend
stock up on
strict
sub-mit
suc-cess
sug-gest
su-per-vi-sor
sup-port
symp-tom
take in-to ac-count
take pride in
team
tem-per-a-ture
through
time off
to-tal cost
trade~off
trans-fer
treat-ment plan
turn down
un-em-ployed
u-nit price
un-wind
up-date
u-til-i-ties in-clud-ed
ver-i-fy
vi-o-late
vi-o-la-tion
vol-un-teer
vote
wa-ges
wear off
weigh your op-tions
well-ness
with-draw
with-in your bud-get
work in-de-pend-ent-ly
work o-ver-time
work~life bal-ance
work-place pol-i-cy
`;

export const RESCUE_WORD_PARTS: Record<string, string> = Object.fromEntries(
  entries.trim().split('\n').map(parts => [
    parts.replaceAll('-', '').replaceAll('~', '-'),
    parts.replaceAll('-', ' · ').replaceAll('~', '-'),
  ]),
);
