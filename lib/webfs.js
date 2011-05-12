var WebFS = function(fs) {
    this.fs = fs;
    this.event
};

(function() {
    
    // Filesystem system types flags
    this.TEMPORARY                   = 0;
    this.PERSISTENT                  = 1;
    // Filesystem progress flags
    this.EMPTY                       = 0;
    this.LOADING                     = 1;
    this.DONE                        = 2;
    // Filesystem error flags
    this.NOT_FOUND_ERR               = 1;
    this.SECURITY_ERR                = 2;
    this.ABORT_ERR                   = 3;
    this.NOT_READABLE_ERR            = 4;
    this.ENCODING_ERR                = 5;
    this.NO_MODIFICATION_ALLOWED_ERR = 6;
    this.INVALID_STATE_ERR           = 7;
    this.SYNTAX_ERR                  = 8;
    this.INVALID_MODIFICATION_ERR    = 9;
    this.QUOTA_EXCEEDED_ERR          = 10;
    this.TYPE_MISMATCH_ERR           = 11;
    this.PATH_EXISTS_ERR             = 12;
    
    this.errorHandler = function(error) {
        var msg;
        
        switch(error.code) {
            case this.NOT_FOUND_ERR:
                msg = "The file or directory has not been found";
                break
            case this.SECURITY_ERR:
                msg = "The file you are attempting to access is unsafe for web access or may be being accessed too many times.";
                break;
            case this.ABORT_ERR:
                msg = "The current operation has been aborted";
                break;
            case this.NOT_READABLE_ERR:
                msg = "The file you are attempting to read is not readable, this may be a permissions issue.";
                break;
            case this.ENCODING_ERR:
                msg = "The data or URL passed is malformed";
                break;
            case this.NO_MODIFICATION_ALLOWED_ERR:
                msg = "The file or directory cannot be modified."
                break;
            case this.INVALID_STATE_ERR:
                msg = "The file or directory state has changed since the last operation."
                break;
            case this.SYNTAX_ERR:
                msg = "There is a syntax error with this file operation."
                break;
            case this.INVALID_MODIFICATION_ERR:
                msg = "Invalid file operation."
                break;
            case this.QUOTA_EXCEEDED_ERR:
                msg = "The quota for the filesystem has been exceded."
                break;
            case this.QUOTA_EXCEEDED_ERR:
                msg = "The quota for the filesystem has been exceded."
                break;
        };
        
        return msg;
        
    };
    
    this.rename = function(path1, path2, callback) {
        var errorCallback = function(error) {
               
        }
        
        var _self = this;
         
        var successHandler = function(handler) {
             handler.moveTo(_self.fs.root, path2, function() {
                callback(null);
            }, function(e) {                
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
        
        var errorHandler = function(error) {
            new Error(msg);
        };
        
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