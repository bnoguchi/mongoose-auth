test:
	@expresso test.js

test-cov:
	@TESTFLAGS=--cov $(MAKE) test

.PHONY: test test-cov
