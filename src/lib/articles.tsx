import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export interface Article {
  slug: string;
  title: string;
  description: string;
  datePublished: string; // ISO
  dateModified: string; // ISO
  readMins: number;
  excerpt: string;
  body: () => ReactNode;
}

function H2({ children }: { children: ReactNode }) {
  return <h2 className="font-serif text-2xl text-foreground mt-10 mb-3">{children}</h2>;
}
function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-relaxed text-muted-foreground mt-4">{children}</p>;
}
function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-muted-foreground">
      {children}
    </ul>
  );
}
function OL({ children }: { children: ReactNode }) {
  return (
    <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed text-muted-foreground">
      {children}
    </ol>
  );
}
function A({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="text-accent underline underline-offset-2 hover:opacity-80">
      {children}
    </Link>
  );
}
function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">
      {children}
    </code>
  );
}

export const ARTICLES: Article[] = [
  {
    slug: "filter-gmail-with-dots",
    title: "How to Filter Gmail Using the Dot Trick (Step by Step)",
    description:
      "Automatically sort email by service using the Gmail dot trick. A complete guide to creating filters based on dot variations.",
    datePublished: "2026-06-22",
    dateModified: "2026-06-22",
    readMins: 5,
    excerpt:
      "Give each service one dot variation, then build automatic Gmail filters. Here is the full walkthrough.",
    body: () => (
      <>
        <P>
          Gmail ignores dots in the username part of an address. That means{" "}
          <Code>ne.tflix@gmail.com</Code> and <Code>netflix@gmail.com</Code> both land in your
          inbox. You can use this to give every service its own unique address and filter it
          automatically.
        </P>
        <H2>Step 1 - Create a unique variation per service</H2>
        <P>
          Open the <A to="/">DotMail generator</A>, type your Gmail username, and pick one
          variation for each service. Keep a note of the pairings, for example:
        </P>
        <UL>
          <li>
            Netflix → <Code>yo.urname@gmail.com</Code>
          </li>
          <li>
            Online store → <Code>your.name@gmail.com</Code>
          </li>
          <li>
            Newsletter → <Code>y.ourname@gmail.com</Code>
          </li>
        </UL>
        <H2>Step 2 - Use that address when signing up</H2>
        <P>
          When you sign up to a service, use the variation you chose. Email still lands in the same
          inbox, but the "To" field now carries the service fingerprint.
        </P>
        <H2>Step 3 - Create a filter in Gmail</H2>
        <OL>
          <li>In Gmail, click the advanced search icon in the search box.</li>
          <li>
            Fill the <strong>To</strong> field with the specific variation, e.g.{" "}
            <Code>yo.urname@gmail.com</Code>.
          </li>
          <li>Click "Create filter".</li>
          <li>
            Pick the action: apply label, skip inbox, archive, or forward. Click "Create filter"
            again.
          </li>
        </OL>
        <P>Done. From now on email from that service is sorted automatically. Repeat per service.</P>
        <H2>Tips</H2>
        <UL>
          <li>Use one consistent variation per service so filters are easy to manage.</li>
          <li>
            Want to track leaks? See the{" "}
            <A to="/articles/detect-email-leaks">leak detection guide</A>.
          </li>
        </UL>
      </>
    ),
  },
  {
    slug: "does-gmail-dot-trick-still-work-2026",
    title: "Does the Gmail Dot Trick Still Work in 2026?",
    description:
      "Status of the Gmail dot trick in 2026: does it still work, why some services reject it, and what a more reliable alternative looks like.",
    datePublished: "2026-06-22",
    dateModified: "2026-06-22",
    readMins: 4,
    excerpt:
      "Short answer: yes, on Gmail's side it still works 100%. But one important thing has changed.",
    body: () => (
      <>
        <P>
          Short answer: <strong>yes</strong>. On Gmail's side, the dot trick still works perfectly
          in 2026. Google keeps ignoring dots in the username, so every variation lands in the same
          inbox exactly like before.
        </P>
        <H2>So what has changed?</H2>
        <P>
          What changed is <strong>third-party services</strong>. More sites now "normalize" email
          addresses - they strip dots before storing, so <Code>jo.hn@gmail.com</Code> and{" "}
          <Code>john@gmail.com</Code> are treated as the same person.
        </P>
        <P>Impact:</P>
        <UL>
          <li>
            For <strong>signing up multiple accounts</strong> on the same service: often fails,
            since they treat it as a duplicate.
          </li>
          <li>
            For <strong>filtering and leak detection</strong>: still reliable, because what matters
            is the address written in the header of the email that reaches you.
          </li>
        </UL>
        <H2>Conclusion</H2>
        <P>
          The dot trick isn't dead - its use cases have shifted. Use it for{" "}
          <A to="/articles/filter-gmail-with-dots">filtering</A> and{" "}
          <A to="/articles/detect-email-leaks">leak detection</A>, not for duplicating accounts.
        </P>
        <P>
          Want to try? <A to="/">Generate all your dot variations here.</A>
        </P>
      </>
    ),
  },
  {
    slug: "detect-email-leaks",
    title: "How to Trace Who Leaked Your Email Address",
    description:
      "Use unique dot variations per service to detect spam sources and data leaks. Practical steps and examples.",
    datePublished: "2026-06-22",
    dateModified: "2026-06-22",
    readMins: 5,
    excerpt:
      "When spam arrives at an address you only used with one service, you know exactly who did it.",
    body: () => (
      <>
        <P>
          Ever received spam and wondered how they got your email? With the dot trick you can give
          every service its own address "fingerprint". When spam shows up, you instantly know the
          source.
        </P>
        <H2>The idea</H2>
        <P>
          Each service gets one unique dot variation. Since only you know the "service → variation"
          pairing, the address in the incoming email reveals the source.
        </P>
        <H2>Practical steps</H2>
        <OL>
          <li>
            Open the <A to="/">generator</A> and produce all dot variations of your username.
          </li>
          <li>
            Label each variation ("Label" feature in the results list) and download as CSV to keep
            a record.
          </li>
          <li>Use a different variation when signing up to each important service.</li>
          <li>
            When a suspicious email arrives, check the "To" address. Match it against your CSV.
          </li>
        </OL>
        <H2>Example</H2>
        <P>
          You sign up to a store using <Code>yo.urname@gmail.com</Code>. A month later gambling
          promos arrive at that exact address. Since only that store has that variation, you know
          your data leaked from them - strong evidence to stop using that service.
        </P>
        <H2>Note</H2>
        <P>
          Some services normalize dots (see{" "}
          <A to="/articles/does-gmail-dot-trick-still-work-2026">does it still work in 2026</A>).
          Combine with a service-specific password for extra safety.
        </P>
      </>
    ),
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
