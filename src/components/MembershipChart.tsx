
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { MembershipData } from "@/types/membership";

interface MembershipChartProps {
  data: MembershipData[];
}

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];

export const MembershipChart = ({ data }: MembershipChartProps) => {
  const statusData = data.reduce((acc, member) => {
    acc[member.status] = (acc[member.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(statusData).map(([name, value]) => ({ name, value }));

  const membershipTypeData = data.reduce((acc, member) => {
    acc[member.membershipName] = (acc[member.membershipName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(membershipTypeData)
    .map(([name, count]) => ({ name: name.slice(0, 20) + '...', count }))
    .slice(0, 8);

  const locationData = data.reduce((acc, member) => {
    if (member.location && member.location !== '-') {
      acc[member.location] = (acc[member.location] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const locationBarData = Object.entries(locationData)
    .map(([name, count]) => ({ name, count }))
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6 bg-gray-900 border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Membership Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 bg-gray-900 border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Membership Types</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="name" 
              stroke="#9CA3AF"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 bg-gray-900 border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Location Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={locationBarData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9CA3AF" />
            <YAxis 
              dataKey="name" 
              type="category" 
              stroke="#9CA3AF"
              fontSize={12}
              width={120}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 bg-gray-900 border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Sessions Remaining Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-blue-400">
              {data.filter(m => m.sessionsLeft > 0).length}
            </p>
            <p className="text-gray-400">With Sessions</p>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-red-400">
              {data.filter(m => m.sessionsLeft === 0).length}
            </p>
            <p className="text-gray-400">No Sessions</p>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-green-400">
              {data.reduce((sum, m) => sum + m.sessionsLeft, 0)}
            </p>
            <p className="text-gray-400">Total Sessions</p>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-yellow-400">
              {Math.round(data.reduce((sum, m) => sum + m.sessionsLeft, 0) / data.length)}
            </p>
            <p className="text-gray-400">Avg Sessions</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
