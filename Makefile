.PHONY: build publish

FLAGS = --bundle --minify --target=es2018

build:
	./node_modules/.bin/esbuild src/index.js $(FLAGS) --outfile=dist/codapi.js

publish:
	make build
	npm publish
