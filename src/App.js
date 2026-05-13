import { useState, useEffect } from "react";

const SHEET_ID = "1egb0EfevkaypFwmqYW8PoG2EWPa3f0FhM1KkoA6IKhw";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg: "#080C14",
  surface: "#0E1420",
  card: "#111827",
  cardHover: "#161f30",
  border: "#1E2A3A",
  borderLight: "#243044",
  accent: "#3B82F6",
  accentGlow: "rgba(59,130,246,0.15)",
  accentDim: "#1D4ED8",
  green: "#10B981",
  greenDim: "#064E3B",
  yellow: "#F59E0B",
  yellowDim: "#78350F",
  red: "#EF4444",
  redDim: "#7F1D1D",
  purple: "#8B5CF6",
  purpleDim: "#3B0764",
  text: "#F0F4FF",
  textSub: "#94A3B8",
  textDim: "#475569",
};

const today = () => new Date().toISOString().split("T")[0];
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

// ─── CALORIE DATABASE ─────────────────────────────────────────────────────────
// All values per standard serving. Logic documented inline.
const CALS = {
  // BREAKFAST (per standard serving)
  "Idli": { cal: 39, serving: "2 pieces (80g)", note: "steamed rice cake" },
  "Dosa": { cal: 168, serving: "1 medium (90g)", note: "plain dosa" },
  "Poha": { cal: 250, serving: "1 bowl (150g)", note: "flattened rice with oil/veg" },
  "Aloo Paratha": { cal: 300, serving: "1 paratha (100g)", note: "stuffed with potato" },
  "Thepla": { cal: 140, serving: "2 pieces (80g)", note: "Gujarati flatbread" },
  "Chole Bhature": { cal: 480, serving: "1 plate", note: "heavy breakfast" },
  "Medu Vada": { cal: 180, serving: "2 pieces (80g)", note: "fried lentil donut" },
  "Pongal": { cal: 220, serving: "1 bowl (180g)", note: "rice+lentil porridge" },
  "Cheela": { cal: 200, serving: "2 pieces (120g)", note: "moong dal pancake" },
  "Vermicelli Upma": { cal: 220, serving: "1 bowl (180g)", note: "with vegetables" },
  "Upma": { cal: 230, serving: "1 bowl (180g)", note: "semolina with veg" },
  "Avocado Toast + Eggs": { cal: 350, serving: "2 slices + 2 eggs", note: "wholegrain bread" },
  "Croissant": { cal: 231, serving: "1 medium (67g)", note: "plain butter" },
  "Pancakes": { cal: 350, serving: "3 medium (150g)", note: "plain with syrup" },
  "English Breakfast": { cal: 600, serving: "1 full plate", note: "eggs, beans, sausage, toast" },
  "Waffles": { cal: 300, serving: "2 waffles (130g)", note: "plain" },
  "Congee": { cal: 180, serving: "1 bowl (350ml)", note: "rice porridge" },
  "Onigiri": { cal: 170, serving: "2 pieces (110g)", note: "rice balls" },
  "Nasi Lemak": { cal: 510, serving: "1 plate", note: "coconut rice with sides" },
  "Sticky Rice": { cal: 200, serving: "1 cup (150g)", note: "plain sticky rice" },

  // DALS / MAIN DISH (per standard bowl ~200ml)
  "Dal Tadka": { cal: 150, serving: "1 bowl (200ml)", note: "tempered lentils" },
  "Toor Dal": { cal: 140, serving: "1 bowl (200ml)", note: "split pigeon peas" },
  "Chana Dal": { cal: 155, serving: "1 bowl (200ml)", note: "split chickpeas" },
  "Chole": { cal: 210, serving: "1 bowl (200ml)", note: "spiced chickpeas" },
  "Masoor Dal": { cal: 130, serving: "1 bowl (200ml)", note: "red lentils" },
  "Rajma": { cal: 180, serving: "1 bowl (200ml)", note: "kidney bean curry" },
  "Dal Makhani": { cal: 230, serving: "1 bowl (200ml)", note: "creamy black lentils" },
  "Rajma Chawal": { cal: 420, serving: "1 plate", note: "with 1 cup rice" },
  "Moong Dal": { cal: 110, serving: "1 bowl (200ml)", note: "yellow lentils" },
  "Mix Dal": { cal: 140, serving: "1 bowl (200ml)", note: "mixed lentils" },

  // SABZI (per standard katori ~150g)
  "Bhindi": { cal: 75, serving: "1 katori (150g)", note: "okra stir fry" },
  "Aloo": { cal: 160, serving: "1 katori (150g)", note: "potato sabzi" },
  "Gobi": { cal: 80, serving: "1 katori (150g)", note: "cauliflower" },
  "Palak": { cal: 65, serving: "1 katori (150g)", note: "spinach" },
  "Baingan": { cal: 85, serving: "1 katori (150g)", note: "eggplant" },
  "Shimla Mirch": { cal: 70, serving: "1 katori (150g)", note: "capsicum sabzi" },
  "Matar Paneer": { cal: 220, serving: "1 katori (150g)", note: "peas + cottage cheese" },
  "Nutrela": { cal: 160, serving: "1 katori (150g)", note: "soy chunks curry" },
  "Mushroom": { cal: 90, serving: "1 katori (150g)", note: "mushroom sabzi" },
  "Paneer Butter Masala": { cal: 280, serving: "1 katori (150g)", note: "rich gravy" },
  "Palak Paneer": { cal: 240, serving: "1 katori (150g)", note: "spinach + paneer" },
  "Aloo Curry": { cal: 170, serving: "1 katori (150g)", note: "potato curry" },
  "Baingan Curry": { cal: 120, serving: "1 katori (150g)", note: "eggplant curry" },
  "Nutrela Curry": { cal: 170, serving: "1 katori (150g)", note: "soy chunks" },
  "Mushroom Curry": { cal: 130, serving: "1 katori (150g)", note: "mushroom gravy" },

  // DINNER MAINS
  "Biryani": { cal: 500, serving: "1 plate (350g)", note: "with raita" },
  "Hyderabadi Biryani": { cal: 520, serving: "1 plate (350g)", note: "richer spices" },
  "Fish Curry": { cal: 280, serving: "1 bowl (200g)", note: "with gravy" },
  "Butter Chicken": { cal: 320, serving: "1 bowl (200g)", note: "creamy tomato" },
  "Rogan Josh": { cal: 300, serving: "1 bowl (200g)", note: "lamb curry" },
  "Tandoori Chicken": { cal: 270, serving: "2 pieces (200g)", note: "without bones" },
  "Chicken Chettinad": { cal: 310, serving: "1 bowl (200g)", note: "spicy" },
  "Dal + Sabzi + Roti": { cal: 400, serving: "1 meal plate", note: "standard thali" },
  "Sushi": { cal: 350, serving: "8 pieces", note: "mixed sushi" },
  "Ramen": { cal: 430, serving: "1 bowl", note: "with broth and toppings" },
  "Pad Thai": { cal: 380, serving: "1 plate (300g)", note: "with tofu or shrimp" },
  "Bibimbap": { cal: 400, serving: "1 bowl", note: "rice + veg + egg" },
  "Kung Pao Chicken": { cal: 330, serving: "1 bowl (250g)", note: "with peanuts" },
  "Peking Duck": { cal: 450, serving: "1 serving (200g)", note: "with pancakes" },
  "Katsu Curry": { cal: 550, serving: "1 plate", note: "breaded cutlet + rice" },
  "Korean BBQ": { cal: 500, serving: "1 serving (250g)", note: "mixed meats" },
  "Red Curry": { cal: 350, serving: "1 bowl (300ml)", note: "with coconut milk" },
  "Lasagna": { cal: 450, serving: "1 slice (250g)", note: "with cheese" },
  "Burger and Fries": { cal: 700, serving: "1 combo", note: "standard fast food" },
  "Pizza": { cal: 400, serving: "2 slices (200g)", note: "regular cheese pizza" },
  "Fish and Chips": { cal: 600, serving: "1 plate", note: "with tartare sauce" },
  "Spaghetti Bolognese": { cal: 450, serving: "1 plate (300g)", note: "with beef mince" },
  "BBQ Ribs": { cal: 600, serving: "1 serving (300g)", note: "with sauce" },
  "Roasted Duck": { cal: 430, serving: "1 serving (200g)", note: "with skin" },
  "Grilled Salmon": { cal: 300, serving: "1 fillet (180g)", note: "without sauce" },
  "Eat Out": { cal: 650, serving: "1 restaurant meal", note: "estimate" },
  "Khichdi": { cal: 280, serving: "1 bowl (250g)", note: "dal + rice" },

  // BREADS (per piece)
  "Chapati": { cal: 100, serving: "1 piece (40g)", note: "whole wheat, no ghee" },
  "Roti": { cal: 100, serving: "1 piece (40g)", note: "same as chapati" },
  "Paratha": { cal: 180, serving: "1 piece (70g)", note: "with oil/ghee" },
  "Puri": { cal: 130, serving: "1 piece (35g)", note: "deep fried" },
  "Bhature": { cal: 200, serving: "1 piece (70g)", note: "deep fried leavened" },
  "Naan": { cal: 260, serving: "1 piece (90g)", note: "tandoor baked" },
  "Rice": { cal: 200, serving: "1 cup cooked (160g)", note: "white rice" },
  "Brown Rice": { cal: 175, serving: "1 cup cooked (160g)", note: "brown rice" },

  // FRUITS (per 250g unless noted)
  "Watermelon": { cal: 75, serving: "250g (1 bowl)", note: "mostly water" },
  "Musk Melon": { cal: 85, serving: "250g (1 bowl)", note: "cantaloupe" },
  "Papaya": { cal: 100, serving: "250g (1 bowl)", note: "ripe" },
  "Banana": { cal: 220, serving: "2 medium (250g)", note: "ripe" },
  "Apple": { cal: 130, serving: "1 large (250g)", note: "with skin" },
  "Litchi": { cal: 165, serving: "15 pieces (~250g)", note: "peeled" },
  "Mango": { cal: 165, serving: "1 medium (250g)", note: "ripe Alphonso" },
  "Guava": { cal: 85, serving: "1 large (250g)", note: "with skin" },
  "Pineapple": { cal: 125, serving: "250g chunks", note: "fresh" },

  // DRINKS
  "Tea without sugar": { cal: 5, serving: "1 cup (200ml)", note: "with milk, no sugar" },
  "Tea with sugar": { cal: 35, serving: "1 cup (200ml)", note: "1 tsp sugar + milk" },
  "Black Coffee": { cal: 5, serving: "1 cup (200ml)", note: "no milk, no sugar" },
  "Latte": { cal: 120, serving: "1 medium (350ml)", note: "whole milk" },
  "Mocha": { cal: 170, serving: "1 medium (350ml)", note: "with chocolate" },
  "Americano": { cal: 15, serving: "1 double shot + water", note: "minimal calories" },
  "Cappuccino": { cal: 80, serving: "1 cup (240ml)", note: "equal milk/foam" },

  // SUPPLEMENTS / EXTRAS
  "Protein Shake": { cal: 120, serving: "26g scoop", note: "whey, mixed with water" },
  "Banana (pre-workout)": { cal: 90, serving: "1 medium (100g)", note: "energy boost" },
  "Coconut Water": { cal: 45, serving: "200ml", note: "natural electrolytes" },
  "Curd": { cal: 60, serving: "1 katori (100g)", note: "plain dahi" },
  "Salad": { cal: 40, serving: "1 bowl (150g)", note: "cucumber, tomato, onion" },
};

function getCal(name, qty = 1) {
  if (!name || name === "None" || name === "Skipped" || name === "-- Select --") return 0;
  const entry = CALS[name];
  return entry ? Math.round(entry.cal * qty) : 50;
}

function calcTotalCal(f) {
  let t = 0;
  if (f.banana === "Yes") t += getCal("Banana (pre-workout)");
  if (f.protein_shake === "Yes") t += getCal("Protein Shake");
  if (f.coconut_water === "Yes") t += getCal("Coconut Water");
  if (f.breakfast) t += getCal(f.breakfast);
  if (f.lunch_main) t += getCal(f.lunch_main);
  if (f.lunch_side) t += getCal(f.lunch_side);
  const lc = parseInt(f.lunch_bread_count || 0);
  if (f.lunch_bread && f.lunch_bread !== "None") t += getCal(f.lunch_bread) * lc;
  if (f.lunch_curd === "Yes") t += getCal("Curd");
  if (f.lunch_salad === "Yes") t += getCal("Salad");
  if (f.post_lunch_beverage === "Tea") t += f.tea_sugar === "With Sugar" ? getCal("Tea with sugar") : getCal("Tea without sugar");
  if (f.post_lunch_beverage === "Coffee") t += getCal(f.coffee_type || "Black Coffee");
  if (f.post_lunch_beverage === "Buttermilk") t += 35;
  if (f.post_lunch_beverage === "Fruit Juice") t += 110;
  if (f.evening_tea_have === "Yes") {
    if (f.evening_bev_type === "Tea") t += f.evening_tea_sugar === "With Sugar" ? getCal("Tea with sugar") : getCal("Tea without sugar");
    else t += getCal(f.evening_coffee_type || "Black Coffee");
  }
  if (f.evening_fruit) t += Math.round(getCal(f.evening_fruit) * (parseInt(f.fruit_grams || 250) / 250));
  if (f.dinner_main) t += getCal(f.dinner_main);
  if (f.dinner_side) t += getCal(f.dinner_side);
  const dc = parseInt(f.dinner_bread_count || 0);
  if (f.dinner_bread && f.dinner_bread !== "None") t += getCal(f.dinner_bread) * dc;
  if (f.dinner_curd === "Yes") t += getCal("Curd");
  return t;
}

// ─── FOOD OPTIONS ─────────────────────────────────────────────────────────────
const S = "-- Select --";
const FOOD = {
  breakfast_indian: [S, "Idli", "Dosa", "Poha", "Aloo Paratha", "Thepla", "Chole Bhature", "Medu Vada", "Pongal", "Cheela", "Vermicelli Upma", "Upma", "Other"],
  breakfast_continental: [S, "Croissant", "Pancakes", "English Breakfast", "Waffles", "Avocado Toast + Eggs", "Other"],
  breakfast_asian: [S, "Congee", "Onigiri", "Nasi Lemak", "Sticky Rice", "Other"],
  breads: ["None", "Chapati", "Roti", "Paratha", "Puri", "Bhature", "Naan", "Rice", "Brown Rice"],
  fruits: [S, "Watermelon", "Musk Melon", "Papaya", "Banana", "Apple", "Litchi", "Mango", "Guava", "Pineapple", "Skipped", "Other"],
  coffees_full: ["Black Coffee", "Latte", "Mocha", "Americano", "Cappuccino"],
  coffees_no_black: ["Latte", "Mocha", "Americano", "Cappuccino"],
};

// Grouped meal options: cuisine → veg/nonveg → items
const MEAL_GROUPS = {
  Indian: {
    Vegetarian: {
      main: ["Dal Tadka", "Toor Dal", "Chana Dal", "Chole", "Masoor Dal", "Rajma", "Dal Makhani", "Moong Dal", "Mix Dal", "Rajma Chawal", "Khichdi", "Dal + Sabzi + Roti"],
      side: ["Bhindi", "Aloo", "Gobi", "Palak", "Baingan", "Shimla Mirch", "Matar Paneer", "Paneer Butter Masala", "Palak Paneer", "Nutrela", "Mushroom", "Aloo Curry", "Baingan Curry", "Nutrela Curry", "Mushroom Curry"],
    },
    "Non-Vegetarian": {
      main: ["Butter Chicken", "Tandoori Chicken", "Chicken Chettinad", "Fish Curry", "Rogan Josh", "Biryani", "Hyderabadi Biryani"],
      side: ["Egg Bhurji", "Chicken Keema", "Prawn Masala"],
    },
  },
  Continental: {
    Vegetarian: {
      main: ["Lasagna", "Pizza", "Pasta Arrabbiata", "Mushroom Risotto", "Grilled Veggies"],
      side: ["Garden Salad", "Coleslaw", "Garlic Bread"],
    },
    "Non-Vegetarian": {
      main: ["Burger and Fries", "Fish and Chips", "Spaghetti Bolognese", "BBQ Ribs", "Roasted Duck", "Grilled Salmon", "English Breakfast"],
      side: ["Caesar Salad", "Bacon Strips", "Chicken Wings"],
    },
  },
  Asian: {
    Vegetarian: {
      main: ["Bibimbap", "Pad Thai (Tofu)", "Vegetable Ramen", "Onigiri", "Congee", "Sticky Rice"],
      side: ["Edamame", "Kimchi", "Miso Soup"],
    },
    "Non-Vegetarian": {
      main: ["Sushi", "Ramen", "Pad Thai", "Kung Pao Chicken", "Katsu Curry", "Korean BBQ", "Red Curry", "Peking Duck"],
      side: ["Gyoza", "Chicken Teriyaki", "Prawn Tempura"],
    },
  },
};

const WORKOUT_DETAILS = {
  "Adidas Strength+": ["Full Body", "Upper Body", "Lower Body"],
  "HRX": ["Chest & Triceps", "Back & Biceps", "Shoulders", "Legs", "Arms", "Core"],
  "Badminton": [], "Running": [], "Walking": [],
};

const INIT = {
  date: today(),
  workout_done: "", workout_type: "", workout_detail: "", workout_duration: "",
  banana: "", protein_shake: "", protein_grams: "26", black_coffee: "", coconut_water: "",
  breakfast_cuisine: "Indian",
  breakfast: "", breakfast_other: "",
  lunch_cuisine: "Indian", lunch_diet: "Vegetarian",
  lunch_main: "", lunch_main_other: "",
  lunch_side: "", lunch_side_other: "",
  lunch_bread: "Chapati", lunch_bread_count: "2",
  lunch_salad: "", lunch_curd: "",
  post_lunch_beverage: "", tea_sugar: "", coffee_type: "",
  evening_tea_have: "", evening_bev_type: "Tea", evening_tea_sugar: "", evening_coffee_type: "",
  evening_fruit: "", evening_fruit_other: "", fruit_grams: "250",
  dinner_cuisine: "Indian", dinner_diet: "Vegetarian",
  dinner_main: "", dinner_main_other: "",
  dinner_side: "", dinner_side_other: "",
  dinner_bread: "Chapati", dinner_bread_count: "2",
  dinner_curd: "", post_dinner_walk: "",
  aw_calories: "", aw_steps: "", aw_workout_type: "", aw_workout_duration: "",
  energy: "", sleep_hours: "", notes: "",
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

const inputBase = {
  width: "100%", background: "#0a1628", border: "1px solid #1E2A3A",
  borderRadius: 8, color: T.text, padding: "10px 34px 10px 12px",
  fontSize: 14, outline: "none", appearance: "none", WebkitAppearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2364748B'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center",
  backgroundSize: "20px", cursor: "pointer", boxSizing: "border-box",
  fontFamily: "inherit", transition: "border-color 0.2s",
};

function Select({ value, opts, onChange, placeholder }) {
  return (
    <select value={value || ""} onChange={e => onChange(e.target.value === S ? "" : e.target.value)}
      style={{ ...inputBase, color: value ? T.text : T.textDim }}>
      {opts.map(o => <option key={o} value={o === S ? "" : o} style={{ background: "#0E1420" }}>{o}</option>)}
    </select>
  );
}

function OtherInput({ show, value, onChange, ph = "Describe what you had..." }) {
  if (!show) return null;
  return <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={ph}
    style={{ ...inputBase, backgroundImage: "none", paddingRight: 12, marginTop: 8, color: T.text }} />;
}

function YesNo({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {["Yes", "No"].map(v => (
        <button key={v} onClick={() => onChange(value === v ? "" : v)} style={{
          flex: 1, padding: "10px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600,
          border: `1px solid ${value === v ? (v === "Yes" ? T.green : T.red) : T.border}`,
          background: value === v ? (v === "Yes" ? T.greenDim : T.redDim) : "#0a1628",
          color: value === v ? (v === "Yes" ? T.green : T.red) : T.textSub,
          transition: "all 0.15s",
        }}>{v === "Yes" ? "✓ Yes" : "✗ No"}</button>
      ))}
    </div>
  );
}

function NumTapper({ value, onChange, min = 0, max = 6 }) {
  const v = parseInt(value || min);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, background: "#0a1628", borderRadius: 8, border: `1px solid ${T.border}`, overflow: "hidden", width: "fit-content" }}>
      <button onClick={() => onChange(String(Math.max(min, v - 1)))}
        style={{ width: 40, height: 40, background: "none", border: "none", color: T.textSub, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
      <span style={{ width: 32, textAlign: "center", fontSize: 16, fontWeight: 700, color: v > 0 ? T.text : T.textDim }}>{v}</span>
      <button onClick={() => onChange(String(Math.min(max, v + 1)))}
        style={{ width: 40, height: 40, background: "none", border: "none", color: T.textSub, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
    </div>
  );
}

function NumInput({ value, onChange, ph, unit }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={ph}
        style={{ ...inputBase, backgroundImage: "none", width: 100, paddingRight: 12 }} />
      {unit && <span style={{ color: T.textDim, fontSize: 13 }}>{unit}</span>}
    </div>
  );
}

function Chip({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 14px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 500,
      border: `1px solid ${active ? T.accent : T.border}`,
      background: active ? "rgba(59,130,246,0.15)" : "transparent",
      color: active ? T.accent : T.textSub, transition: "all 0.15s",
    }}>{label}</button>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
        <span style={{ fontSize: 12, color: T.textSub, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6 }}>{label}</span>
        {hint && <span style={{ fontSize: 11, color: T.textDim }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Card({ title, emoji, badge, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background: T.card, borderRadius: 16, border: `1px solid ${T.border}`, marginBottom: 10, overflow: "hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "none", border: "none", cursor: "pointer", color: T.text,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>{emoji}</span>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: 0.2 }}>{title}</span>
          {badge && <span style={{ fontSize: 11, background: "rgba(59,130,246,0.15)", color: T.accent, padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>{badge}</span>}
        </div>
        <span style={{ color: T.textDim, fontSize: 12, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </button>
      {open && <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${T.border}` }}>{/* spacer */}
        <div style={{ height: 14 }} />
        {children}
      </div>}
    </div>
  );
}

// ─── CALORIE RING ─────────────────────────────────────────────────────────────
function CalRing({ eaten, burned, target = 1900 }) {
  const net = eaten - burned;
  const pct = Math.min(eaten / target, 1.15);
  const r = 52, cx = 70, cy = 70;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  const ringColor = eaten > target + 300 ? T.red : eaten > target ? T.yellow : T.green;
  const macros = [
    { label: "🍽 Eaten", val: `${eaten} kcal`, color: T.text },
    { label: "🔥 Burned", val: burned ? `−${burned}` : "—", color: T.accent },
    { label: "⚖️ Net", val: `${net}`, color: net > target + 200 ? T.red : net < target - 400 ? T.accent : T.green },
    { label: "🎯 Target", val: `~${target}`, color: T.textDim },
  ];
  return (
    <div style={{ background: `linear-gradient(135deg, #0E1829 0%, #0A1220 100%)`, borderRadius: 16, border: `1px solid ${T.border}`, padding: "16px", marginBottom: 10, display: "flex", gap: 16, alignItems: "center" }}>
      <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
        <svg width="140" height="140">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.border} strokeWidth="8" />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={ringColor} strokeWidth="8"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "stroke-dasharray 0.6s ease, stroke 0.4s" }} />
          <circle cx={cx} cy={cy} r={r - 16} fill="none" stroke={T.border} strokeWidth="1" strokeDasharray="3 5" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: ringColor, letterSpacing: -1 }}>{eaten}</span>
          <span style={{ fontSize: 10, color: T.textDim, marginTop: 1 }}>KCAL EATEN</span>
          <span style={{ fontSize: 11, color: T.textSub, marginTop: 4 }}>{Math.round(pct * 100)}% of target</span>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 12, letterSpacing: 0.3 }}>TODAY'S INTAKE</div>
        {macros.map(m => (
          <div key={m.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: T.textDim }}>{m.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.val}</span>
          </div>
        ))}
        <div style={{ marginTop: 10, height: 4, background: T.border, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min(pct * 100, 100)}%`, background: ringColor, borderRadius: 4, transition: "width 0.6s ease" }} />
        </div>
      </div>
    </div>
  );
}

// ─── CUISINE TABS ─────────────────────────────────────────────────────────────
function CuisinePicker({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
      {["Indian", "Continental", "Asian"].map(c => (
        <button key={c} onClick={() => onChange(c)} style={{
          flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: value === c ? 700 : 500,
          border: `1px solid ${value === c ? T.accent : T.border}`,
          background: value === c ? "rgba(59,130,246,0.12)" : "transparent",
          color: value === c ? T.accent : T.textSub, transition: "all 0.15s",
        }}>{c}</button>
      ))}
    </div>
  );
}

// ─── GROUPED SELECT (shows optgroup headers) ──────────────────────────────────
function GroupedSelect({ value, groups, onChange }) {
  return (
    <select value={value || ""} onChange={e => onChange(e.target.value === S ? "" : e.target.value)}
      style={{ ...inputBase, color: value ? T.text : T.textDim }}>
      <option value="" style={{ background: "#0E1420" }}>{S}</option>
      <option value="None" style={{ background: "#0E1420", color: T.textDim }}>None</option>
      {Object.entries(groups).filter(([k]) => k !== "None").map(([groupLabel, items]) => (
        <optgroup key={groupLabel} label={`── ${groupLabel} ──`} style={{ background: "#0E1420", color: T.textSub }}>
          {items.map(item => (
            <option key={item} value={item} style={{ background: "#0E1420", color: T.text }}>{item}</option>
          ))}
          <option value={`Other (${groupLabel})`} style={{ background: "#0E1420", color: T.textDim }}>Other…</option>
        </optgroup>
      ))}
    </select>
  );
}

function buildMealGroups(cuisine, diet) {
  const cuisineData = MEAL_GROUPS[cuisine] || MEAL_GROUPS.Indian;
  if (diet === "All") {
    // merge both veg and nonveg into labelled groups
    const result = {};
    Object.entries(cuisineData).forEach(([dietLabel, data]) => {
      result[`${cuisine} · ${dietLabel}`] = data.main;
    });
    return result;
  }
  const dietData = cuisineData[diet] || cuisineData["Vegetarian"];
  return { [`${cuisine} · ${diet}`]: dietData.main };
}

function buildSideGroups(cuisine, diet) {
  const cuisineData = MEAL_GROUPS[cuisine] || MEAL_GROUPS.Indian;
  if (diet === "All") {
    const result = {};
    Object.entries(cuisineData).forEach(([dietLabel, data]) => {
      result[`${cuisine} · ${dietLabel}`] = data.side;
    });
    return result;
  }
  const dietData = cuisineData[diet] || cuisineData["Vegetarian"];
  return { [`${cuisine} · ${diet}`]: dietData.side };
}

// ─── MEAL SECTION ─────────────────────────────────────────────────────────────
function MealSection({ title, emoji, mealType, form, set }) {
  const prefix = mealType;
  const isLunch = mealType === "lunch";
  const cuisineKey = `${prefix}_cuisine`;
  const dietKey = `${prefix}_diet`;

  const calHint = (key) => {
    const v = form[key];
    if (!v || v === S || v === "None" || v.startsWith("Other")) return "";
    const e = CALS[v];
    return e ? `~${e.cal} kcal / ${e.serving}` : "";
  };

  const isOther = (v) => !v || v === "" || (v && v.startsWith("Other"));

  if (mealType === "breakfast") {
    const bfOpts = form.breakfast_cuisine === "Indian" ? FOOD.breakfast_indian
      : form.breakfast_cuisine === "Continental" ? FOOD.breakfast_continental
      : FOOD.breakfast_asian;
    return (
      <Card title={title} emoji={emoji}>
        <Field label="Cuisine Type">
          <CuisinePicker value={form.breakfast_cuisine} onChange={set("breakfast_cuisine")} />
        </Field>
        <Field label="What did you eat?" hint={calHint("breakfast")}>
          <Select value={form.breakfast} opts={bfOpts} onChange={set("breakfast")} />
          <OtherInput show={form.breakfast === "Other"} value={form.breakfast_other} onChange={set("breakfast_other")} />
        </Field>
      </Card>
    );
  }

  const cuisine = form[cuisineKey] || "Indian";
  const diet = form[dietKey] || "Vegetarian";
  const mainGroups = buildMealGroups(cuisine, diet);
  const sideGroups = buildSideGroups(cuisine, diet);

  const dietColors = { Vegetarian: T.green, "Non-Vegetarian": T.red, All: T.yellow };
  const dietBg = { Vegetarian: T.greenDim, "Non-Vegetarian": T.redDim, All: T.yellowDim };

  return (
    <Card title={title} emoji={emoji}>

      {/* Step 1: Cuisine */}
      <Field label="Cuisine">
        <CuisinePicker
          value={cuisine}
          onChange={v => { set(cuisineKey)(v); set(`${prefix}_main`)(""); set(`${prefix}_side`)(""); }}
        />
      </Field>

      {/* Step 2: Veg / Non-Veg */}
      <Field label="Veg / Non-Veg">
        <div style={{ display: "flex", gap: 6 }}>
          {["Vegetarian", "Non-Vegetarian", "All"].map(d => (
            <button key={d} onClick={() => { set(dietKey)(d); set(`${prefix}_main`)(""); set(`${prefix}_side`)(""); }}
              style={{
                flex: 1, padding: "8px 4px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: diet === d ? 700 : 500,
                border: `1px solid ${diet === d ? dietColors[d] : T.border}`,
                background: diet === d ? dietBg[d] : "transparent",
                color: diet === d ? dietColors[d] : T.textSub,
                transition: "all 0.15s",
              }}>
              {d === "Vegetarian" ? "🥦 Veg" : d === "Non-Vegetarian" ? "🍗 Non-Veg" : "🍽 All"}
            </button>
          ))}
        </div>
      </Field>

      {/* Step 3: Main Dish — grouped select */}
      <Field label="Main Dish" hint={calHint(`${prefix}_main`)}>
        <GroupedSelect
          value={form[`${prefix}_main`]}
          groups={mainGroups}
          onChange={v => { set(`${prefix}_main`)(v); set(`${prefix}_main_other`)(""); }}
        />
        <OtherInput show={isOther(form[`${prefix}_main`]) && form[`${prefix}_main`] !== ""} value={form[`${prefix}_main_other`]} onChange={set(`${prefix}_main_other`)} />
      </Field>

      {/* Step 4: Side Dish — grouped select */}
      <Field label="Side Dish / Sabzi" hint={calHint(`${prefix}_side`)}>
        <GroupedSelect
          value={form[`${prefix}_side`]}
          groups={{ ...sideGroups, "None": [] }}
          onChange={v => { set(`${prefix}_side`)(v); set(`${prefix}_side_other`)(""); }}
        />
        <OtherInput show={isOther(form[`${prefix}_side`]) && form[`${prefix}_side`] !== ""} value={form[`${prefix}_side_other`]} onChange={set(`${prefix}_side_other`)} />
      </Field>

      {/* Bread */}
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <Field label="Bread / Starch" hint={form[`${prefix}_bread`] && form[`${prefix}_bread`] !== "None" ? `~${getCal(form[`${prefix}_bread`])} kcal each` : ""}>
            <Select value={form[`${prefix}_bread`]} opts={FOOD.breads} onChange={set(`${prefix}_bread`)} />
          </Field>
        </div>
        {form[`${prefix}_bread`] && form[`${prefix}_bread`] !== "None" && (
          <div>
            <Field label="Count">
              <NumTapper value={form[`${prefix}_bread_count`]} onChange={set(`${prefix}_bread_count`)} />
            </Field>
          </div>
        )}
      </div>

      {/* Curd */}
      <Field label="Curd / Dahi">
        <YesNo value={form[`${prefix}_curd`]} onChange={set(`${prefix}_curd`)} />
      </Field>

      {isLunch && (
        <Field label="Salad?">
          <YesNo value={form.lunch_salad} onChange={set("lunch_salad")} />
        </Field>
      )}
      {isLunch && <PostLunchBev form={form} set={set} />}
      {!isLunch && (
        <Field label="Post-dinner walk?">
          <YesNo value={form.post_dinner_walk} onChange={set("post_dinner_walk")} />
        </Field>
      )}
    </Card>
  );
}

function PostLunchBev({ form, set }) {
  const bevs = ["Tea", "Coffee", "Buttermilk", "Fruit Juice", "None"];
  return (
    <Field label="Post-lunch drink?">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: form.post_lunch_beverage && form.post_lunch_beverage !== "None" ? 10 : 0 }}>
        {bevs.map(b => <Chip key={b} label={b} active={form.post_lunch_beverage === b} onClick={() => set("post_lunch_beverage")(form.post_lunch_beverage === b ? "" : b)} />)}
      </div>
      {form.post_lunch_beverage === "Tea" && (
        <div style={{ display: "flex", gap: 6 }}>
          {["Without Sugar", "With Sugar"].map(s => (
            <Chip key={s} label={s} active={form.tea_sugar === s} onClick={() => set("tea_sugar")(form.tea_sugar === s ? "" : s)} />
          ))}
        </div>
      )}
      {form.post_lunch_beverage === "Coffee" && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {FOOD.coffees_full.map(c => <Chip key={c} label={c} active={form.coffee_type === c} onClick={() => set("coffee_type")(form.coffee_type === c ? "" : c)} />)}
        </div>
      )}
    </Field>
  );
}

function EveningBev({ form, set }) {
  return (
    <Card title="Evening Drink" emoji="☕">
      <Field label="Did you have tea or coffee?">
        <YesNo value={form.evening_tea_have} onChange={set("evening_tea_have")} />
      </Field>
      {form.evening_tea_have === "Yes" && (
        <>
          <Field label="Type">
            <div style={{ display: "flex", gap: 6 }}>
              {["Tea", "Coffee"].map(t => <Chip key={t} label={t} active={form.evening_bev_type === t} onClick={() => set("evening_bev_type")(t)} />)}
            </div>
          </Field>
          {form.evening_bev_type === "Tea" && (
            <Field label="Sugar?">
              <div style={{ display: "flex", gap: 6 }}>
                {["Without Sugar", "With Sugar"].map(s => <Chip key={s} label={s} active={form.evening_tea_sugar === s} onClick={() => set("evening_tea_sugar")(s)} />)}
              </div>
            </Field>
          )}
          {form.evening_bev_type === "Coffee" && (
            <Field label="Coffee type">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {FOOD.coffees_no_black.map(c => <Chip key={c} label={c} active={form.evening_coffee_type === c} onClick={() => set("evening_coffee_type")(c)} />)}
              </div>
            </Field>
          )}
        </>
      )}
    </Card>
  );
}

// ─── WEEKLY SUMMARY ───────────────────────────────────────────────────────────
function WeeklySummary({ logs }) {
  if (!logs.length) return (
    <div style={{ textAlign: "center", padding: 48, color: T.textDim }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
      <div style={{ fontSize: 15, color: T.textSub }}>No logs this week yet.</div>
      <div style={{ fontSize: 13, marginTop: 6 }}>Start logging today to see your summary.</div>
    </div>
  );
  const workouts = logs.filter(l => l.workout_done === "Yes").length;
  const protein = logs.filter(l => l.protein_shake === "Yes").length;
  const walks = logs.filter(l => l.post_dinner_walk === "Yes").length;
  const sleepArr = logs.filter(l => l.sleep_hours).map(l => parseFloat(l.sleep_hours));
  const avgSleep = sleepArr.length ? (sleepArr.reduce((a, b) => a + b, 0) / sleepArr.length) : 0;
  const totalAwCal = logs.reduce((s, l) => s + parseInt(l.aw_calories || 0), 0);
  const totalSteps = logs.reduce((s, l) => s + parseInt(l.aw_steps || 0), 0);
  const avgCal = logs.length ? Math.round(logs.reduce((s, l) => s + calcTotalCal(l), 0) / logs.length) : 0;

  const stats = [
    { icon: "🏋️", label: "Workout Days", val: `${workouts}/7`, good: workouts >= 5 },
    { icon: "🥤", label: "Protein Shake", val: `${protein}/7`, good: protein >= 6 },
    { icon: "🚶", label: "Evening Walk", val: `${walks}/7`, good: walks >= 5 },
    { icon: "😴", label: "Avg Sleep", val: `${avgSleep.toFixed(1)}h`, good: avgSleep >= 7 },
    { icon: "🔥", label: "Active Cal", val: totalAwCal.toLocaleString(), good: true },
    { icon: "👟", label: "Total Steps", val: totalSteps.toLocaleString(), good: true },
    { icon: "🍽", label: "Avg Intake", val: `${avgCal} kcal`, good: avgCal < 2100 },
  ];

  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 14, letterSpacing: 0.3 }}>
        WEEK OF {fmtDate(logs[0]?.date).toUpperCase()}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.good ? T.green : T.yellow }}>{s.val}</div>
            <div style={{ fontSize: 11, color: T.textSub, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.textSub, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.6 }}>Daily Log</div>
        {logs.map(l => {
          const kcal = calcTotalCal(l);
          return (
            <div key={l.date} style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
              <span style={{ fontSize: 12, color: T.textDim, width: 70 }}>{fmtDate(l.date)}</span>
              <span style={{ fontSize: 12, color: T.text, flex: 1 }}>{l.workout_type || (l.workout_done === "No" ? "Rest" : "—")}{l.workout_detail ? ` · ${l.workout_detail}` : ""}</span>
              <span style={{ fontSize: 12, color: T.accent, marginRight: 10 }}>{kcal ? `${kcal} kcal` : "—"}</span>
              <span style={{ fontSize: 14 }}>{l.energy?.split(" ")[0] || "—"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── WATCH GUIDE ──────────────────────────────────────────────────────────────
function WatchGuide() {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: "⚡", title: "Open Shortcuts", items: ["Open the Shortcuts app on iPhone (pre-installed).", "Tap + top right → name the shortcut 'Fitness Log'.", "Tap 'Add Action' to start adding steps."] },
    { icon: "❤️", title: "Pull Health Data", items: ["Search 'Find Health Samples' → add 3 times.", "Action 1: Active Energy · Today · Latest 1 → save as 'ActiveCal'.", "Action 2: Steps · Today · Latest 1 → save as 'Steps'.", "Action 3: Workouts · Today · Latest 1 → save as 'Workout'."] },
    { icon: "📲", title: "Show & Open", items: ["Add 'Show Notification': text 'Cal: [ActiveCal] | Steps: [Steps]'.", "Add 'Open URL' → paste your Claude.ai tracker URL.", "Tap ▶ to test — you'll see your Watch data then the app opens."] },
    { icon: "📱", title: "Home Screen + Automation", items: ["Tap ⋯ on shortcut → 'Add to Home Screen' → Add.", "For daily reminder: Automation tab → + → Personal Automation → 9:00 PM → run 'Fitness Log'.", "Every evening: tap the icon → see Watch data → fill tracker → done in 2 min!"] },
  ];
  const s = steps[step];
  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {steps.map((st, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            flex: 1, padding: "10px 6px", borderRadius: 10, border: `1px solid ${step === i ? T.accent : T.border}`,
            background: step === i ? "rgba(59,130,246,0.12)" : "transparent",
            color: step === i ? T.accent : T.textSub, fontSize: 10, fontWeight: 700, cursor: "pointer",
            textAlign: "center", lineHeight: 1.4,
          }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{st.icon}</div>
            Step {i + 1}
          </button>
        ))}
      </div>
      <div style={{ background: "#0a1628", borderRadius: 12, border: `1px solid ${T.border}`, padding: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: T.text, marginBottom: 14 }}>{s.icon} {s.title}</div>
        {s.items.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(59,130,246,0.15)", color: T.accent, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
            <span style={{ fontSize: 13, color: T.textSub, lineHeight: 1.6 }}>{item}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{ padding: "9px 20px", borderRadius: 8, border: `1px solid ${T.border}`, background: "none", color: step === 0 ? T.border : T.textSub, cursor: step === 0 ? "default" : "pointer", fontSize: 13 }}>← Back</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1}
          style={{ padding: "9px 20px", borderRadius: 8, border: `1px solid ${T.accent}`, background: "rgba(59,130,246,0.15)", color: T.accent, cursor: step === steps.length - 1 ? "default" : "pointer", fontSize: 13, fontWeight: 700, opacity: step === steps.length - 1 ? 0.4 : 1 }}>Next →</button>
      </div>
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ s }) {
  if (!s) return null;
  const col = s.type === "success" ? T.green : s.type === "error" ? T.red : T.yellow;
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: T.card, border: `1px solid ${col}`, color: col, padding: "12px 24px", borderRadius: 30, fontSize: 13, fontWeight: 700, zIndex: 200, boxShadow: `0 8px 32px rgba(0,0,0,0.8), 0 0 0 1px ${col}22`, whiteSpace: "nowrap", letterSpacing: 0.3 }}>{s.msg}</div>
  );
}

// ─── PROGRESS BAR (weight) ────────────────────────────────────────────────────
function WeightProgress() {
  const start = 93.1, target = 67, current = 93.1;
  const lost = start - current;
  const total = start - target;
  const pct = Math.max(0, (lost / total) * 100);
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: 0.6 }}>Weight Goal</span>
        <span style={{ fontSize: 12, color: T.textDim }}>{lost.toFixed(1)} kg lost · {(total - lost).toFixed(1)} kg to go</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: T.text }}>{current} <span style={{ fontSize: 13, color: T.textDim, fontWeight: 400 }}>kg now</span></span>
        <span style={{ fontSize: 22, fontWeight: 800, color: T.green }}>{target} <span style={{ fontSize: 13, color: T.textDim, fontWeight: 400 }}>kg target</span></span>
      </div>
      <div style={{ height: 6, background: T.border, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${T.accent}, ${T.green})`, borderRadius: 4, transition: "width 1s ease" }} />
      </div>
      <div style={{ fontSize: 11, color: T.textDim, marginTop: 5, textAlign: "right" }}>{pct.toFixed(1)}% complete · Phase 1 → 88 kg</div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("log");
  const [form, setForm] = useState(INIT);
  const [logs, setLogs] = useState({});
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("rahul_fitness_logs") || "{}");
      setLogs(saved);
      if (saved[today()]) setForm({ ...INIT, ...saved[today()] });
    } catch {}
  }, []);

  const eaten = calcTotalCal(form);
  const burned = parseInt(form.aw_calories || 0);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const saveLocal = data => {
    const u = { ...logs, [data.date]: data };
    setLogs(u);
    localStorage.setItem("rahul_fitness_logs", JSON.stringify(u));
  };

  const toRow = d => [
    d.date, d.workout_done, d.workout_type, d.workout_detail, d.workout_duration,
    d.banana, d.protein_shake, d.protein_grams, d.black_coffee, d.coconut_water,
    d.breakfast === "Other" ? d.breakfast_other : d.breakfast,
    d.lunch_main === "Other" ? d.lunch_main_other : d.lunch_main,
    d.lunch_side === "Other" ? d.lunch_side_other : d.lunch_side,
    d.lunch_bread, d.lunch_bread_count, d.lunch_salad, d.lunch_curd,
    d.post_lunch_beverage, d.tea_sugar, d.coffee_type,
    d.evening_tea_have, d.evening_bev_type, d.evening_tea_sugar, d.evening_coffee_type,
    d.evening_fruit === "Other" ? d.evening_fruit_other : d.evening_fruit, d.fruit_grams,
    d.dinner_main === "Other" ? d.dinner_main_other : d.dinner_main,
    d.dinner_side === "Other" ? d.dinner_side_other : d.dinner_side,
    d.dinner_bread, d.dinner_bread_count, d.dinner_curd, d.post_dinner_walk,
    d.aw_calories, d.aw_steps, d.aw_workout_type, d.aw_workout_duration,
    d.energy, d.sleep_hours, calcTotalCal(d),
    `"${(d.notes || "").replace(/"/g, "'")}"`,
  ].join(",");

  const save = async () => {
    setSaving(true); showToast("⏳ Saving...", "loading");
    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row: toRow(form), sheetId: SHEET_ID }),
      });
      const data = await res.json();
      if (data.success) { saveLocal(form); showToast("✅ Saved to Google Drive!", "success"); }
      else throw new Error();
    } catch { saveLocal(form); showToast("💾 Saved locally", "error"); }
    setSaving(false);
  };

  const weekLogs = () => {
    const now = new Date(), day = now.getDay();
    const mon = new Date(now); mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    return Object.values(logs).filter(l => new Date(l.date) >= mon).sort((a, b) => a.date.localeCompare(b.date));
  };

  const TABS = [
    { id: "log", icon: "📝", label: "Log" },
    { id: "week", icon: "📊", label: "Week" },
    { id: "watch", icon: "⌚", label: "Watch" },
  ];

  return (
    <div style={{ background: T.bg, minHeight: "100vh", color: T.text, fontFamily: "'SF Pro Display', -apple-system, 'Helvetica Neue', sans-serif", maxWidth: 430, margin: "0 auto", paddingBottom: 90 }}>

      {/* ── HEADER ── */}
      <div style={{ padding: "20px 16px 12px", background: T.surface, borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: T.accent, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3 }}>Fitness Tracker</div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>Rahul's Log</div>
            <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>{fmtDate(form.date)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: T.textDim, marginBottom: 2 }}>Today's intake</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: eaten > 2100 ? T.red : eaten > 1700 ? T.yellow : T.green, letterSpacing: -1 }}>{eaten}</div>
            <div style={{ fontSize: 11, color: T.textDim }}>kcal</div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ display: "flex", padding: "10px 12px", gap: 6, background: T.surface, borderBottom: `1px solid ${T.border}` }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "9px 6px", borderRadius: 10, border: `1px solid ${tab === t.id ? T.accent : "transparent"}`,
            background: tab === t.id ? "rgba(59,130,246,0.12)" : "transparent",
            color: tab === t.id ? T.accent : T.textDim, fontWeight: tab === t.id ? 700 : 500,
            fontSize: 13, cursor: "pointer", transition: "all 0.15s",
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      <div style={{ padding: "12px 12px 0" }}>

        {/* ── WEEK TAB ── */}
        {tab === "week" && <WeeklySummary logs={weekLogs()} />}

        {/* ── WATCH TAB ── */}
        {tab === "watch" && (
          <Card title="Set Up Apple Watch Shortcut" emoji="⌚">
            <WatchGuide />
          </Card>
        )}

        {/* ── LOG TAB ── */}
        {tab === "log" && (
          <>
            <WeightProgress />
            <CalRing eaten={eaten} burned={burned} />

            {/* WORKOUT */}
            <Card title="Workout" emoji="🏋️">
              <Field label="Did you work out?">
                <YesNo value={form.workout_done} onChange={set("workout_done")} />
              </Field>
              {form.workout_done === "Yes" && (
                <>
                  <Field label="Workout type">
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {Object.keys(WORKOUT_DETAILS).map(w => (
                        <Chip key={w} label={w} active={form.workout_type === w}
                          onClick={() => { set("workout_type")(form.workout_type === w ? "" : w); set("workout_detail")(""); }} />
                      ))}
                    </div>
                  </Field>
                  {form.workout_type && WORKOUT_DETAILS[form.workout_type].length > 0 && (
                    <Field label="Focus area">
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {WORKOUT_DETAILS[form.workout_type].map(d => (
                          <Chip key={d} label={d} active={form.workout_detail === d} onClick={() => set("workout_detail")(form.workout_detail === d ? "" : d)} />
                        ))}
                      </div>
                    </Field>
                  )}
                  <Field label="Duration">
                    <NumInput value={form.workout_duration} onChange={set("workout_duration")} ph="50" unit="min" />
                  </Field>
                </>
              )}
            </Card>

            {/* PRE/POST WORKOUT */}
            <Card title="Pre / Post Workout" emoji="🍌" defaultOpen={false}>
              <Field label="Pre-workout banana">
                <YesNo value={form.banana} onChange={set("banana")} />
              </Field>
              <Field label="Protein shake">
                <YesNo value={form.protein_shake} onChange={set("protein_shake")} />
                {form.protein_shake === "Yes" && (
                  <div style={{ marginTop: 8 }}>
                    <NumInput value={form.protein_grams} onChange={set("protein_grams")} ph="26" unit="g" />
                  </div>
                )}
              </Field>
              <Field label="Black coffee (post-workout)">
                <YesNo value={form.black_coffee} onChange={set("black_coffee")} />
              </Field>
              <Field label="Coconut water">
                <YesNo value={form.coconut_water} onChange={set("coconut_water")} />
              </Field>
            </Card>

            {/* BREAKFAST */}
            <MealSection title="Breakfast" emoji="🌅" mealType="breakfast" form={form} set={set} />

            {/* LUNCH */}
            <MealSection title="Lunch" emoji="🥘" mealType="lunch" form={form} set={set} />

            {/* EVENING DRINK */}
            <EveningBev form={form} set={set} />

            {/* EVENING FRUIT */}
            <Card title="Evening Fruit" emoji="🍉">
              <Field label="Fruit" hint={form.evening_fruit && form.evening_fruit !== "Skipped" && form.evening_fruit !== "Other" ? `~${getCal(form.evening_fruit)} kcal / 250g` : ""}>
                <Select value={form.evening_fruit} opts={FOOD.fruits} onChange={set("evening_fruit")} />
                <OtherInput show={form.evening_fruit === "Other"} value={form.evening_fruit_other} onChange={set("evening_fruit_other")} ph="e.g. Jamun, Chiku..." />
              </Field>
              {form.evening_fruit && form.evening_fruit !== "Skipped" && (
                <Field label="Quantity">
                  <NumInput value={form.fruit_grams} onChange={set("fruit_grams")} ph="250" unit="g" />
                </Field>
              )}
            </Card>

            {/* DINNER */}
            <MealSection title="Dinner" emoji="🌙" mealType="dinner" form={form} set={set} />

            {/* APPLE WATCH */}
            <Card title="Apple Watch Data" emoji="⌚" defaultOpen={false}>
              <div style={{ background: "rgba(59,130,246,0.08)", border: `1px solid rgba(59,130,246,0.2)`, borderRadius: 8, padding: "10px 12px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: T.textSub }}>Set up auto-sync from Watch</span>
                <button onClick={() => setTab("watch")} style={{ fontSize: 12, color: T.accent, background: "none", border: `1px solid ${T.accent}`, borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontWeight: 700 }}>Setup →</button>
              </div>
              <Field label="Active calories burned">
                <NumInput value={form.aw_calories} onChange={set("aw_calories")} ph="450" unit="kcal" />
              </Field>
              <Field label="Steps today">
                <NumInput value={form.aw_steps} onChange={set("aw_steps")} ph="8500" unit="steps" />
              </Field>
              <Field label="Workout on Watch">
                <Select value={form.aw_workout_type} opts={["-- Select --", "HRX", "Adidas Strength+", "Badminton", "Running", "Walking", "None"]} onChange={set("aw_workout_type")} />
              </Field>
              <Field label="Duration">
                <NumInput value={form.aw_workout_duration} onChange={set("aw_workout_duration")} ph="50" unit="min" />
              </Field>
            </Card>

            {/* FEELING */}
            <Card title="How are you feeling?" emoji="✨" defaultOpen={false}>
              <Field label="Energy level today">
                <div style={{ display: "flex", gap: 6 }}>
                  {["😴 Low", "😐 Okay", "💪 Good", "🔥 Great"].map(e => (
                    <Chip key={e} label={e} active={form.energy === e} onClick={() => set("energy")(form.energy === e ? "" : e)} />
                  ))}
                </div>
              </Field>
              <Field label="Sleep last night">
                <NumInput value={form.sleep_hours} onChange={set("sleep_hours")} ph="7.5" unit="hrs" />
              </Field>
              <Field label="Notes">
                <textarea value={form.notes} onChange={e => set("notes")(e.target.value)} placeholder="Cravings, how you felt, any observations..."
                  rows={3} style={{ ...inputBase, backgroundImage: "none", paddingRight: 12, resize: "none", fontFamily: "inherit", lineHeight: 1.6 }} />
              </Field>
            </Card>

            {/* SAVE */}
            <button onClick={save} disabled={saving} style={{
              width: "100%", padding: "16px", borderRadius: 14, border: "none", marginBottom: 8, marginTop: 4,
              background: saving ? T.border : `linear-gradient(135deg, ${T.accentDim} 0%, ${T.accent} 100%)`,
              color: T.text, fontSize: 15, fontWeight: 800, cursor: saving ? "not-allowed" : "pointer",
              letterSpacing: 0.5, boxShadow: saving ? "none" : `0 4px 20px rgba(59,130,246,0.35)`,
              transition: "all 0.2s",
            }}>
              {saving ? "⏳ Saving..." : "💾  Save Today's Log"}
            </button>
            <p style={{ textAlign: "center", fontSize: 11, color: T.textDim, margin: "0 0 8px" }}>Saves locally · syncs to Google Drive</p>
          </>
        )}
      </div>
      <Toast s={toast} />
    </div>
  );
}