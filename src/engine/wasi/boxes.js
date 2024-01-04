// WASI binaries.
export default {
    lua: {
        program: "lua",
        repo: "https://github.com/nalgeon/lua-wasi",
        url: "https://unpkg.com/@antonz/lua-wasi@5.4.6/dist/lua.wasm",
    },
    php: {
        program: "php",
        repo: "https://github.com/nalgeon/php-wasi",
        url: "https://unpkg.com/@antonz/php-wasi@8.2.6/dist/php-cgi.wasm",
    },
    python: {
        program: "python",
        repo: "https://github.com/nalgeon/python-wasi",
        url: "https://unpkg.com/@antonz/python-wasi@3.12.0/dist/python.wasm",
    },
    ruby: {
        program: "ruby",
        repo: "https://github.com/nalgeon/ruby-wasi",
        url: "https://unpkg.com/@antonz/ruby-wasi@3.2.2/dist/ruby.wasm",
    },
    sqlite: {
        program: "sqlite3",
        repo: "https://github.com/nalgeon/sqlite-wasi",
        url: "https://unpkg.com/@antonz/sqlite-wasi@3.44.2/dist/sqlite.wasm",
    },
};
