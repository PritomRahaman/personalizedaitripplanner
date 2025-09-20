import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "../utils/index";
import { MapPin, Compass, User, Home, PlaneTakeoff, Calendar, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "Plan Trip",
    url: createPageUrl("PlanTrip"),
    icon: PlaneTakeoff,
  },
  {
    title: "My Trips",
    url: createPageUrl("MyTrips"),
    icon: Calendar,
  },
  {
    title: "Profile",
    url: createPageUrl("Profile"),
    icon: User,
  },
];

// export default function Layout({ children, currentPageName }) {
//   const location = useLocation();

//   return (
//     <SidebarProvider>
//       <style>
//         {`
//           :root {
//             --primary-navy: #1a365d;
//             --primary-gold: #d69e2e;
//             --accent-teal: #319795;
//             --neutral-warm: #f7fafc;
//             --text-dark: #2d3748;
//             --text-light: #718096;
//           }
          
//           .gradient-bg {
//             background: linear-gradient(135deg, var(--primary-navy) 0%, var(--accent-teal) 100%);
//           }
          
//           .gold-accent {
//             color: var(--primary-gold);
//           }
          
//           .travel-card {
//             background: rgba(255, 255, 255, 0.95);
//             backdrop-filter: blur(10px);
//             border: 1px solid rgba(255, 255, 255, 0.2);
//           }
//         `}
//       </style>
//       <div className="min-h-screen flex w-full bg-slate-50">
//         <Sidebar className="border-r border-slate-200 bg-white">
//           <SidebarHeader className="border-b border-slate-200 p-6">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
//                 <Compass className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h2 className="font-bold text-slate-900 text-lg">TripCraft AI</h2>
//                 <p className="text-xs text-slate-500">Personalized Travel Planner</p>
//               </div>
//             </div>
//           </SidebarHeader>
          
//           <SidebarContent className="p-3">
//             <SidebarGroup>
//               <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
//                 Navigation
//               </SidebarGroupLabel>
//               <SidebarGroupContent>
//                 <SidebarMenu>
//                   {navigationItems.map((item) => (
//                     <SidebarMenuItem key={item.title}>
//                       <SidebarMenuButton 
//                         asChild 
//                         className={`hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 rounded-lg mb-1 ${
//                           location.pathname === item.url ? 'bg-slate-900 text-white hover:bg-slate-900 hover:text-white' : ''
//                         }`}
//                       >
//                         <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
//                           <item.icon className="w-5 h-5" />
//                           <span className="font-medium">{item.title}</span>
//                         </Link>
//                       </SidebarMenuButton>
//                     </SidebarMenuItem>
//                   ))}
//                 </SidebarMenu>
//               </SidebarGroupContent>
//             </SidebarGroup>
//           </SidebarContent>

//           <SidebarFooter className="border-t border-slate-200 p-4">
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
//                 <User className="w-4 h-4 text-slate-600" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="font-medium text-slate-900 text-sm truncate">Travel Explorer</p>
//                 <p className="text-xs text-slate-500 truncate">Plan your perfect journey</p>
//               </div>
//             </div>
//           </SidebarFooter>
//         </Sidebar>

//         <main className="flex-1 flex flex-col">
//           <header className="bg-white border-b border-slate-200 px-6 py-4 md:hidden">
//             <div className="flex items-center gap-4">
//               <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
//               <h1 className="text-xl font-bold text-slate-900">TripCraft AI</h1>
//             </div>
//           </header>

//           <div className="flex-1 overflow-auto">
//             {children}
//           </div>
//         </main>
//       </div>
//     </SidebarProvider>
//   );
// }


export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --primary-navy: #1a365d;
            --primary-gold: #d69e2e;
            --accent-teal: #319795;
            --neutral-warm: #f7fafc;
            --text-dark: #2d3748;
            --text-light: #718096;
          }
          
          .gradient-bg {
            background: linear-gradient(135deg, var(--primary-navy) 0%, var(--accent-teal) 100%);
          }
          
          .gold-accent {
            color: var(--primary-gold);
          }
          
          .travel-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
        `}
      </style>

      <div className="min-h-screen flex w-full bg-slate-50">
        {/* SIDEBAR - FIXED HEIGHT + INDEPENDENT SCROLL */}
        <Sidebar className="border-r border-slate-200 bg-white flex flex-col fixed left-0 top-0 h-screen w-64">
          <SidebarHeader className="border-b border-slate-200 p-6 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">TripCraft AI</h2>
                <p className="text-xs text-slate-500">Personalized Travel Planner</p>
              </div>
            </div>
          </SidebarHeader>

          {/* SCROLLABLE NAVIGATION AREA */}
          <SidebarContent className="flex-1 overflow-y-auto p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 rounded-lg mb-1 ${
                          location.pathname === item.url
                            ? "bg-slate-900 text-white hover:bg-slate-900 hover:text-white"
                            : ""
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* FOOTER - STICKY AT BOTTOM */}
          <SidebarFooter className="border-t border-slate-200 p-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate">Travel Explorer</p>
                <p className="text-xs text-slate-500 truncate">Plan your perfect journey</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* MAIN CONTENT - WITH LEFT PADDING TO AVOID OVERLAP */}
        <main className="flex-1 flex flex-col ml-64">
          <header className="bg-white border-b border-slate-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-900">TripCraft AI</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
