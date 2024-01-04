// WASI sandboxes and commands.
export default {
    lua: {
        run: {
            steps: [
                {
                    box: "lua",
                    stdin: true,
                    entry: "main.lua",
                    args: ["-e", "main.lua"],
                },
            ],
        },
    },
    php: {
        run: {
            steps: [
                {
                    box: "php",
                    entry: "main.php",
                    args: ["--no-header", "--no-php-ini", "/src/main.php"],
                },
            ],
        },
    },
    python: {
        run: {
            steps: [
                {
                    box: "python",
                    entry: "main.py",
                    args: ["/src/main.py"],
                },
            ],
        },
    },
    ruby: {
        run: {
            steps: [
                {
                    box: "ruby",
                    entry: "main.rb",
                    args: ["/src/main.rb"],
                },
            ],
        },
    },
    sqlite: {
        run: {
            steps: [
                {
                    box: "sqlite",
                    stdin: true,
                    entry: "main.sql",
                    args: ["-box", ":memory:", "main.sql"],
                },
            ],
        },
    },
};
