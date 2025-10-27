'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
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

const DashboardPage = () => {
  // Monthly Progress Data
  const monthlyData = [
    { month: 'Jun', items: 50 },
    { month: 'Jul', items: 65 },
    { month: 'Aug', items: 75 },
    { month: 'Sep', items: 85 },
    { month: 'Oct', items: 110 },
  ];

  // Waste Distribution Data
  const wasteData = [
    { name: 'Plastic', value: 35, color: '#14b8a6' },
    { name: 'Food', value: 20, color: '#0ea5e9' },
    { name: 'Aluminum', value: 15, color: '#fbbf24' },
    { name: 'Fabric', value: 15, color: '#a855f7' },
    { name: 'Other', value: 15, color: '#06b6d4' },
  ];

  // Items by Type Data
  const itemsData = [
    { type: 'Plastic Bottles', count: 150, color: '#0ea5e9' },
    { type: 'Food Wrappers', count: 100, color: '#10b981' },
    { type: 'Aluminum Cans', count: 75, color: '#fbbf24' },
    { type: 'Fabric Bags', count: 65, color: '#3b82f6' },
    { type: 'Cigarette Butts', count: 50, color: '#8b5cf6' },
  ];

  // Recent Activity Data
  const recentActivity = [
    { location: 'Toronto Waterfront', date: 'Oct 8, 2025', items: 34 },
    { location: 'Toronto Waterfront', date: 'Oct 5, 2025', items: 28 },
    { location: 'High Park Beach', date: 'Oct 28, 2025', items: 45 },
    { location: 'Toronto Waterfront', date: 'Sep 28, 2025', items: 31 },
  ];

  // Top Contributors Data
  const topContributors = [
    { name: 'Sarah Chen', items: 482, rank: 1, isYou: false },
    { name: 'You', items: 427, rank: 2, isYou: true },
    { name: 'Michael Torres', items: 385, rank: 3, isYou: false },
    { name: 'Emma Wilson', items: 354, rank: 4, isYou: false },
  ];

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
            <RecyclingOutlined sx={{ color: '#0284c7', fontSize: '24px' }} />
          </Box>
          <Typography sx={styles.statValue}>427</Typography>
          <Typography sx={styles.statLabel}>Total Items</Typography>
          <Box sx={{ ...styles.badge, backgroundColor: '#dcfce7', color: '#16a34a' }}>
            -23%
          </Box>
        </Box>

        {/* Cleanups */}
        <Box sx={styles.statCard}>
          <Box sx={{ ...styles.statIcon, backgroundColor: '#fef3c7' }}>
            <CalendarTodayOutlined sx={{ color: '#f59e0b', fontSize: '24px' }} />
          </Box>
          <Typography sx={styles.statValue}>12</Typography>
          <Typography sx={styles.statLabel}>Cleanups</Typography>
        </Box>

        {/* Impact Score */}
        <Box sx={styles.statCard}>
          <Box sx={{ ...styles.statIcon, backgroundColor: '#ddd6fe' }}>
            <TrendingUpOutlined sx={{ color: '#7c3aed', fontSize: '24px' }} />
          </Box>
          <Typography sx={styles.statValue}>8.9k</Typography>
          <Typography sx={styles.statLabel}>Impact Score</Typography>
          <Box sx={{ ...styles.badge, backgroundColor: '#dcfce7', color: '#16a34a' }}>
            +18%
          </Box>
        </Box>

        {/* Rank */}
        <Box sx={styles.statCard}>
          <Box sx={{ ...styles.statIcon, backgroundColor: '#fed7aa' }}>
            <EmojiEventsOutlined sx={{ color: '#ea580c', fontSize: '24px' }} />
          </Box>
          <Typography sx={styles.statValue}>#47</Typography>
          <Typography sx={styles.statLabel}>Rank</Typography>
          <Box sx={{ ...styles.badge, backgroundColor: '#dcfce7', color: '#16a34a' }}>
            +5
          </Box>
        </Box>
      </Box>

      {/* Charts Row */}
      <Box sx={styles.chartsRow}>
        {/* Monthly Progress */}
        <Box sx={styles.chartCard}>
          <Typography sx={styles.chartTitle}>Monthly Progress</Typography>
          <Typography sx={styles.chartSubtitle}>Last 5 months</Typography>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="month" 
                stroke="#9ca3af" 
                style={{ fontSize: '12px', fontFamily: 'Inter' }}
              />
              <YAxis 
                stroke="#9ca3af" 
                style={{ fontSize: '12px', fontFamily: 'Inter' }}
              />
              <Line
                type="monotone"
                dataKey="items"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={{ fill: '#0ea5e9', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Waste Distribution */}
        <Box sx={styles.chartCard}>
          <Typography sx={styles.chartTitle}>Waste Distribution</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={wasteData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {wasteData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* Items Collected by Type */}
      <Box sx={styles.barChartCard}>
        <Typography sx={styles.chartTitle}>Items Collected by Type</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={itemsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="type" 
              stroke="#9ca3af" 
              style={{ fontSize: '11px', fontFamily: 'Inter' }}
            />
            <YAxis 
              stroke="#9ca3af" 
              style={{ fontSize: '12px', fontFamily: 'Inter' }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {itemsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Bottom Row */}
      <Box sx={styles.bottomRow}>
        {/* Recent Activity */}
        <Box sx={styles.activityCard}>
          <Typography sx={styles.chartTitle}>Recent Activity</Typography>
          <Box sx={{ marginTop: '20px' }}>
            {recentActivity.map((activity, index) => (
              <Box key={index} sx={styles.activityItem}>
                <Box sx={styles.activityInfo}>
                  <Typography sx={styles.activityLocation}>
                    {activity.location}
                  </Typography>
                  <Typography sx={styles.activityDate}>{activity.date}</Typography>
                </Box>
                <Box sx={styles.activityBadge}>{activity.items} items</Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Top Contributors */}
        <Box sx={styles.activityCard}>
          <Typography sx={styles.chartTitle}>Top Contributors</Typography>
          <Box sx={{ marginTop: '20px' }}>
            {topContributors.map((contributor, index) => (
              <Box key={index} sx={styles.contributorItem}>
                <Box sx={styles.contributorLeft}>
                  <Box sx={styles.contributorAvatar}>
                    <PersonOutline />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={styles.contributorName}>
                        {contributor.name}
                      </Typography>
                      {contributor.isYou && (
                        <span style={styles.youBadge}>You</span>
                      )}
                    </Box>
                    <Typography sx={styles.contributorCount}>
                      {contributor.items} items collected
                    </Typography>
                  </Box>
                </Box>
                <Typography sx={styles.contributorRank}>
                  #{contributor.rank}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Community Impact */}
      <Box sx={styles.communityCard}>
        <Typography sx={styles.communityTitle}>
          <Public sx={{ color: '#0ea5e9' }} />
          Community Impact
        </Typography>
        <Box sx={styles.communityStats}>
          <Box sx={styles.communityStat}>
            <Typography sx={styles.communityValue}>12,547</Typography>
            <Typography sx={styles.communityLabel}>
              Total items collected by all volunteers
            </Typography>
          </Box>
          <Box sx={styles.communityStat}>
            <Typography sx={styles.communityValue}>2,891</Typography>
            <Typography sx={styles.communityLabel}>
              Active volunteers across Canada
            </Typography>
          </Box>
          <Box sx={styles.communityStat}>
            <Typography sx={styles.communityValue}>243km</Typography>
            <Typography sx={styles.communityLabel}>
              Coastline cleaned this month
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default withAuth(DashboardPage);