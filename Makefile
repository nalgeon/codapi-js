.PHONY: build publish

VERSION = $(shell npm pkg get version --workspaces=false)
FLAGS = --bundle --minify --target=es2021 --define:VERSION='$(VERSION)'

build:
	./node_modules/.bin/esbuild src/snippet.js $(FLAGS) --format=iife --outfile=dist/snippet.js
	./node_modules/.bin/esbuild src/snippet.js $(FLAGS) --format=esm --outfile=dist/snippet.mjs
	./node_modules/.bin/esbuild src/engine/runno.js $(FLAGS) --format=iife --outfile=dist/engine/wasi.js
	./node_modules/.bin/esbuild src/engine/runno.js $(FLAGS) --format=esm --outfile=dist/engine/wasi.mjs
	./node_modules/.bin/esbuild src/snippet.css $(FLAGS) --outfile=dist/snippet.css

publish:
	make build
	npm publish --access=public
