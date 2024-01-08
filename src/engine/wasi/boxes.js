// WASI binaries.
export default {
    lua: {
        program: "lua",
        repo: "https://github.com/nalgeon/lua-wasi",
        path: "https://unpkg.com/@antonz/lua-wasi@5.4.6/dist",
        file: "lua.wasm",
    },
    php: {
        program: "php",
        repo: "https://github.com/nalgeon/php-wasi",
        path: "https://unpkg.com/@antonz/php-wasi@8.2.6/dist",
        file: "php-cgi.wasm",
    },
    python: {
        program: "python",
        repo: "https://github.com/nalgeon/python-wasi",
        path: "https://unpkg.com/@antonz/python-wasi@3.12.0/dist",
        file: "python.wasm",
    },
    ruby: {
        program: "ruby",
        repo: "https://github.com/nalgeon/ruby-wasi",
        path: "https://unpkg.com/@antonz/ruby-wasi@3.2.2/dist",
        file: "ruby.wasm",
    },
    sqlite: {
        program: "sqlite3",
        repo: "https://github.com/nalgeon/sqlite-wasi",
        path: "https://unpkg.com/@antonz/sqlite-wasi@3.44.2/dist",
        file: "sqlite.wasm",
    },
};
