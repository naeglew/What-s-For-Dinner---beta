import { useState, useMemo, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const SHORT = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const CATEGORIES = ["Produce","Meat & Seafood","Dairy","Bakery","Pantry","Frozen","Other"];
const CUISINES = ["Italian","Mexican","Asian","American","Mediterranean","Indian","French","Greek","Japanese","Thai"];
const DIETS = ["Vegetarian","Vegan","Gluten-Free","Dairy-Free","Keto","Paleo","Nut-Free"];
const TIMES = ["Under 20 min","20–30 min","30–45 min","45–60 min","1+ hour"];

// ─── SEED USERS / FAMILIES ────────────────────────────────────────────────────
const ALL_USERS = [
  { id:"u1", name:"Sarah M.", family:"f1", role:"admin", avatar:"👩", familyName:"The Mitchells" },
  { id:"u2", name:"Tom M.",   family:"f1", role:"member",avatar:"👨", familyName:"The Mitchells" },
  { id:"u3", name:"Emma M.",  family:"f1", role:"member",avatar:"👧", familyName:"The Mitchells" },
  { id:"u4", name:"Jake M.",  family:"f1", role:"member",avatar:"👦", familyName:"The Mitchells" },
  { id:"u5", name:"Linda K.", family:"f2", role:"admin", avatar:"👩‍🦰", familyName:"The Kowalskis" },
  { id:"u6", name:"Chef Raj", family:"f3", role:"admin", avatar:"👨‍🍳", familyName:"The Patel Kitchen" },
  { id:"u7", name:"Mia C.",   family:"f4", role:"admin", avatar:"👩‍🦱", familyName:"Casa Chen" },
];

// ─── SEED COMMUNITY RECIPES ───────────────────────────────────────────────────
const SEED_COMMUNITY = [
  {
    id:"cr1", name:"Classic Beef Lasagna", authorId:"u5", authorName:"Linda K.", familyName:"The Kowalskis",
    servings:6, time:"1+ hour", cuisines:["Italian"], diets:[], description:"Rich, hearty layers of beef, béchamel, and pasta — our family's Sunday tradition for 20 years.",
    ingredients:[
      {item:"Lasagna sheets",qty:"12",category:"Pantry"},
      {item:"Ground beef",qty:"500g",category:"Meat & Seafood"},
      {item:"Ricotta cheese",qty:"400g",category:"Dairy"},
      {item:"Mozzarella, shredded",qty:"2 cups",category:"Dairy"},
      {item:"Crushed tomatoes",qty:"2 cans",category:"Pantry"},
      {item:"Yellow onion",qty:"1",category:"Produce"},
      {item:"Garlic cloves",qty:"4",category:"Produce"},
      {item:"Whole milk",qty:"2 cups",category:"Dairy"},
      {item:"Butter",qty:"3 tbsp",category:"Dairy"},
      {item:"All-purpose flour",qty:"3 tbsp",category:"Pantry"},
    ],
    steps:["Brown beef with onion and garlic. Add tomatoes; simmer 20 min.","Make béchamel: melt butter, whisk in flour, add milk slowly.","Layer: sauce → noodles → ricotta → béchamel → repeat.","Top with mozzarella. Bake 375°F for 40 min.","Rest 15 min before slicing."],
    likes:["u1","u6","u7"], rating:4.8, ratingCount:24,
    comments:[
      {id:"c1",userId:"u6",userName:"Chef Raj",avatar:"👨‍🍳",text:"Added a pinch of nutmeg to the béchamel — game changer!",ts:"2 days ago"},
      {id:"c2",userId:"u7",userName:"Mia C.",avatar:"👩‍🦱",text:"My kids devoured this. Making it every Sunday now.",ts:"5 days ago"},
    ],
    savedBy:["u1","u6"], postedAt:"1 week ago",
  },
  {
    id:"cr2", name:"Butter Chicken", authorId:"u6", authorName:"Chef Raj", familyName:"The Patel Kitchen",
    servings:4, time:"45–60 min", cuisines:["Indian"], diets:["Gluten-Free"], description:"Creamy, fragrant, and deeply spiced. Better than takeout, I promise.",
    ingredients:[
      {item:"Chicken thighs, boneless",qty:"700g",category:"Meat & Seafood"},
      {item:"Plain yogurt",qty:"½ cup",category:"Dairy"},
      {item:"Butter",qty:"3 tbsp",category:"Dairy"},
      {item:"Heavy cream",qty:"½ cup",category:"Dairy"},
      {item:"Crushed tomatoes",qty:"1 can",category:"Pantry"},
      {item:"Yellow onion",qty:"1",category:"Produce"},
      {item:"Garlic cloves",qty:"4",category:"Produce"},
      {item:"Fresh ginger",qty:"1 tbsp",category:"Produce"},
      {item:"Garam masala",qty:"2 tsp",category:"Pantry"},
      {item:"Cumin",qty:"1 tsp",category:"Pantry"},
      {item:"Turmeric",qty:"½ tsp",category:"Pantry"},
    ],
    steps:["Marinate chicken in yogurt + spices 1 hr (or overnight).","Sear chicken in butter until charred. Set aside.","Sauté onion, ginger, garlic. Add tomatoes; simmer 15 min.","Blend sauce smooth. Return to pan with cream.","Add chicken; simmer 10 min. Serve with naan or rice."],
    likes:["u1","u2","u3","u7"], rating:4.9, ratingCount:41,
    comments:[
      {id:"c3",userId:"u1",userName:"Sarah M.",avatar:"👩",text:"Made this last Tuesday — absolute hit with the whole family!",ts:"3 days ago"},
    ],
    savedBy:["u1","u2","u7"], postedAt:"2 weeks ago",
  },
  {
    id:"cr3", name:"Veggie Rainbow Tacos", authorId:"u7", authorName:"Mia C.", familyName:"Casa Chen",
    servings:4, time:"20–30 min", cuisines:["Mexican"], diets:["Vegetarian","Vegan","Gluten-Free"], description:"Colorful, crunchy, and satisfying. We make these every Meatless Monday.",
    ingredients:[
      {item:"Corn tortillas",qty:"12",category:"Bakery"},
      {item:"Black beans, canned",qty:"1 can",category:"Pantry"},
      {item:"Red cabbage, shredded",qty:"2 cups",category:"Produce"},
      {item:"Mango, diced",qty:"1",category:"Produce"},
      {item:"Avocado",qty:"2",category:"Produce"},
      {item:"Red bell pepper",qty:"1",category:"Produce"},
      {item:"Corn kernels",qty:"1 cup",category:"Produce"},
      {item:"Lime",qty:"2",category:"Produce"},
      {item:"Cilantro",qty:"¼ cup",category:"Produce"},
      {item:"Cumin",qty:"1 tsp",category:"Pantry"},
    ],
    steps:["Warm beans with cumin and a pinch of salt.","Char bell pepper and corn in a dry pan.","Make mango salsa: mango + lime + cilantro.","Warm tortillas. Assemble with all toppings.","Finish with a squeeze of lime."],
    likes:["u1","u4"], rating:4.6, ratingCount:18,
    comments:[],
    savedBy:["u1"], postedAt:"3 days ago",
  },
  {
    id:"cr4", name:"One-Pan Lemon Herb Chicken", authorId:"u5", authorName:"Linda K.", familyName:"The Kowalskis",
    servings:4, time:"30–45 min", cuisines:["Mediterranean"], diets:["Gluten-Free","Dairy-Free"], description:"Weeknight hero. Everything in one pan, minimal cleanup, maximum flavor.",
    ingredients:[
      {item:"Chicken thighs, bone-in",qty:"4",category:"Meat & Seafood"},
      {item:"Baby potatoes",qty:"400g",category:"Produce"},
      {item:"Cherry tomatoes",qty:"1 cup",category:"Produce"},
      {item:"Lemon",qty:"2",category:"Produce"},
      {item:"Garlic cloves",qty:"5",category:"Produce"},
      {item:"Fresh rosemary",qty:"3 sprigs",category:"Produce"},
      {item:"Fresh thyme",qty:"4 sprigs",category:"Produce"},
      {item:"Olive oil",qty:"3 tbsp",category:"Pantry"},
    ],
    steps:["Preheat oven to 425°F.","Toss potatoes in olive oil, garlic, herbs.","Nestle chicken among potatoes; add tomatoes and lemon slices.","Roast 35–40 min until chicken is golden and potatoes are tender.","Rest 5 min before serving."],
    likes:["u2","u3","u6"], rating:4.7, ratingCount:31,
    comments:[
      {id:"c4",userId:"u4",userName:"Jake M.",avatar:"👦",text:"Even I helped make this one lol",ts:"1 day ago"},
    ],
    savedBy:["u2","u6"], postedAt:"5 days ago",
  },
  {
    id:"cr5", name:"Miso Ramen from Scratch", authorId:"u6", authorName:"Chef Raj", familyName:"The Patel Kitchen",
    servings:4, time:"1+ hour", cuisines:["Japanese","Asian"], diets:[], description:"Weekend project worth every minute. The broth will haunt your dreams.",
    ingredients:[
      {item:"Ramen noodles",qty:"400g",category:"Pantry"},
      {item:"Chicken stock",qty:"6 cups",category:"Pantry"},
      {item:"White miso paste",qty:"4 tbsp",category:"Pantry"},
      {item:"Soy sauce",qty:"2 tbsp",category:"Pantry"},
      {item:"Soft-boiled eggs",qty:"4",category:"Dairy"},
      {item:"Pork belly or chicken",qty:"300g",category:"Meat & Seafood"},
      {item:"Bok choy",qty:"2 heads",category:"Produce"},
      {item:"Green onions",qty:"4",category:"Produce"},
      {item:"Nori sheets",qty:"4",category:"Pantry"},
      {item:"Sesame oil",qty:"1 tbsp",category:"Pantry"},
      {item:"Fresh ginger",qty:"1 inch",category:"Produce"},
    ],
    steps:["Simmer stock with ginger 30 min. Whisk in miso + soy.","Cook protein separately; slice thin.","Blanch bok choy in broth 1 min.","Cook noodles per package.","Assemble bowls: noodles, broth, protein, egg, bok choy, nori. Drizzle sesame oil."],
    likes:["u1","u3","u7"], rating:4.9, ratingCount:52,
    comments:[
      {id:"c5",userId:"u1",userName:"Sarah M.",avatar:"👩",text:"This took us a whole Saturday but wow. Worth it!",ts:"6 hours ago"},
      {id:"c6",userId:"u7",userName:"Mia C.",avatar:"👩‍🦱",text:"The soft-boiled eggs really make it. Don't skip them.",ts:"1 day ago"},
    ],
    savedBy:["u1","u3","u7"], postedAt:"4 days ago",
  },
];

// ─── SEED FAMILY RECIPES ──────────────────────────────────────────────────────
const SEED_FAMILY_RECIPES = [
  {
    id:"fr1", name:"Chicken Tacos", servings:4, time:"30 min", tags:["Mexican","Quick"],
    ingredients:[
      {item:"Chicken breast",qty:"600g",category:"Meat & Seafood"},
      {item:"Flour tortillas",qty:"8",category:"Bakery"},
      {item:"Cheddar cheese",qty:"1 cup",category:"Dairy"},
      {item:"Avocado",qty:"2",category:"Produce"},
      {item:"Lime",qty:"2",category:"Produce"},
      {item:"Taco seasoning",qty:"2 tbsp",category:"Pantry"},
    ],
    steps:["Season chicken with taco seasoning.","Cook in oil 6–8 min per side.","Slice and serve in warm tortillas with toppings."],
  },
  {
    id:"fr2", name:"Spaghetti Bolognese", servings:4, time:"45 min", tags:["Italian","Comfort"],
    ingredients:[
      {item:"Spaghetti",qty:"400g",category:"Pantry"},
      {item:"Ground beef",qty:"500g",category:"Meat & Seafood"},
      {item:"Crushed tomatoes",qty:"1 can",category:"Pantry"},
      {item:"Yellow onion",qty:"1",category:"Produce"},
      {item:"Garlic cloves",qty:"3",category:"Produce"},
      {item:"Parmesan",qty:"½ cup",category:"Dairy"},
    ],
    steps:["Sauté onion and garlic.","Brown beef. Add tomatoes; simmer 30 min.","Cook pasta. Serve with parmesan."],
  },
];

const HISTORY_MEALS = ["Spaghetti Bolognese","Chicken Tacos","Grilled Salmon","BBQ Ribs","Stir-Fry Noodles","Mac & Cheese","Shrimp Fried Rice","Beef Stew"];

function buildMenu() {
  return DAYS.map((day,i)=>({ day, meal:null, locked:i===4, lockedLabel:i===4?"Eat Out Night 🍽️":null }));
}
function genMenu(suggestions, history, base) {
  const freq={};
  suggestions.forEach(({meals})=>meals.forEach(m=>{freq[m]=(freq[m]||0)+1;}));
  const pool=Object.entries(freq).sort((a,b)=>b[1]-a[1]).map(([m])=>m);
  const fallback=[...history].sort(()=>Math.random()-.5);
  const full=[...new Set([...pool,...fallback])];
  return base.map(slot=>slot.locked?slot:{...slot,meal:full.shift()||"TBD"});
}

const MEAL_EMOJI={"Chicken Tacos":"🌮","Spaghetti Bolognese":"🍝","Grilled Salmon":"🐟","Stir-Fry Noodles":"🍜","BBQ Ribs":"🍖","Butter Chicken":"🍛","Classic Beef Lasagna":"🫕","Veggie Rainbow Tacos":"🌈","Miso Ramen from Scratch":"🍜","One-Pan Lemon Herb Chicken":"🍋"};
const mE=n=>MEAL_EMOJI[n]||"🍽️";

function StarRating({rating, count, interactive, onRate}) {
  const [hovered,setHovered]=useState(0);
  return (
    <div style={{display:"flex",alignItems:"center",gap:4}}>
      {[1,2,3,4,5].map(s=>(
        <span key={s}
          style={{fontSize:interactive?18:13,cursor:interactive?"pointer":"default",
            color:s<=(hovered||Math.round(rating))?"#F4A827":"#DDD",transition:"color .1s"}}
          onMouseEnter={()=>interactive&&setHovered(s)}
          onMouseLeave={()=>interactive&&setHovered(0)}
          onClick={()=>interactive&&onRate(s)}>★</span>
      ))}
      {count!=null&&<span style={{fontSize:12,color:"#8A7F74",marginLeft:2}}>{rating.toFixed(1)} ({count})</span>}
    </div>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:#F7F3EE;color:#1E1E1E;}

.shell{min-height:100vh;max-width:480px;margin:0 auto;display:flex;flex-direction:column;background:#F7F3EE;}

/* Top bar with two sections */
.topbar{background:#1E1E1E;color:#F7F3EE;position:sticky;top:0;z-index:100;}
.topbar-inner{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 0;}
.logo{font-family:'Fraunces',serif;font-size:17px;font-weight:900;letter-spacing:-.3px;}
.logo em{color:#E07A5F;font-style:italic;}
.upill{display:flex;align-items:center;gap:5px;background:rgba(255,255,255,.1);border-radius:20px;padding:5px 11px 5px 7px;cursor:pointer;font-size:12px;font-weight:600;border:none;color:#F7F3EE;}
.upill:hover{background:rgba(255,255,255,.18);}

/* Section switcher */
.section-tabs{display:flex;gap:0;margin:10px 16px 0;}
.stab{flex:1;background:rgba(255,255,255,.08);border:none;color:rgba(255,255,255,.5);font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;padding:8px 6px;cursor:pointer;letter-spacing:.4px;text-transform:uppercase;transition:all .15s;border-radius:0;}
.stab:first-child{border-radius:8px 0 0 0;}
.stab:last-child{border-radius:0 8px 0 0;}
.stab.on{background:#E07A5F;color:#fff;}

/* Sub-nav */
.subnav{display:flex;gap:2px;padding:0 12px;overflow-x:auto;scrollbar-width:none;}
.subnav::-webkit-scrollbar{display:none;}
.snbtn{background:none;border:none;color:rgba(255,255,255,.45);font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;padding:7px 10px;cursor:pointer;border-radius:6px 6px 0 0;transition:all .15s;letter-spacing:.4px;text-transform:uppercase;white-space:nowrap;}
.snbtn.on{background:rgba(255,255,255,.12);color:#fff;border-bottom:2px solid #E07A5F;}
.snbtn:hover:not(.on){color:rgba(255,255,255,.8);}

.body{flex:1;padding:14px 14px 32px;overflow-y:auto;}

/* Cards */
.card{background:#fff;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,.06);margin-bottom:14px;overflow:hidden;}
.ch{padding:12px 16px 10px;border-bottom:1px solid #EEE8E0;display:flex;align-items:center;justify-content:space-between;}
.ct{font-family:'Fraunces',serif;font-size:16px;font-weight:700;display:flex;align-items:center;gap:6px;}
.cb{padding:13px 15px;}

/* Buttons */
.btn{border:none;border-radius:10px;padding:9px 15px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;gap:5px;}
.bp{background:#E07A5F;color:#fff;}.bp:hover{background:#C9603E;}.bp:disabled{background:#D4C5BB;cursor:not-allowed;}
.bs{background:#EEE8E0;color:#1E1E1E;}.bs:hover{background:#E2D9CE;}
.bg{background:none;color:#E07A5F;padding:5px 9px;font-size:12px;}.bg:hover{background:#FDF0EC;}
.bfull{width:100%;justify-content:center;}
.bsm{padding:5px 10px;font-size:12px;}
.bicon{padding:6px 8px;border-radius:8px;background:#EEE8E0;color:#555;font-size:13px;}
.bicon:hover{background:#E2D9CE;}
.bdanger{background:#FDF0EC;color:#C96B50;}
.bdanger:hover{background:#FAE0D8;}

/* Community recipe card */
.crc{border:1.5px solid #EEE8E0;border-radius:14px;margin-bottom:12px;overflow:hidden;background:#fff;transition:border-color .15s;}
.crc:hover{border-color:#E07A5F;}
.crc-head{padding:13px 14px 10px;cursor:pointer;}
.crc-row1{display:flex;align-items:flex-start;gap:10px;}
.crc-icon{width:48px;height:48px;border-radius:11px;background:#FDF0EC;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;}
.crc-info{flex:1;min-width:0;}
.crc-name{font-family:'Fraunces',serif;font-size:15px;font-weight:700;margin-bottom:2px;}
.crc-by{font-size:11px;color:#8A7F74;margin-bottom:4px;}
.crc-desc{font-size:12px;color:#555;line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.crc-meta{display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap;}
.pill{background:#EEE8E0;border-radius:20px;padding:3px 9px;font-size:11px;font-weight:600;color:#444;}
.pill-green{background:#EAF7EE;color:#2C7A4B;}
.pill-blue{background:#E8F0FE;color:#2255CC;}
.crc-foot{display:flex;align-items:center;gap:6px;padding:9px 14px;border-top:1px solid #F0EBE3;background:#FAFAF8;}
.like-btn{display:flex;align-items:center;gap:4px;background:none;border:none;cursor:pointer;font-size:12px;font-weight:600;color:#8A7F74;padding:4px 7px;border-radius:7px;}
.like-btn:hover{background:#FDF0EC;color:#E07A5F;}
.like-btn.liked{color:#E07A5F;}
.save-btn{display:flex;align-items:center;gap:4px;background:none;border:none;cursor:pointer;font-size:12px;font-weight:600;color:#8A7F74;padding:4px 7px;border-radius:7px;}
.save-btn:hover{background:#EAF7EE;color:#2C7A4B;}
.save-btn.saved{color:#2C7A4B;}
.comment-count{font-size:12px;color:#8A7F74;margin-left:auto;}

/* Tags filter bar */
.filterbar{display:flex;gap:5px;overflow-x:auto;padding-bottom:6px;scrollbar-width:none;margin-bottom:12px;}
.filterbar::-webkit-scrollbar{display:none;}
.ftag{border:1.5px solid #DDD8D0;border-radius:20px;padding:4px 11px;font-size:12px;font-weight:600;color:#666;cursor:pointer;white-space:nowrap;background:#fff;transition:all .12s;}
.ftag.on{background:#E07A5F;border-color:#E07A5F;color:#fff;}
.ftag:hover:not(.on){border-color:#E07A5F;color:#E07A5F;}

/* Search */
.searchbar{display:flex;align-items:center;gap:8px;background:#fff;border:1.5px solid #E2D9CE;border-radius:12px;padding:8px 12px;margin-bottom:12px;}
.searchbar input{flex:1;border:none;outline:none;font-family:'DM Sans',sans-serif;font-size:14px;background:none;}
.searchbar span{color:#B0A898;font-size:16px;}

/* Modal */
.mbg{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:300;display:flex;align-items:flex-end;}
.modal{background:#fff;border-radius:20px 20px 0 0;max-height:90vh;width:100%;max-width:480px;margin:0 auto;overflow:hidden;display:flex;flex-direction:column;}
.mhdr{padding:14px 16px 12px;border-bottom:1px solid #EEE8E0;display:flex;align-items:flex-start;justify-content:space-between;flex-shrink:0;}
.mtitle{font-family:'Fraunces',serif;font-size:18px;font-weight:700;}
.mbody{padding:14px 16px;overflow-y:auto;flex:1;}
.xbtn{width:30px;height:30px;border-radius:50%;background:#EEE8E0;border:none;cursor:pointer;font-size:17px;display:flex;align-items:center;justify-content:center;color:#555;flex-shrink:0;}
.xbtn:hover{background:#E2D9CE;}

/* Comments */
.comment{display:flex;gap:9px;margin-bottom:12px;}
.cav{width:30px;height:30px;border-radius:50%;background:#FDF0EC;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
.cbubble{background:#F7F3EE;border-radius:10px;padding:8px 11px;flex:1;}
.cname{font-size:12px;font-weight:700;margin-bottom:2px;}
.ctext{font-size:13px;color:#333;line-height:1.45;}
.cts{font-size:11px;color:#B0A898;margin-top:3px;}

/* Inputs */
.inp{border:1.5px solid #E2D9CE;border-radius:10px;padding:8px 11px;font-family:'DM Sans',sans-serif;font-size:14px;background:#FAFAF8;outline:none;transition:border-color .15s;width:100%;}
.inp:focus{border-color:#E07A5F;background:#fff;}
.inp::placeholder{color:#B0A898;}
.inpsm{padding:6px 9px;font-size:12px;border-radius:8px;}
.sel{border:1.5px solid #E2D9CE;border-radius:8px;padding:6px 8px;font-family:'DM Sans',sans-serif;font-size:12px;background:#FAFAF8;outline:none;color:#1E1E1E;width:100%;}
.lbl{font-size:10px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;color:#8A7F74;margin-bottom:5px;}
.field{margin-bottom:11px;}

/* Menu */
.mrow{display:flex;align-items:center;gap:8px;padding:8px 9px;border-radius:10px;transition:background .12s;}
.mrow:hover{background:#FAFAF8;}
.mrow.mlocked{background:#FFF8EC;}
.mday{width:32px;font-size:10px;font-weight:700;color:#8A7F74;text-transform:uppercase;letter-spacing:.5px;flex-shrink:0;}
.mmeal{flex:1;font-size:13px;font-weight:500;}
.mlink{color:#2C7A4B;cursor:pointer;text-decoration:underline dotted;}
.mlink:hover{color:#1B5C38;}
.mtbd{color:#B0A898;font-style:italic;font-size:13px;}
.lbadge{font-size:10px;font-weight:600;color:#B5860A;background:#FFF0C2;padding:2px 7px;border-radius:5px;}
.rbadge{font-size:10px;font-weight:700;color:#2C7A4B;background:#EAF7EE;padding:2px 6px;border-radius:5px;}

/* Shopping */
.scat{font-size:10px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:#8A7F74;padding:7px 0 3px;margin-top:4px;}
.sitem{display:flex;align-items:center;gap:9px;padding:7px 9px;border-radius:9px;transition:background .12s;}
.sitem:hover{background:#FAFAF8;}
.sitem.chk{opacity:.4;}
.sitem.chk .snm{text-decoration:line-through;}
.schk{accent-color:#E07A5F;width:16px;height:16px;cursor:pointer;flex-shrink:0;}
.snm{flex:1;font-size:13px;font-weight:500;}
.sqty{font-size:11px;color:#8A7F74;}
.smtag{font-size:10px;color:#E07A5F;background:#FDF0EC;border-radius:5px;padding:1px 6px;font-weight:600;}

/* Members */
.mmbr{display:flex;align-items:center;gap:9px;padding:9px 11px;border-radius:11px;background:#FAFAF8;margin-bottom:6px;}
.mav{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:19px;}
.min-info{flex:1;}
.mn{font-size:13px;font-weight:600;}
.mr{font-size:11px;color:#8A7F74;}
.ms{font-size:11px;color:#E07A5F;font-weight:500;margin-top:1px;}

/* Misc */
.pb-w{background:#EEE8E0;border-radius:10px;height:5px;margin-top:5px;}
.pb{height:5px;border-radius:10px;background:#81B29A;transition:width .3s;}
.div{height:1px;background:#EEE8E0;margin:9px 0;}
.empty{text-align:center;padding:24px 10px;color:#B0A898;}
.empty .ei{font-size:32px;margin-bottom:7px;}
.empty p{font-size:13px;}
.banner{background:#F0FAF3;border:1.5px solid #81B29A;border-radius:11px;padding:9px 13px;display:flex;align-items:center;gap:9px;margin-bottom:12px;}
.banner p{font-size:12px;font-weight:500;color:#2C6B44;}
.usw{position:absolute;top:56px;right:14px;background:#fff;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.15);z-index:400;overflow:hidden;min-width:175px;}
.uop{display:flex;align-items:center;gap:7px;padding:9px 13px;cursor:pointer;font-size:13px;transition:background .12s;}
.uop:hover{background:#F7F3EE;}
.uop.on{background:#FDF0EC;font-weight:600;}
.uop-fam{font-size:10px;color:#8A7F74;margin-left:auto;}
.badge{display:inline-flex;align-items:center;justify-content:center;background:#E07A5F;color:#fff;border-radius:50%;width:17px;height:17px;font-size:10px;font-weight:700;}
.spill{display:inline-flex;align-items:center;gap:4px;background:#EEE8E0;border-radius:7px;padding:3px 8px;font-size:11px;font-weight:600;color:#555;}
.srow{display:flex;align-items:center;gap:7px;margin-bottom:7px;}
.snum{width:22px;height:22px;border-radius:50%;background:#E07A5F;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.locked-row{display:grid;grid-template-columns:auto 90px 1fr;gap:7px;align-items:center;padding:7px 0;border-bottom:1px solid #EEE8E0;}
.locked-row:last-child{border-bottom:none;}
.ie-row{display:grid;grid-template-columns:1fr 80px 105px 26px;gap:5px;margin-bottom:5px;align-items:center;}
.follow-btn{display:flex;align-items:center;gap:4px;border-radius:20px;padding:5px 13px;font-size:12px;font-weight:700;border:1.5px solid #E07A5F;cursor:pointer;transition:all .15s;}
.follow-btn.following{background:#E07A5F;color:#fff;border-color:#E07A5F;}
.follow-btn.following:hover{background:#C9603E;}
.follow-btn:not(.following){background:#fff;color:#E07A5F;}
.follow-btn:not(.following):hover{background:#FDF0EC;}
.tag-row{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;}
.ctag{border:1.5px solid #DDD8D0;border-radius:6px;padding:3px 8px;font-size:11px;font-weight:600;color:#666;cursor:pointer;background:#fff;transition:all .12s;}
.ctag.on{background:#1E1E1E;border-color:#1E1E1E;color:#fff;}
.family-badge{font-size:10px;color:#E07A5F;background:#FDF0EC;border-radius:5px;padding:2px 6px;font-weight:700;}
.textarea{border:1.5px solid #E2D9CE;border-radius:10px;padding:8px 11px;font-family:'DM Sans',sans-serif;font-size:13px;background:#FAFAF8;outline:none;width:100%;resize:vertical;min-height:70px;transition:border-color .15s;}
.textarea:focus{border-color:#E07A5F;background:#fff;}
`;

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function DinnerFam() {
  const [user, setUser] = useState(ALL_USERS[0]);
  const [section, setSection] = useState("family"); // "family" | "community"
  const [familyTab, setFamilyTab] = useState("menu");
  const [communityTab, setCommunityTab] = useState("browse");
  const [showUserPicker, setShowUserPicker] = useState(false);

  // Family data
  const familyMembers = ALL_USERS.filter(u=>u.family===user.family);
  const [menu, setMenu] = useState(()=>{
    const base=buildMenu();
    const allS=Object.entries({u1:["Chicken Tacos","Spaghetti Bolognese"],u2:["Chicken Tacos","BBQ Ribs"],u3:["Spaghetti Bolognese"],u4:["Chicken Tacos"]}).map(([id,meals])=>({memberId:id,meals}));
    return genMenu(allS,HISTORY_MEALS,base);
  });
  const [menuGenerated, setMenuGenerated] = useState(true);
  const [familyRecipes, setFamilyRecipes] = useState(SEED_FAMILY_RECIPES);
  const [suggestions, setSuggestions] = useState({u1:["Chicken Tacos","Spaghetti Bolognese"],u2:["Chicken Tacos","BBQ Ribs"],u3:["Spaghetti Bolognese"],u4:["Chicken Tacos"]});
  const [myMeals, setMyMeals] = useState(["Chicken Tacos","Spaghetti Bolognese","","",""]);
  const [checkedItems, setCheckedItems] = useState({});
  const [extraItems, setExtraItems] = useState([]);
  const [newExtra, setNewExtra] = useState("");
  const [lockedCfg, setLockedCfg] = useState(DAYS.map((d,i)=>({day:d,locked:i===4,label:i===4?"Eat Out Night 🍽️":""})));
  const [editingMealIdx, setEditingMealIdx] = useState(null);
  const [editMealVal, setEditMealVal] = useState("");
  const [viewFamilyRecipe, setViewFamilyRecipe] = useState(null);
  const [editingFamilyRecipe, setEditingFamilyRecipe] = useState(null);
  const [isNewFamilyRecipe, setIsNewFamilyRecipe] = useState(false);

  // Community data
  const [communityRecipes, setCommunityRecipes] = useState(SEED_COMMUNITY);
  const [searchQ, setSearchQ] = useState("");
  const [filterCuisine, setFilterCuisine] = useState([]);
  const [filterDiet, setFilterDiet] = useState([]);
  const [filterTime, setFilterTime] = useState([]);
  const [viewCommunityRecipe, setViewCommunityRecipe] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [followed, setFollowed] = useState(["u5"]);
  const [myPublishedRecipe, setMyPublishedRecipe] = useState(null);
  const [showPublishEditor, setShowPublishEditor] = useState(false);
  const [showToast, setShowToast] = useState("");

  const isAdmin = user.role === "admin";

  function toast(msg) { setShowToast(msg); setTimeout(()=>setShowToast(""),2500); }

  // Community filter logic
  const filteredCommunity = useMemo(()=>{
    return communityRecipes.filter(r=>{
      const q=searchQ.toLowerCase();
      const matchQ=!q||r.name.toLowerCase().includes(q)||r.authorName.toLowerCase().includes(q)||r.description.toLowerCase().includes(q);
      const matchC=filterCuisine.length===0||filterCuisine.some(c=>r.cuisines.includes(c));
      const matchD=filterDiet.length===0||filterDiet.some(d=>r.diets.includes(d));
      const matchT=filterTime.length===0||filterTime.includes(r.time);
      return matchQ&&matchC&&matchD&&matchT;
    });
  },[communityRecipes,searchQ,filterCuisine,filterDiet,filterTime]);

  const followedRecipes = communityRecipes.filter(r=>followed.includes(r.authorId));
  const savedRecipes = communityRecipes.filter(r=>r.savedBy.includes(user.id));

  function toggleLike(recipeId) {
    setCommunityRecipes(p=>p.map(r=>{
      if(r.id!==recipeId) return r;
      const liked=r.likes.includes(user.id);
      return {...r,likes:liked?r.likes.filter(i=>i!==user.id):[...r.likes,user.id]};
    }));
    if(viewCommunityRecipe?.id===recipeId)
      setViewCommunityRecipe(p=>({...p,likes:p.likes.includes(user.id)?p.likes.filter(i=>i!==user.id):[...p.likes,user.id]}));
  }

  function toggleSave(recipeId) {
    setCommunityRecipes(p=>p.map(r=>{
      if(r.id!==recipeId) return r;
      const saved=r.savedBy.includes(user.id);
      return {...r,savedBy:saved?r.savedBy.filter(i=>i!==user.id):[...r.savedBy,user.id]};
    }));
    toast("Recipe saved to your library!");
  }

  function addToFamilyLibrary(cr) {
    const exists=familyRecipes.find(r=>r.name===cr.name);
    if(exists){toast("Already in your family library!");return;}
    setFamilyRecipes(p=>[...p,{id:"fimport_"+cr.id,name:cr.name,servings:cr.servings,time:cr.time,tags:cr.cuisines,ingredients:cr.ingredients,steps:cr.steps}]);
    toast("Added to your family recipe library!");
  }

  function addComment(recipeId) {
    if(!newComment.trim()) return;
    const comment={id:"cm"+Date.now(),userId:user.id,userName:user.name,avatar:user.avatar,text:newComment.trim(),ts:"just now"};
    setCommunityRecipes(p=>p.map(r=>r.id===recipeId?{...r,comments:[...r.comments,comment]}:r));
    setViewCommunityRecipe(p=>({...p,comments:[...p.comments,comment]}));
    setNewComment("");
  }

  function rateRecipe(recipeId, stars) {
    setCommunityRecipes(p=>p.map(r=>{
      if(r.id!==recipeId) return r;
      const newCount=r.ratingCount+1;
      const newRating=((r.rating*r.ratingCount)+stars)/newCount;
      return {...r,rating:Math.round(newRating*10)/10,ratingCount:newCount};
    }));
    toast(`You rated this ${stars} stars!`);
  }

  function publishRecipe(rec) {
    const pub={...rec,id:"pub_"+Date.now(),authorId:user.id,authorName:user.name,familyName:user.familyName,
      likes:[],rating:0,ratingCount:0,comments:[],savedBy:[],postedAt:"just now"};
    setCommunityRecipes(p=>[pub,...p]);
    setShowPublishEditor(false);
    setSection("community");
    setCommunityTab("browse");
    toast("Recipe published to the community!");
  }

  function toggleFollow(authorId) {
    setFollowed(p=>p.includes(authorId)?p.filter(i=>i!==authorId):[...p,authorId]);
  }

  function handleGenMenu() {
    const base=DAYS.map((d,i)=>({day:d,meal:null,locked:lockedCfg[i].locked,lockedLabel:lockedCfg[i].label}));
    const allS=Object.entries(suggestions).map(([id,meals])=>({memberId:id,meals:meals.filter(Boolean)}));
    setMenu(genMenu(allS,HISTORY_MEALS,base));
    setMenuGenerated(true);
    setFamilyTab("menu");
  }

  // Shopping list
  const shoppingList = useMemo(()=>{
    const all={};
    menu.forEach(slot=>{
      if(slot.locked||!slot.meal) return;
      const rec=familyRecipes.find(r=>r.name===slot.meal);
      if(!rec) return;
      rec.ingredients.forEach(ing=>{
        const key=ing.item.toLowerCase();
        if(!all[key]) all[key]={item:ing.item,qty:ing.qty,category:ing.category,meals:[slot.meal]};
        else{all[key].meals.push(slot.meal);all[key].qty+=` + ${ing.qty}`;}
      });
    });
    extraItems.forEach(e=>{all["__x"+e.id]={item:e.name,qty:"",category:"Other",meals:[],extra:true,id:e.id};});
    const grouped={};
    Object.values(all).forEach(item=>{if(!grouped[item.category])grouped[item.category]=[];grouped[item.category].push(item);});
    return grouped;
  },[menu,familyRecipes,extraItems]);

  const totalItems=Object.values(shoppingList).flat().length;
  const checkedCount=Object.values(checkedItems).filter(Boolean).length;
  const recipeCount=menu.filter(s=>!s.locked&&s.meal&&familyRecipes.find(r=>r.name===s.meal)).length;
  const submittedCount=Object.values(suggestions).filter(m=>m.some(s=>s.trim())).length;

  return (
    <>
      <style>{CSS}</style>
      {showToast&&(
        <div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",background:"#1E1E1E",color:"#fff",padding:"10px 18px",borderRadius:10,fontSize:13,fontWeight:600,zIndex:500,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,.25)"}}>
          {showToast}
        </div>
      )}
      <div className="shell" onClick={()=>showUserPicker&&setShowUserPicker(false)}>

        {/* ── Top bar */}
        <div className="topbar">
          <div className="topbar-inner">
            <div className="logo">What's for <em>Dinner?</em></div>
            <button className="upill" onClick={e=>{e.stopPropagation();setShowUserPicker(v=>!v);}}>
              {user.avatar} {user.name} <span style={{opacity:.6,fontSize:10}}>▾</span>
            </button>
          </div>
          <div style={{padding:"8px 16px 0",display:"flex",alignItems:"center",gap:8}}>
            <div className="section-tabs">
              <button className={`stab${section==="family"?" on":""}`} onClick={()=>setSection("family")}>🏠 My Family</button>
              <button className={`stab${section==="community"?" on":""}`} onClick={()=>setSection("community")}>🌍 Community</button>
            </div>
          </div>
          {section==="family"&&(
            <div className="subnav">
              {[{k:"menu",l:"Menu"},{k:"recipes",l:"Recipes"},{k:"shop",l:"🛒 Shop"},{k:"picks",l:"My Picks"},{k:"family",l:"Family"},...(isAdmin?[{k:"admin",l:"⚙️ Admin"}]:[])].map(({k,l})=>(
                <button key={k} className={`snbtn${familyTab===k?" on":""}`} onClick={()=>setFamilyTab(k)}>{l}</button>
              ))}
            </div>
          )}
          {section==="community"&&(
            <div className="subnav">
              {[{k:"browse",l:"Browse"},{k:"following",l:"Following"},{k:"saved",l:"Saved"},{k:"share",l:"+ Share Recipe"}].map(({k,l})=>(
                <button key={k} className={`snbtn${communityTab===k?" on":""}`} onClick={()=>setCommunityTab(k)}>{l}</button>
              ))}
            </div>
          )}
        </div>

        {/* User switcher */}
        {showUserPicker&&(
          <div className="usw" onClick={e=>e.stopPropagation()}>
            {ALL_USERS.map(m=>(
              <div key={m.id} className={`uop${m.id===user.id?" on":""}`}
                onClick={()=>{setUser(m);setShowUserPicker(false);setMyMeals((suggestions[m.id]||[]).concat(["","","","",""]).slice(0,5));}}>
                {m.avatar} {m.name}
                <span className="uop-fam">{m.familyName}</span>
              </div>
            ))}
          </div>
        )}

        {/* ════════════════ FAMILY SECTION */}
        {section==="family"&&(
          <div className="body">

            {/* MENU TAB */}
            {familyTab==="menu"&&(
              <>
                {menuGenerated&&<div className="banner"><span>✅</span><p>{recipeCount} meals have recipes. Tap a green meal name to view it.</p></div>}
                <div className="card">
                  <div className="ch"><span className="ct">🗓 This Week</span>
                    {isAdmin&&<button className="btn bg bsm" onClick={handleGenMenu}>↻ Regen</button>}
                  </div>
                  <div className="cb">
                    {menu.map((slot,i)=>{
                      const rec=familyRecipes.find(r=>r.name===slot.meal);
                      return (
                        <div key={slot.day} className={`mrow${slot.locked?" mlocked":""}`}>
                          <span className="mday">{SHORT[i]}</span>
                          {editingMealIdx===i?(
                            <>
                              <input className="inp" style={{flex:1,fontSize:13,padding:"6px 9px"}} value={editMealVal}
                                onChange={e=>setEditMealVal(e.target.value)}
                                onKeyDown={e=>e.key==="Enter"&&(setMenu(p=>p.map((s,j)=>j===i?{...s,meal:editMealVal.trim()||s.meal}:s)),setEditingMealIdx(null))}
                                autoFocus/>
                              <button className="btn bp bsm" onClick={()=>{setMenu(p=>p.map((s,j)=>j===i?{...s,meal:editMealVal.trim()||s.meal}:s));setEditingMealIdx(null);}}>✓</button>
                            </>
                          ):(
                            <>
                              {slot.locked?<span className="mmeal">{slot.lockedLabel}</span>:
                                <span className={`mmeal${rec?" mlink":""}`} onClick={rec?()=>setViewFamilyRecipe(rec):undefined}>
                                  {slot.meal||<span className="mtbd">No meal set</span>}
                                </span>}
                              {rec&&<span className="rbadge">📋</span>}
                              {slot.locked&&<span className="lbadge">Fixed</span>}
                              {isAdmin&&!slot.locked&&<button className="btn bicon bsm" onClick={()=>{setEditingMealIdx(i);setEditMealVal(slot.meal||"");}}>✏️</button>}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* RECIPES TAB */}
            {familyTab==="recipes"&&(
              <div className="card">
                <div className="ch"><span className="ct">📋 Family Recipes</span>
                  {isAdmin&&<button className="btn bp bsm" onClick={()=>{setEditingFamilyRecipe({id:"fr"+Date.now(),name:"",servings:4,time:"",tags:[],ingredients:[{item:"",qty:"",category:"Produce"}],steps:[""]});setIsNewFamilyRecipe(true);}}>+ Add</button>}
                </div>
                <div className="cb">
                  {familyRecipes.length===0?<div className="empty"><div className="ei">📖</div><p>No recipes yet.</p></div>:(
                    familyRecipes.map(rec=>(
                      <div key={rec.id} className="crc" onClick={()=>setViewFamilyRecipe(rec)}>
                        <div className="crc-head">
                          <div className="crc-row1">
                            <div className="crc-icon">{mE(rec.name)}</div>
                            <div className="crc-info">
                              <div className="crc-name">{rec.name}</div>
                              <div className="crc-meta">
                                <span className="pill">⏱ {rec.time}</span>
                                <span className="pill">👤 {rec.servings}</span>
                                {rec.tags?.map(t=><span key={t} className="pill">{t}</span>)}
                              </div>
                            </div>
                          </div>
                        </div>
                        {isAdmin&&(
                          <div className="crc-foot" onClick={e=>e.stopPropagation()}>
                            <button className="btn bs bsm" onClick={()=>{setEditingFamilyRecipe({...rec,ingredients:[...rec.ingredients],steps:[...rec.steps]});setIsNewFamilyRecipe(false);}}>Edit</button>
                            <button className="btn bdanger bsm" onClick={()=>setFamilyRecipes(p=>p.filter(r=>r.id!==rec.id))}>Delete</button>
                            <button className="btn bg bsm" style={{marginLeft:"auto"}} onClick={()=>{setShowPublishEditor({...rec,cuisines:rec.tags||[],diets:[],description:""});setSection("community");setCommunityTab("share");}}>Publish to Community →</button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* SHOP TAB */}
            {familyTab==="shop"&&(
              <div className="card">
                <div className="ch"><span className="ct">🛒 Shopping List</span>
                  <span style={{fontSize:11,color:"#8A7F74"}}>{checkedCount}/{totalItems} done</span>
                </div>
                <div className="cb">
                  <div className="pb-w"><div className="pb" style={{width:totalItems?`${(checkedCount/totalItems)*100}%`:"0%"}}/></div>
                  {totalItems===0?<div className="empty" style={{padding:"16px 0"}}><div className="ei">🛒</div><p>Link recipes to your meals and your list builds automatically.</p></div>:(
                    <>
                      {CATEGORIES.filter(c=>shoppingList[c]?.length).map(cat=>(
                        <div key={cat}>
                          <div className="scat">{cat}</div>
                          {shoppingList[cat].map((item,ii)=>{
                            const key=item.extra?`x-${item.id}`:`${cat}-${ii}`;
                            return (
                              <div key={key} className={`sitem${checkedItems[key]?" chk":""}`}>
                                <input type="checkbox" className="schk" checked={!!checkedItems[key]} onChange={()=>setCheckedItems(p=>({...p,[key]:!p[key]}))}/>
                                <span className="snm">{item.item}</span>
                                {item.qty&&<span className="sqty">{item.qty}</span>}
                                {item.meals?.length>0&&<span className="smtag">{item.meals[0]}{item.meals.length>1&&` +${item.meals.length-1}`}</span>}
                                {item.extra&&<button className="btn bicon bsm" style={{padding:"2px 5px",fontSize:11}} onClick={()=>setExtraItems(p=>p.filter(e=>e.id!==item.id))}>✕</button>}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </>
                  )}
                  <div className="div"/>
                  <div className="lbl">Add item</div>
                  <div style={{display:"flex",gap:6}}>
                    <input className="inp inpsm" style={{flex:1}} placeholder="e.g. Paper towels…" value={newExtra}
                      onChange={e=>setNewExtra(e.target.value)}
                      onKeyDown={e=>{if(e.key==="Enter"&&newExtra.trim()){setExtraItems(p=>[...p,{id:Date.now(),name:newExtra.trim()}]);setNewExtra("");}}}/>
                    <button className="btn bp bsm" onClick={()=>{if(newExtra.trim()){setExtraItems(p=>[...p,{id:Date.now(),name:newExtra.trim()}]);setNewExtra("");}}}>Add</button>
                  </div>
                  {checkedCount>0&&<button className="btn bs bfull bsm" style={{marginTop:8}} onClick={()=>setCheckedItems({})}>Clear checked</button>}
                </div>
              </div>
            )}

            {/* PICKS TAB */}
            {familyTab==="picks"&&(
              <>
                <div className="card">
                  <div className="ch"><span className="ct">{user.avatar} {user.name}'s Picks</span>
                    {(suggestions[user.id]||[]).some(m=>m.trim())&&<span style={{fontSize:11,color:"#81B29A",fontWeight:700}}>✓ Submitted</span>}
                  </div>
                  <div className="cb">
                    <p style={{fontSize:12,color:"#8A7F74",marginBottom:10}}>Suggest 3–5 dinners. Popular picks get priority!</p>
                    {myMeals.map((meal,i)=>(
                      <div key={i} className="srow">
                        <div className="snum">{i+1}</div>
                        <input className="inp inpsm" placeholder={i<3?`Dinner idea ${i+1}…`:`Optional #${i+1}…`}
                          value={meal} onChange={e=>{const u=[...myMeals];u[i]=e.target.value;setMyMeals(u);}}/>
                      </div>
                    ))}
                    <button className="btn bp bfull" style={{marginTop:4}} onClick={()=>{setSuggestions(p=>({...p,[user.id]:myMeals.filter(Boolean)}));toast("Picks submitted!");}}>Submit Picks</button>
                  </div>
                </div>
                <div className="card">
                  <div className="ch"><span className="ct">⭐ Fan Favorites</span></div>
                  <div className="cb">
                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                      {HISTORY_MEALS.map(m=>(
                        <div key={m} className="pill" style={{cursor:"pointer",border:"1.5px dashed #CCC4BA"}}
                          onClick={()=>{const ei=myMeals.findIndex(x=>!x.trim());if(ei!==-1){const u=[...myMeals];u[ei]=m;setMyMeals(u);}}}>
                          + {m}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* FAMILY TAB */}
            {familyTab==="family"&&(
              <div className="card">
                <div className="ch"><span className="ct">👨‍👩‍👧‍👦 {user.familyName}</span><span className="badge">{familyMembers.length}</span></div>
                <div className="cb">
                  <div style={{fontSize:12,color:"#8A7F74",marginBottom:7}}>{submittedCount} of {familyMembers.length} have submitted picks.</div>
                  <div className="pb-w"><div className="pb" style={{width:`${(submittedCount/familyMembers.length)*100}%`}}/></div>
                  <div className="div"/>
                  {familyMembers.map(m=>{
                    const ms=(suggestions[m.id]||[]).filter(Boolean);
                    return (
                      <div key={m.id} className="mmbr">
                        <div className="mav">{m.avatar}</div>
                        <div className="min-info">
                          <div className="mn">{m.name}{m.id===user.id&&<span style={{fontSize:10,color:"#8A7F74",marginLeft:5}}>(you)</span>}</div>
                          <div className="mr">{m.role==="admin"?"Admin":"Member"}</div>
                          {ms.length>0?<div className="ms">{ms.join(" · ")}</div>:<div style={{fontSize:11,color:"#C0B5AB",marginTop:1}}>No picks yet</div>}
                        </div>
                        {ms.length>0&&<span style={{fontSize:16}}>✅</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ADMIN TAB */}
            {familyTab==="admin"&&isAdmin&&(
              <>
                <div className="card">
                  <div className="ch"><span className="ct">🔒 Fixed Nights</span></div>
                  <div className="cb">
                    {lockedCfg.map((cfg,i)=>(
                      <div key={cfg.day} className="locked-row">
                        <input type="checkbox" style={{accentColor:"#E07A5F",width:15,height:15,cursor:"pointer"}} checked={cfg.locked}
                          onChange={e=>setLockedCfg(p=>p.map((c,j)=>j===i?{...c,locked:e.target.checked}:c))}/>
                        <span style={{fontSize:12,fontWeight:600}}>{cfg.day}</span>
                        <input className="inp inpsm" placeholder="e.g. Pizza Night 🍕" value={cfg.label} disabled={!cfg.locked}
                          onChange={e=>setLockedCfg(p=>p.map((c,j)=>j===i?{...c,label:e.target.value}:c))}/>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card">
                  <div className="ch"><span className="ct">🗓 Menu</span></div>
                  <div className="cb">
                    <button className="btn bp bfull" onClick={handleGenMenu}>Generate This Week's Menu</button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ════════════════ COMMUNITY SECTION */}
        {section==="community"&&(
          <div className="body">

            {/* BROWSE TAB */}
            {communityTab==="browse"&&(
              <>
                <div className="searchbar">
                  <span>🔍</span>
                  <input placeholder="Search recipes, authors…" value={searchQ} onChange={e=>setSearchQ(e.target.value)}/>
                  {searchQ&&<button style={{background:"none",border:"none",cursor:"pointer",color:"#8A7F74",fontSize:16}} onClick={()=>setSearchQ("")}>×</button>}
                </div>
                <div className="filterbar">
                  <span style={{fontSize:11,fontWeight:700,color:"#8A7F74",paddingTop:4,flexShrink:0}}>Cuisine:</span>
                  {CUISINES.map(c=><div key={c} className={`ftag${filterCuisine.includes(c)?" on":""}`} onClick={()=>setFilterCuisine(p=>p.includes(c)?p.filter(x=>x!==c):[...p,c])}>{c}</div>)}
                </div>
                <div className="filterbar">
                  <span style={{fontSize:11,fontWeight:700,color:"#8A7F74",paddingTop:4,flexShrink:0}}>Diet:</span>
                  {DIETS.map(d=><div key={d} className={`ftag${filterDiet.includes(d)?" on":""}`} onClick={()=>setFilterDiet(p=>p.includes(d)?p.filter(x=>x!==d):[...p,d])}>{d}</div>)}
                </div>
                {filteredCommunity.length===0?<div className="empty"><div className="ei">🍽️</div><p>No recipes match your filters.</p></div>:(
                  filteredCommunity.map(rec=><CommunityCard key={rec.id} rec={rec} userId={user.id} followed={followed} onView={()=>setViewCommunityRecipe(rec)} onLike={()=>toggleLike(rec.id)} onSave={()=>toggleSave(rec.id)} onFollow={()=>toggleFollow(rec.authorId)}/>)
                )}
              </>
            )}

            {/* FOLLOWING TAB */}
            {communityTab==="following"&&(
              <>
                {followed.length===0?<div className="empty"><div className="ei">👥</div><p>Follow families and chefs to see their recipes here.</p></div>:(
                  followedRecipes.length===0?<div className="empty"><div className="ei">🍳</div><p>The families you follow haven't posted yet.</p></div>:
                  followedRecipes.map(rec=><CommunityCard key={rec.id} rec={rec} userId={user.id} followed={followed} onView={()=>setViewCommunityRecipe(rec)} onLike={()=>toggleLike(rec.id)} onSave={()=>toggleSave(rec.id)} onFollow={()=>toggleFollow(rec.authorId)}/>)
                )}
              </>
            )}

            {/* SAVED TAB */}
            {communityTab==="saved"&&(
              <>
                {savedRecipes.length===0?<div className="empty"><div className="ei">🔖</div><p>Tap the bookmark icon on any recipe to save it here.</p></div>:(
                  savedRecipes.map(rec=><CommunityCard key={rec.id} rec={rec} userId={user.id} followed={followed} onView={()=>setViewCommunityRecipe(rec)} onLike={()=>toggleLike(rec.id)} onSave={()=>toggleSave(rec.id)} onFollow={()=>toggleFollow(rec.authorId)}/>)
                )}
              </>
            )}

            {/* SHARE TAB */}
            {communityTab==="share"&&(
              <div className="card">
                <div className="ch"><span className="ct">📤 Share a Recipe</span></div>
                <div className="cb">
                  {!isAdmin?(
                    <div className="empty"><div className="ei">🔒</div><p>Only family admins can publish recipes to the community.</p></div>
                  ):(
                    <PublishEditor initialRecipe={showPublishEditor||undefined} onPublish={publishRecipe} familyRecipes={familyRecipes} onLoadFromLibrary={r=>setShowPublishEditor(r)}/>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ MODAL: Community Recipe Detail */}
        {viewCommunityRecipe&&(
          <div className="mbg" onClick={()=>setViewCommunityRecipe(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="mhdr">
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:11,color:"#8A7F74",marginBottom:2}}>By {viewCommunityRecipe.authorName} · {viewCommunityRecipe.familyName}</div>
                  <div className="mtitle">{viewCommunityRecipe.name}</div>
                  <StarRating rating={viewCommunityRecipe.rating||0} count={viewCommunityRecipe.ratingCount}/>
                </div>
                <button className="xbtn" onClick={()=>setViewCommunityRecipe(null)}>×</button>
              </div>
              <div className="mbody">
                <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:10}}>
                  <span className="spill">⏱ {viewCommunityRecipe.time}</span>
                  <span className="spill">👤 {viewCommunityRecipe.servings}</span>
                  {viewCommunityRecipe.cuisines?.map(c=><span key={c} className="pill pill-blue">{c}</span>)}
                  {viewCommunityRecipe.diets?.map(d=><span key={d} className="pill pill-green">{d}</span>)}
                </div>
                <p style={{fontSize:13,color:"#555",lineHeight:1.5,marginBottom:12}}>{viewCommunityRecipe.description}</p>

                <div className="lbl">Ingredients</div>
                {viewCommunityRecipe.ingredients.map((ing,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #F0EBE3",fontSize:13}}>
                    <span>{ing.item}</span><span style={{color:"#8A7F74",fontWeight:500}}>{ing.qty}</span>
                  </div>
                ))}
                <div className="div"/>
                <div className="lbl">Steps</div>
                {viewCommunityRecipe.steps.map((s,i)=>(
                  <div key={i} style={{display:"flex",gap:9,marginBottom:9}}>
                    <div style={{width:22,height:22,borderRadius:"50%",background:"#E07A5F",color:"#fff",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{i+1}</div>
                    <div style={{fontSize:13,lineHeight:1.55,color:"#333"}}>{s}</div>
                  </div>
                ))}

                {/* Actions */}
                <div style={{display:"flex",gap:8,margin:"14px 0 4px"}}>
                  <button className={`btn bsm${viewCommunityRecipe.likes.includes(user.id)?" bp":" bs"}`}
                    onClick={()=>toggleLike(viewCommunityRecipe.id)}>
                    {viewCommunityRecipe.likes.includes(user.id)?"❤️":"🤍"} {viewCommunityRecipe.likes.length}
                  </button>
                  <button className={`btn bsm${viewCommunityRecipe.savedBy.includes(user.id)?" bp":" bs"}`}
                    onClick={()=>toggleSave(viewCommunityRecipe.id)}>
                    {viewCommunityRecipe.savedBy.includes(user.id)?"🔖 Saved":"🔖 Save"}
                  </button>
                  <button className="btn bs bsm" onClick={()=>addToFamilyLibrary(viewCommunityRecipe)}>+ My Library</button>
                  <button className={`follow-btn${followed.includes(viewCommunityRecipe.authorId)?" following":""}`}
                    style={{marginLeft:"auto"}}
                    onClick={()=>toggleFollow(viewCommunityRecipe.authorId)}>
                    {followed.includes(viewCommunityRecipe.authorId)?"Following":"Follow"}
                  </button>
                </div>

                {/* Rate */}
                <div className="div"/>
                <div className="lbl">Rate this recipe</div>
                <StarRating rating={0} count={null} interactive onRate={stars=>rateRecipe(viewCommunityRecipe.id,stars)}/>

                {/* Comments */}
                <div className="div"/>
                <div className="lbl">Comments ({viewCommunityRecipe.comments.length})</div>
                {viewCommunityRecipe.comments.map(c=>(
                  <div key={c.id} className="comment">
                    <div className="cav">{c.avatar}</div>
                    <div className="cbubble">
                      <div className="cname">{c.userName}</div>
                      <div className="ctext">{c.text}</div>
                      <div className="cts">{c.ts}</div>
                    </div>
                  </div>
                ))}
                <div style={{display:"flex",gap:7,marginTop:8}}>
                  <textarea className="textarea" placeholder="Add a comment…" value={newComment} onChange={e=>setNewComment(e.target.value)} rows={2}/>
                  <button className="btn bp bsm" style={{alignSelf:"flex-end"}} onClick={()=>addComment(viewCommunityRecipe.id)}>Post</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ MODAL: Family Recipe Detail */}
        {viewFamilyRecipe&&(
          <div className="mbg" onClick={()=>setViewFamilyRecipe(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="mhdr">
                <div><div style={{fontSize:11,color:"#8A7F74",marginBottom:2}}>Family Recipe</div><div className="mtitle">{mE(viewFamilyRecipe.name)} {viewFamilyRecipe.name}</div></div>
                <button className="xbtn" onClick={()=>setViewFamilyRecipe(null)}>×</button>
              </div>
              <div className="mbody">
                <div style={{display:"flex",gap:8,marginBottom:12}}><span className="spill">⏱ {viewFamilyRecipe.time}</span><span className="spill">👤 {viewFamilyRecipe.servings}</span></div>
                <div className="lbl">Ingredients</div>
                {viewFamilyRecipe.ingredients.map((ing,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #F0EBE3",fontSize:13}}>
                    <span>{ing.item}</span><span style={{color:"#8A7F74",fontWeight:500}}>{ing.qty}</span>
                  </div>
                ))}
                <div className="div"/>
                <div className="lbl">Steps</div>
                {viewFamilyRecipe.steps.map((s,i)=>(
                  <div key={i} style={{display:"flex",gap:9,marginBottom:9}}>
                    <div style={{width:22,height:22,borderRadius:"50%",background:"#E07A5F",color:"#fff",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</div>
                    <div style={{fontSize:13,lineHeight:1.55}}>{s}</div>
                  </div>
                ))}
                {isAdmin&&<button className="btn bs bfull" style={{marginTop:12}} onClick={()=>{setViewFamilyRecipe(null);setEditingFamilyRecipe({...viewFamilyRecipe});setIsNewFamilyRecipe(false);}}>Edit Recipe</button>}
              </div>
            </div>
          </div>
        )}

        {/* ════ MODAL: Family Recipe Editor */}
        {editingFamilyRecipe&&(
          <FamilyRecipeEditor recipe={editingFamilyRecipe} isNew={isNewFamilyRecipe}
            onSave={rec=>{if(isNewFamilyRecipe)setFamilyRecipes(p=>[...p,rec]);else setFamilyRecipes(p=>p.map(r=>r.id===rec.id?rec:r));setEditingFamilyRecipe(null);toast(isNewFamilyRecipe?"Recipe added!":"Recipe updated!");}}
            onCancel={()=>setEditingFamilyRecipe(null)}/>
        )}
      </div>
    </>
  );
}

// ─── Community Recipe Card ────────────────────────────────────────────────────
function CommunityCard({rec, userId, followed, onView, onLike, onSave, onFollow}) {
  const liked=rec.likes.includes(userId);
  const saved=rec.savedBy.includes(userId);
  const isFollowing=followed.includes(rec.authorId);
  return (
    <div className="crc">
      <div className="crc-head" onClick={onView}>
        <div className="crc-row1">
          <div className="crc-icon">{mE(rec.name)}</div>
          <div className="crc-info">
            <div className="crc-name">{rec.name}</div>
            <div className="crc-by">{rec.authorName} · {rec.familyName} · {rec.postedAt}</div>
            <StarRating rating={rec.rating||0} count={rec.ratingCount}/>
            <div className="crc-desc" style={{marginTop:4}}>{rec.description}</div>
          </div>
        </div>
        <div className="crc-meta" style={{marginTop:8}}>
          <span className="pill">⏱ {rec.time}</span>
          <span className="pill">👤 {rec.servings}</span>
          {rec.cuisines?.map(c=><span key={c} className="pill pill-blue">{c}</span>)}
          {rec.diets?.slice(0,2).map(d=><span key={d} className="pill pill-green">{d}</span>)}
        </div>
      </div>
      <div className="crc-foot">
        <button className={`like-btn${liked?" liked":""}`} onClick={onLike}>
          {liked?"❤️":"🤍"} {rec.likes.length}
        </button>
        <button className={`save-btn${saved?" saved":""}`} onClick={onSave}>
          {saved?"🔖":"🔖"} {saved?"Saved":"Save"}
        </button>
        <button className={`follow-btn bsm${isFollowing?" following":""}`} style={{marginLeft:"auto"}} onClick={onFollow}>
          {isFollowing?"Following":"+ Follow"}
        </button>
        {rec.comments.length>0&&<span className="comment-count">💬 {rec.comments.length}</span>}
      </div>
    </div>
  );
}

// ─── Publish Editor ───────────────────────────────────────────────────────────
function PublishEditor({initialRecipe, onPublish, familyRecipes, onLoadFromLibrary}) {
  const blank={id:"",name:"",servings:4,time:"30 min",cuisines:[],diets:[],description:"",ingredients:[{item:"",qty:"",category:"Produce"}],steps:[""]};
  const [r,setR]=useState(initialRecipe||blank);
  function setF(k,v){setR(p=>({...p,[k]:v}));}
  function toggleArr(k,v){setR(p=>({...p,[k]:p[k].includes(v)?p[k].filter(x=>x!==v):[...p[k],v]}))}
  function setIng(i,k,v){const a=[...r.ingredients];a[i]={...a[i],[k]:v};setR(p=>({...p,ingredients:a}));}
  function setStep(i,v){const a=[...r.steps];a[i]=v;setR(p=>({...p,steps:a}));}
  return (
    <div>
      {familyRecipes.length>0&&(
        <div className="field">
          <div className="lbl">Load from family library</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {familyRecipes.map(fr=>(
              <button key={fr.id} className="btn bs bsm" onClick={()=>setR({...blank,...fr,cuisines:fr.tags||[],diets:[],description:""})}>{fr.name}</button>
            ))}
          </div>
        </div>
      )}
      <div className="div"/>
      <div className="field"><div className="lbl">Recipe name</div><input className="inp" value={r.name} onChange={e=>setF("name",e.target.value)} placeholder="e.g. Grandma's Lasagna"/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:10}}>
        <div><div className="lbl">Cook time</div>
          <select className="sel" value={r.time} onChange={e=>setF("time",e.target.value)}>
            {TIMES.map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <div><div className="lbl">Serves</div><input className="inp inpsm" type="number" min={1} max={20} value={r.servings} onChange={e=>setF("servings",Number(e.target.value))}/></div>
      </div>
      <div className="field"><div className="lbl">Description</div><textarea className="textarea" rows={2} placeholder="What makes this special?" value={r.description} onChange={e=>setF("description",e.target.value)}/></div>
      <div className="field">
        <div className="lbl">Cuisine tags</div>
        <div className="tag-row">{CUISINES.map(c=><div key={c} className={`ctag${r.cuisines.includes(c)?" on":""}`} onClick={()=>toggleArr("cuisines",c)}>{c}</div>)}</div>
      </div>
      <div className="field">
        <div className="lbl">Diet tags</div>
        <div className="tag-row">{DIETS.map(d=><div key={d} className={`ctag${r.diets.includes(d)?" on":""}`} onClick={()=>toggleArr("diets",d)}>{d}</div>)}</div>
      </div>
      <div className="div"/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
        <div className="lbl" style={{margin:0}}>Ingredients</div>
        <button className="btn bg bsm" onClick={()=>setR(p=>({...p,ingredients:[...p.ingredients,{item:"",qty:"",category:"Produce"}]}))}>+ Add</button>
      </div>
      {r.ingredients.map((ing,i)=>(
        <div key={i} className="ie-row">
          <input className="inp inpsm" placeholder="Item" value={ing.item} onChange={e=>setIng(i,"item",e.target.value)}/>
          <input className="inp inpsm" placeholder="qty" value={ing.qty} onChange={e=>setIng(i,"qty",e.target.value)}/>
          <select className="sel" value={ing.category} onChange={e=>setIng(i,"category",e.target.value)}>
            {CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
          <button className="btn bdanger bsm" style={{padding:"4px 6px"}} onClick={()=>setR(p=>({...p,ingredients:p.ingredients.filter((_,j)=>j!==i)}))}>✕</button>
        </div>
      ))}
      <div className="div"/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
        <div className="lbl" style={{margin:0}}>Steps</div>
        <button className="btn bg bsm" onClick={()=>setR(p=>({...p,steps:[...p.steps,""]}))}>+ Add</button>
      </div>
      {r.steps.map((s,i)=>(
        <div key={i} style={{display:"flex",gap:7,marginBottom:6,alignItems:"flex-start"}}>
          <div className="snum" style={{marginTop:3}}>{i+1}</div>
          <textarea className="textarea" style={{minHeight:44}} rows={2} value={s} onChange={e=>setStep(i,e.target.value)} placeholder={`Step ${i+1}…`}/>
          {r.steps.length>1&&<button className="btn bdanger bsm" style={{padding:"4px 6px",marginTop:3}} onClick={()=>setR(p=>({...p,steps:p.steps.filter((_,j)=>j!==i)}))}>✕</button>}
        </div>
      ))}
      <button className="btn bp bfull" style={{marginTop:12}} disabled={!r.name.trim()} onClick={()=>onPublish(r)}>
        Publish to Community 🌍
      </button>
    </div>
  );
}

// ─── Family Recipe Editor ─────────────────────────────────────────────────────
function FamilyRecipeEditor({recipe, isNew, onSave, onCancel}) {
  const [r,setR]=useState(recipe);
  function setF(k,v){setR(p=>({...p,[k]:v}));}
  function setIng(i,k,v){const a=[...r.ingredients];a[i]={...a[i],[k]:v};setR(p=>({...p,ingredients:a}));}
  function setStep(i,v){const a=[...r.steps];a[i]=v;setR(p=>({...p,steps:a}));}
  return (
    <div className="mbg">
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="mhdr">
          <div className="mtitle">{isNew?"New Family Recipe":"Edit Recipe"}</div>
          <button className="xbtn" onClick={onCancel}>×</button>
        </div>
        <div className="mbody">
          <div className="field"><div className="lbl">Name</div><input className="inp" value={r.name} onChange={e=>setF("name",e.target.value)} placeholder="Recipe name"/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:10}}>
            <div><div className="lbl">Time</div><input className="inp inpsm" value={r.time} onChange={e=>setF("time",e.target.value)} placeholder="30 min"/></div>
            <div><div className="lbl">Serves</div><input className="inp inpsm" type="number" min={1} max={20} value={r.servings} onChange={e=>setF("servings",Number(e.target.value))}/></div>
          </div>
          <div className="div"/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
            <div className="lbl" style={{margin:0}}>Ingredients</div>
            <button className="btn bg bsm" onClick={()=>setR(p=>({...p,ingredients:[...p.ingredients,{item:"",qty:"",category:"Produce"}]}))}>+ Add</button>
          </div>
          {r.ingredients.map((ing,i)=>(
            <div key={i} className="ie-row">
              <input className="inp inpsm" placeholder="Item" value={ing.item} onChange={e=>setIng(i,"item",e.target.value)}/>
              <input className="inp inpsm" placeholder="qty" value={ing.qty} onChange={e=>setIng(i,"qty",e.target.value)}/>
              <select className="sel" value={ing.category} onChange={e=>setIng(i,"category",e.target.value)}>
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
              <button className="btn bdanger bsm" style={{padding:"4px 6px"}} onClick={()=>setR(p=>({...p,ingredients:p.ingredients.filter((_,j)=>j!==i)}))}>✕</button>
            </div>
          ))}
          <div className="div"/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
            <div className="lbl" style={{margin:0}}>Steps</div>
            <button className="btn bg bsm" onClick={()=>setR(p=>({...p,steps:[...p.steps,""]}))}>+ Add</button>
          </div>
          {r.steps.map((s,i)=>(
            <div key={i} style={{display:"flex",gap:7,marginBottom:6,alignItems:"flex-start"}}>
              <div className="snum" style={{marginTop:3}}>{i+1}</div>
              <textarea className="textarea" style={{minHeight:44}} rows={2} value={s} onChange={e=>setStep(i,e.target.value)} placeholder={`Step ${i+1}…`}/>
            </div>
          ))}
          <div style={{display:"flex",gap:8,marginTop:12}}>
            <button className="btn bs" style={{flex:1}} onClick={onCancel}>Cancel</button>
            <button className="btn bp" style={{flex:2}} disabled={!r.name.trim()} onClick={()=>onSave(r)}>{isNew?"Save Recipe":"Save Changes"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
