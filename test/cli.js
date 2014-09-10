
var assert = require('assert');
var equal = require('assert-dir-equal');
var exec = require('child_process').exec;
var exists = require('fs').existsSync;
var once = require('once');
var rm = require('rimraf').sync;

/**
 * Tests.
 */

describe('cli', function(){
  beforeEach(function(){
    rm('test/tmp');
  });

  describe('install', function(){
    it('should show help without any args', function(done){
      khaos('install', '', function(err, stdout, stderr){
        if (err) return done(err);
        assert(stdout);
        assert(~stdout.indexOf('Usage: khaos-install <repository> <name>'));
        done();
      });
    });

    it('should fail without a / in the repository', function(done){
      khaos('install', 'segmentio node', function(err, stdout, stderr){
        assert(err);
        assert(stderr);
        assert(~stderr.indexOf('Couldn\'t find a GitHub repository named "segmentio".'));
        done();
      });
    });

    it('should fail on a non-existant repository', function(done){
      khaos('install', 'segmentio/noooooooo test', function(err, stdout, stderr){
        assert(err);
        assert(stderr);
        assert(~stderr.indexOf('Repository not found.'));
        done();
      });
    });

    it('should install a new template', function(done){
      khaos('install', 'segmentio/khaos-node node', function(err){
        if (err) return done(err);
        assert(exists('test/tmp/node'));
        assert(exists('test/tmp/node/template'));
        assert(exists('test/tmp/node/template/Readme.md'));
        done();
      });
    });
  });

  describe('update', function(){
    it('should show help without the right args', function(done){
      khaos('update', '', function(err, stdout, stderr){
        if (err) return done(err);
        assert(stdout);
        assert(~stdout.indexOf('Usage: khaos-update <template>'));
        done();
      });
    });

    it('should fail with a non-existant template', function(done){
      khaos('update', 'non-existant', function(err, stdout, stderr){
        assert(err);
        assert(stderr);
        assert(~stderr.indexOf('Couldn\'t find a local template named "non-existant".'));
        done();
      });
    });

    it('should update an existing template');
  });

  describe('create', function(){
    it('should generate a new template');
  });
});

/**
 * Test a khaos `cmd` with `args`.
 *
 * @param {String} cmd
 * @param {String} args
 * @param {Function} fn
 */

function khaos(cmd, args, fn){
  args = args + ' --directory test/tmp';
  cmd = 'bin/khaos ' + cmd + ' ' + args;
  fn = once(fn);
  exec(cmd, fn);
}