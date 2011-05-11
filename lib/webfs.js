var WebFS = function(fs) {
    this.fs = fs;
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
        
        var dirSuccess = function(dirHandler) {
             dirHandler.moveTo(_self.fs.root, path2, function() {
                callback(null);
            }, function(error) {
                callback(error);
            });
        };
        
        var fileSuccess = function(fileHandler) {
            fileHandler.moveTo(_self.fs.root, path2, function() {
                callback(null);
            }, function(error) {
                callback(error);
            });
        };
        
        var fileFailure = function(error) {
            if (error.code == _self.fs.TYPE_MISMATCH_ERR) {
                _self.fs.root.getDirectory(path1, {create: false}, dirSuccess, function(error) {
                    callback(error);
                });
            } else {
                callback(error);
            }
        };
        
        // Try renaming a file first
        this.fs.root.getFile(path1, {create: false}, fileSuccess, fileFailure);
        
    };
    
    this.truncate = function(fd, len, callback) {
        
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
        
    };
    
    this.rmdir = function(path, callback) {
        
    };
    
    this.mkdir = function(path, callback) {
        
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