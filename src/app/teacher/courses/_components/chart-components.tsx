"use client";

import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Bar,
    BarChart,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

export function HOTSPieChart({ data }: { data: any[] }) {
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

    return (
        <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
                <Pie
                    data={data}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={60}
                    fill='#8884d8'
                    dataKey='value'
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}

export function ScoreDistributionChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width='100%' height='100%'>
            <BarChart
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='score' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='count' fill='#8884d8' name='Jumlah Siswa' />
            </BarChart>
        </ResponsiveContainer>
    );
}
