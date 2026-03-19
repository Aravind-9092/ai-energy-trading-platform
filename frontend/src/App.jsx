import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

const API = "http://127.0.0.1:8000";

const DARK = {
  bg:"#0a0c0f", surface:"#111318", card:"#161a21", elevated:"#1d2230",
  border:"rgba(255,255,255,0.07)", borderStr:"rgba(255,255,255,0.13)",
  text:"#eef0f4", textSec:"#8b93a5", textMut:"#4a5568",
  accent:"#00d4a8", accentDim:"rgba(0,212,168,0.12)", accentBdr:"rgba(0,212,168,0.3)",
  sell:"#00d4a8", sellDim:"rgba(0,212,168,0.1)",
  buy:"#ff6b4a", buyDim:"rgba(255,107,74,0.1)", amber:"#f5a623",
};
const LIGHT = {
  bg:"#f0f2f5", surface:"#ffffff", card:"#ffffff", elevated:"#f7f8fa",
  border:"rgba(0,0,0,0.07)", borderStr:"rgba(0,0,0,0.13)",
  text:"#0d1117", textSec:"#5a6478", textMut:"#9aa3b2",
  accent:"#00916e", accentDim:"rgba(0,145,110,0.08)", accentBdr:"rgba(0,145,110,0.25)",
  sell:"#00916e", sellDim:"rgba(0,145,110,0.08)",
  buy:"#e04f2d", buyDim:"rgba(224,79,45,0.08)", amber:"#d4880a",
};

function Field({ label, unit, value, onChange, t }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <div style={{ display:"flex", justifyContent:"space-between" }}>
        <span style={{ fontSize:11, fontWeight:600, textTransform:"uppercase",
          letterSpacing:"0.06em", color:t.textSec }}>{label}</span>
        <span style={{ fontSize:10, color:t.textMut, fontFamily:"monospace" }}>{unit}</span>
      </div>
      <input type="number" value={value} onChange={e => onChange(e.target.value)}
        style={{ background:t.elevated, border:`1px solid ${t.borderStr}`,
          borderRadius:8, padding:"10px 12px", color:t.text,
          fontSize:15, fontWeight:600, fontFamily:"monospace",
          outline:"none", width:"100%" }}
        onFocus={e => e.target.style.borderColor = t.accent}
        onBlur={e  => e.target.style.borderColor = t.borderStr}
      />
    </div>
  );
}

function KPI({ label, value, unit, color, t }) {
  return (
    <div style={{ background:t.elevated, border:`1px solid ${t.border}`,
      borderRadius:12, padding:"14px 16px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0,
        height:2, background:color || t.border }} />
      <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.08em",
        textTransform:"uppercase", color:t.textMut, marginBottom:8 }}>{label}</div>
      <div style={{ fontSize:22, fontWeight:800, color:color || t.text,
        letterSpacing:"-0.02em" }}>{value}</div>
      <div style={{ fontSize:10, color:t.textMut, fontFamily:"monospace",
        marginTop:4 }}>{unit}</div>
    </div>
  );
}

export default function App() {
  const [dark, setDark]         = useState(true);
  const t                       = dark ? DARK : LIGHT;
  const [view, setView]         = useState("dashboard");
  const [temp, setTemp]         = useState(28);
  const [wind, setWind]         = useState(3);
  const [humidity, setHumidity] = useState(55);
  const [hour, setHour]         = useState(12);
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [history, setHistory]   = useState([]);
  const [clock, setClock]       = useState("");

  useEffect(() => {
    const id = setInterval(() =>
      setClock(new Date().toLocaleTimeString("en-GB")), 1000);
    return () => clearInterval(id);
  }, []);

  const predict = async () => {
    setLoading(true); setError(null);
    try {
      const res = await axios.get(`${API}/predict`,
        { params: { temp, wind, humidity, hour } });
      const entry = {
        ...res.data,
        time: new Date().toLocaleTimeString("en-GB"),
        temp:+temp, wind:+wind, humidity:+humidity, hour:+hour,
      };
      setResult(entry);
      setHistory(prev => [entry, ...prev].slice(0, 50));
    } catch {
      setError("Cannot reach backend. Run: uvicorn backend.app:app --reload");
    }
    setLoading(false);
  };

  const card = { background:t.card, border:`1px solid ${t.border}`,
    borderRadius:14, padding:"18px 20px", transition:"background 0.3s" };
  const cardTitle = { fontSize:11, fontWeight:600, letterSpacing:"0.1em",
    textTransform:"uppercase", color:t.textMut, marginBottom:14 };
  const g2 = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 };
  const g5 = { display:"grid", gridTemplateColumns:"repeat(5,minmax(0,1fr))", gap:12 };

  const decColor = result?.decision === "SELL" ? t.sell
                 : result?.decision === "BUY"  ? t.buy : t.amber;

  const navItem = (id, icon, label) => (
    <div key={id} onClick={() => setView(id)} style={{
      display:"flex", alignItems:"center", gap:10,
      padding:"10px 12px", margin:"1px 8px", borderRadius:10,
      fontSize:13, fontWeight:500, cursor:"pointer",
      color: view===id ? t.accent : t.textSec,
      background: view===id ? t.accentDim : "transparent",
      border: view===id ? `1px solid ${t.accentBdr}` : "1px solid transparent",
    }}>
      <span>{icon}</span>{label}
      {(id==="predictions"||id==="trading") && history.length > 0 && (
        <span style={{ marginLeft:"auto", fontSize:9, fontFamily:"monospace",
          background:t.accentDim, color:t.accent,
          border:`1px solid ${t.accentBdr}`, padding:"2px 6px", borderRadius:999 }}>
          {history.length}
        </span>
      )}
    </div>
  );

  const sells = history.filter(r => r.decision === "SELL").length;
  const buys  = history.filter(r => r.decision === "BUY").length;
  let cum = 0;
  const cumPnl = [...history].reverse().map(r => {
    cum += r.profit;
    return { time: r.time, pnl: Math.round(cum * 100) / 100 };
  });

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'Segoe UI',sans-serif",
      background:t.bg, color:t.text, overflow:"hidden", transition:"background 0.3s" }}>

      {/* SIDEBAR */}
      <div style={{ width:210, minWidth:210, background:t.surface,
        borderRight:`1px solid ${t.border}`, display:"flex",
        flexDirection:"column", padding:"20px 0" }}>
        <div style={{ padding:"0 16px 18px", borderBottom:`1px solid ${t.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
            <div style={{ width:30, height:30, background:t.accent, borderRadius:8,
              display:"flex", alignItems:"center", justifyContent:"center" }}>⚡</div>
            <span style={{ fontSize:16, fontWeight:800 }}>EnergyAI</span>
          </div>
          <div style={{ fontSize:10, color:t.textMut, fontFamily:"monospace" }}>
            UAE SOLAR TRADING
          </div>

          {/* ── MAE SCORE ── */}
          <div style={{ marginTop:12, background:t.elevated,
            border:`1px solid ${t.border}`, borderRadius:8, padding:"8px 10px" }}>
            <div style={{ fontSize:9, fontWeight:600, color:t.textMut,
              textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>
              Model Performance
            </div>
            <div style={{ fontSize:13, fontWeight:800, color:t.accent,
              fontFamily:"monospace" }}>MAE: 33.62 W/m²</div>
            <div style={{ fontSize:10, color:t.textMut, marginTop:3 }}>
              Random Forest · 78,888 rows
            </div>
          </div>
        </div>

        <div style={{ padding:"12px 0", flex:1 }}>
          <div style={{ fontSize:9, fontWeight:600, color:t.textMut,
            letterSpacing:"0.12em", textTransform:"uppercase",
            padding:"8px 20px 6px" }}>Navigation</div>
          {navItem("dashboard","⊞","Dashboard")}
          {navItem("predictions","↗","Predictions")}
          {navItem("trading","⇄","Trading")}
          {navItem("analytics","▦","Analytics")}
        </div>

        <div style={{ padding:"12px 14px 0", borderTop:`1px solid ${t.border}` }}>
          <div style={{ background:t.elevated, border:`1px solid ${t.border}`,
            borderRadius:10, padding:"10px 12px",
            display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:7, height:7, borderRadius:"50%",
              background:t.sell, flexShrink:0 }} />
            <div>
              <div style={{ fontSize:12, fontWeight:600 }}>System Online</div>
              <div style={{ fontSize:11, color:t.textSec }}>RF Model Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* TOPBAR */}
        <div style={{ background:t.surface, borderBottom:`1px solid ${t.border}`,
          padding:"0 24px", height:56, display:"flex",
          alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <span style={{ fontSize:11, color:t.textMut, fontFamily:"monospace" }}>
              ENERGYAI / {view.toUpperCase()}
            </span>
            <span style={{ fontSize:15, fontWeight:700 }}>
              {{ dashboard:"Overview", predictions:"Prediction History",
                 trading:"Trade Log", analytics:"Analytics" }[view]}
            </span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontFamily:"monospace", fontSize:11, color:t.textMut,
              background:t.elevated, border:`1px solid ${t.border}`,
              padding:"4px 10px", borderRadius:6 }}>{clock}</span>
            <button onClick={() => setDark(d => !d)} style={{ width:52, height:28,
              background:t.elevated, border:`1px solid ${t.borderStr}`,
              borderRadius:999, cursor:"pointer", position:"relative" }}>
              <div style={{ position:"absolute", top:3, width:20, height:20,
                left: dark ? 3 : 27, background:t.text, borderRadius:"50%",
                transition:"left 0.25s", display:"flex",
                alignItems:"center", justifyContent:"center", fontSize:10 }}>
                {dark ? "🌙" : "☀️"}
              </div>
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px",
          display:"flex", flexDirection:"column", gap:16 }}>

          {/* ════ DASHBOARD ════ */}
          {view === "dashboard" && <>
            <div style={g2}>
              <div style={card}>
                <div style={cardTitle}>Weather inputs</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <Field label="Temperature" unit="T2M · °C"
                    value={temp} onChange={setTemp} t={t} />
                  <Field label="Wind Speed" unit="WS10M · m/s"
                    value={wind} onChange={setWind} t={t} />
                  <Field label="Humidity" unit="RH2M · %"
                    value={humidity} onChange={setHumidity} t={t} />
                  <Field label="Hour" unit="HR · 0–23"
                    value={hour} onChange={setHour} t={t} />
                </div>
                {error && (
                  <div style={{ marginTop:10, padding:"10px 12px", borderRadius:8,
                    background:t.buyDim, color:t.buy, fontSize:12 }}>{error}</div>
                )}
                <button onClick={predict} disabled={loading} style={{
                  width:"100%", marginTop:14, padding:13,
                  fontSize:13, fontWeight:700, letterSpacing:"0.06em",
                  textTransform:"uppercase", color:"#fff",
                  background: loading ? t.elevated : t.accent,
                  border:"none", borderRadius:10,
                  cursor: loading ? "not-allowed" : "pointer" }}>
                  {loading ? "Running ML model…" : "⚡ Predict"}
                </button>
              </div>

              <div style={card}>
                <div style={cardTitle}>AI insight</div>
                {result ? (<>
                  <div style={{ fontSize:16, fontWeight:800, color:decColor,
                    display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                    <span style={{ width:8, height:8, borderRadius:"50%",
                      background:decColor, display:"inline-block" }} />
                    Decision: {result.decision}
                  </div>
                  <div style={{ fontSize:13, color:t.textSec, lineHeight:1.7 }}>
                    At <b style={{ color:t.text }}>{result.hour}:00</b>, the Random Forest
                    model predicted <b style={{ color:t.text }}>{result.solar_radiation} W/m²</b>{" "}
                    solar radiation. The 500m² farm generates{" "}
                    <b style={{ color:t.text }}>{result.power_generation_kw} kW</b> vs
                    market demand of <b style={{ color:t.text }}>{result.demand_kw} kW</b>.
                    {result.decision === "SELL"
                      ? ` Surplus energy sold → +${result.profit} AED`
                      : result.decision === "BUY"
                      ? ` Energy deficit purchased → ${result.profit} AED`
                      : " Perfect balance. No trade needed."}
                  </div>
                  <div style={{ marginTop:14 }}>
                    <div style={{ fontSize:10, fontWeight:600, color:t.textMut,
                      textTransform:"uppercase", letterSpacing:"0.08em",
                      marginBottom:10 }}>Feature importance</div>
                    {[["Hour (HR)","50%",t.sell],["Humidity (RH2M)","44%",t.sell],
                      ["Temp (T2M)","3%",t.amber],["Wind (WS10M)","1%",t.amber]]
                      .map(([n,v,c]) => (
                      <div key={n} style={{ marginBottom:7 }}>
                        <div style={{ display:"flex", justifyContent:"space-between",
                          marginBottom:3 }}>
                          <span style={{ fontSize:11, color:t.textSec }}>{n}</span>
                          <span style={{ fontSize:11, color:t.textMut,
                            fontFamily:"monospace" }}>{v}</span>
                        </div>
                        <div style={{ height:4, background:t.borderStr, borderRadius:2 }}>
                          <div style={{ width:v, height:"100%",
                            background:c, borderRadius:2 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </>) : (
                  <div style={{ color:t.textMut, fontSize:13, lineHeight:1.8 }}>
                    Enter values from your UAE dataset and click Predict.<br/>
                    <span style={{ fontFamily:"monospace", fontSize:11 }}>
                      Temp: 18–45°C · Wind: 1–10 m/s<br/>
                      Humidity: 20–90% · Hour: 0–23
                    </span>
                  </div>
                )}
              </div>
            </div>

            {result && (
              <div style={card}>
                <div style={cardTitle}>Key performance indicators</div>
                <div style={g5}>
                  <KPI label="Solar Radiation"
                    value={result.solar_radiation} unit="W/m² · ML predicted" t={t} />
                  <KPI label="Power Generation"
                    value={`${result.power_generation_kw} kW`}
                    unit="500m² · 20% efficiency" t={t} />
                  <KPI label="Market Demand"
                    value={`${result.demand_kw} kW`} unit="simulated" t={t} />
                  <KPI label="Profit / Loss"
                    value={`${result.profit >= 0 ? "+" : ""}${result.profit} AED`}
                    unit="@ 0.30 AED/kWh"
                    color={result.profit >= 0 ? t.sell : t.buy} t={t} />
                  <KPI label="Decision" value={result.decision}
                    unit="trading action" color={decColor} t={t} />
                </div>
              </div>
            )}

            {result && (
              <div style={card}>
                <div style={cardTitle}>
                  24-hour power forecast — ML model predictions for each hour
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={result.forecast}>
                    <XAxis dataKey="hour" tick={{ fill:t.textMut, fontSize:11 }}
                      tickFormatter={h => `${h}:00`} />
                    <YAxis tick={{ fill:t.textMut, fontSize:11 }} />
                    <Tooltip
                      contentStyle={{ background:t.card,
                        border:`1px solid ${t.border}`,
                        borderRadius:8, color:t.text }}
                      formatter={v => [`${v} kW`, "Power"]}
                      labelFormatter={h => `${h}:00`} />
                    <Line type="monotone" dataKey="power_kw"
                      stroke={t.sell} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </>}

          {/* ════ PREDICTIONS ════ */}
          {view === "predictions" && (
            <div style={card}>
              <div style={cardTitle}>
                Prediction history — {history.length} runs
              </div>
              {history.length === 0 ? (
                <div style={{ color:t.textMut, textAlign:"center",
                  padding:"32px 0", fontSize:13 }}>
                  No predictions yet. Go to Dashboard and click Predict.
                </div>
              ) : (
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                  <thead>
                    <tr>{["Time","Temp","Wind","Humidity","Hour",
                          "Radiation","Power","Demand","Decision","P&L"]
                      .map(h => (
                        <th key={h} style={{ textAlign:"left",
                          fontSize:10, fontWeight:600, letterSpacing:"0.08em",
                          textTransform:"uppercase", color:t.textMut,
                          padding:"0 10px 12px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((r, i) => (
                      <tr key={i}>
                        {[r.time,
                          `${r.temp}°C`, `${r.wind} m/s`,
                          `${r.humidity}%`, `${r.hour}:00`,
                          `${r.solar_radiation} W/m²`,
                          `${r.power_generation_kw} kW`,
                          `${r.demand_kw} kW`].map((v, j) => (
                          <td key={j} style={{ padding:"10px",
                            borderTop:`1px solid ${t.border}`,
                            fontFamily: j >= 5 ? "monospace" : "inherit",
                            color:t.text }}>{v}</td>
                        ))}
                        <td style={{ padding:"10px",
                          borderTop:`1px solid ${t.border}` }}>
                          <span style={{
                            background: r.decision==="SELL" ? t.sellDim : t.buyDim,
                            color: r.decision==="SELL" ? t.sell : t.buy,
                            border:`1px solid ${r.decision==="SELL"
                              ? "rgba(0,212,168,0.25)" : "rgba(255,107,74,0.25)"}`,
                            borderRadius:6, padding:"3px 8px",
                            fontSize:11, fontWeight:700 }}>
                            {r.decision}
                          </span>
                        </td>
                        <td style={{ padding:"10px",
                          borderTop:`1px solid ${t.border}`,
                          color: r.profit >= 0 ? t.sell : t.buy,
                          fontFamily:"monospace", fontWeight:700 }}>
                          {r.profit >= 0 ? "+" : ""}{r.profit} AED
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ════ TRADING ════ */}
          {view === "trading" && <>
            <div style={{ display:"grid",
              gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:12 }}>
              <KPI label="Total Trades" value={history.length}
                unit="executions" t={t} />
              <KPI label="SELL Orders" value={sells}
                unit="grid export" color={t.sell} t={t} />
              <KPI label="BUY Orders" value={buys}
                unit="grid import" color={t.buy} t={t} />
              <KPI label="Net P&L"
                value={`${Math.round(history.reduce((s,r)=>s+r.profit,0)*100)/100 >= 0 ? "+" : ""}${Math.round(history.reduce((s,r)=>s+r.profit,0)*100)/100} AED`}
                unit="total session"
                color={history.reduce((s,r)=>s+r.profit,0) >= 0 ? t.sell : t.buy}
                t={t} />
            </div>
            <div style={card}>
              <div style={cardTitle}>Trade execution log</div>
              {history.length === 0 ? (
                <div style={{ color:t.textMut, textAlign:"center",
                  padding:"32px 0", fontSize:13 }}>
                  No trades yet. Run a prediction from Dashboard.
                </div>
              ) : (
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                  <thead>
                    <tr>{["Time","Action","Generation","Demand","Volume","Price","P&L"]
                      .map(h => (
                        <th key={h} style={{ textAlign:"left", fontSize:10,
                          fontWeight:600, letterSpacing:"0.08em",
                          textTransform:"uppercase", color:t.textMut,
                          padding:"0 10px 12px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((r, i) => (
                      <tr key={i}>
                        <td style={{ padding:"10px", borderTop:`1px solid ${t.border}`,
                          color:t.textMut, fontFamily:"monospace" }}>{r.time}</td>
                        <td style={{ padding:"10px", borderTop:`1px solid ${t.border}` }}>
                          <span style={{
                            background: r.decision==="SELL" ? t.sellDim : t.buyDim,
                            color: r.decision==="SELL" ? t.sell : t.buy,
                            border:`1px solid ${r.decision==="SELL"
                              ? "rgba(0,212,168,0.25)" : "rgba(255,107,74,0.25)"}`,
                            borderRadius:6, padding:"3px 8px",
                            fontSize:11, fontWeight:700 }}>
                            {r.decision}
                          </span>
                        </td>
                        <td style={{ padding:"10px", borderTop:`1px solid ${t.border}`,
                          fontFamily:"monospace" }}>{r.power_generation_kw} kW</td>
                        <td style={{ padding:"10px", borderTop:`1px solid ${t.border}`,
                          fontFamily:"monospace" }}>{r.demand_kw} kW</td>
                        <td style={{ padding:"10px", borderTop:`1px solid ${t.border}`,
                          fontFamily:"monospace" }}>
                          {Math.abs(Math.round((r.power_generation_kw-r.demand_kw)*100)/100)} kW
                        </td>
                        <td style={{ padding:"10px", borderTop:`1px solid ${t.border}`,
                          fontFamily:"monospace" }}>0.30 AED</td>
                        <td style={{ padding:"10px", borderTop:`1px solid ${t.border}`,
                          color: r.profit >= 0 ? t.sell : t.buy,
                          fontFamily:"monospace", fontWeight:700 }}>
                          {r.profit >= 0 ? "+" : ""}{r.profit} AED
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>}

          {/* ════ ANALYTICS ════ */}
          {view === "analytics" && <>
            <div style={g2}>
              <div style={card}>
                <div style={cardTitle}>Generation vs Demand</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={history.slice(0,10)}>
                    <XAxis dataKey="time" tick={{ fill:t.textMut, fontSize:10 }} />
                    <YAxis tick={{ fill:t.textMut, fontSize:10 }} />
                    <Tooltip contentStyle={{ background:t.card,
                      border:`1px solid ${t.border}`,
                      borderRadius:8, color:t.text }} />
                    <Bar dataKey="power_generation_kw"
                      name="Generation (kW)" fill={t.sell} radius={[4,4,0,0]} />
                    <Bar dataKey="demand_kw"
                      name="Demand (kW)" fill={t.buy} radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={card}>
                <div style={cardTitle}>Cumulative P&L</div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={cumPnl}>
                    <XAxis dataKey="time" tick={{ fill:t.textMut, fontSize:10 }} />
                    <YAxis tick={{ fill:t.textMut, fontSize:10 }} />
                    <Tooltip contentStyle={{ background:t.card,
                      border:`1px solid ${t.border}`,
                      borderRadius:8, color:t.text }}
                      formatter={v => [`${v} AED`, "P&L"]} />
                    <Line type="monotone" dataKey="pnl" stroke={t.accent}
                      strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={g2}>
              <div style={card}>
                <div style={cardTitle}>Decision Breakdown</div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={[
                        { name:"SELL", value: sells || 0 },
                        { name:"BUY",  value: buys  || 0 },
                      ]}
                      cx="50%" cy="50%" outerRadius={75}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}>
                      <Cell fill={t.sell} />
                      <Cell fill={t.buy} />
                    </Pie>
                    <Tooltip contentStyle={{ background:t.card,
                      border:`1px solid ${t.border}`,
                      borderRadius:8, color:t.text }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={card}>
                <div style={cardTitle}>Solar Radiation per Prediction</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={history.slice(0,10)}>
                    <XAxis dataKey="time" tick={{ fill:t.textMut, fontSize:10 }} />
                    <YAxis tick={{ fill:t.textMut, fontSize:10 }} />
                    <Tooltip contentStyle={{ background:t.card,
                      border:`1px solid ${t.border}`,
                      borderRadius:8, color:t.text }}
                      formatter={v => [`${v} W/m²`, "Radiation"]} />
                    <Bar dataKey="solar_radiation" fill={t.amber}
                      radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>}

        </div>
      </div>
    </div>
  );
}