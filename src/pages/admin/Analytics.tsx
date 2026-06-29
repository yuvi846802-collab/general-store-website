import { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, ComposedChart } from "recharts";
import { TrendingUp, Users, DollarSign, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock Data
const yearDataYTD = [
  { name: 'Jan', revenue: 4000, orders: 240 },
  { name: 'Feb', revenue: 3000, orders: 139 },
  { name: 'Mar', revenue: 2000, orders: 980 },
  { name: 'Apr', revenue: 2780, orders: 390 },
  { name: 'May', revenue: 1890, orders: 480 },
  { name: 'Jun', revenue: 2390, orders: 380 },
  { name: 'Jul', revenue: 3490, orders: 430 },
  { name: 'Aug', revenue: 4200, orders: 500 },
];

const yearDataLastYear = [
  { name: 'Jan', revenue: 3200, orders: 210 },
  { name: 'Feb', revenue: 2800, orders: 150 },
  { name: 'Mar', revenue: 2400, orders: 800 },
  { name: 'Apr', revenue: 3100, orders: 420 },
  { name: 'May', revenue: 2100, orders: 510 },
  { name: 'Jun', revenue: 2600, orders: 410 },
  { name: 'Jul', revenue: 3800, orders: 480 },
  { name: 'Aug', revenue: 4500, orders: 550 },
  { name: 'Sep', revenue: 4100, orders: 470 },
  { name: 'Oct', revenue: 5400, orders: 630 },
  { name: 'Nov', revenue: 5100, orders: 590 },
  { name: 'Dec', revenue: 6400, orders: 750 },
];

const yearDataAllTime = [
  { name: '2021', revenue: 12000, orders: 1200 },
  { name: '2022', revenue: 25000, orders: 2400 },
  { name: '2023', revenue: 45000, orders: 4800 },
  { name: '2024', revenue: 28000, orders: 3100 },
];

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("Year to Date");
  const { toast } = useToast();

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setTimeRange(val);
    toast({ title: "Time Range Updated", description: `Showing analytics data for ${val}.` });
  };

  const getActiveData = () => {
    if (timeRange === "Last Year") return yearDataLastYear;
    if (timeRange === "All Time") return yearDataAllTime;
    return yearDataYTD;
  };

  const getMetrics = () => {
    if (timeRange === "Last Year") {
      return { sales: "₹3,92,100", orders: "4,120", avg: "₹95.10", trend1: "+15.2%", trend2: "+8.1%", trend3: "+6.5%" };
    }
    if (timeRange === "All Time") {
      return { sales: "₹12,45,000", orders: "15,200", avg: "₹81.90", trend1: "+45.5%", trend2: "+32.3%", trend3: "+9.2%" };
    }
    return { sales: "₹4,52,310", orders: "5,241", avg: "₹86.30", trend1: "+24.5%", trend2: "+12.3%", trend3: "+4.2%" };
  };

  const metrics = getMetrics();

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Analytics Overview</h1>
          <p className="text-sm text-muted-foreground">Deep dive into your store's performance metrics.</p>
        </div>
        <select 
          value={timeRange}
          onChange={handleTimeRangeChange}
          className="bg-card border border-border text-sm text-foreground rounded-lg px-4 py-2 font-medium shadow-sm outline-none hover:bg-accent cursor-pointer transition-colors"
        >
          <option value="Year to Date">Year to Date</option>
          <option value="Last Year">Last Year</option>
          <option value="All Time">All Time</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Gross Sales</h3>
            <div className="p-2 bg-primary/10 text-primary rounded-lg"><DollarSign size={18}/></div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">{metrics.sales}</p>
          <p className="text-sm text-emerald-500 font-medium flex items-center gap-1"><TrendingUp size={14}/> {metrics.trend1} vs previous</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Orders</h3>
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><ShoppingBag size={18}/></div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">{metrics.orders}</p>
          <p className="text-sm text-emerald-500 font-medium flex items-center gap-1"><TrendingUp size={14}/> {metrics.trend2} vs previous</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Avg. Order Value</h3>
            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg"><Users size={18}/></div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">{metrics.avg}</p>
          <p className="text-sm text-emerald-500 font-medium flex items-center gap-1"><TrendingUp size={14}/> {metrics.trend3} vs previous</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-foreground mb-6">Revenue & Orders ({timeRange})</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={getActiveData()} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dx={-10} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dx={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Bar yAxisId="left" dataKey="revenue" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={40} name="Revenue (₹)" />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={3} dot={{r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff'}} name="Orders" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
