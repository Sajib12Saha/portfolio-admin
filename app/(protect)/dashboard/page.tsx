import { ChartArea } from "@/components/chat-area";

const Dashboard = () => {
  return (
    <div>
      <ChartArea
        data={[
          { date: "2024-05-19", desktopUsers: 120, mobileUsers: 80 },
          { date: "2024-05-20", desktopUsers: 150, mobileUsers: 95 },
          { date: "2024-05-21", desktopUsers: 160, mobileUsers: 100 },
          { date: "2024-05-22", desktopUsers: 140, mobileUsers: 110 },
          { date: "2024-05-23", desktopUsers: 170, mobileUsers: 130 },
          { date: "2024-05-24", desktopUsers: 130, mobileUsers: 125 },
          { date: "2024-05-25", desktopUsers: 110, mobileUsers: 140 },
        ]}
        changeLabel="Traffic up by 12.5% this week"
        dateRangeLabel="May 19 – May 25, 2024"
      />
    </div>
  );
};

export default Dashboard;
