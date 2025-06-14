"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type TrafficData = {
  date: string // e.g., "2024-05-25"
  desktopUsers: number
  mobileUsers: number
}

type ChartAreaProps = {
  data: TrafficData[]
  dateRangeLabel?: string // e.g., "May 19 – May 25, 2024"
  changeLabel?: string // e.g., "Traffic up by 8.3% this week"
}

export const ChartArea = ({
  data,
  dateRangeLabel = "",
  changeLabel = "",
}: ChartAreaProps) => {
  const [chartColors, setChartColors] = useState<ChartConfig>({
    desktopUsers: { label: "Desktop Users", color: "#000000" },
    mobileUsers: { label: "Mobile Users", color: "#000000" },
  })

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement)
    setChartColors({
      desktopUsers: {
        label: "Desktop Users",
        color: rootStyles.getPropertyValue("--color-chart-1").trim(),
      },
      mobileUsers: {
        label: "Mobile Users",
        color: rootStyles.getPropertyValue("--color-chart-2").trim(),
      },
    })
  }, [])

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Daily User Traffic</CardTitle>
        <CardDescription>Unique users visiting your site each day</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartColors}>
          <AreaChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value)
                return `${date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}`
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="mobileUsers"
              type="monotone"
              fill={chartColors.mobileUsers.color}
              fillOpacity={0.4}
              stroke={chartColors.mobileUsers.color}
              stackId="a"
            />
            <Area
              dataKey="desktopUsers"
              type="monotone"
              fill={chartColors.desktopUsers.color}
              fillOpacity={0.4}
              stroke={chartColors.desktopUsers.color}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {changeLabel || "Traffic data loading..."}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {dateRangeLabel || ""}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
