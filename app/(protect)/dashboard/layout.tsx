import { Sidebar } from "@/components/sidebar";

interface Props {
    children:React.ReactNode;
}

const DashboardLayout = ({children}:Props) =>{
    return(
  <div className="flex h-screen overflow-hidden">
  <aside className="shrink-0 overflow-y-auto shadow-[3px_3px_3px_rgba(0,0,0,0.25),-1px_-1px_4px_rgba(255,255,255,0.8)] dark:shadow-[-3px_-3px_3px_rgba(0,0,0,0.25),1px_1px_4px_rgba(255,255,255,0.16)]">
    <Sidebar />
  </aside>
  <main className="flex-1 overflow-y-auto px-4 py-8">
    {children}
  </main>
</div>

    )
}

export default DashboardLayout;