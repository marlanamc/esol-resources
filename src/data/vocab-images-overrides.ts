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
  Monday:
    "https://images.unsplash.com/photo-1716556165208-563b2c7802e4?w=1080&q=80&auto=format&fit=crop",
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
  "House": "https://pixabay.com/get/g2c0846f4cbc028073dc110959806c28645b721ed419b721dd68fc0223499bfad00748493c562f2edc99dc4b7100d37ffd4fa94c8da4c628524794deca5fa1079_640.jpg",
  "Supermarket": "https://pixabay.com/get/g6155c0c675f8ac948380ceb12951ae5e4ab5772a758647b809ead086898abe09002b8daa7057b66f241fb709598fdcf5d24657f1b2b6dfa1c9e735f1737dd2c2_640.jpg",
  "Bus Stop": "https://pixabay.com/get/gb98276a202c0cf1391f693b4ce2d9c4edb0386fe792e09276f1cf1df579fd58531681373bc2667374d690908827cfa6653f93756a957476f0713f56dfcabbbe9_640.jpg",
  "Station": "https://pixabay.com/get/g3d15a5fa10a5b3c6f643cb09c6c51aa12ae93a0c1fdbf5712d340b42cd4adb16319037688132843320291bc72010130bc1ce9534edcf0d08251f81438d1ae73e_640.jpg",
  "Public Transportation": "https://pixabay.com/get/g59c162be39b47ea31254e7d1305bc658cff84aa6cddb1579dc21410b3fb39a81c6efd59d8eb2fb25109085e6a39a27607396b2f2d972d74f3ab411339b00fe17_640.jpg",
  "Clinic": "https://pixabay.com/get/g011ae9eb084dbd0dec305c5b4efcce20db8841dd9ad03ad8f2a3617306ed31500e6f419b8752684e989229fbdecc8eabb53fedaf6aea58d36d971972eff77265_640.jpg",
  "Restaurant": "https://pixabay.com/get/g143b7a328575773fc3941f3b254a8af23ab99f1771af34e556f1a9b806b8b7f5bd515d0c897c333dd9a919d7cf588919_640.jpg",
  "Store": "https://pixabay.com/get/g79db66488681243dd92921a6cf9b947c24e51acf8426593fcd48bb3e7f977fefc6d59cd27b688af7345bc6f0e2b0587f553e6eda25b169371a6b9ef743e31cb0_640.jpg",
  "Gym": "https://pixabay.com/get/g7771d069b89eb93b8da17bc3237d47b05386f6c0ef1909f012917b03f909f1db984de773f54e914fc18616f270a92881f0d1910728be6a2a4487a6f2fd7b7b87_640.jpg",
  "Airport": "https://pixabay.com/get/gd5efe60147b7dcd95cef10f88be9e84c2672e9a166c8b88f6d77416fe8393b9a9ff1bb5f3d8d0e5632aeb9c0d5d08b1932a08c1ef0cc79e6caa259a8199f22bd_640.jpg",
  "Laundromat": "https://pixabay.com/get/gfdcdb35df6b8ddd47fe18155293f3dd6450e5968026887c6b1df54960e0310343583e3e1cc41460c4e6d74625b9be981_640.jpg",
  "Left": "https://pixabay.com/get/g32044c82b0cc985cc8a67bdd100941dd1f0ec879db8f3e1fd3c22f84e5a299a5716da2282161ee0c3b8aaa61e3e12e6abaae01b4d1995d07ca1ec999400a4ffd_640.jpg",
  "Right": "https://pixabay.com/get/g2fb941b95bf5dbe0a5b9715137d532ce5735016ccad5ffd3cf699ed937191b69ad0c619e1459cc8783fe10b74679bff7_640.jpg",
  "Straight": "https://pixabay.com/get/g1a2fe45645ce2bd5424b8e184fa900995b6bc9934c0ec6e2c088f1bd8cc836aac04a011965de864f05192fe7b5ffbe31ea4a8f1c6f76978d9498a1d93c5a4422_640.jpg",
  "Around": "https://pixabay.com/get/g5df973d2f44bf5563c5b091022ebe75c67b321487f8731be20403b9d1081fb4d98b9c7a90d5cd87b81c2b5a11429b74a2ae107e71a40c65be6f5eac42e175128_640.jpg",
  "Arms": "https://pixabay.com/get/g0be9e274b6be5525d1bedc6cb25a0c5da62c8df7e86082c02e7ce336ad218cd1ee34ca9253358ea0ff3e8092483b6b80acf0efbabe9d0f6036d049a63d810db4_640.jpg",
  "Chest": "https://pixabay.com/get/g78cf41121fa1c4b67f71995fc992e371feecd37feadabb2922d52b0777648b48ac78513d21a524693a0607be38ca96dc37845341e0169114fb4f2e2a6d173663_640.jpg",
  "Hands": "https://pixabay.com/get/ge655fe74af896065c2aa9c0bdf636b8ee2cc42302511248cb42164970d5f175d4dbf23cf216d1f5fb680df3dba5abe3aa67cf33380954e8fc30ffc7d011740a7_640.jpg",
  "Education": "https://pixabay.com/get/g76fd44a0da23e1e1b78db9d634c541b19d78b4e0c6f39451eb749f26f482aebdb53220164a1f26ae60e8cf27acb4957067135dfcac1456e1a5ac31df47ed117c_640.jpg",
  "Shopping": "https://pixabay.com/get/gd78fe274d302b984d9c186c8e2e1cb7814d423a1494f9b68f2ddce5343a7979ad4bc14bae6d22f01bb8ade9355aa9490756546f9f40a16ab1cfa8a1dc7eab279_640.jpg",
  "Housing": "https://pixabay.com/get/gb30b4c7bbee47b3a46e5e5beb925813cf643f8d11073a9c8946a757142866cd4041306a17f8cc48a916874697b2134bdc53363a4a855fb1e471e9ee1a8a56f57_640.jpg",
  "Hospital": "https://pixabay.com/get/g286a3491bcc1490cee8a06ef0effc6a99dadfb6d359bc4fc4c8433409ae78e1ade74b65280df65d25f56e5145734d5dff3d5badf4096197f35bd39995a5bcb70_640.jpg",
  "Hotel": "https://pixabay.com/get/g3d2108929cb80df9c2f212850cc2212f0eed65048e04860604616ad79e143c2568f98f0221aa04a1d73e7c40c8a8fd082d17354f53f643c48e4b38d157fe2165_640.jpg",
  "Bank": "https://pixabay.com/get/gcb226ed10ce3a6b888266a40a5523fcb17054eb5ecd8f7794b4521a52835912abcf767be68a0c777bbdeac34d38bf364ce118d0f1df41168db4a3be1ea027bf4_640.jpg",
  "Post Office": "https://pixabay.com/get/g1cbd8d2d55406f67d857b9d76bb098649f415d9e551695403d58f35f68ecced1b69f1b1702b16cc3cf63ae4f89a797fb_640.jpg",
  "Police Station": "https://pixabay.com/get/g278e366a2b47e0bbb66d066c2d250b0de3ea7b573e407a1b0cf6e7176520e315bd599da3891a90f3acb49520b1fd5ee0a1d5c1024101638de3d083c1d12e4288_640.jpg",
  "RMV": "https://pixabay.com/get/gbf6951e4ffb042c790b7ee6939a99b4d8832e9b8eae2d8fd3aa2cae9c4126d2cd459f5f71ffedfe689db81f9aefddb5a1cc089dad4a1bc4fc11ce85ef1938dcc_640.jpg",
  "City Hall": "https://pixabay.com/get/gd780b08812534ecdb7e1174c3a186488a5f87cd2f02782e68ec8c9033d7e035c898f4c452a6c9a86357db0aaa6f9d2b1697bb60d509eb1e317022860eab3d22d_640.jpg",
  "Pharmacy": "https://pixabay.com/get/g74dcd4e6772a120150eb25f96ffecfd8e127f0424280f95f590ae97b6e0bb3a98a835b457b6c235269217151e7a3fad925f83619758c6be440275a46f333bb02_640.jpg",
  "Candidate": "https://pixabay.com/get/ge5c0ea986c14812d23a448910f8e79913b3ead84b77b0ce8ac81b8d81ee88e93f51c7cc172c11b1faace403b21207b58dcbde220097f23e7efb3980b28109bb0_640.jpg",
  "Call": "https://pixabay.com/get/ga2937d13be54b72fcf1c403f51885c413d48daa572ceb70aadd0cdc2ea2838bfc665225c2cd5071a571cbfacb2a4a26a7e509bc1e923a2b8a6c3f6866a61df86_640.jpg",
  "Message": "https://pixabay.com/get/gc95b267c9fe5768d043b73c3dc6bcfe34e1d0a5703536f6d29c4f5bcdb63a1a0e1f23ab8cbbb797ffdf506e22ab30a69a18bb9e1a4cef72cefece734cbaf8e02_640.jpg",
  "Voicemail": "https://pixabay.com/get/g19641a1ab00b65829c46c1305dc118839a301d3829c37c9a34fed90902a85843b5d84304ba824ade23fe471252fc6e8ea4f932a9f89b91ec3509cbe17aae5c42_640.jpg",
  "Email": "https://pixabay.com/get/g93b841a83c376a45f27ed0eb2aeab093beaeeec937496a3fefea73e95e1a86a47f986a172a6cf329fe5a80045b641fbcd10891cc917ed8a3fb031c77ae4eb317_640.jpg",
  "Thanks": "https://pixabay.com/get/g8a98fc70cbf18f0a73cbf81b7ba1856a9b78d28139ff0d7c24d7003a761f3d3fdf3bbceec50c1d15b72517b5b68b990c_640.jpg",
  "Meal": "https://pixabay.com/get/g902d35db1253d511976081805428a097c071bdf14e0b1e176b1e6f0687c4aff128228ba1f6b9d6ee2c33fa4396687c11c066dc121c34fa78c0d44dc47f8bcb25_640.jpg",
  "Indigenous": "https://pixabay.com/get/gb63c299ade5ae4d09b3ab0c8c1e4adfafec687bce2b3444bb421ace51ff0efc64907fc2bf392a7416e456eb064cc1f76_640.jpg",
  "Pilgrim": "https://pixabay.com/get/g65804d7ef5fafafb5ca3113a29fb8c89307ceadc82f4ba07b6ba4fb6f8a744e30a0dfb07c180dfd7e1f8c38b413513e8aebbdf8a1881d03d072f64d5fb2a9531_640.jpg",
  "Shirt": "https://pixabay.com/get/g4b09c3a6854c43622f944ddbe8aa74b6a4c022704fc89e417c8699f8db35dc6f49b5f1ebbcc318381a140d55f78ebcf3924e191861a13ab704bfb0a7a95a1c3b_640.jpg",
  "Suit": "https://pixabay.com/get/g19b0bc7187063d8a3bcad2ed446f7794229f75c2ce2e36c737d5751dcdaaf2297cd1036f7f899e10c89e78312a83729788bd08df8b6314d4c5596479cdf15399_640.jpg",
  "Sweater": "https://pixabay.com/get/g0b8c93c57603770fc49bdc31228a8880b1b45a169e9824a7611b1fbd7b19f83add83fbc9586396200db6680c729c419520feb916cb9fd6ae364be88b26159d7c_640.jpg",
  "Cap": "https://pixabay.com/get/gca8fdb8594f14c0420dff10e3e8ae1b5d6bf2eb3f415824001bea62f027bc447fb8729424021b2e911bf8036e0e78477bd2bde281f4b1d32cf5032500d9bd147_640.jpg",
  "Dress": "https://pixabay.com/get/g504a8755d0fcb2a173768b432587c163147165b504c6691df210832822676d9a66b82e7f364075bc3aa6958839d4276d615590f40a92be7ed8a9abe78e097176_640.jpg",
  "Skirt": "https://pixabay.com/get/gcd284eaffa16bc36a6f0bc2fd15612c46c8232828952129b672bd3fc14800ce0413976d21a1fe2a8aff45c13c86e43d15aefd6eaf4be1b0a881ee29acd67887b_640.jpg",
  "Belt": "https://pixabay.com/get/g07e71bbc9704aa011a70efdb0d5536089aa9d89584de2182c6a7f0eb848e2137696b30a4a3aa2f97235411260c07b437ba419ed90b76aa0bd74638ba5ebd1e22_640.jpg",
  "Pants": "https://pixabay.com/get/g852d21b8a93951d5c83ee8c829c8c4a80c0f7ae4b44ece234d6acdf4cd7e1d0e153dd1e9112fa3db86243274d8eedad8f2f4b90d164b0e0a823ff152a939f312_640.jpg",
  "Shorts": "https://pixabay.com/get/g0f5c0715035ebef26d7ec50a11e1129971f437735ed25c8d5a5cedd5e6cf7e0b1dfa115973176d105af8b6157c988df9aff7277b4082faeab3ed80cfb69a4daa_640.jpg",
  "Large": "https://pixabay.com/get/gf293fa0f0064bd5dfb81e8a5c4719ac345740bdf34b9e0ba64d9effbddce6d79d44d831d52f4238acca2019bc9347a996e499c97465649802593310c382af170_640.jpg",
  "Small": "https://pixabay.com/get/gb08e4806b156e8e00ff6d92769f8b4f8d43180336f348a6f63ea73fb61f14e91effc44da747a3393340a2a6735cd69a988091f087c6119c64db22b311ef22530_640.jpg",
  "Electronics": "https://pixabay.com/get/gea03420b719a797f7653682d76431a1f74282eec83f7526e80d439a01e63dc8cc89f268fae72a74bec887307e91c1c8f_640.jpg",
  "Computer": "https://pixabay.com/get/gf00c42882111959ac0adc64c28ca60917c6513af8b11415590206eac3b37125bfd69a94d8da14d29020e67441b0ce470e7e39b2352bbe8eea09c8b601a6c4402_640.jpg",
  "Car": "https://pixabay.com/get/gd178c7f240dc2fb700b30b2dd63aa36c2311c9e64461f39ce456ced474424046998ff0b7d2164a6aa3a9c6c35b61007809623d17396e77a1cadf3a89abf80017_640.jpg",
  "Cellphone": "https://pixabay.com/get/gc74b9865dc5a6ba83a3e83f4f7a7509423f03f26a330eccda5a70d43ed83e6f2be39d4404aa12cf138e71addf13d0b129a63a343eaedd823b944d7fdf042e665_640.jpg",
  "Receipt": "https://pixabay.com/get/g482e780eb6d8b4403d6a3835fa621558faf5c275fe270586be26a22b415816b5adfa69346aa05e4fd9be55b321543481_640.jpg",
  "Tax": "https://pixabay.com/get/ga4e8484a4628e8f79792bec233edf31b648e9389ad5d61ff02f0bea400617f3cd82f96c3346c340ba282e95534f0cce7_640.jpg",
  "Credit Card": "https://pixabay.com/get/gcdf737ae94ce2a0c5e600e898478e61c5d2a8f7169a17b2eac9f500be4e8354180dd224ca34920d83b8aba7adfb35fe412a6a748db7f6cb120815ef62857b18c_640.jpg",
  "Debit Card": "https://pixabay.com/get/g36c255ddd030e4bf5a25f94549d9dcd81632720855aba784226cc99bf4f46da22c7ef3bb1c8931277ec149dc456e2a0077a54240eabe40aa0778d37c1ebe4635_640.jpg",
  "Check": "https://pixabay.com/get/g38e3b67e5dd2ab6ffa5e1918d9be742c68c13a9f8ca34fdc06116b5184d091f5932a175ea68a649b1969260cfcfdea93e9255d4b01cb4fd8dd4b1518307c05d8_640.jpg",
  "Signature": "https://pixabay.com/get/g4a9128a7fecd615dc1d570c6c70a3191473911a903736ee686335ad94040ef0e430379cc19730fafe7e09e1d0998530b6e94ca72e8c977e813b394e698dc6110_640.jpg",
  "ATM": "https://pixabay.com/get/g03a6578548bed412f66be4fa427b49d4da2642efded50cdbdfa2b2a08970a0e41227a6f5c8d7e337bb48cbeb3c6f12b7_640.jpg",
  "Online": "https://pixabay.com/get/gba60f1746c50910bcdbf85ccc3fb62162df10a3f29ca50d6fad6a9896bcc93026e58728e594decd5919aa270b6fff38b378ed68e19fe7dc1091476ced93fb826_640.jpg",
  "Refund": "https://pixabay.com/get/g6cd847505712b41a896aedec20e3ef362a31bd1ac365649a14e3a20da81483ec8cbf7624bda77b7e15a82362c84216ada0c22a6305a7ecf9180eb476652ed7e2_640.jpg",
  "Landlord": "https://pixabay.com/get/gaa737e5b28d4c371c84952dee96cab007196acd438b68bacb8ba315804a92c3968370676788ae9a099ac3c5740e2bdf5b25418da81d70aa3bf987b8b075558d8_640.jpg",
  "Manager": "https://pixabay.com/get/g41c6b423c69c323951911a96cdb5d9849729367cc4795290aedd779ffb23d5bb594203178c663466fe6bed9f9b6598f6a1dda7ab7a40d9b8e4ee569b9dfb3c08_640.jpg",
  "Agent": "https://pixabay.com/get/ge97f16e60bd0d92f9ba55634fd12d3a1a7d485ad22431acfc3e916d69135a56998968d0a0404a7944dee0bf3b3958b95fbc823bb3a82a632b1cb0896d8ae5093_640.jpg",
  "Real Estate": "https://pixabay.com/get/g4318c0ae3f321e33bfdea6ad5f52e5eaddfae3dde20be4c4f84a0650d8e4de58f560a8ce08adce5be83e4fd1c72f0664b4d5555a9af764cc9ea3c998df5883cd_640.jpg",
  "Leak": "https://pixabay.com/get/g346aac06432f889d17e21564dac2dc36a1b87db7bd46659f6a95c1db003552e522f1c6a467c14cfa66f39de9b02ebebb_640.jpg",
  "Broken Window": "https://pixabay.com/get/gfa5b33233ef0df27da15b04914f0a68196e9d82070605a8af69e4f426ade94ad55fe1153c58dc05a3bd108253cac0b2e83c306bdf06f5ecccfdd593841b58102_640.jpg",
  "Clogged Toilet": "https://pixabay.com/get/g5da52341f1eaa122411bf523d173516a515d4fab5c2ade2734e79233a5a9c7e64ba9a944e046de5dae838b6cbbbe7ef44bf5e21a4486396cb8cc2bba554fbbdf_640.jpg",
  "Complaint": "https://pixabay.com/get/g786cc4be636122b16359c2979aadee152eb70e8d570d64d16061c3e4e7f606090ab0bf4b808d013c81e73e30d4010f38dc00a95c09ed040c923e95321749fd23_640.jpg",
  "Home": "https://pixabay.com/get/gfa5b0cb9d31f31f5799b6905961523b84cc48a0f12cbd1eeeaf59e9f973174ef0fa23c3ba4f0f86b5e3f3a7e99e23cbb886ebe8a9f9bc578b436707aa0c4d493_640.jpg",
  "Apartment": "https://pixabay.com/get/g85008d87336db5f017c0135ce431b38ef8af652fadd68afb349b6494f09a71703dd84b35271b66644f3c8ba08f66046f_640.jpg",
  "Condominium": "https://pixabay.com/get/g1feb9a4ab97a202d060e341996d39a2a740d4f4e05868a1b154c0275638679a20a0c6a3e4307566d4b67aea4f3d5d550ad85a0298e44d259f4112436bfe6a7d9_640.jpg",
  "Unit": "https://pixabay.com/get/g70f637687d0bd2c0af19b895d4c304248e554cbf23d16097bb5424971a6b9ae430059ddb71295b23593e4396ab89ac74_640.jpg",
  "Rent": "https://pixabay.com/get/g14a18c4023285bd78a05c0f29231bb5fe142e48b622d7378583327d85b51cc4968e21474979df750206560531d823fcc806f014856b63b08d128fc0aac176ee0_640.jpg",
  "Lease": "https://pixabay.com/get/g9222573cc9f78d06374c3b6c192aa8a3bb66680be7ea3b3ca5d1b8a3cb9a2b5f220fdb65073d97a06bcb6d16f23bf4be24220107c665fe231fc0cdec8d30d001_640.jpg",
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
};
