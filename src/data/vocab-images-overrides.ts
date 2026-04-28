/**
 * Hand-curated image URLs for Level 1 vocabulary terms (highest priority).
 * Keys must match `card.term` exactly (case-sensitive).
 *
 * Paste a **direct image URL** (what `<img src="...">` can load), not the Unsplash
 * gallery page. On an Unsplash photo page, right‑click the main image → “Copy image
 * address” (or open the image in a new tab and copy that URL). It should start with
 * `https://images.unsplash.com/photo-...`. The short id in the page URL path
 * (e.g. `.../photos/...-aN21jB8GfKs`) is not the same string as the CDN filename.
 *
 * Overrides are never overwritten by `npm run vocab:images` unless you remove them here.
 */
export const vocabImageOverrides: Record<string, string> = {
  Afternoon:
    "https://images.unsplash.com/photo-1595439291859-89777a22e3c8?w=1080&q=80&auto=format&fit=crop",
  Brother:
    "https://images.unsplash.com/photo-1502143135356-dcdb8a9a3da6?w=1080&q=80&auto=format&fit=crop",
  /** https://unsplash.com/photos/a-calendar-with-red-push-buttons-pinned-to-it-bwOAixLG0uc */
  Calendar:
    "https://images.unsplash.com/photo-1633526543814-9718c8922b7a?w=1080&q=80&auto=format&fit=crop",
  "Christmas Tree":
    "https://images.unsplash.com/photo-1607882589955-27facfb459c9?w=1080&q=80&auto=format&fit=crop",
  Divorced:
    "https://images.unsplash.com/photo-1608734022710-538043c7ec3f?w=1080&q=80&auto=format&fit=crop",
  Father:
    "https://images.unsplash.com/photo-1564156280315-1d42b4651629?w=1080&q=80&auto=format&fit=crop",
  // Unit 1 pronouns + I'm — manual Unsplash picks (merged over vocab-images-generated).
  I: "https://images.unsplash.com/photo-1758273240097-b861e2f65b38?w=1080&q=80&auto=format&fit=crop",
  "I'm": "https://images.unsplash.com/photo-1655961929028-dd144f89de6c?w=1080&q=80&auto=format&fit=crop",
  You: "https://images.unsplash.com/photo-1602300271429-93110917af2e?w=1080&q=80&auto=format&fit=crop",
  He: "https://images.unsplash.com/photo-1552873816-636e43209957?w=1080&q=80&auto=format&fit=crop",
  She: "https://images.unsplash.com/photo-1665560924350-29cbc22df634?w=1080&q=80&auto=format&fit=crop",
  It: "https://images.unsplash.com/photo-1646598990880-cb5b64582f2f?w=1080&q=80&auto=format&fit=crop",
  We: "https://images.unsplash.com/photo-1569617084133-26942bb441f2?w=1080&q=80&auto=format&fit=crop",
  They: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1080&q=80&auto=format&fit=crop",
  /** Swapped vs generated Unsplash picks so singular = one foot, plural = both feet. */
  Feet: "https://images.unsplash.com/photo-1763198302090-76a6ca09ebd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxGb290JTIwaHVtYW4lMjBib2R5JTIwYW5hdG9teSUyMGhlYWx0aHxlbnwxfDB8fHwxNzc1MTMxNjYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  Food: "https://images.unsplash.com/photo-1768236067917-8d7e2bdc9dd8?w=1080&q=80&auto=format&fit=crop",
  Foot: "https://images.unsplash.com/photo-1582380330092-636f9aff6aaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxGZWV0JTIwaHVtYW4lMjBib2R5JTIwYW5hdG9teSUyMGhlYWx0aHxlbnwxfDB8fHwxNzc1MTMxNzM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  Her: "https://images.unsplash.com/photo-1713693211889-660f92fece32?w=1080&q=80&auto=format&fit=crop",
  His: "https://images.unsplash.com/photo-1562564885-a776c7960d63?w=1080&q=80&auto=format&fit=crop",
  Husband:
    "https://images.unsplash.com/photo-1514415008039-efa173293080?w=1080&q=80&auto=format&fit=crop",
  /** https://unsplash.com/photos/man-in-orange-and-black-vest-wearing-white-helmet-holding-yellow-and-black-power-tool-VLPUm5wP5Z0 */
  "Job": "https://images.unsplash.com/photo-1758876020337-2501eeb1ede5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw2fHxwZXJzb24lMjB3b3JraW5nJTIwb2ZmaWNlJTIwd29ya3BsYWNlJTIwbGFwdG9wJTIwcHJvZmVzc2lvbmFsfGVufDB8MHx8fDE3NzczNDA2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  /** https://unsplash.com/photos/a-group-of-people-walking-on-a-train-platform-3F76TfkhEH0 */
  "Monday": "https://images.unsplash.com/photo-1691097097192-03866b391c97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxNb25kYXklMjBjYWxlbmRhciUyMHNlYXNvbiUyMHNjaGVkdWxlfGVufDB8MHx8fDE3NzYxOTU0Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  // Months of the year (calendar-feel picks; overrides generated search).
  /** https://unsplash.com/photos/x_4IoG7Kp7Q */
  January:
    "https://images.unsplash.com/photo-1640535602155-b7f1428a8a4a?w=1080&q=80&auto=format&fit=crop",
  /** https://unsplash.com/photos/0OS8hh5uLr4 */
  February:
    "https://images.unsplash.com/photo-1611019708499-995e850160fa?w=1080&q=80&auto=format&fit=crop",
  /** https://unsplash.com/photos/4I2zDNDApkA */
  March:
    "https://images.unsplash.com/photo-1709993296178-3953475a760e?w=1080&q=80&auto=format&fit=crop",
  /** https://unsplash.com/photos/KfxCiGLNBMQ */
  April:
    "https://images.unsplash.com/photo-1744390708972-3c4928899b44?w=1080&q=80&auto=format&fit=crop",
  /** https://unsplash.com/photos/lZ_v9CaeQ6Q */
  May: "https://images.unsplash.com/photo-1743516465188-6eee2aa0828d?w=1080&q=80&auto=format&fit=crop",
  /** https://unsplash.com/photos/QtkWhV9Veoo */
  June:
    "https://images.unsplash.com/photo-1715765036065-32539cf43710?w=1080&q=80&auto=format&fit=crop",
  /** https://unsplash.com/photos/E4c0zn-L38Y */
  July:
    "https://images.unsplash.com/photo-1610605619426-5483a3d8e8a9?w=1080&q=80&auto=format&fit=crop",
  /** https://unsplash.com/photos/SBOIOjns6q8 */
  August:
    "https://images.unsplash.com/photo-1632248773273-0152ece8d2d5?w=1080&q=80&auto=format&fit=crop",
  /** https://unsplash.com/photos/bmp7SrCxaZ8 */
  September:
    "https://images.unsplash.com/photo-1624431378026-96852ab492bb?w=1080&q=80&auto=format&fit=crop",
  /** https://unsplash.com/photos/IXbCIYj4XD8 */
  October:
    "https://images.unsplash.com/photo-1592236300372-78465d77dd06?w=1080&q=80&auto=format&fit=crop",
  /** https://unsplash.com/photos/dq1ccxxKhlo */
  November:
    "https://images.unsplash.com/photo-1604566723271-cc2874f6f887?w=1080&q=80&auto=format&fit=crop",
  /** https://unsplash.com/photos/_oClj-7X76Y */
  December:
    "https://images.unsplash.com/photo-1613390891668-1636f941b05a?w=1080&q=80&auto=format&fit=crop",
  My: "https://images.unsplash.com/photo-1513790935210-acec1ddde534?w=1080&q=80&auto=format&fit=crop",
  Name: "https://images.unsplash.com/photo-1551022288-ed9a66777d5e?w=1080&q=80&auto=format&fit=crop",
  Nephew:
    "https://images.unsplash.com/photo-1739208683720-1c395a36ecd3?w=1080&q=80&auto=format&fit=crop",
  /** https://unsplash.com/photos/a-man-sitting-at-a-table-using-a-laptop-computer-ey8N0cPHkdY */
  Next: "https://images.unsplash.com/photo-1650050349203-85d2b4821717?w=1080&q=80&auto=format&fit=crop",
  Nine: "https://images.unsplash.com/photo-1759830374316-6df9d9782c5d?w=1080&q=80&auto=format&fit=crop",
  One: "https://images.unsplash.com/photo-1746291645635-ef039b4323d8?w=1080&q=80&auto=format&fit=crop",
  Old: "https://images.unsplash.com/photo-1603566541830-972ff1b4b2cd?w=1080&q=80&auto=format&fit=crop",
  Our: "https://images.unsplash.com/photo-1765562435305-6bb234a67acb?w=1080&q=80&auto=format&fit=crop",
  Paper:
    "https://images.unsplash.com/photo-1516409590654-e8d51fc2d25c?w=1080&q=80&auto=format&fit=crop",
  Parent:
    "https://images.unsplash.com/photo-1517554558809-9b4971b38f39?w=1080&q=80&auto=format&fit=crop",
  "Phone number":
    "https://images.unsplash.com/photo-1644047777798-fa92add387f6?w=1080&q=80&auto=format&fit=crop",
  /** https://unsplash.com/photos/black-and-white-microwave-oven--PYVCeufoMU */
  Schedule:
    "https://images.unsplash.com/photo-1615776649547-038afe604c5f?w=1080&q=80&auto=format&fit=crop",
  Single:
    "https://images.unsplash.com/photo-1461468611824-46457c0e11fd?w=1080&q=80&auto=format&fit=crop",
  Sister:
    "https://images.unsplash.com/photo-1451471016731-e963a8588be8?w=1080&q=80&auto=format&fit=crop",
  State:
    "https://images.unsplash.com/photo-1604496464355-a5032e3b47e0?w=1080&q=80&auto=format&fit=crop",
  /** https://unsplash.com/photos/gray-city-road-Fi3jxDPe3NA */
  Street:
    "https://images.unsplash.com/photo-1572293319000-ea78c2631bb0?w=1080&q=80&auto=format&fit=crop",
  /** https://unsplash.com/photos/person-lying-down-in-a-hammock-hanging-between-trees-lpSvOOLjxVU */
  Sunday:
    "https://images.unsplash.com/photo-1566333147839-431a86e6690a?w=1080&q=80&auto=format&fit=crop",
  Ten: "https://images.unsplash.com/photo-1543839596-4b1b4908d113?w=1080&q=80&auto=format&fit=crop",
  Their:
    "https://images.unsplash.com/photo-1759409972461-110bf5be5f95?w=1080&q=80&auto=format&fit=crop",
  /** https://unsplash.com/photos/round-analog-wall-clock-pointing-at-1009-L0xOtAnv94Y */
  Time: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=1080&q=80&auto=format&fit=crop",
  Uncle:
    "https://images.unsplash.com/photo-1576189311153-1005a26b64fb?w=1080&q=80&auto=format&fit=crop",
  Wife: "https://images.unsplash.com/photo-1641504711945-4d427e30a6dd?w=1080&q=80&auto=format&fit=crop",
  Your:
    "https://images.unsplash.com/photo-1758874089961-e52549c294c3?w=1080&q=80&auto=format&fit=crop",
  "Zip code":
    "https://images.unsplash.com/photo-1736117705482-6d897896e077?w=1080&q=80&auto=format&fit=crop",
  "House": "https://images.unsplash.com/photo-1762374974129-f9266d9c4efc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxNXx8aG9tZSUyMHdpdGglMjBmYW1pbHl8ZW58MHwwfHx8MTc3NjU0NDk2MXww&ixlib=rb-4.1.0&q=80&w=1080",
  "Supermarket": "https://images.unsplash.com/photo-1760463921956-b21cfa5cb2ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxlbXB0eSUyMHN1cGVybWFya2V0JTIwZ3JvY2VyeSUyMHN0b3JlJTIwYWlzbGUlMjBzaGVsdmVzfGVufDB8MHx8fDE3NzYyOTQyNjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Bus Stop": "https://images.unsplash.com/photo-1730303300789-772d7219d76b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxidXMlMjBzdGF0aW9uJTIwc3RvcCUyMGJlbmNoJTIwZW1wdHklMjBzaWduJTIwb3V0ZG9vcnxlbnwwfDB8fHwxNzc2Mjk0MjYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Station": "https://images.unsplash.com/photo-1764470560846-ad0f4f11c323?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw0fHx0cmFpbiUyMHN0YXRpb24lMjBwbGF0Zm9ybSUyMGVtcHR5JTIwdHJhY2tzJTIwY2xlYXIlMjBkYXklMjBidWlsZGluZ3xlbnwwfDB8fHwxNzc2Mjk0MjYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Public Transportation": "https://images.unsplash.com/photo-1613545037806-07618f088603?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw0fHxwdWJsaWMlMjB0cmFuc2l0JTIwdHJhaW4lMjBidXMlMjBzdWJ3YXklMjBjbGVhciUyMGJyaWdodHxlbnwwfDB8fHwxNzc2Mjk0MjYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Clinic": "https://images.unsplash.com/photo-1631507623112-0092cef9c70d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxM3x8bWVkaWNhbCUyMGNsaW5pYyUyMHxlbnwwfDB8fHwxNzc2Mjk0NTU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Restaurant": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw0fHxyZXN0YXVyYW50fGVufDB8MHx8fDE3NzYyOTQ1ODB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Store": "https://images.unsplash.com/photo-1567958451986-2de427a4a0be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw5fHxyZXRhaWx8ZW58MHwwfHx8MTc3NjI5NDYxNHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Gym": "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxMXx8Z3ltJTIwfGVufDB8MHx8fDE3NzYyOTQ2NjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Airport": "https://images.unsplash.com/photo-1609408341205-861253559a83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxhaXJwb3J0JTIwdGVybWluYWwlMjBwbGFuZSUyMGxhcmdlJTIwd2luZG93cyUyMGNsZWFyJTIwYnVpbGRpbmd8ZW58MHwwfHx8MTc3NjI5NDI2MXww&ixlib=rb-4.1.0&q=80&w=1080",
  "Laundromat": "https://images.unsplash.com/photo-1521656693074-0ef32e80a5d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxsYXVuZHJvbWF0JTIwfGVufDB8MHx8fDE3NzYyOTQ2OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Left": "https://pixabay.com/get/g32044c82b0cc985cc8a67bdd100941dd1f0ec879db8f3e1fd3c22f84e5a299a5716da2282161ee0c3b8aaa61e3e12e6abaae01b4d1995d07ca1ec999400a4ffd_640.jpg",
  "Right": "https://pixabay.com/get/g2fb941b95bf5dbe0a5b9715137d532ce5735016ccad5ffd3cf699ed937191b69ad0c619e1459cc8783fe10b74679bff7_640.jpg",
  "Straight": "https://images.unsplash.com/photo-1711504443989-ea7afb1ea346?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwzfHxzdHJhaWdodCUyMGhhaXIlMjBoYWlyc3R5bGV8ZW58MHwwfHx8MTc3NjI4NDY5MHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Around": "https://pixabay.com/get/g5df973d2f44bf5563c5b091022ebe75c67b321487f8731be20403b9d1081fb4d98b9c7a90d5cd87b81c2b5a11429b74a2ae107e71a40c65be6f5eac42e175128_640.jpg",
  "Arms": "https://pixabay.com/get/g0be9e274b6be5525d1bedc6cb25a0c5da62c8df7e86082c02e7ce336ad218cd1ee34ca9253358ea0ff3e8092483b6b80acf0efbabe9d0f6036d049a63d810db4_640.jpg",
  "Chest": "https://pixabay.com/get/g78cf41121fa1c4b67f71995fc992e371feecd37feadabb2922d52b0777648b48ac78513d21a524693a0607be38ca96dc37845341e0169114fb4f2e2a6d173663_640.jpg",
  "Hands": "https://pixabay.com/get/ge655fe74af896065c2aa9c0bdf636b8ee2cc42302511248cb42164970d5f175d4dbf23cf216d1f5fb680df3dba5abe3aa67cf33380954e8fc30ffc7d011740a7_640.jpg",
  "Education": "https://images.unsplash.com/photo-1631047085941-a29e9730a7e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw5fHxjaGFsa2JvYXJkJTIwYmxhY2tib2FyZCUyMGNoYWxrJTIwZXJhc2VyJTIwc2Nob29sJTIwY2xlYXJ8ZW58MHwwfHx8MTc3NjI5NDcxMHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Shopping": "https://images.unsplash.com/photo-1726137569825-7535962addcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw4fHxwdXJjaGFzZXxlbnwwfDB8fHwxNzc2Mjk0NzM3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Housing": "https://images.unsplash.com/photo-1731611538799-bcadda7e119e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxNHx8YXBhcnRtZW50JTIwY29tcGxleHxlbnwwfDB8fHwxNzc2Mjk0NzY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Hospital": "https://images.unsplash.com/photo-1587351021355-a479a299d2f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw0fHxob3NwaXRhbCUyMGJ1aWxkaW5nJTIwfGVufDB8MHx8fDE3NzYyOTQzMzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Hotel": "https://images.unsplash.com/photo-1585441167263-b2f5aa748adf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw4fHxob3RlbCUyMGJ1aWxkaW5nJTIwZXh0ZXJpb3IlMjBlbnRyYW5jZSUyMHNpZ24lMjBjbGVhciUyMGRheXxlbnwwfDB8fHwxNzc2Mjk0MjYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Bank": "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxiYW5rJTIwfGVufDB8MHx8fDE3NzYyOTQzODV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Post Office": "https://images.unsplash.com/photo-1559268191-087643399ef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw5fHxwb3N0JTIwb2ZmaWNlJTIwfGVufDB8MHx8fDE3NzYyOTQ0MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Police Station": "https://images.unsplash.com/photo-1729048228129-64569b44caa7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwzfHxwb2xpY2UlMjBzdGF0aW9ufGVufDB8MHx8fDE3NzYyOTQ0NTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "RMV": "https://images.unsplash.com/photo-1581982231900-6a1a46b744c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxkbXYlMjB3YWl0aW5nJTIwcm9vbSUyMGludGVyaW9yJTIwY2hhaXJzJTIwZGVzayUyMGVtcHR5fGVufDB8MHx8fDE3NzYyOTQyNjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "City Hall": "https://images.unsplash.com/photo-1602143631225-449a131b1018?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxMXx8Y2l0eSUyMGhhbGx8ZW58MHwwfHx8MTc3NjI5NDUzNnww&ixlib=rb-4.1.0&q=80&w=1080",
  "Pharmacy": "https://images.unsplash.com/photo-1576091358783-a212ec293ff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw2fHxwaGFybWFjeSUyMHxlbnwwfDB8fHwxNzc2Mjk0NjQwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Candidate": "https://images.unsplash.com/photo-1659941334427-e5928f04fe86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw3fHxwb2xpdGljYWwlMjBjYW5kaWRhdGUlMjBzcGVha2luZyUyMGF0JTIwcG9kaXVtJTIwaXNvbGF0ZWR8ZW58MHwwfHx8MTc3NjI4NTEyNnww&ixlib=rb-4.1.0&q=80&w=1080",
  "Call": "https://images.unsplash.com/photo-1516055619834-586f8c75d1de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw5fHxzbWFydHBob25lJTIwY2FsbGluZ3xlbnwwfDB8fHwxNzc2Mjk5NjY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Message": "https://images.unsplash.com/photo-1720069004713-f72d26684a87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxM3x8c21hcnRwaG9uZSUyMGNoYXQlMjBidWJibGUlMjBoYW5kJTIwbWVzc2FnaW5nJTIwY2xvc2UlMjB1cCUyMG1hY3JvfGVufDB8MHx8fDE3NzYyOTQ3OTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Voicemail": "https://images.unsplash.com/photo-1626682561412-eb4ab2dd80f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwzfHxwbGF5JTIwYnV0dG9uJTIwdm9pY2VtYWlsJTIwYXVkaW8lMjByZWNvcmRpbmclMjBjbG9zZSUyMHVwJTIwbWFjcm98ZW58MHwwfHx8MTc3NjI5NDc5NXww&ixlib=rb-4.1.0&q=80&w=1080",
  "Email": "https://images.unsplash.com/photo-1556204975-1851fadab092?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw5fHxlbWFpbCUyMGVudmVsb3BlJTIwaWNvbiUyMGxhcHRvcCUyMHNjcmVlbiUyMGNsb3NlJTIwdXB8ZW58MHwwfHx8MTc3NjI5NDc5NXww&ixlib=rb-4.1.0&q=80&w=1080",
  "Thanks": "https://images.unsplash.com/photo-1587532771889-c9f59344b104?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw0fHxncmF0ZWZ1bCUyMHBlcnNvbnxlbnwwfDB8fHwxNzc2Mjk5NzQxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Meal": "https://images.unsplash.com/photo-1605926637412-b0cd5a3e3543?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHx0aGFua3NnaXZpbmclMjBtZWFsfGVufDB8MHx8fDE3NzYyOTk4MjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Indigenous": "https://images.unsplash.com/photo-1720260991040-2ed9b3f7da0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxuYXRpdmUlMjBhbWVyaWNhbiUyMHRyYWRpdGlvbmFsJTIwZHJlc3MlMjBwb3J0cmFpdCUyMGNsZWFyfGVufDB8MHx8fDE3NzYyOTk2OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Pilgrim": "https://images.unsplash.com/photo-1775733902223-9cc0ad924b08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxtYXlmbG93ZXIlMjBzaGlwfGVufDB8MHx8fDE3NzYyOTk4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Shirt": "https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw4fHx0JTIwc2hpcnR8ZW58MHwwfHx8MTc3NjM2NjY2NXww&ixlib=rb-4.1.0&q=80&w=1080",
  "Suit": "https://images.unsplash.com/photo-1600679472868-eae382e28b34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw0fHxidXNpbmVzcyUyMHN1aXQlMjB8ZW58MHwwfHx8MTc3NjM2NjY3NXww&ixlib=rb-4.1.0&q=80&w=1080",
  "Sweater": "https://images.unsplash.com/photo-1588271968087-4c51abe05afc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw2fHxzd2VhdGVyfGVufDB8MHx8fDE3NzYzNjY3MDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Cap": "https://images.unsplash.com/photo-1602336494169-7e33ed92ea09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw2fHxDYXAlMjBjbG90aGluZyUyMGZhc2hpb24lMjBhcHBhcmVsJTIwb3V0Zml0fGVufDB8MHx8fDE3NzYzNjY2Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Dress": "https://images.unsplash.com/photo-1499939667766-4afceb292d05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw0fHxkcmVzcyUyMHxlbnwwfDB8fHwxNzc2MzY2NzMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Skirt": "https://images.unsplash.com/photo-1556747439-3b96858b9d8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxNHx8c2tpcnQlMjB8ZW58MHwwfHx8MTc3NjM2NjgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Belt": "https://images.unsplash.com/photo-1624222247344-550fb60583dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxsZWF0aGVyJTIwYmVsdCUyMGJ1Y2tsZSUyMGlzb2xhdGVkJTIwd2hpdGUlMjBzdHVkaW8lMjBiYWNrZ3JvdW5kfGVufDB8MHx8fDE3NzYzNjY2Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Pants": "https://images.unsplash.com/photo-1643302214215-46fd832d3c2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxM3x8aGVtbWVkJTIwcGFudHN8ZW58MHwwfHx8MTc3NjM2Njg2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "Shorts": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxTaG9ydHMlMjB8ZW58MHwwfHx8MTc3NjM2Njg4NXww&ixlib=rb-4.1.0&q=80&w=1080",
  "Large": "https://images.unsplash.com/photo-1596919099190-5b021294a916?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwzfHxsYXJnZSUyMGRyaW5rfGVufDB8MHx8fDE3NzYzNjY5MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Small": "https://images.unsplash.com/photo-1764904982687-93f14474715f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw5fHxzbWFsbCUyMGN1dGUlMjBraXR0ZW58ZW58MHwwfHx8MTc3NjM2NzA3MXww&ixlib=rb-4.1.0&q=80&w=1080",
  "Electronics": "https://images.unsplash.com/photo-1732896066088-7b2aee1c1eba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw0fHxhc3NvcnRlZCUyMGVsZWN0cm9uaWNzJTIwfGVufDB8MHx8fDE3NzYyOTk5MDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Computer": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxjb21wdXRlciUyMHxlbnwwfDB8fHwxNzc2Mjk5OTMxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Car": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxjYXIlMjB8ZW58MHwwfHx8MTc3NjI5OTk3NHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Cellphone": "https://images.unsplash.com/photo-1598965402089-897ce52e8355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw1fHxzbWFydHBob25lfGVufDB8MHx8fDE3NzYyOTk5NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Receipt": "https://images.unsplash.com/photo-1634733988138-bf2c3a2a13fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxyZWNlaXB0JTIwc2hvcHBpbmd8ZW58MHwwfHx8MTc3NjM2MDEwNnww&ixlib=rb-4.1.0&q=80&w=1080",
  "Tax": "https://images.unsplash.com/photo-1636038197596-28e7dce070e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHx0YXglMjBmb3JtJTIwZG9jdW1lbnQlMjBwZW4lMjBtYWNybyUyMGNsb3NlJTIwdXAlMjBpc29sYXRlZHxlbnwwfDB8fHwxNzc2MzU5ODI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Credit Card": "https://images.unsplash.com/photo-1572798793834-67d5e285760d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwzfHxibGFuayUyMGNyZWRpdCUyMGNhcmQlMjBpc29sYXRlZCUyMG1hY3JvJTIwY2xvc2UlMjB1cCUyMHN0dWRpb3xlbnwwfDB8fHwxNzc2MzU5ODI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Debit Card": "https://images.unsplash.com/photo-1631528754981-dcbce4d4d652?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw5fHxEZWJpdCUyMENhcmQlMjB8ZW58MHwwfHx8MTc3NjM1OTg3NXww&ixlib=rb-4.1.0&q=80&w=1080",
  "Check": "https://images.unsplash.com/photo-1763872867598-b1b5f769d7e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxjaGVjayUyMGZvciUyMHBheW1lbnR8ZW58MHwwfHx8MTc3NjM1OTg5MHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Signature": "https://images.unsplash.com/photo-1627518788331-b3b7fdaa382f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxMnx8U2lnbmF0dXJlJTIwb24lMjBjaGVja3xlbnwwfDB8fHwxNzc2MzYwMTIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "ATM": "https://images.unsplash.com/photo-1746826618149-7c54e99e7946?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw5fHxhdG0lMjBtYWNoaW5lJTIwfGVufDB8MHx8fDE3NzYzNTk5MDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Online": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxPbmxpbmUlMjBiYW5raW5nfGVufDB8MHx8fDE3NzYzNTk5NTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Refund": "https://images.unsplash.com/photo-1771736006700-cfcf7770bdb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw4fHxtb25leSUyMGhhbmRlZCUyMHRvJTIweW91fGVufDB8MHx8fDE3NzYzNjAwMzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Landlord": "https://images.unsplash.com/photo-1741156386380-0236c72eb6f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMGtleXMlMjBoYW5kaW5nJTIwb3ZlciUyMHxlbnwwfDB8fHwxNzc2NTQ0NzQxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Manager": "https://images.unsplash.com/photo-1573496130141-209d200cebd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxwcm9wZXJ0eSUyMG1hbmFnZXIlMjB8ZW58MHwwfHx8MTc3NzMxODE1Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  "Agent": "https://images.unsplash.com/photo-1714647212013-760bd7d975bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxyZWFsJTIwZXN0YXRlJTIwYWdlbnQlMjBob3VzZSUyMHNob3dpbmd8ZW58MHwwfHx8MTc3NjQ2Mjk3OXww&ixlib=rb-4.1.0&q=80&w=1080",
  "Real Estate": "https://images.unsplash.com/photo-1755746008025-eb747abf229c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwzfHxmb3IlMjBzYWxlJTIwc2lnbiUyMHxlbnwwfDB8fHwxNzc2NTQ0NzkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Leak": "https://images.unsplash.com/photo-1542858485-3a8d2adf6d4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw5fHx3YXRlciUyMHN0YWluJTIwY2VpbGluZyUyMGJ1Y2tldCUyMGNhdGNoaW5nJTIwZHJpcCUyMGhvbWUlMjBkYW1hZ2V8ZW58MHwwfHx8MTc3NjUyODUyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "Broken Window": "https://images.unsplash.com/photo-1592457060850-46b358e206cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxjcmFja2VkJTIwaG91c2UlMjB3aW5kb3clMjBnbGFzcyUyMGRhbWFnZSUyMGZyYW1lJTIwZXh0ZXJpb3J8ZW58MHwwfHx8MTc3NjUyODUyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "Clogged Toilet": "https://images.unsplash.com/photo-1749532125405-70950966b0e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxwbHVtYmVyJTIwfGVufDB8MHx8fDE3NzY1NDQ4OTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Complaint": "https://images.unsplash.com/photo-1758611975583-fddf609226a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHx1cHNldCUyMHRhbGtpbmclMjBvbiUyMHBob25lfGVufDB8MHx8fDE3NzY1NDQ5NDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Home": "https://images.unsplash.com/photo-1770587899537-23e617e17767?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxjb3p5JTIwbGl2aW5nJTIwcm9vbSUyMHNvZmElMjBsYW1wJTIwd2FybSUyMGZhbWlseSUyMGV2ZW5pbmclMjBpbnRlcmlvcnxlbnwwfDB8fHwxNzc2NTI4NTIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Apartment": "https://images.unsplash.com/photo-1484154218962-a197022b5858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw3fHxhcGFydG1lbnR8ZW58MHwwfHx8MTc3NjU0NTA1Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  "Condominium": "https://images.unsplash.com/photo-1545388205-dad431fd23a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxMXx8bW9kZXJuJTIwY29uZG8lMjBidWlsZGluZyUyMGJhbGNvbmllcyUyMHVyYmFuJTIwcmVzaWRlbnRpYWwlMjBkYXl0aW1lfGVufDB8MHx8fDE3NzY1Mjg1MjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Unit": "https://images.unsplash.com/photo-1753911372198-50b1b254ad4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw3fHxhcGFydG1lbnQlMjBmbG9vciUyMHBsYW58ZW58MHwwfHx8MTc3NjU0NTA5OHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Rent": "https://images.unsplash.com/photo-1593871097805-09627f52f4bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw5fHxyZW50JTIwY2hlY2slMjB8ZW58MHwwfHx8MTc3NjQ2MzIwMXww&ixlib=rb-4.1.0&q=80&w=1080",
  "Lease": "https://images.unsplash.com/photo-1521791055366-0d553872125f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw4fHxsZWFzZSUyMHJlbnRhbCUyMGFncmVlbWVudCUyMGNvbnRyYWN0JTIwcGFwZXIlMjBwZW4lMjBtYWNyb3xlbnwwfDB8fHwxNzc3MzE4MTE1fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Fee": "https://images.unsplash.com/photo-1776871160570-0cd008289b5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxMnx8ZmVlc3xlbnwwfDB8fHwxNzc3MzE4NDUxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Security deposit": "https://images.unsplash.com/photo-1611187401884-254eb9d99ed6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxMnx8c2VjdXJpdHklMjBkZXBvc2l0fGVufDB8MHx8fDE3NzczMTg0ODB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Laundry": "https://images.unsplash.com/photo-1696546761269-a8f9d2b80512?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxM3x8bGF1bmRyeSUyMGJhc2tldCUyMGZvbGRlZCUyMHRvd2VscyUyMHdhc2hpbmclMjBtYWNoaW5lJTIwaG9tZSUyMGJyaWdodHxlbnwwfDB8fHwxNzc3MzE4MTE1fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Gas": "https://images.unsplash.com/photo-1764677367365-d56787922d83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxnYXMlMjBzdG92ZSUyMGJsdWUlMjBmbGFtZSUyMGJ1cm5lciUyMGtpdGNoZW4lMjBjb29raW5nJTIwaG9tZXxlbnwwfDB8fHwxNzc3MzE4MTE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Water": "https://images.unsplash.com/photo-1521207418485-99c705420785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw0fHxraXRjaGVuJTIwZmF1Y2V0JTIwfGVufDB8MHx8fDE3NzczMTg1NTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Electric": "https://images.unsplash.com/photo-1543489816-c87b0f5f7dd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw1fHxlbGVjdHJpY2l0eXxlbnwwfDB8fHwxNzc3MzE4NTc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Room": "https://images.unsplash.com/photo-1722650362348-ef3034f6b864?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxlbXB0eSUyMHdoaXRlJTIwcm9vbSUyMHdvb2RlbiUyMGZsb29yJTIwYnJpZ2h0JTIwY2xlYXIlMjBpbnRlcmlvcnxlbnwwfDB8fHwxNzc3MzE4NjI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Bathroom": "https://images.unsplash.com/photo-1646592491720-ad2a252215c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw0fHxiYXRocm9vbSUyMHdoaXRlJTIwc2luayUyMG1pcnJvciUyMGNsZWFuJTIwYnJpZ2h0JTIwbW9kZXJufGVufDB8MHx8fDE3NzczMTg2Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Kitchen": "https://images.unsplash.com/photo-1654176154397-3133364f22e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw4fHxtb2Rlcm4lMjBraXRjaGVuJTIwd2hpdGUlMjBjYWJpbmV0cyUyMGVtcHR5JTIwY2xlYXIlMjBicmlnaHR8ZW58MHwwfHx8MTc3NzMxODYyOXww&ixlib=rb-4.1.0&q=80&w=1080",
  "Bedroom": "https://images.unsplash.com/photo-1716078585943-cb45d6c21abb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw0fHxtYWRlJTIwYmVkJTIwd2hpdGUlMjBwaWxsb3dzJTIwc2ltcGxlJTIwbW9kZXJuJTIwYmVkcm9vbXxlbnwwfDB8fHwxNzc3MzE4NjI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Living room": "https://images.unsplash.com/photo-1716078410207-20e223587181?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwzfHxsaXZpbmclMjByb29tJTIwZW1wdHklMjBzb2ZhJTIwd2hpdGUlMjB3YWxsJTIwaW50ZXJpb3IlMjBicmlnaHR8ZW58MHwwfHx8MTc3NzMxODYyOXww&ixlib=rb-4.1.0&q=80&w=1080",
  "Hall": "https://images.unsplash.com/photo-1721739496969-0dbd15306bd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw1fHxuYXJyb3clMjBob21lJTIwaGFsbHdheSUyMHxlbnwwfDB8fHwxNzc3MzMxMTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Floor": "https://images.unsplash.com/photo-1559387373-f7c499b478e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwzfHxoYXJkd29vZCUyMGZsb29yJTIwdGV4dHVyZSUyMHNpbXBsZSUyMGNsZWFuJTIwZW1wdHl8ZW58MHwwfHx8MTc3NzMzMTE2MHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Basement": "https://images.unsplash.com/photo-1623955277601-2aa7bb3fb240?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxiYXNlbWVudCUyMHN0YWlycyUyMGluY29tcGxldGUlMjB1bmZpbmlzaGVkJTIwcm9vbSUyMGNsZWFyfGVufDB8MHx8fDE3NzczMzExNjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Attic": "https://images.unsplash.com/photo-1775481929781-d1ea83579ed8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw1fHxhdHRpYyUyMHJvb2YlMjB3b29kZW4lMjBiZWFtcyUyMGVtcHR5JTIwYnJpZ2h0fGVufDB8MHx8fDE3NzczMzExNjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Chimney": "https://images.unsplash.com/photo-1718909704556-0fe9477637d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw3fHxicmljayUyMGNoaW1uZXklMjByb29mJTIwc2t5JTIwcmVzaWRlbnRpYWwlMjBob3VzZSUyMGV4dGVyaW9yfGVufDB8MHx8fDE3NzczMzExNjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Door": "https://images.unsplash.com/photo-1604930067320-50b0874d6f21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxM3x8ZnJvbnQlMjBkb29yJTIwY2xvc2VkJTIwfGVufDB8MHx8fDE3NzczMzEyMTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Front": "https://images.unsplash.com/photo-1771515825748-b21eabbae5aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw1fHxmcm9udCUyMGRvb3IlMjBob3VzZXxlbnwwfDB8fHwxNzc3MzMxMjM3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Back": "https://images.unsplash.com/photo-1628625251833-04eeafb7a2db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwzfHxiYWNrJTIweWFyZHxlbnwwfDB8fHwxNzc3MzMxMjU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Lock": "https://images.unsplash.com/photo-1651807193139-2ec2d0b1ec47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw1fHxicmFzcyUyMGRvb3IlMjBkZWFkYm9sdCUyMGxvY2slMjBrZXlob2xlJTIwY2xvc2UlMjB1cCUyMG1hY3JvfGVufDB8MHx8fDE3NzczMzExNjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Stairs": "https://images.unsplash.com/photo-1529160638848-c6c71fee1cb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw1fHxzdGFpcnN8ZW58MHwwfHx8MTc3NzMzMTMwNHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Porch": "https://images.unsplash.com/photo-1633396611072-6db6ba1cca00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxmcm9udCUyMHBvcmNoJTIwd29vZGVuJTIwc3RlcHMlMjByb2NraW5nJTIwY2hhaXIlMjBob3VzZSUyMGVudHJhbmNlJTIwZGF5fGVufDB8MHx8fDE3NzczMzExNjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Driveway": "https://images.unsplash.com/photo-1758680475983-9bd68d8c3cc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxjb25jcmV0ZSUyMGRyaXZld2F5JTIwc3VidXJiYW4lMjBnYXJhZ2UlMjB0d28lMjBjYXJzJTIwcmVzaWRlbnRpYWx8ZW58MHwwfHx8MTc3NzMzMTE2MHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Yard": "https://images.unsplash.com/photo-1621271654319-5e78a0f48756?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxMHx8Z3JlZW4lMjBncmFzcyUyMGJhY2t5YXJkJTIwZW1wdHklMjBuZWF0JTIwY2xlYXJ8ZW58MHwwfHx8MTc3NzMzMTE2MHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Garden": "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxnYXJkZW4lMjB2ZWdldGFibGVzfGVufDB8MHx8fDE3NzczMzE0MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Window": "https://images.unsplash.com/photo-1547571232-e81f97fc0f48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHx3aW5kb3clMjBnbGFzcyUyMGZyYW1lJTIwZGF5bGlnaHQlMjBicmlnaHQlMjBlbXB0eXxlbnwwfDB8fHwxNzc3MzMxNDE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "End table": "https://images.unsplash.com/photo-1610671907016-1eb6e7ab964d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxlbmQlMjB0YWJsZXxlbnwwfDB8fHwxNzc3MzM2NjM5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Coffee table": "https://images.unsplash.com/photo-1599008634438-fc6d2be54835?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw0fHxsb3clMjB3b29kZW4lMjBjb2ZmZWUlMjB0YWJsZSUyMGxpdmluZyUyMHJvb20lMjBydWclMjBtYWdhemluZXMlMjBzaW1wbGV8ZW58MHwwfHx8MTc3NzMzMTQxNXww&ixlib=rb-4.1.0&q=80&w=1080",
  "Plant": "https://images.unsplash.com/photo-1592150621744-aca64f48394a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxpbmRvb3IlMjBwbGFudHxlbnwwfDB8fHwxNzc3MzM2NjU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Painting": "https://images.unsplash.com/photo-1758366278768-0afef0775383?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxmcmFtZWQlMjB3YWxsJTIwYXJ0JTIwcGFpbnRpbmd8ZW58MHwwfHx8MTc3NzMzNjY3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  "Rug": "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxydWd8ZW58MHwwfHx8MTc3NzMzNjcxNHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Carpet": "https://images.unsplash.com/photo-1558944351-3f79926e74ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw2fHxjYXJwZXR8ZW58MHwwfHx8MTc3NzMzNjg4NXww&ixlib=rb-4.1.0&q=80&w=1080",
  "Sink": "https://images.unsplash.com/photo-1629078692818-c5a0443f4ae3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw0fHxzdGFpbmxlc3MlMjBzdGVlbCUyMGtpdGNoZW4lMjBzaW5rJTIwZmF1Y2V0JTIwd2hpdGUlMjBiYWNrZ3JvdW5kJTIwaXNvbGF0ZWR8ZW58MHwwfHx8MTc3NzMzMTQxNXww&ixlib=rb-4.1.0&q=80&w=1080",
  "Curtain": "https://images.unsplash.com/photo-1764669358888-d32e3b17d872?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw3fHx3aW5kb3clMjBjdXJ0YWlucyUyMHNoZWVyJTIwZGF5bGlnaHQlMjBsaXZpbmclMjByb29tJTIwZmFicmljJTIwZm9sZHN8ZW58MHwwfHx8MTc3NzMzMTQxNnww&ixlib=rb-4.1.0&q=80&w=1080",
  "Bedtable": "https://images.unsplash.com/photo-1726283295905-bb2c8ddbd8f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxM3x8d29vZGVuJTIwbmlnaHRzdGFuZCUyMGJlZHNpZGUlMjBsYW1wJTIwYWxhcm0lMjBjbG9jayUyMGJlZHJvb20lMjBzaW1wbGV8ZW58MHwwfHx8MTc3NzMzMTQxNnww&ixlib=rb-4.1.0&q=80&w=1080",
  "Refrigerator": "https://images.unsplash.com/photo-1722859178634-ccc8ea5680d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw2fHxtb2Rlcm4lMjB3aGl0ZSUyMHJlZnJpZ2VyYXRvciUyMGZyaWRnZSUyMGlzb2xhdGVkfGVufDB8MHx8fDE3NzczMzE0MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Microwave": "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxtaWNyb3dhdmUlMjB8ZW58MHwwfHx8MTc3NzMzNjgyMXww&ixlib=rb-4.1.0&q=80&w=1080",
  "Oven": "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw5fHxraXRjaGVuJTIwb3ZlbiUyMGNsb3NlZCUyMGlzb2xhdGVkJTIwd2hpdGUlMjBiYWNrZ3JvdW5kJTIwc2ltcGxlfGVufDB8MHx8fDE3NzczMzE0MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Counter": "https://images.unsplash.com/photo-1526868621613-18bc2df51131?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwzfHxraXRjaGVuJTIwY291bnRlciUyMGdyYW5pdGV8ZW58MHwwfHx8MTc3NzMzMTQxNnww&ixlib=rb-4.1.0&q=80&w=1080",
  "Cabinet": "https://images.unsplash.com/photo-1757439402103-fc35542f96f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw2fHx3aGl0ZSUyMGtpdGNoZW4lMjB3YWxsJTIwY2FiaW5ldHMlMjBoYW5kbGVzJTIwYnJpZ2h0JTIwbW9kZXJuJTIwZW1wdHl8ZW58MHwwfHx8MTc3NzMzMTQxNnww&ixlib=rb-4.1.0&q=80&w=1080",
  "Sofa": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxzb2ZhJTIwfGVufDB8MHx8fDE3NzczMzY4Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Armchair": "https://images.unsplash.com/photo-1650300636679-b3310a41638d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxNHx8c2luZ2xlJTIwdXBob2xzdGVyZWQlMjBhcm1jaGFpciUyMGxpdmluZyUyMHJvb20lMjB3aW5kb3clMjBuYXR1cmFsJTIwbGlnaHR8ZW58MHwwfHx8MTc3NzMzNjYzMXww&ixlib=rb-4.1.0&q=80&w=1080",
  "TV": "https://images.unsplash.com/photo-1717295248358-4b8f2c8989d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxmbGF0JTIwc2NyZWVuJTIwdGVsZXZpc2lvbiUyMHxlbnwwfDB8fHwxNzc3MzM2ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Fireplace": "https://images.unsplash.com/photo-1696814543693-31fcf942ccb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxzdG9uZSUyMGZpcmVwbGFjZSUyMGxpdmluZyUyMHJvb20lMjBtYW50ZWwlMjBsb2dzJTIwaW50ZXJpb3IlMjBjb3p5fGVufDB8MHx8fDE3NzczMzY2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Tuesday": "https://images.unsplash.com/photo-1691097097368-3715f5cb5f7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw3fHxUdWVzZGF5JTIwY2FsZW5kYXIlMjBzZWFzb24lMjBzY2hlZHVsZXxlbnwwfDB8fHwxNzc2MTk1NDM5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Friday": "https://images.unsplash.com/photo-1691097097106-4d8c330266f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw3fHxGcmlkYXklMjBjYWxlbmRhciUyMHNlYXNvbiUyMHNjaGVkdWxlfGVufDB8MHx8fDE3NzYxOTU0Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Saturday": "https://images.unsplash.com/photo-1691097097517-e30038aeda68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxTYXR1cmRheSUyMHxlbnwwfDB8fHwxNzc2MTk1NDc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Week": "https://images.unsplash.com/photo-1615776649547-038afe604c5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxM3x8V2VlayUyMGNhbGVuZGFyJTIwc2Vhc29uJTIwc2NoZWR1bGV8ZW58MHwwfHx8MTc3NjE5NTQ0MHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Yesterday": "https://images.unsplash.com/photo-1607523751409-dfd21c533288?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxZZXN0ZXJkYXklMjBzY2hlZHVsZXxlbnwwfDB8fHwxNzc2MTk1Nzg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Tomorrow": "https://images.unsplash.com/photo-1519500883398-1f823b076c3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwzfHxUb21vcnJvd3xlbnwwfDB8fHwxNzc2MTk1ODA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Today": "https://images.unsplash.com/photo-1667669325817-b387fd46700c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxUb2RheXxlbnwwfDB8fHwxNzc2MTk1ODE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Month": "https://images.unsplash.com/photo-1698749507514-d7a93924aa74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxNHx8TW9udGh8ZW58MHwwfHx8MTc3NjE5NTgzMHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Textbook": "https://images.unsplash.com/photo-1758875630351-b65d256e4dfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxMnx8dGV4dGJvb2slMjBzY2hvb2wlMjBlZHVjYXRpb258ZW58MHwwfHx8MTc3NjE5NjAzMnww&ixlib=rb-4.1.0&q=80&w=1080",
  "Teacher": "https://images.unsplash.com/photo-1758270704925-fa59d93119c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHx0ZWFjaGVyJTIwY2xhc3Nyb29tJTIwc2Nob29sfGVufDB8MHx8fDE3NzYxOTYwMzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Hair": "https://images.unsplash.com/photo-1747398690600-ffe8ecda9df1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxoZWFsdGh5JTIwbG9uZyUyMGhhaXIlMjBicnVzaCUyMGJhY2slMjBoZWFkJTIwaXNvbGF0ZWR8ZW58MHwwfHx8MTc3NjE5NjE3MHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Short": "https://images.unsplash.com/photo-1604545579383-58dbd58dc91c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw3fHxzaG9ydCUyMHBlcnNvbiUyMHN0YW5kaW5nJTIwaGVpZ2h0JTIwbWVhc3VyZW1lbnQlMjBzaW1wbGUlMjBiYWNrZ3JvdW5kfGVufDB8MHx8fDE3NzYxOTYxOTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Eyes": "https://images.unsplash.com/photo-1460904577954-8fadb262612c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw2fHxleWVzfGVufDB8MHx8fDE3NzYyODQ2NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Long": "https://images.unsplash.com/photo-1585828950421-a40556a08c7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxM3x8bG9uZyUyMHRhcGV8ZW58MHwwfHx8MTc3NjI4NDcxMHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Wavy": "https://images.unsplash.com/photo-1758798262064-8690e89d0b59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw1fHx3YXZ5JTIwZmVtYWxlJTIwaGFpciUyMHxlbnwwfDB8fHwxNzc2Mjg0NzU3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Curly": "https://images.unsplash.com/photo-1565357419076-6acd4a10094e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw4fHxjdXJseSUyMGhhaXIlMjB0ZXh0dXJlJTIwcG9ydHJhaXQlMjBzaW1wbGUlMjBiYWNrZ3JvdW5kfGVufDB8MHx8fDE3NzYyODQ2OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Bald": "https://images.unsplash.com/photo-1617925357829-fc25f5e53b62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxiYWxkJTIwbWFuJTIwcG9ydHJhaXQlMjBoZWFkJTIwc2ltcGxlJTIwYnJpZ2h0JTIwYmFja2dyb3VuZHxlbnwwfDB8fHwxNzc2Mjg0NjkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Brown": "https://images.unsplash.com/photo-1743964817509-f171e2539363?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGNvbG9yfGVufDB8MHx8fDE3NzYyODQ4MTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Black": "https://images.unsplash.com/photo-1497910091122-9f8a7746eb33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw0fHxibGFjayUyMGNhdHxlbnwwfDB8fHwxNzc2Mjg0ODYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Gray": "https://images.unsplash.com/photo-1580471260026-2a8acbc7c7a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxMHx8Z3JleSUyMHdoaXRlJTIwaGFpciUyMHNlbmlvciUyMHBlcnNvbiUyMHNpbXBsZSUyMGJhY2tncm91bmR8ZW58MHwwfHx8MTc3NjI4NDY5MHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Tall": "https://images.unsplash.com/photo-1596188729461-bf039d662198?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHx0YWxsJTIwYnVpbGRpbmclMjBsb29raW5nJTIwdXAlMjBzaW1wbGUlMjBza3klMjBoZWlnaHR8ZW58MHwwfHx8MTc3NjI4NDY5MHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Young": "https://images.unsplash.com/photo-1528289343377-a0249042ee2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw0fHx5b3VuZyUyMGtpZHN8ZW58MHwwfHx8MTc3NjI4NDkxMHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Thin": "https://images.unsplash.com/photo-1550520920-27ba45c38740?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHx0aGluJTIwbm90ZWJvb2t8ZW58MHwwfHx8MTc3NjI4NTAyNXww&ixlib=rb-4.1.0&q=80&w=1080",
  "Heavy": "https://images.unsplash.com/photo-1763479168264-3c439e27bb45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxoZWF2eSUyMHBhY2thZ2V8ZW58MHwwfHx8MTc3NjI4NTA1NXww&ixlib=rb-4.1.0&q=80&w=1080",
  "Doctor's office": "https://images.unsplash.com/photo-1758691462878-6edc3d3da1be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw0fHxkb2N0b3IlMjBzdGV0aG9zY29wZSUyMGRlc2slMjBwYXRpZW50JTIwcm9vbSUyMGJyaWdodCUyMGNsZWFufGVufDB8MHx8fDE3NzYyOTQyNjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Medical Care": "https://images.unsplash.com/photo-1758691462814-485c3672e447?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwzfHxzdGV0aG9zY29wZSUyMGNsaXAlMjBib2FyZCUyMGRvY3RvciUyMGRlc2slMjBjbG9zZSUyMHVwfGVufDB8MHx8fDE3NzYyOTQ3MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Turkey": "https://images.unsplash.com/photo-1669889587211-70196ed17d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwzfHx0dXJrZXklMjBiaXJkJTIwdGhhbmtzZ2l2aW5nfGVufDB8MHx8fDE3NzYyOTk2OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Price": "https://images.unsplash.com/photo-1649261124662-1a490c51f28d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw4fHxwcmljZSUyMHRhZ3xlbnwwfDB8fHwxNzc2MzU5ODM3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Deposit": "https://images.unsplash.com/photo-1593871097805-09627f52f4bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw1fHxjaGVjayUyMGVudmVsb3BlJTIwZGVwb3NpdCUyMGJhbmslMjBzbGlwJTIwY2xvc2UlMjB1cHxlbnwwfDB8fHwxNzc2MzU5ODI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Exchange": "https://images.unsplash.com/photo-1553003337-4907880f23a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxnaXZpbmclMjBtb25leSUyMHRvJTIwc29tZW9uZXxlbnwwfDB8fHwxNzc2MzY2MzU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Blouse": "https://images.unsplash.com/photo-1770294758906-c8762abb2c8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw0fHxCbG91c2UlMjBjbG90aGluZyUyMGZhc2hpb24lMjBhcHBhcmVsJTIwb3V0Zml0fGVufDB8MHx8fDE3NzYzNjY2Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Coat": "https://images.unsplash.com/photo-1706765779494-2705542ebe74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBjb2F0JTIwfGVufDB8MHx8fDE3NzYzNjY3ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Big": "https://images.unsplash.com/photo-1513185727240-e54323adb7f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxiaWclMjB8ZW58MHwwfHx8MTc3NjM2NjkzOHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Medium": "https://images.unsplash.com/photo-1750751860244-defb08e07f00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxMHx8dGhyZWUlMjBzaXplcyUyMGNvZmZlZXxlbnwwfDB8fHwxNzc2MzY3MDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Used": "https://images.unsplash.com/photo-1634649482168-4a7b59ec3b27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxMnx8dXNlZCUyMGNhcnxlbnwwfDB8fHwxNzc2MzY3MDg3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Utilities": "https://images.unsplash.com/photo-1603736043044-65d44d3c6230?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwzfHx1dGlsaXR5JTIwYmlsbCUyMHxlbnwwfDB8fHwxNzc3MzE4NTI2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Roof": "https://images.unsplash.com/photo-1538385329981-80baa0ab4859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwzfHxob3VzZSUyMHJvb2YlMjBhc3BoYWx0JTIwc2hpbmdsZXMlMjBjbGVhciUyMGNsb3NlJTIwdXAlMjBtYWNyb3xlbnwwfDB8fHwxNzc3MzMxMTYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Deck": "https://images.unsplash.com/photo-1623684143744-3a84757f73b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw5fHx3b29kJTIwZGVjayUyMHBvcmNoJTIwb3V0ZG9vciUyMGhvdXNlfGVufDB8MHx8fDE3NzczMzExNjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Garage": "https://images.unsplash.com/photo-1694889649834-91ff242d1763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxM3x8Z2FyYWdlfGVufDB8MHx8fDE3NzczMzEzMzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Light": "https://images.unsplash.com/photo-1664260820884-197e7172d34e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwzfHxsYW1wJTIwb24lMjB0YWJsZSUyMGRlc2t8ZW58MHwwfHx8MTc3NzMzMTQxNXww&ixlib=rb-4.1.0&q=80&w=1080",
  "Toilet": "https://images.unsplash.com/photo-1656646523710-eec180420c2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw3fHx3aGl0ZSUyMGJhdGhyb29tJTIwdG9pbGV0JTIwYm93bCUyMGlzb2xhdGVkJTIwY2xvc2VkJTIwbGlkfGVufDB8MHx8fDE3NzczMzE0MTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Bed": "https://images.unsplash.com/photo-1644031995392-5a07babd176c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw2fHxkb3VibGUlMjBiZWQlMjBtYWRlJTIwd2hpdGUlMjBzaGVldHMlMjBwaWxsb3dzJTIwaXNvbGF0ZWR8ZW58MHwwfHx8MTc3NzMzMTQxNnww&ixlib=rb-4.1.0&q=80&w=1080",
  "Closet": "https://images.unsplash.com/photo-1742453161018-73e39a241541?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxMXx8ZW1wdHklMjBvcGVuJTIwY2xvc2V0JTIwd2hpdGUlMjBzaGVsdmVzJTIwaGFuZ2luZyUyMHJvZHxlbnwwfDB8fHwxNzc3MzMxNDE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Lamp": "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwzfHxsYW1wfGVufDB8MHx8fDE3NzczMzY3MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Bathtub": "https://images.unsplash.com/photo-1630699376517-7d0ac3d33cc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxM3x8YmF0aHR1YnxlbnwwfDB8fHwxNzc3MzM2NzkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Chair": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxjaGFpcnxlbnwwfDB8fHwxNzc3MzM2ODExfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Washer": "https://images.unsplash.com/photo-1691729086731-a8f0b124986c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxMXx8d2FzaGluZyUyMG1hY2hpbmUlMjB8ZW58MHwwfHx8MTc3NzMzNjg5OHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Dryer": "https://images.unsplash.com/photo-1550025005-05b9002486c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw0fHxjbG90aGVzJTIwZHJ5ZXJ8ZW58MHwwfHx8MTc3NzMzNjkyOHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Over": "https://images.unsplash.com/photo-1621202959307-b3f68167ae45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxicmlkZ2UlMjBvdmVyJTIwcml2ZXIlMjBhYm92ZXxlbnwwfDB8fHwxNzc3MzM2OTM4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Under": "https://images.unsplash.com/photo-1753104429242-30a26741a206?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHx1bmRlciUyMHRhYmxlJTIwYmVsb3d8ZW58MHwwfHx8MTc3NzMzNjkzOHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Server": "https://images.unsplash.com/photo-1598977977476-1c9b2f2bc672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw5fHxyZXN0YXVyYW50JTIwc2VydmVyJTIwd2FpdGVyfGVufDB8MHx8fDE3NzczMzY5NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Cook": "https://images.unsplash.com/photo-1653233797467-1a528819fd4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxNXx8Y2hlZiUyMGhhbmRzJTIwY2hvcHBpbmclMjB2ZWdldGFibGVzJTIwY3V0dGluZyUyMGJvYXJkJTIwa2l0Y2hlbiUyMHN0YWlubGVzc3xlbnwwfDB8fHwxNzc3MzM2OTYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Prep Cook": "https://images.unsplash.com/photo-1488905971602-47901d26961b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxMnx8Y29tbWVyY2lhbCUyMGtpdGNoZW4lMjBwcmVwJTIwc3RhdGlvbiUyMGN1dHRpbmclMjBib2FyZCUyMGtuaXZlcyUyMGluZ3JlZGllbnRzfGVufDB8MHx8fDE3NzczMzY5NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Business owner": "https://images.unsplash.com/photo-1753351056301-73dbe05f84a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwzfHxzbWFsbCUyMHN0b3JlZnJvbnQlMjBvcGVuJTIwc2lnbiUyMG93bmVyJTIwYXByb24lMjBzaWRld2FsayUyMGRheXRpbWV8ZW58MHwwfHx8MTc3NzM0MDU1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
  "Homemaker": "https://images.unsplash.com/photo-1761839258803-21515f43190c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxmYW1pbHklMjBob21lJTIwY29va2luZyUyMG1lYWwlMjBraXRjaGVuJTIwYnJpZ2h0JTIwd2FybSUyMGludGVyaW9yfGVufDB8MHx8fDE3NzczNDEwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Driver": "https://images.unsplash.com/photo-1615563164538-89e1da13fcc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxkcml2ZXJ8ZW58MHwwfHx8MTc3NzM3NzA1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "Landscaper": "https://images.unsplash.com/photo-1689855614312-20f96816c5ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwzfHxMYW5kc2NhcGVyJTIwd29ya2Vyc3xlbnwwfDB8fHwxNzc3Mzc3MDcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Housekeeper": "https://images.unsplash.com/photo-1664008760004-182420e58e7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw1fHxob3VzZWtlZXBpbmclMjB8ZW58MHwwfHx8MTc3NzM3NzE4NHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Construction worker": "https://images.unsplash.com/photo-1646324554833-f0b6a479fa5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxMXx8Y29uc3RydWN0aW9uJTIwd29ya2VyfGVufDB8MHx8fDE3NzczNzcyMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Electrician": "https://images.unsplash.com/photo-1743836798811-6208a08233c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxMXx8ZWxlY3RyaWNpYW4lMjB3b21hbnxlbnwwfDB8fHwxNzc3Mzc3MjMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Plumber": "https://images.unsplash.com/photo-1749532125405-70950966b0e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxwbHVtYmVyfGVufDB8MHx8fDE3NzczNzcyNjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Painter": "https://images.unsplash.com/photo-1523198780259-41f275ab6e3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxwYWludGVyJTIwd29ya2Vyc3xlbnwwfDB8fHwxNzc3Mzc3Mjg0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Dentist": "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwyfHxkZW50aXN0fGVufDB8MHx8fDE3NzczNzczMzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Cashier": "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwzfHxjYXNoaWVyJTIwfGVufDB8MHx8fDE3NzczNzczNjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
};
