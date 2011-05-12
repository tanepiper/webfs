var WebFS = function(fs) {
    this.fs = fs;
    this.event
};

(function() {
    
    // Filesystem system types flags
    this.TEMPORARY                   = TEMPORARY                    || 0;
    this.PERSISTENT                  = PERSISTENT                   || 1;
    // Filesystem progress flags
    this.EMPTY                       = EMPTY                        || 0;
    this.LOADING                     = LOADING                      || 1;
    this.DONE                        = DONE                         || 2;
    // Filesystem error flags
    this.NOT_FOUND_ERR               = NOT_FOUND_ERR                || 1;
    this.SECURITY_ERR                = SECURITY_ERR                 || 2;
    this.ABORT_ERR                   = ABORT_ERR                    || 3;
    this.NOT_READABLE_ERR            = NOT_READABLE_ERR             || 4;
    this.ENCODING_ERR                = ENCODING_ERR                 || 5;
    this.NO_MODIFICATION_ALLOWED_ERR = NO_MODIFICATION_ALLOWED_ERR  || 6;
    this.INVALID_STATE_ERR           = INVALID_STATE_ERR            || 7;
    this.SYNTAX_ERR                  = SYNTAX_ERR                   || 8;
    this.INVALID_MODIFICATION_ERR    = INVALID_MODIFICATION_ERR     || 9;
    this.QUOTA_EXCEEDED_ERR          = QUOTA_EXCEEDED_ERR           || 10;
    this.TYPE_MISMATCH_ERR           = TYPE_MISMATCH_ERR            || 11;
    this.PATH_EXISTS_ERR             = PATH_EXISTS_ERR              || 12;
    
    this.rename = function(path1, path2, callback) {
        var _self = this;
        
        var beforerename = document.createEvent("Event");
        beforerename.initEvent("beforerename", true, true);
        beforerename.path1 = path1;
        beforerename.path2 = path2;
        
        var success = document.createEvent("Event");
        success.initEvent("success", true, false);
        
        var error = document.createEvent("Event");
        error.initEvent("error", true, false);
        
        var successHandler = function(handler) {
             handler.moveTo(_self.fs.root, path2, function() {
                success.handler = handler;
                document.dispatchEvent(success);
                callback(null);
            }, function(e) {
                error.error = e;
                document.dispatchEvent(error);
                callback(e);
            });
        };
        
        var fileFailure = function(e) {
            if (e.code == _self.fs.TYPE_MISMATCH_ERR) {
                _self.fs.root.getDirectory(path1, {create: false}, successHandler, function(e) {
                    callback(e);
                });
            } else {
                error.error = e;
                document.dispatchEvent(error);
                callback(e);
            }
        };
        
        // Try renaming a file first
        document.dispatchEvent(beforerename);
        this.fs.root.getFile(path1, {create: false}, successHandler, fileFailure);
        
    };
    
    this.truncate = function(fd, len, callback) {
        var _self = this;
        
        var progress = document.createEvent("Event");
        progress.initEvent("beforerename", true, true);
        
        fd.createWriter(function(fileWriter) {
            fileWriter.onwriteend = function(e) {
                callback(null, e);
            };
            fileWriter.onerror = function(error) {
                callback(error);
            };
            fileWriter.onprogress = function(e) {
                progress.progress = e;
                document.dispatchEvent(progress);
            }
            fileWriter.truncate(len);
        });
    };
    
    this.chmod = function(path, mode, callback) {
        
    };
    
    this.stat = function(path, callback) {
        
    };
    
    this.lstat = function(path, callback) {
        
    };
    
    this.fstat = function(fd, callback) {
        
    };
    
    this.link = function(srcpath, destpath, callback) {
        
    };
    
    this.symlink = function(linkdata, path, callback) {
        
    };
    
    this.unlink = function(path, callback) {
        var _self = this;

        var successHandler = function(fileEntry) {
            fileEntry.remove(function() {
                callback(null);
            }, function(error) {
                callback(error);   
            });
        };

        this.fs.root.getFile(path, {create: false}, successHandler, function(error) {
            callback(error);   
        });
    };
    
    this.rmdir = function(path, callback) {
        var _self = this;

        var successHandler = function(dirEntry) {
            dirEntry.remove(function() {
                callback(null);
            }, function(error) {
                callback(error);   
            });
        };

        this.fs.root.getDirectory(path, {create: false}, successHandler, function(error) {
            callback(error);   
        });
    };
    
    this.mkdir = function(path, callback) {
        var createDir = function(rootDir, folders) {
            if (folders[0] === '.' || folders[0] === '') {
                folders = folders.slice(1);
            }

            rootDir.getDirectory(folders[0], {create: true}, function(dirEntry) {
                if (folders.length) {
                    createDir(dirEntry, folders.slice(1));
                } else {
                    callback(null, dirEntry);
                }
            }, function(error) {
                callback(error);   
            });
        };
        createDir(this.fs.root, path.split('/'));
    };
    
    this.readdir = function(path, callback) {
        
    };
    
    this.open = function(path, flags, mode, callback) {
        
    };
    
    this.write = function(fd, buffer, offset, length, position, callback) {
        
    };
    
    this.writeFile = function(filename, data, encoding, callback) {
        
    };
    
    this.read = function(fd, buffer, offset, length, position, callback) {
        
    };
    
    this.readFile = function(filename, encoding, callback) {
        
    };
})(WebFS.prototype);