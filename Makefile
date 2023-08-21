.PHONY: build publish

FLAGS = --bundle --minify --target=es2021

build:
	./node_modules/.bin/esbuild src/snippet.js $(FLAGS) --outfile=dist/snippet.js
	./node_modules/.bin/esbuild src/snippet.js $(FLAGS) --format=esm --outfile=dist/snippet.mjs

publish:
	make build
	npm publish --access=public
