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
    <aside className="w-64 bg-muted p-4 hidden md:block">
      <h2 className="font-semibold mb-4">Examples</h2>
      <ul className="space-y-2">
        {examples.map((example, index) => (
          <li key={index}>
            <Link
              href={example.link}
              className={clsx({
                "flex items-center gap-2 text-black-500 hover:text-black-700 hover:cursor":
                  true,
                "text-blue-500": pathname === example.link,
              })}
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
