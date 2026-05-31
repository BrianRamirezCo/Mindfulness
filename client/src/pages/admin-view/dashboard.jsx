import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  ShoppingBag,
  BookOpen,
  TrendingUp,
  Users,
  Package,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "@/lib/api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#A8896C", "#B5B89A", "#C9B99A", "#D4C4B0"];

function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);

  async function fetchMetrics() {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/orders/get`, { withCredentials: true }),
        axios.get(`${API_URL}/api/admin/products/get`, {
          withCredentials: true,
        }),
      ]);

      const orders = ordersRes.data?.data || [];
      const products = productsRes.data?.data || [];
      const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
      const totalRevenue = paidOrders.reduce(
        (sum, o) => sum + o.totalAmount,
        0,
      );
      const avgTicket =
        paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const ordersToday = paidOrders.filter(
        (o) => new Date(o.orderDate) >= today,
      ).length;

      const ebooksSold = paidOrders.reduce((sum, o) => {
        return (
          sum +
          o.cartItems
            .filter((i) => i.type === "ebook")
            .reduce((s, i) => s + i.quantity, 0)
        );
      }, 0);

      setMetrics({
        totalRevenue,
        totalOrders: paidOrders.length,
        avgTicket,
        ordersToday,
        totalProducts: products.length,
        ebooksSold,
      });

      // Ingresos por mes (últimos 6 meses)
      const months = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];
      const revenueMap = {};
      paidOrders.forEach((o) => {
        const date = new Date(o.orderDate);
        const key = `${months[date.getMonth()]}`;
        revenueMap[key] = (revenueMap[key] || 0) + o.totalAmount;
      });
      const revenueData = Object.entries(revenueMap)
        .slice(-6)
        .map(([mes, ingresos]) => ({ mes, ingresos }));
      setRevenueByMonth(revenueData);

      // Top productos vendidos
      const productSales = {};
      paidOrders.forEach((o) => {
        o.cartItems.forEach((item) => {
          if (!productSales[item.title]) productSales[item.title] = 0;
          productSales[item.title] += item.quantity;
        });
      });
      const topProds = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([nombre, ventas]) => ({
          nombre: nombre.length > 20 ? nombre.substring(0, 20) + "..." : nombre,
          ventas,
        }));
      setTopProducts(topProds);

      // Órdenes por estado
      const statusMap = {
        confirmed: "Confirmado",
        pending: "Pendiente",
        rejected: "Rechazado",
        delivered: "Entregado",
      };
      const statusCount = {};
      orders.forEach((o) => {
        const label = statusMap[o.orderStatus] || o.orderStatus;
        statusCount[label] = (statusCount[label] || 0) + 1;
      });
      setOrdersByStatus(
        Object.entries(statusCount).map(([name, value]) => ({ name, value })),
      );
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchMetrics();
  }, []);

  const metricCards = [
    {
      label: "Ingresos totales",
      value: metrics ? `$${metrics.totalRevenue.toLocaleString("es-AR")}` : "—",
      icon: TrendingUp,
      desc: "Ventas confirmadas",
    },
    {
      label: "Órdenes totales",
      value: metrics ? metrics.totalOrders : "—",
      icon: ShoppingBag,
      desc: `${metrics?.ordersToday || 0} hoy`,
    },
    {
      label: "Ticket promedio",
      value: metrics
        ? `$${Math.round(metrics.avgTicket).toLocaleString("es-AR")}`
        : "—",
      icon: TrendingUp,
      desc: "Por orden pagada",
    },
    {
      label: "Ebooks vendidos",
      value: metrics ? metrics.ebooksSold : "—",
      icon: BookOpen,
      desc: "Descargas totales",
    },
    {
      label: "Productos activos",
      value: metrics ? metrics.totalProducts : "—",
      icon: Package,
      desc: "En catálogo",
    },
    {
      label: "Órdenes hoy",
      value: metrics ? metrics.ordersToday : "—",
      icon: Users,
      desc: "Nuevas hoy",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl text-foreground tracking-wide">
          Dashboard
        </h1>
        <p className="text-sm text-foreground/50 font-sans mt-1">
          Resumen de tu tienda
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((card) => (
          <div
            key={card.label}
            className="bg-card border border-border/50 rounded-xl p-5 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-foreground/40 font-sans">
                {card.label}
              </p>
              <card.icon className="w-4 h-4 text-primary/50" />
            </div>
            <p className="font-serif text-2xl text-foreground">{card.value}</p>
            <p className="text-xs text-foreground/40 font-sans">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingresos por mes */}
        <div className="bg-card border border-border/50 rounded-xl p-6">
          <h2 className="font-sans text-sm uppercase tracking-widest text-foreground/60 mb-4">
            Ingresos por mes
          </h2>
          {revenueByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2D8CF" />
                <XAxis
                  dataKey="mes"
                  tick={{
                    fontSize: 11,
                    fill: "#9E8878",
                    fontFamily: "sans-serif",
                  }}
                />
                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: "#9E8878",
                    fontFamily: "sans-serif",
                  }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(v) => [
                    `$${v.toLocaleString("es-AR")}`,
                    "Ingresos",
                  ]}
                  contentStyle={{
                    fontFamily: "sans-serif",
                    fontSize: 12,
                    borderColor: "#E2D8CF",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ingresos"
                  stroke="#A8896C"
                  strokeWidth={2}
                  dot={{ fill: "#A8896C" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px]">
              <p className="text-sm text-foreground/30 font-sans">
                Sin datos todavía
              </p>
            </div>
          )}
        </div>

        {/* Top productos */}
        <div className="bg-card border border-border/50 rounded-xl p-6">
          <h2 className="font-sans text-sm uppercase tracking-widest text-foreground/60 mb-4">
            Productos más vendidos
          </h2>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2D8CF" />
                <XAxis
                  type="number"
                  tick={{
                    fontSize: 11,
                    fill: "#9E8878",
                    fontFamily: "sans-serif",
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="nombre"
                  width={120}
                  tick={{
                    fontSize: 10,
                    fill: "#9E8878",
                    fontFamily: "sans-serif",
                  }}
                />
                <Tooltip
                  formatter={(v) => [v, "Ventas"]}
                  contentStyle={{
                    fontFamily: "sans-serif",
                    fontSize: 12,
                    borderColor: "#E2D8CF",
                  }}
                />
                <Bar dataKey="ventas" fill="#A8896C" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px]">
              <p className="text-sm text-foreground/30 font-sans">
                Sin datos todavía
              </p>
            </div>
          )}
        </div>

        {/* Órdenes por estado */}
        <div className="bg-card border border-border/50 rounded-xl p-6 lg:col-span-2">
          <h2 className="font-sans text-sm uppercase tracking-widest text-foreground/60 mb-4">
            Órdenes por estado
          </h2>
          {ordersByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                >
                  {ordersByStatus.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    fontFamily: "sans-serif",
                    fontSize: 12,
                    borderColor: "#E2D8CF",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontFamily: "sans-serif", fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px]">
              <p className="text-sm text-foreground/30 font-sans">
                Sin datos todavía
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
