import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, Users, ShoppingCart, TrendingUp, DollarSign, 
  ArrowUpRight, ArrowDownRight, AlertCircle, Clock, 
  MessageSquare, Star, ArrowRight, Percent, Download,
  RefreshCcw, Search, ChevronLeft, ChevronRight
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";

import { fetchDashboardData, DashboardResponse } from "@/services/api";
import { DashboardLoading } from "./dashboard/DashboardLoading";
import { DashboardError } from "./dashboard/DashboardError";
import { EmptyState } from "./dashboard/EmptyState";

const DATE_FILTERS = [
  "Today", "Yesterday", "Last 7 Days", "This Week", "Last Week", 
  "This Month", "Last Month", "Last 3 Months", "Last 6 Months", 
  "This Year", "Last Year", "Custom Range"
];

export default function AdminDashboard() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("This Month");
  const [isExporting, setIsExporting] = useState(false);
  const [orderPage, setOrderPage] = useState(1);
  const [orderSearch, setOrderSearch] = useState("");
  const ordersPerPage = 5;

  const { data, isLoading, isError, error, refetch } = useQuery<DashboardResponse, Error>({
    queryKey: ['dashboardData', timeRange],
    queryFn: () => fetchDashboardData(timeRange),
    staleTime: 60 * 1000, // Cache for 1 minute
    retry: 2,
  });

  const updateTrigger = useRealTimeData('all');
  
  useEffect(() => {
    if (updateTrigger > 0) {
      refetch();
    }
  }, [updateTrigger, refetch]);

  const handleExport = () => {
    if (!data) return;
    setIsExporting(true);
    setTimeout(() => {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Metric,Value,Change\n"
        + `Total Revenue,${data.summary.revenue.value},${data.summary.revenue.change}\n`
        + `Total Orders,${data.summary.orders.value},${data.summary.orders.change}\n`
        + `Visitors,${data.summary.visitors.value},${data.summary.visitors.change}\n`
        + `Conversion Rate,${data.summary.convRate.value},${data.summary.convRate.change}\n`;
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `dashboard_report_${timeRange.replace(/\s+/g, '_').toLowerCase()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
      toast({ title: "Report Exported", description: `Your report for ${timeRange} has been downloaded as CSV.` });
    }, 1500);
  };

  const filteredOrders = useMemo(() => {
    if (!data?.orders) return [];
    let filtered = data.orders;
    if (orderSearch) {
      const lower = orderSearch.toLowerCase();
      filtered = filtered.filter(o => o.customer.toLowerCase().includes(lower) || o.id.toString().includes(lower));
    }
    return filtered;
  }, [data?.orders, orderSearch]);

  const paginatedOrders = useMemo(() => {
    const start = (orderPage - 1) * ordersPerPage;
    return filteredOrders.slice(start, start + ordersPerPage);
  }, [filteredOrders, orderPage, ordersPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  if (isLoading) return <DashboardLoading />;
  if (isError) return <DashboardError error={error} resetErrorBoundary={refetch} />;
  if (!data) return null;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header - Not in a card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-1 tracking-tight flex items-center gap-2">
            Dashboard Overview <span className="text-2xl">👋</span>
          </h1>
          <p className="text-sm text-muted-foreground">Here is what's happening with your store ({timeRange}).</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select 
            value={timeRange}
            onChange={(e) => {
              setTimeRange(e.target.value);
              setOrderPage(1); // Reset pagination on range change
            }}
            className="bg-card border border-border text-foreground hover:bg-accent px-4 py-2 rounded-xl text-sm font-semibold outline-none cursor-pointer shadow-sm transition-colors flex-1 md:flex-none"
          >
            {DATE_FILTERS.map(filter => (
              <option key={filter} value={filter}>{filter}</option>
            ))}
          </select>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="bg-[#00c897] hover:bg-[#00b386] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed flex-1 md:flex-none"
          >
            {isExporting ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Preparing...</>
            ) : (
              <><Download size={16} /> Export CSV</>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={timeRange}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Primary Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard title="Total Revenue" value={data.summary.revenue.value} change={data.summary.revenue.change} isPositive={data.summary.revenue.isPositive} icon={DollarSign} delay={0.0} sparklineData={data.revenue} />
            <StatCard title="Total Orders" value={data.summary.orders.value} change={data.summary.orders.change} isPositive={data.summary.orders.isPositive} icon={ShoppingCart} delay={0.1} />
            <StatCard title="Store Visitors" value={data.summary.visitors.value} change={data.summary.visitors.change} isPositive={data.summary.visitors.isPositive} icon={Users} delay={0.2} />
            <StatCard title="Conversion Rate" value={data.summary.convRate.value} change={data.summary.convRate.change} isPositive={data.summary.convRate.isPositive} icon={Percent} delay={0.3} />
          </div>

          {/* Alerts Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AlertCard title="Low Stock" value={`${data.alerts.lowStock} Items`} icon={AlertCircle} color="amber" />
            <AlertCard title="Out of Stock" value={`${data.alerts.outOfStock} Items`} icon={Package} color="destructive" />
            <AlertCard title="Pending Orders" value={`${data.alerts.pendingOrders} Orders`} icon={Clock} color="blue" />
            <AlertCard title="New Messages" value={`${data.alerts.newMessages} Unread`} icon={MessageSquare} color="emerald" />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Revenue Chart */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Revenue Analytics</h3>
                  <p className="text-sm text-muted-foreground">Sales performance for {timeRange.toLowerCase()}</p>
                </div>
                <select className="bg-background border border-border text-xs rounded-lg px-3 py-1.5 outline-none hover:bg-accent cursor-pointer">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="h-[300px] w-full">
                {data.revenue.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.revenue} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00c897" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#00c897" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 11}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 11}} tickFormatter={(val) => `₹${val/1000}k`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))', padding: '12px' }}
                        itemStyle={{ color: '#00c897', fontWeight: 'bold' }}
                        cursor={{ stroke: '#00c897', strokeWidth: 1, strokeDasharray: '4 4' }}
                      />
                      <Area type="monotone" dataKey="total" stroke="#00c897" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" animationDuration={1000} activeDot={{ r: 6, fill: '#fff', stroke: '#00c897', strokeWidth: 3 }} dot={{ r: 3, fill: '#fff', stroke: '#00c897', strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState title="No Revenue Data" description="There is no revenue data available for the selected period." />
                )}
              </div>
            </div>

            {/* Category Pie Chart */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-bold text-foreground">Sales by Category</h3>
                <button className="text-xs bg-muted/50 hover:bg-muted text-muted-foreground px-3 py-1.5 rounded-lg border border-border transition-colors">
                  View Report
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Distribution of revenue</p>
              
              {data.salesByCategory.length > 0 ? (
                <>
                  <div className="flex-1 flex items-center justify-center relative my-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={data.salesByCategory} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none" animationDuration={800}>
                          {data.salesByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-bold text-foreground">{data.summary.orders.value}</span>
                      <span className="text-sm text-muted-foreground font-medium mt-1">Orders</span>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    {data.salesByCategory.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                          <span className="text-muted-foreground font-medium">{item.name}</span>
                        </div>
                        <span className="font-bold text-foreground">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <EmptyState title="No Category Data" description="No breakdown available." />
                </div>
              )}
            </div>
          </div>

          {/* Tables & Lists Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-lg font-bold text-foreground">Recent Orders</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search orders..." 
                    value={orderSearch}
                    onChange={e => { setOrderSearch(e.target.value); setOrderPage(1); }}
                    className="bg-background border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs font-medium outline-none focus:border-primary transition-colors w-full sm:w-48"
                  />
                </div>
              </div>

              {filteredOrders.length > 0 ? (
                <>
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-muted-foreground border-b border-border uppercase font-bold tracking-wider">
                          <th className="pb-3 px-2">Order ID</th>
                          <th className="pb-3 px-2">Customer</th>
                          <th className="pb-3 px-2">Date</th>
                          <th className="pb-3 px-2">Amount</th>
                          <th className="pb-3 px-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {paginatedOrders.map((order) => (
                          <tr key={order.id} className="group hover:bg-accent/30 transition-colors">
                            <td className="py-3 px-2 font-semibold text-foreground">#ORD-{order.id}</td>
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold text-[10px] shrink-0">
                                  {order.name.charAt(0)}
                                </div>
                                <span className="font-semibold text-foreground truncate">{order.customer}</span>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-muted-foreground whitespace-nowrap">{order.time}</td>
                            <td className="py-3 px-2 font-bold text-foreground">₹{order.amount.toFixed(2)}</td>
                            <td className="py-3 px-2 text-right">
                              <span className={`inline-flex px-3 py-1 rounded-md text-[10px] font-bold border ${
                                order.status === 'Processing' ? 'bg-[#FFF9F0] text-[#FF8A00] border-[#FFE8CC]' : 
                                order.status === 'Cancelled' ? 'bg-[#FFF0F2] text-[#FF4D4D] border-[#FFE0E5]' :
                                'bg-[#F0FDF4] text-[#10B981] border-[#DCFCE7]'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-6 border-t border-border mt-auto">
                      <span className="text-xs text-muted-foreground font-medium">Showing {((orderPage - 1) * ordersPerPage) + 1} to {Math.min(orderPage * ordersPerPage, filteredOrders.length)} of {filteredOrders.length}</span>
                      <div className="flex gap-2">
                        <button disabled={orderPage === 1} onClick={() => setOrderPage(p => p - 1)} className="w-7 h-7 rounded-full flex items-center justify-center border border-border disabled:opacity-50 hover:bg-accent transition-colors"><ChevronLeft size={14}/></button>
                        <button disabled={orderPage === totalPages} onClick={() => setOrderPage(p => p + 1)} className="w-7 h-7 rounded-full flex items-center justify-center border border-border disabled:opacity-50 hover:bg-accent transition-colors"><ChevronRight size={14}/></button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12">
                  <EmptyState title="No Orders Found" description={orderSearch ? "Try adjusting your search criteria." : "There are no orders for this period."} />
                </div>
              )}
            </div>

            {/* Recent Activities Timeline */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col max-h-[500px] overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
                <button className="text-xs bg-muted/50 hover:bg-muted text-muted-foreground px-3 py-1.5 rounded-lg border border-border transition-colors">
                  View All
                </button>
              </div>
              
              {data.activities.length > 0 ? (
                <div className="overflow-y-auto pr-2 space-y-6 relative before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px before:h-full before:w-[2px] before:bg-border flex-1">
                  {data.activities.map((item, idx) => {
                    let Icon = ShoppingCart;
                    let color = "text-blue-500";
                    let bg = "bg-blue-500/10";
                    
                    if (item.type === 'alert') { Icon = AlertCircle; color = "text-amber-500"; bg = "bg-amber-500/10"; }
                    else if (item.type === 'user') { Icon = Users; color = "text-emerald-500"; bg = "bg-emerald-500/10"; }
                    else if (item.type === 'review') { Icon = Star; color = "text-purple-500"; bg = "bg-purple-500/10"; }
                    else if (item.type === 'refund') { Icon = RefreshCcw; color = "text-destructive"; bg = "bg-destructive/10"; }

                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx} 
                        className="relative flex items-start gap-4"
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${bg} ${color}`}>
                          <Icon size={12} strokeWidth={3} />
                        </div>
                        <div className="flex-1 pb-2">
                          <p className="text-xs font-bold text-foreground">{item.title}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">{item.desc}</p>
                          <p className="text-[10px] text-muted-foreground font-semibold mt-1 opacity-70">{item.time}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 flex-1">
                  <EmptyState title="No Activity" description="There hasn't been any recent activity." />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Sub-components
const StatCard = ({ title, value, change, isPositive, icon: Icon, delay, sparklineData }: any) => {
  if (value === "--") return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm opacity-70">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-muted rounded-md"><Icon className="text-muted-foreground w-4 h-4" /></div>
        <p className="text-muted-foreground text-xs font-semibold">{title}</p>
      </div>
      <h3 className="text-2xl font-bold text-muted-foreground tracking-tight">N/A</h3>
    </div>
  );

  // Generate a smooth curve array if none provided
  const dummyData = sparklineData || [
    { value: 20 }, { value: 35 }, { value: 25 }, { value: 45 }, { value: 30 }, { value: 50 }, { value: 40 }, { value: 60 }
  ];
  
  const sparklineColor = isPositive ? '#10B981' : '#8B5CF6'; // emerald for positive, purple for some others in the image

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="bg-card rounded-xl p-5 border border-border shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow relative"
    >
      <div className="flex justify-between items-start w-full z-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all text-primary">
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-muted-foreground text-sm font-semibold">{title}</p>
          </div>
          <h3 className="text-3xl font-bold text-foreground mb-4">{value}</h3>
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${
            isPositive ? "text-emerald-500" : "text-destructive"
          }`}>
            {isPositive ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
            {change}
          </span>
        </div>
        
        {/* Sparkline */}
        <div className="w-[80px] h-[40px] mt-6 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dummyData}>
              <Line type="monotone" dataKey={sparklineData ? "total" : "value"} stroke={sparklineColor} strokeWidth={2.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

const AlertCard = ({ title, value, icon: Icon, color }: any) => {
  const colorMap: any = {
    amber: "bg-[#FFF9F0] border-[#FFE8CC] text-[#FF8A00] dark:bg-amber-950/30 dark:border-amber-900/50",
    destructive: "bg-[#FFF0F2] border-[#FFE0E5] text-[#FF4D4D] dark:bg-red-950/30 dark:border-red-900/50",
    blue: "bg-[#F0F7FF] border-[#D6EAFF] text-[#3B82F6] dark:bg-blue-950/30 dark:border-blue-900/50",
    emerald: "bg-[#F0FDF4] border-[#DCFCE7] text-[#10B981] dark:bg-emerald-950/30 dark:border-emerald-900/50"
  };
  const iconBgMap: any = {
    amber: "bg-[#FF8A00]",
    destructive: "bg-[#FF4D4D]",
    blue: "bg-[#3B82F6]",
    emerald: "bg-[#10B981]"
  };
  const bgClass = colorMap[color];
  const iconBg = iconBgMap[color];

  return (
    <div className={`border rounded-xl p-4 flex items-center justify-between transition-colors shadow-sm cursor-pointer hover:opacity-90 ${bgClass}`}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${iconBg} shadow-inner`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <p className="text-xs font-semibold opacity-80 mb-0.5">{title}</p>
          <p className="text-lg font-bold tracking-tight">{value}</p>
        </div>
      </div>
      <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center shadow-sm">
        <ChevronRight size={14} className="text-muted-foreground" />
      </div>
    </div>
  );
};
