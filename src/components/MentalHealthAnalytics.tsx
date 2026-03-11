import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Shield, Activity } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { MindAssessment, getRiskColor, getRiskLabel, getSeverityLabel } from '@/hooks/useMentalHealthData';

interface MentalHealthAnalyticsProps {
  assessments: MindAssessment[];
}

const MentalHealthAnalytics = ({ assessments }: MentalHealthAnalyticsProps) => {
  const analytics = useMemo(() => {
    if (assessments.length === 0) return null;

    const latest = assessments[0];
    const deepScans = assessments.filter(a => a.scan_type === 'deep');
    const totalScans = assessments.length;

    // Trend data (deep scans only, chronological)
    const trendData = [...deepScans].reverse().slice(-10).map(a => ({
      date: format(new Date(a.created_at), 'dd/MM'),
      phq9: a.phq9_total ?? 0,
      gad7: a.gad7_total ?? 0,
      stress: a.dass21_stress ?? 0,
    }));

    // Risk distribution
    const riskCounts = assessments.reduce((acc, a) => {
      acc[a.overall_risk] = (acc[a.overall_risk] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const riskDistribution = ['low', 'moderate', 'high', 'crisis'].map(risk => ({
      name: getRiskLabel(risk),
      count: riskCounts[risk] || 0,
      color: getRiskColor(risk),
    }));

    // Average scores (deep scans)
    const avgScores = deepScans.length > 0 ? {
      phq9: Math.round(deepScans.reduce((s, a) => s + (a.phq9_total ?? 0), 0) / deepScans.length),
      gad7: Math.round(deepScans.reduce((s, a) => s + (a.gad7_total ?? 0), 0) / deepScans.length),
      depression: Math.round(deepScans.reduce((s, a) => s + (a.dass21_depression ?? 0), 0) / deepScans.length),
      anxiety: Math.round(deepScans.reduce((s, a) => s + (a.dass21_anxiety ?? 0), 0) / deepScans.length),
      stress: Math.round(deepScans.reduce((s, a) => s + (a.dass21_stress ?? 0), 0) / deepScans.length),
    } : null;

    // Trend direction (compare last 2 deep scans)
    let trend: 'improving' | 'stable' | 'worsening' = 'stable';
    if (deepScans.length >= 2) {
      const current = deepScans[0].phq9_total ?? 0;
      const previous = deepScans[1].phq9_total ?? 0;
      if (current < previous - 2) trend = 'improving';
      else if (current > previous + 2) trend = 'worsening';
    }

    return { latest, trendData, riskDistribution, avgScores, totalScans, deepScans: deepScans.length, trend };
  }, [assessments]);

  if (!analytics) {
    return (
      <div className="text-center py-16">
        <Brain className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground text-lg">Tiada data saringan lagi</p>
        <p className="text-muted-foreground/70 text-sm mt-2">
          Buat saringan pertama anda melalui aplikasi scan2mind
        </p>
      </div>
    );
  }

  const TrendIcon = analytics.trend === 'improving' ? TrendingDown :
                    analytics.trend === 'worsening' ? TrendingUp : Activity;
  const trendColor = analytics.trend === 'improving' ? 'text-green-400' :
                     analytics.trend === 'worsening' ? 'text-red-400' : 'text-yellow-400';
  const trendLabel = analytics.trend === 'improving' ? 'Bertambah Baik' :
                     analytics.trend === 'worsening' ? 'Perlu Perhatian' : 'Stabil';

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Latest Risk */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Risiko Terkini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: getRiskColor(analytics.latest.overall_risk) }}>
              {getRiskLabel(analytics.latest.overall_risk)}
            </div>
            <div className="text-xs text-muted-foreground/70 mt-1">
              {format(new Date(analytics.latest.created_at), 'dd/MM/yyyy HH:mm')}
            </div>
            {analytics.latest.overall_risk === 'crisis' && (
              <div className="flex items-center mt-2 text-xs text-red-400">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Hubungi HEAL 15555
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trend */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${trendColor}`}>
              {trendLabel}
            </div>
            <div className="flex items-center mt-2 text-xs">
              <TrendIcon className={`w-3 h-3 mr-1 ${trendColor}`} />
              <span className="text-muted-foreground">
                Berdasarkan {analytics.deepScans} saringan penuh
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Scans */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Jumlah Saringan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {analytics.totalScans}
            </div>
            <div className="text-xs text-muted-foreground/70">
              {analytics.deepScans} penuh · {analytics.totalScans - analytics.deepScans} pantas
            </div>
          </CardContent>
        </Card>

        {/* PHQ-9 Latest */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">PHQ-9 Terkini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">
              {analytics.latest.phq9_total ?? '-'}
              <span className="text-sm font-normal text-muted-foreground">/27</span>
            </div>
            <div className="text-xs text-muted-foreground/70">
              {getSeverityLabel(analytics.latest.phq9_severity)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Trend */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Trend Skor Saringan</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.trendData.length >= 2 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Area type="monotone" dataKey="phq9" stroke="#EF4444" fill="#EF444420" strokeWidth={2} name="PHQ-9" />
                  <Area type="monotone" dataKey="gad7" stroke="#F59E0B" fill="#F59E0B20" strokeWidth={2} name="GAD-7" />
                  <Area type="monotone" dataKey="stress" stroke="#06B6D4" fill="#06B6D420" strokeWidth={2} name="Tekanan" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12">
                <Activity className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">
                  Perlu sekurang-kurangnya 2 saringan penuh
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Taburan Risiko</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.riskDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {analytics.riskDistribution.map((entry, index) => (
                    <Bar key={index} dataKey="count" fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Average Scores */}
      {analytics.avgScores && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Purata Skor Keseluruhan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{analytics.avgScores.phq9}</div>
                <div className="text-sm text-muted-foreground">PHQ-9</div>
                <div className="text-xs text-muted-foreground/50">Kemurungan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">{analytics.avgScores.gad7}</div>
                <div className="text-sm text-muted-foreground">GAD-7</div>
                <div className="text-xs text-muted-foreground/50">Kebimbangan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{analytics.avgScores.depression}</div>
                <div className="text-sm text-muted-foreground">DASS-D</div>
                <div className="text-xs text-muted-foreground/50">Kemurungan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{analytics.avgScores.anxiety}</div>
                <div className="text-sm text-muted-foreground">DASS-A</div>
                <div className="text-xs text-muted-foreground/50">Kebimbangan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{analytics.avgScores.stress}</div>
                <div className="text-sm text-muted-foreground">DASS-S</div>
                <div className="text-xs text-muted-foreground/50">Tekanan</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Assessments */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Saringan Terkini</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assessments.slice(0, 5).map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getRiskColor(a.overall_risk) }}
                  />
                  <div>
                    <p className="text-foreground text-sm font-medium">
                      {a.scan_type === 'quick' ? 'Saringan Pantas' : 'Saringan Penuh'}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {format(new Date(a.created_at), 'dd/MM/yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {a.phq9_total != null && (
                    <Badge variant="outline" className="text-xs">PHQ-9: {a.phq9_total}</Badge>
                  )}
                  {a.gad7_total != null && (
                    <Badge variant="outline" className="text-xs">GAD-7: {a.gad7_total}</Badge>
                  )}
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{ color: getRiskColor(a.overall_risk), borderColor: getRiskColor(a.overall_risk) + '50' }}
                  >
                    {getRiskLabel(a.overall_risk)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentalHealthAnalytics;
