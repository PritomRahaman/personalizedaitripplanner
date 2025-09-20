// // src/components/ui/sidebar.jsx
// import React from "react";
// import { cn } from "../../utils/cn"; // Optional helper for merging classNames (create if you want)

// export function Sidebar({ children, className }) {
//   return <aside className={cn("w-64 flex flex-col", className)}>{children}</aside>;
// }
// export function SidebarContent({ children, className }) {
//   return <div className={cn("flex-1 overflow-y-auto", className)}>{children}</div>;
// }

// export function SidebarGroup({ children, className }) {
//   return <div className={cn("mb-4", className)}>{children}</div>;
// }

// export function SidebarGroupLabel({ children, className }) {
//   return (
//     <div className={cn("text-xs font-semibold uppercase tracking-wider mb-2 px-3 text-slate-500", className)}>
//       {children}
//     </div>
//   );
// }

// export function SidebarGroupContent({ children, className }) {
//   return <div className={cn("space-y-1", className)}>{children}</div>;
// }

// export function SidebarMenu({ children, className }) {
//   return <nav className={cn("flex flex-col", className)}>{children}</nav>;
// }

// export function SidebarMenuItem({ children, className }) {
//   return <div className={cn("", className)}>{children}</div>;
// }

// export function SidebarMenuButton({ children, asChild = false, className, ...props }) {
//   if (asChild) {
//     // If using <Link> as child
//     return React.cloneElement(children, {
//       className: cn("flex items-center gap-3 px-3 py-2.5 rounded-lg", children.props.className, className),
//       ...props,
//     });
//   }
//   return (
//     <button className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg", className)} {...props}>
//       {children}
//     </button>
//   );
// }

// export function SidebarHeader({ children, className }) {
//   return <header className={cn("p-4", className)}>{children}</header>;
// }

// export function SidebarFooter({ children, className }) {
//   return <footer className={cn("p-4 mt-auto", className)}>{children}</footer>;
// }

// export function SidebarProvider({ children }) {
//   // You can add context logic here if you want (expand/collapse sidebar state)
//   return <>{children}</>;
// }

// export function SidebarTrigger({ className, onClick }) {
//   return (
//     <button onClick={onClick} className={cn("p-2 rounded-md", className)}>
//       ☰
//     </button>
//   );
// }

import React from "react";
import { cn } from "../../utils/cn";

export function Sidebar({ children, className }) {
  return <aside className={cn("w-64 flex flex-col bg-white border-r border-slate-200", className)}>{children}</aside>;
}
export function SidebarContent({ children, className }) {
  return <div className={cn("flex-1 overflow-y-auto", className)}>{children}</div>;
}
export function SidebarGroup({ children, className }) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}
export function SidebarGroupLabel({ children, className }) {
  return <div className={cn("text-xs font-semibold uppercase tracking-wider mb-2 px-3 text-slate-500", className)}>{children}</div>;
}
export function SidebarGroupContent({ children, className }) {
  return <div className={cn("space-y-1", className)}>{children}</div>;
}
export function SidebarMenu({ children, className }) {
  return <nav className={cn("flex flex-col", className)}>{children}</nav>;
}
export function SidebarMenuItem({ children, className }) {
  return <div className={cn("", className)}>{children}</div>;
}
export function SidebarMenuButton({ children, asChild = false, className, ...props }) {
  if (asChild) {
    return React.cloneElement(children, {
      className: cn("flex items-center gap-3 px-3 py-2.5 rounded-lg", children.props.className, className),
      ...props,
    });
  }
  return (
    <button className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg", className)} {...props}>
      {children}
    </button>
  );
}
export function SidebarHeader({ children, className }) {
  return <header className={cn("p-4", className)}>{children}</header>;
}
export function SidebarFooter({ children, className }) {
  return <footer className={cn("p-4 mt-auto", className)}>{children}</footer>;
}
export function SidebarProvider({ children }) {
  return <>{children}</>;
}
export function SidebarTrigger({ className, onClick }) {
  return (
    <button onClick={onClick} className={cn("p-2 rounded-md hover:bg-slate-100", className)}>
      ☰
    </button>
  );
}
