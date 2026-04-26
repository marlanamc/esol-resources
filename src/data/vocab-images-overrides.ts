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
  Job: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1080&q=80&auto=format&fit=crop",
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
  "Manager": "https://images.unsplash.com/photo-1626178793926-22b28830aa30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHwxfHxwcm9wZXJ0eSUyMG1hbmFnZXIlMjB8ZW58MHwwfHx8MTc3NjU0NDc3MHww&ixlib=rb-4.1.0&q=80&w=1080",
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
  "Lease": "https://images.unsplash.com/photo-1648712898089-4435bc87b587?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMzd8MHwxfHNlYXJjaHw5fHxsZWFzZSUyMHJlbnRhbCUyMGFncmVlbWVudCUyMGNvbnRyYWN0JTIwcGFwZXIlMjBwZW4lMjBtYWNyb3xlbnwwfDB8fHwxNzc2NDYyOTc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Fee": "https://pixabay.com/get/gd60cc79819eb094b82423c7b0a3b395362356857dbdbe35e315b0a022d1a83596ca24c14851f3f8bdc13fa938d04b5b3f15e9af4cfe7600db929deb808acb900_640.jpg",
  "Security deposit": "https://pixabay.com/get/g74376d69a5a2fa42a68d6186f928d78fbda403b3dc0625513852c420291bb594835c4407e911e05129b82b3a30a3859578d4ebf841731b8eb0ff8748a469ce09_640.jpg",
  "Laundry": "https://pixabay.com/get/ga9ae1bb6d03604a3cad588f3aa426eaee99a08bcb3db593a4ba60d2b230f863f72a6a6ce8e7a7ad591f349b4fa635d23_640.jpg",
  "Gas": "https://pixabay.com/get/gb95c6c888773f8ce16a19ad21b2c2013e898a35c62c9b9213b1abeac14a8c04485f4a7845906a67769c5ca02fe1202142c7d5a41b2516feed640a10fb1ed316a_640.jpg",
  "Water": "https://pixabay.com/get/g2a488044afbb5eff224c856e5209df90c6df956c16834600e49021fadf0fbeddf5c94c5fa4bcdd8d78e2dc4040cb0c24_640.jpg",
  "Electric": "https://pixabay.com/get/ga355b3d1281b936f311c11137829789de29be050ad5c51c4248eb203df17ec08cd0b5f88766438e4cf83b47f393826ad_640.jpg",
  "Room": "https://pixabay.com/get/g9b2a7a10c34a2bd574b84908d24ca6eaae8aed28c85cf74e4df904fd3412db55c69d55c6e7343cf411d5d52e7f062f3d_640.jpg",
  "Bathroom": "https://pixabay.com/get/ga364c07c0b69294dd826b7d74aca3d9f5986d14bd69e5a2954c6b8b0aead3ba584b154b83b66e00e0b29f3854f333c69bc574e6aa8486c863b9c141dbc6cdf9e_640.jpg",
  "Kitchen": "https://pixabay.com/get/g6dd026f6473f6289c36b17c39bc73befc00ac24618b9f93b20ed00b933970b402a0373a49129d45f0879c71bf8e225d23f6ec4c76bffa675cd1ac1044f62f749_640.jpg",
  "Bedroom": "https://pixabay.com/get/g7a1e7f4d35dced403b409176e2565f9047210dc55f97c47e6e8eb2562cf3cbb15e7259956d6b56f2fc3331073caebc000802db8f8e9da6955a37ba767b25c905_640.jpg",
  "Living room": "https://pixabay.com/get/gbe1889eda31e15cbbcee79a7c47a319b012e91565e10e904a5b0a347eb16732c2db536ebaa09acdc1e81968ca2bb3ebe1504ef12b66fd1920bda41cc5f0c98b5_640.jpg",
  "Hall": "https://pixabay.com/get/g0d3a66c5a651f293c4ab0aae6835e37585b94eb7c851f6566b89df17bf3f1d1b39cf6df9a98836aba1edbf0d75cb5aa747b160d18e3e67ea4f460274870dfea5_640.jpg",
  "Floor": "https://pixabay.com/get/gdec586a84b46da1a532f470b7eda9576851f56ec913c3d95a9986fc0d663e43c58cafc6268346098323f5948bae52f57580d338569ea4555f3195bfe156a600b_640.jpg",
  "Basement": "https://pixabay.com/get/gcdd1eb2c7ccec24329e754be742223a20b671caccbf30513b7e8bf00235ede7a5a00ed92dc068d9a3326155033c81635_640.jpg",
  "Attic": "https://pixabay.com/get/g9d95bfff69c152564760d5a34554837afc8bf207f24dcca5fe6e8352089ce40b1a004eeabee9826a9c4bd55c273876b916fdef9be46b4115644229f738a17f16_640.jpg",
  "Chimney": "https://pixabay.com/get/gb87dac81910986aab51f94862794746e52afb7e92b193184fd4517c00b3ae927dfe560fa7bcd2f8ad2e091eb83ef9f9a7a22e9cf2620e16a587103ada4a31233_640.jpg",
  "Door": "https://pixabay.com/get/ga949dcedbf415f596f3b81c0b34146da620874aba0cf6fd8a5bc087dbdfe0853424f5667ee301192bc95296b0dae0f80d52c4c109a9baa5f6fe7dcb32feea1c8_640.jpg",
  "Front": "https://pixabay.com/get/gc3aba31a04cb3d889e4609d9e63995d52f2a10ce2f77f1dc27250e2e0be9810c0321cc5d460382973aaa720f8f1cf4bd_640.jpg",
  "Back": "https://pixabay.com/get/g8ddfbc961e97b137626f149294e17b438310a76da5fd6fb44b98eefff636b27658f158ba6070180cd5844a6a9f5ec7883c1cd998eb71a1dc4670c76b88977820_640.jpg",
  "Lock": "https://pixabay.com/get/g884112c9bc96b2254e0148d0366fb8301aa2ab7aeff004228b982f5feac72a64683c84ea651a1a339d37d5d4262b31d2_640.jpg",
  "Stairs": "https://pixabay.com/get/g1105b89888bb1b2884623906da0162e7c99844d0fabe41cbaad5a31089316c487c20f9e441de1a613a3c1ab7721d4910_640.jpg",
  "Porch": "https://pixabay.com/get/ga122d77cbee0e47fbc33127b48f3b1a5fd880bc2c20be30b5091894b8cd527d1479afd960115e0539d2f767156c2a4cf5ec1bc7040237e56c9d4f20c423632a4_640.jpg",
  "Driveway": "https://pixabay.com/get/g727ba079c8497f451bd31cbbb06c1f4ced034b1b5efed50095d0b06e044f82e7dec4993dadcd561642735ad9958aeeb859fc267783c52e32fd6b1c6f6f067ed5_640.jpg",
  "Yard": "https://pixabay.com/get/g1cb87f3dc7503ba604a8fba987975a1d5f2c139d82a7acd47da2c6be3ca6777eb765d564a1d3bd4d01c0eb7404290769_640.jpg",
  "Garden": "https://pixabay.com/get/gcfc6531398a3122f85489bd98c78e4d2b9a1420da488d6c7366d5361e59d904522ae45f1bfa6b709ae4871bbb9777828f5ad43b0f0ad03da9ada29dc518e3602_640.jpg",
  "Window": "https://pixabay.com/get/g52c64060c50f7ac924f28ddfae6e42da170fca0b39f1505c36a49739b51bcc4a569cad772bb8b20b9cfcd900290ffb39ff58cb03a0526fc7f028c725f6217808_640.jpg",
  "End table": "https://pixabay.com/get/g4e5a96d7a0135ef61a23a0d21f5bc55591b3294323e9c1a7ab9ac272e1b15db1774258a6dd4870a1f1f6bb318a6fcef91498338952004de8901082bd3385db73_640.jpg",
  "Coffee table": "https://pixabay.com/get/g4f047aef99daf344454ce58afcf2d6fcf9fe7531861ae838162eea2ef32dfb26397f28c4fdb212090461f771c03c073ccb32086deea24d6bb6914ab3b50d4b30_640.jpg",
  "Plant": "https://pixabay.com/get/g2d47ead740d6c50329589235c6fab698a887d7c4709bc511b93f9e8399dbbb10a78e8e42658033f0ad79a839a175464938f42d8da66bfc1d2f7c3533befbb0f4_640.jpg",
  "Painting": "https://pixabay.com/get/g7b4fa2d71306446d55d9cfd062fe4609adcf152d16bfe050b8814d404ae9d65c5124ed362db496d12074ba477ec9ded4_640.jpg",
  "Rug": "https://pixabay.com/get/g520833eccb82755c817993ac8e41979e1d51c368d981acbaa7ab3d9c876f518ddcbdb913f34c56ddff1f9277c8a29ab1_640.jpg",
  "Carpet": "https://pixabay.com/get/gfd62ab82c6d662dd5dfff34ccc9ab0a44717fc2c311cea098f5f0b493473c6075021c60aeb3d11f6ad6d313c1ecae779_640.jpg",
  "Sink": "https://pixabay.com/get/gee7791ddf3fba31468502b4d917844905cb5ea0bc2d2c9b134fb4753ec4ce8d1740891d20bb9b76d426e93284889d564753a2b8cd8c015d8c11516004611e64e_640.jpg",
  "Curtain": "https://pixabay.com/get/g1f5f94296cbb05e2b05ad239407308658e46897ef44cf47c649ab1a78467eac9a525cd27ec7970cdfcd894692af72974c123a747f5554805d4c0afa8d3e8ebe2_640.jpg",
  "Bedtable": "https://pixabay.com/get/g72352b84ae708fdd25d67ea7710ef8054936dca3ac06b8e4f5687d931b9f292f533a62b22022f2c2b41f7587e38182e0fc08e9d8e88d1825cfb45a7c5a29dd69_640.jpg",
  "Refrigerator": "https://pixabay.com/get/gbfe94e55b41a93f9047954525aecef772b7e892ba605844b52b2c002678321e60da400eb84d65d1fff2433d91dfbc657e844b2d4d173fc3498110a4451b1d2a6_640.jpg",
  "Microwave": "https://pixabay.com/get/g517425501e54c25e645b2a2cb13b619f495943e5b5d733f58ea91c969890f194e1dd2d5e4780b12307492516410b66c4a98a2ea51233b69fb6e9b92e04e2fcc2_640.jpg",
  "Oven": "https://pixabay.com/get/g9357afb210dd9e6cff18f2fd3e79ac0f34e0272a888b7041cc7f216ea3bb0cc50dffabe35db6584b5439c4fd12986d4c85ea3487179b6b929816033d06c0f8bf_640.jpg",
  "Counter": "https://pixabay.com/get/g18fcd0c1843291e3a96d4009fd3e1635208d84d8a1753cac93fab4187e1c2ed4ab86ccd5ac39fef702f10fccb1311eb8529ee47b1f60deed4573ffc90d6691e4_640.jpg",
  "Cabinet": "https://pixabay.com/get/gf63d1eaf224335cef935d3659844733cc2d53c1ed9d30a0d8c26211ba056021d82fc226b4c9b0d0d4e491fdff93e3276fa99215440afb58a445845a0402b0043_640.jpg",
  "Sofa": "https://pixabay.com/get/geeb181b759cee161b587a8e697bf1640bfbee5ae7a655df41a4d0905b5e29f957e392008adab54294612601c2ecb3d7d6b9982dbc9ab5f3161a8f310b332a4de_640.jpg",
  "Armchair": "https://pixabay.com/get/g0746bc4fe520498b6cd1c703485aecdf86638c2411b88ef4da1db5edaf326c4212eefc33cf1af8ff28c756552a8aaec2ee78c792a2463990fd6413ad9dd082e4_640.jpg",
  "TV": "https://pixabay.com/get/g6c8d0bb2af8b7a23c432fb6b66989022c48611a9e99a3056a3e7e6fc35ecc4bafec03d87c1249f0077072be88f8bcc072b32c7421e28034f0141b567fdaba261_640.jpg",
  "Fireplace": "https://pixabay.com/get/ge6a6d7098670c216f4f84e883cc272f5e4fe9a0ef738575dc11afa655065a187a09cf70d2558c431529af4dabf8bd98d6228faa0bc62e0761d341b517e9390aa_640.jpg",
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
};
