'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Sector,
} from 'recharts';
import {
  RecyclingOutlined,
  CalendarTodayOutlined,
  TrendingUpOutlined,
  EmojiEventsOutlined,
  PersonOutline,
  Public,
} from '@mui/icons-material';
import { styles } from './dashboard.styles';
import withAuth from '@/components/auth/withAuth';
import { apiCall } from '@/utils/api';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await apiCall('get', 'http://localhost:5000/api/dashboard/stats');
        setDashboardData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show empty state if no data
  if (!dashboardData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography>Unable to load dashboard data</Typography>
      </Box>
    );
  }

  // Extract data from response
  const {
    user,
    monthlyProgress = [],
    wasteDistribution = [],
    itemsByType = [],
    recentActivity = [],
    communityStats = {},
  } = dashboardData;

  // Use backend data or fallback to empty arrays
  const monthlyData = monthlyProgress.length > 0 ? monthlyProgress : [
    { month: 'Jun', items: 0 },
    { month: 'Jul', items: 0 },
    { month: 'Aug', items: 0 },
    { month: 'Sep', items: 0 },
    { month: 'Oct', items: 0 },
    { month: 'Nov', items: 0 },
  ];

  const wasteData = wasteDistribution;
  const itemsData = itemsByType;

  // Custom Tooltip for Line Chart (Monthly Progress)
  const CustomLineTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: '#ffffff',
            padding: '8px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#1a1a1a', margin: 0 }}>
            {payload[0].payload.month}
          </Typography>
          <Typography sx={{ fontSize: '13px', color: '#0ea5e9', fontWeight: 600, margin: '4px 0 0 0' }}>
            {payload[0].value} items
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Custom Tooltip for Bar Chart
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = itemsData.reduce((sum, entry) => sum + entry.count, 0);
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <Box
          sx={{
            backgroundColor: '#ffffff',
            padding: '8px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#1a1a1a', margin: 0 }}>
            {payload[0].payload.type}
          </Typography>
          <Typography 
            sx={{ 
              fontSize: '13px', 
              color: payload[0].payload.color, 
              fontWeight: 600, 
              margin: '4px 0 0 0' 
            }}
          >
            {payload[0].value} items ({percentage}%)
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={styles.container}>
      {/* Header */}
      <Box sx={styles.header}>
        <Typography sx={styles.title}>Your Impact Dashboard</Typography>
        <Typography sx={styles.subtitle}>
          Track your cleanup progress and see how you're making a difference
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={styles.statsGrid}>
        {/* Total Items */}
        <Box sx={styles.statCard}>
          <Box sx={{ ...styles.statIcon, backgroundColor: '#e0f2fe' }}>
            <RecyclingOutlined sx={{ color: '#0284c7', fontSize: '22px' }} />
          </Box>
          <Typography sx={styles.statValue}>{user?.totalItemsCollected || 0}</Typography>
          <Typography sx={styles.statLabel}>Total Items</Typography>
        </Box>

        {/* Cleanups */}
        <Box sx={styles.statCard}>
          <Box sx={{ ...styles.statIcon, backgroundColor: '#fef3c7' }}>
            <CalendarTodayOutlined sx={{ color: '#f59e0b', fontSize: '22px' }} />
          </Box>
          <Typography sx={styles.statValue}>{user?.totalCleanups || 0}</Typography>
          <Typography sx={styles.statLabel}>Cleanups</Typography>
        </Box>

        {/* Challenges */}
        <Box sx={styles.statCard}>
          <Box sx={{ ...styles.statIcon, backgroundColor: '#ddd6fe' }}>
            <TrendingUpOutlined sx={{ color: '#7c3aed', fontSize: '22px' }} />
          </Box>
          <Typography sx={styles.statValue}>{user?.totalChallenges || 0}</Typography>
          <Typography sx={styles.statLabel}>Challenges Joined</Typography>
        </Box>

        {/* Rank */}
        <Box sx={styles.statCard}>
          <Box sx={{ ...styles.statIcon, backgroundColor: '#fed7aa' }}>
            <EmojiEventsOutlined sx={{ color: '#ea580c', fontSize: '22px' }} />
          </Box>
          <Typography sx={styles.statValue}>#{user?.rank || 0}</Typography>
          <Typography sx={styles.statLabel}>Rank</Typography>
          <Typography sx={{ fontSize: '11px', color: '#6b7280', mt: 0.5 }}>
            of {user?.totalUsers || 0} users
          </Typography>
        </Box>
      </Box>

      {/* Charts Row */}
      <Box sx={styles.chartsRow}>
        {/* Monthly Progress */}
        <Box sx={{ ...styles.chartCard, '& svg': { outline: 'none' }, '& *:focus': { outline: 'none' } }}>
          <Typography sx={styles.chartTitle}>Monthly Progress</Typography>
          <Typography sx={styles.chartSubtitle}>Last 6 months</Typography>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis 
                dataKey="month" 
                stroke="#9ca3af" 
                style={{ fontSize: '12px', fontFamily: 'Inter' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                stroke="#9ca3af" 
                style={{ fontSize: '12px', fontFamily: 'Inter' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomLineTooltip />} cursor={{ stroke: '#0ea5e9', strokeWidth: 1 }} />
              <Line
                type="monotone"
                dataKey="items"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={{ fill: '#0ea5e9', r: 5 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Waste Distribution */}
        <Box sx={{ ...styles.chartCard, '& svg': { outline: 'none' }, '& *:focus': { outline: 'none' } }}>
          <Typography sx={styles.chartTitle}>Waste Distribution</Typography>
          {wasteData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={wasteData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={2}
                  dataKey="value"
                  activeShape={(props) => {
                    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
                    const total = wasteData.reduce((sum, entry) => sum + entry.value, 0);
                    const percentage = ((payload.value / total) * 100).toFixed(1);
                    
                    return (
                      <g>
                        <text x={cx} y={cy - 10} textAnchor="middle" fill="#1a1a1a" fontSize="16" fontWeight="600">
                          {payload.name}
                        </text>
                        <text x={cx} y={cy + 15} textAnchor="middle" fill={fill} fontSize="20" fontWeight="700">
                          {percentage}%
                        </text>
                        <Sector
                          cx={cx}
                          cy={cy}
                          innerRadius={innerRadius}
                          outerRadius={outerRadius + 8}
                          startAngle={startAngle}
                          endAngle={endAngle}
                          fill={fill}
                        />
                      </g>
                    );
                  }}
                >
                  {wasteData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
              <Typography sx={{ color: '#6b7280', fontSize: '14px' }}>
                No data available yet
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Items Collected by Type */}
      <Box sx={{ ...styles.barChartCard, '& svg': { outline: 'none' }, '& *:focus': { outline: 'none' } }}>
        <Typography sx={styles.chartTitle}>Items Collected by Type</Typography>
        {itemsData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={itemsData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis 
                dataKey="type" 
                stroke="#9ca3af" 
                style={{ fontSize: '11px', fontFamily: 'Inter' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                angle={0}
                textAnchor="middle"
              />
              <YAxis 
                stroke="#9ca3af" 
                style={{ fontSize: '12px', fontFamily: 'Inter' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={90}>
                {itemsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 280 }}>
            <Typography sx={{ color: '#6b7280', fontSize: '14px' }}>
              No cleanup data available yet
            </Typography>
          </Box>
        )}
      </Box>

      {/* Bottom Row */}
      <Box sx={styles.bottomRow}>
        {/* Recent Activity */}
        <Box sx={styles.activityCard}>
          <Typography sx={styles.chartTitle}>Recent Activity</Typography>
          <Box sx={{ marginTop: '20px' }}>
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <Box key={index} sx={styles.activityItem}>
                  <Box sx={styles.activityInfo}>
                    <Typography sx={styles.activityLocation}>
                      {activity.location}
                    </Typography>
                    <Typography sx={styles.activityDate}>{activity.date}</Typography>
                  </Box>
                  <Box sx={styles.activityBadge}>{activity.items} items</Box>
                </Box>
              ))
            ) : (
              <Typography sx={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', py: 4 }}>
                No cleanup activity yet. Start by joining a challenge!
              </Typography>
            )}
          </Box>
        </Box>

        {/* Community Stats - moved from bottom */}
        <Box sx={styles.activityCard}>
          <Typography sx={styles.chartTitle}>Community Impact</Typography>
          <Box sx={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography sx={{ fontSize: '28px', fontWeight: 700, color: '#0ea5e9' }}>
                {communityStats?.totalItemsCollected?.toLocaleString() || 0}
              </Typography>
              <Typography sx={{ fontSize: '13px', color: '#6b7280', mt: 0.5 }}>
                Total items collected
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '28px', fontWeight: 700, color: '#10b981' }}>
                {communityStats?.totalVolunteers?.toLocaleString() || 0}
              </Typography>
              <Typography sx={{ fontSize: '13px', color: '#6b7280', mt: 0.5 }}>
                Active volunteers
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '28px', fontWeight: 700, color: '#f59e0b' }}>
                {communityStats?.activeChallenges || 0}
              </Typography>
              <Typography sx={{ fontSize: '13px', color: '#6b7280', mt: 0.5 }}>
                Active challenges
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default withAuth(DashboardPage);