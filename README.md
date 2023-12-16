# Embeddable code playgrounds

_for education, documentation, and fun_ 🎉

Embed interactive code snippets directly into your product documentation, online course, or blog post.

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

-   Supports dozens of playgrounds out of the box, plus custom sandboxes if you need them.
-   Available as a cloud service and as a self-hosted version.
-   Lightweight and easy to integrate.
-   Open source.

For an introduction to Codapi, see this post: [Interactive code examples for fun and profit](https://antonz.org/code-examples/).

## Installation

Install with `npm`:

```
npm install @antonz/codapi
```

Or use a CDN:

```html
<script src="https://unpkg.com/@antonz/codapi@0.10.0/dist/snippet.js"></script>
```

Optional styles:

```html
<link rel="stylesheet" href="https://unpkg.com/@antonz/codapi@0.10.0/dist/snippet.css"/>
```

## Usage

See the guide that best fits your use case:

-   [HTML/Markdown](docs/html.md)
-   [Docusaurus](docs/docusaurus.md)
-   [WordPress](docs/wordpress.md)
-   [Notion](docs/notion.md)
-   [Dev.to/Medium/Substack/Newsletter](docs/code-links.md) (or other platforms that do not support JavaScript embeds)

## Browser-only playgrounds

Most playgrounds (like Python, PostgreSQL, or Bash) run code on the Codapi server.

But there are some playgrounds that work [completely in the browser](docs/browser-only.md), no Codapi server required.

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

## License

Copyright 2023+ [Anton Zhiyanov](https://antonz.org/).

The software is available under the MIT License.

## Stay tuned

★ [**Subscribe**](https://antonz.org/subscribe/) to stay on top of new features.
