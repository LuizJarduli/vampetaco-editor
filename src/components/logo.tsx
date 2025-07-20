import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22a7 7 0 0 0 7-7h-2a5 5 0 0 1-5 5v2z" />
      <path d="M19 15a7 7 0 0 0-7-7v-2a9 9 0 0 1 9 9h-2z" />
      <path d="M5 9a7 7 0 0 1 7-7v2a5 5 0 0 0-5 5H5z" />
      <path d="M5 9h2a5 5 0 0 1 5 5v2a7 7 0 0 1-7-7z" />
    </svg>
  );
}
