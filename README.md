# Interactive code examples

_for documentation, education and fun_ 🎉

Embed interactive code snippets directly into your product documentation, online course or blog post.

```
┌───────────────────────────────┐
│ def greet(name):              │
│   print(f"Hello, {name}!")    │
│                               │
│ greet("World")                │
└───────────────────────────────┘
  Run ►  Edit  ✓ Done
┌───────────────────────────────┐
│ Hello, World!                 │
└───────────────────────────────┘
```

Highlights:

-   Automatically converts static code examples into mini-playgrounds.
-   Lightweight and easy to integrate.
-   Sandboxes for any programming language, database, or software.
-   Open source. Uses the permissive Apache-2.0 license.

For an introduction to Codapi, see this post: [Interactive code examples for fun and profit](https://antonz.org/code-examples/).

## Installation

Install with `npm`:

```
npm install @antonz/codapi
```

Or use a CDN:

```html
<script src="https://unpkg.com/@antonz/codapi@0.19.0/dist/snippet.js"></script>
```

Optional styles:

```html
<link rel="stylesheet" href="https://unpkg.com/@antonz/codapi@0.19.0/dist/snippet.css" />
```

## Usage

See the guide that best fits your use case:

-   [HTML/Markdown](docs/html.md)
-   [Docusaurus](docs/docusaurus.md)
-   [Docsify](docs/docsify.md)
-   [WordPress](docs/wordpress.md)
-   [Notion](docs/notion.md)
-   [Dev.to/Medium/Substack/Newsletter](docs/code-links.md) (or other platforms that do not support JavaScript embeds)

You'll also need a working Codapi server, either cloud-based at [codapi.org](https://codapi.org/) or [self-hosted](https://github.com/nalgeon/codapi). Unless you are using an in-browser playground (see below).

## Advanced features

Codapi offers a number of features that go beyond simple code playgrounds:

-   [Output modes](docs/output-modes.md) for displaying images, HTML fragments and interactive DOM.
-   [Templates](docs/templates.md) for hiding parts of the code behind the scenes.
-   [Multi-file](docs/files.md) playgrounds.
-   [Custom actions](docs/custom-actions.md).
-   [Code cells](docs/code-cells.md) for a Jupyter notebook-like experience.

## In-browser playgrounds

Most playgrounds (like Go or MongoDB) run code on the Codapi server.

But there are some playgrounds that work completely in the browser, no Codapi server required:

-   [JavaScript](docs/browser-only.md#javascript)
-   [Fetch](docs/browser-only.md#fetch)
-   [Lua](docs/browser-only.md#lua)
-   [PHP](docs/browser-only.md#php)
-   [PostgreSQL](docs/browser-only.md#postgresql)
-   [Python](docs/browser-only.md#python)
-   [Ruby](docs/browser-only.md#ruby)
-   [SQLite](docs/browser-only.md#sqlite)

## Styling

The widget is unstyled by default. Use `snippet.css` for some basic styling or add your own instead.

Here is the widget structure:

```html
<codapi-snippet sandbox="python" editor="basic">
    <codapi-toolbar>
        <button>Run</button>
        <a href="#edit">Edit</a>
        <codapi-status> ✓ Done </codapi-status>
    </codapi-toolbar>
    <codapi-output>
        <pre><code>Hello, World!</code></pre>
    </codapi-output>
</codapi-snippet>
```

`codapi-snippet` is the top-level element. It contains the the toolbar (`codapi-toolbar`) and the code execution output (`codapi-output`). The toolbar contains a Run `button`, one or more action buttons (`a`) and a status bar (`codapi-status`).

## Funding

Codapi is mostly a [one-man](https://antonz.org/) project, not backed by a VC fund or anything.

If you find Codapi useful, please consider sponsoring it on GitHub. It really helps to move the project forward.

♥ [Become a sponsor](https://github.com/sponsors/nalgeon) to support Codapi.

★ [Subscribe](https://antonz.org/subscribe/) to stay on top of new features.
