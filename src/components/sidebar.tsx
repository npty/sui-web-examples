"use client";

import Link from "next/link";
import { Send, Upload } from "lucide-react";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const examples = [
  {
    name: "Send Deployment",
    icon: <Upload className="w-4 h-4 mr-2" />,
    link: "/send-deployment",
  },
  {
    name: "Send Token",
    icon: <Send className="w-4 h-4 mr-2" />,
    link: "/send-token",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-background border-r p-6 hidden md:block">
      <div className="flex items-center h-12 mb-2">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Examples
        </h2>
      </div>
      <ul className="space-y-1">
        {examples.map((example, index) => (
          <li key={index}>
            <Link
              href={example.link}
              className={clsx(
                "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                {
                  "text-foreground/80 hover:bg-accent hover:text-foreground":
                    pathname !== example.link,
                  "bg-accent text-foreground": pathname === example.link,
                },
              )}
            >
              {example.icon}
              {example.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
