# Audio transcript to transform into starting prompt

## Audio transcript of my rambling which you need to transform into a structured prompt

The goal of this project is to create a very simple web app—a one-page landing page where the user is able to interact with elevenlabs agents. I don't want you to go too crazy with this. I'm going to provide you with a simple background that you'll use for the page, and then you'll simply use that together with existing prebuilt components from the elevenlabs UI. You'll add those components and connect them with my voice agent, which is accessible via a voice agent ID.

It's important that you keep it simple and that, as you're developing, you start with the basics. You'll really just create a landing page. Make sure we're using Vercel for deployment. Use the background that I provide, and make sure it works—that you can run the server, access it, and that everything looks good.

Then you'll have to select your component, and I'll explain the process you need to follow to select it. You'll add that component and connect it with the elevenlabs agent ID that I provide. That's really all there is to it in terms of the process.

**This is ultra important:** you always need to review the latest documentation from the elevenlabs Agent SDK before planning or implementing anything. You need to review the latest documentation from the elevenlabs UI component that you're using. Look at guides, examples, etc. You shall not start planning or implementing until you are absolutely sure, with references, that this is the way to do it.

What you'll do is start by reviewing the background page that I'm giving you and using your Next.js skills to set up a proper project with a single page, employing best practices. Set up everything properly regarding the folder structure of the repository. Before that, you'll establish the tech stack that you're going to use and all the libraries that you're going to use, and you'll make sure that they're all available and compatible.

Once you've established that, you'll put together that page with the background and deploy it. You'll use a test-driven approach to make sure things are right. Use the Chrome Devtools mcp to troubleshoot whatever you're doing. You'll always run the server—kill any existing servers first, then run your server. Look at the logs of the server to make sure it's compiling and building with no errors. Then access localhost with the Chrome Devtools mcp, take screenshots, analyze them, and leverage all of your Chrome Devtools mcp tools to troubleshoot any issues. Make sure we've got a very well-structured baseline to start developing our component.

Once this is done, I want you to perform extensive research on both the elevenlabs Agent SDK and the elevenlabs UI documentation. Learn how to interact with the Agent SDK given that I have one specific agent ID I want you to use. Be careful here—we want to use the elevenlabs Agent SDK, not the elevenlabs REST API agent SDK. We're working with elevenlabs agents.

Then I want you to also research, at the same time, the elevenlabs UI components and how they should be implemented and how they should be connected to the elevenlabs Agent SDK. Essentially, you're going to create concise documents that explain all the patterns to follow systematically as we go forward to develop this component. Create documents for AI agents to provide them context and to make sure they follow the patterns they're supposed to follow and don't need to research anything to know how to implement it. You'll select all the important directives, give lots of code snippets and examples so that agents can infer how to implement these things. Do this in the context of Next.js, and make sure you don't create documents that are too large. I want them to load easily, and you'll reference those documents in your cloud.md.

I'd like you to orchestrate an efficient and fast process where you think of calling parallel agents to divide and conquer. Think about how you want to handle recombining the data, etc. You're going to be the orchestrator and the implementer. Think and define very quickly your workflow—which tasks run first, which ones in parallel, which are sequential, what is their surveillance, and establish a reporting protocol where they report in the session directory with a very distinctive name. Then establish how you'll combine these documents. It might be another sequential agent, for example, that reads all the reports and performs a deep, recursive thought to outline the relationships between the elements of the reports, connects the dots, and then creates a final report for you that gives you all the context you need to understand how to implement everything.

Obviously this is a multi-phase process, so you need to think carefully about how you want to proceed and always think about the context you engineer. You want to make sure your context is not polluted by noise and is filled with always the most relevant information that will allow you to implement everything correctly in one shot.

You may also want to have some sort of verification agent that ensures the general application infrastructure and that all rules, patterns, and conventions of this repository are respected. You might want to have a specialized elevenlabs Agent SDK agent that verifies that you are indeed implementing the elevenlabs agent UI component and connecting it correctly to the Agent SDK. For this agent, you'll reference all of those documents prior and also give it the means to research the documentation if any issues arise or if there's a need for clarification.

Note that the elevenlabs ui components can be imported bia the shadcnui registry so make sure to include @elevenlabs-ui in the accessible registry when setting up shadcnui components. 

## Clarify with user

Always clarify with the user if anything is unclear. You should clarify proactively as you go. 

## Important deliverables

- comprehensive plans with phases (research, standards definition, spec generation, implentation plan generation, implementation plan execution). Each phase should include a brainstorming of viable options and evaluation from multiple expert POV evaluating pros and cons and scoring relevant aspects --> which you will use to order rank and select best approach.
- The plan should include the creation of pruned context files with relevant context and step by step guides with example code:
    - research-nextjs-setup.md
    - research-elevenlabs.md
- tech-stack-and-code-standards.md (including which library versions, etc...)
- nextjs-starter-specs.md
- elevenlabs-voice-component-specs.md


## Import skills to use

- nextjs
- shadcn
- tailwindcss
- test-driven-development (tdd)
- webapp-testing


## Important mcps to use

- Ref mcp tools for researching latest library documentation
- Firecrawl mcp to search online and scrappe important ressources, examples, guides, etc...
- Chrome devtools mcp to navigate to localhost and review your work by analyzing screenshots, reviewing the page html code, reviewing network calls (api calls post and response), to review logs, etc...
- vercel mcp when deploying or to monitor deployments and logs. 

## Important ressources

Make sure to review the following ressources

- https://elevenlabs.io/docs/agents-platform/guides/quickstarts/next-js
- https://elevenlabs.io/docs/agents-platform -> scrape all relevant pages
- https://github.com/elevenlabs/elevenlabs-examples/tree/main/examples/conversational-ai/nextjs
- https://www.npmjs.com/package/@elevenlabs/react 
- https://ui.elevenlabs.io/docs -> scrape all relevant pages
- https://ui.elevenlabs.io/docs/setup



## Background: Aurora

```You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
aurora-background.tsx
"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col  h-[100vh] items-center justify-center bg-zinc-50 dark:bg-zinc-900  text-slate-950 transition-bg",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            //   I'm sorry but this is what peak developer performance looks like // trigger warning
            className={cn(
              `
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-50 will-change-transform`,

              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
            )}
          ></div>
        </div>
        {children}
      </div>
    </main>
  );
};


demo.tsx
"use client";

import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";

export function AuroraBackgroundDemo() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          Background lights are cool you know.
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          And this, is chemical burn.
        </div>
        <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
          Debug now
        </button>
      </motion.div>
    </AuroraBackground>
  );
}

```

Extend existing tailwind.config.js with this code:
```js
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // your paths
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        aurora: "aurora 60s linear infinite",
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
      },
    },
  },
  plugins: [addVariablesForColors],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them
```
