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
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error))
        };
        
        // We got a file, so now we need to rename it
        var fileSuccess = function(fileHandler) {
            
            // Now we need the directory that the file is going to
            var tmp = path2.split('/');
            var new_filename = tmp.pop();
            var path2_dir = tmp.join('/');
            
            _self.fs.root.getDirectory(path2_dir, {create: false}, function(parentDir) {
                fileHandler.moveTo(parentDir, new_filename, function(newFile) {
                    callback(null, newFile);
                }, errorHandler);
            }, errorHandler);
        };
            
        var fileFailure = function(error) {
            // Check if it's a mismatch error, then we want to rename a directory
            if (error.code == _self.TYPE_MISMATCH_ERR) {

                // Now we need the directory that the directory is going to
                var tmp = path2.split('/');
                var new_dirname = tmp.pop();
                var path2_dir = tmp.join('/');
                
                _self.offlinefs.root.getDirectory(path2_dir, {create: false}, function(parentDir) {
                    _self.offlinefs.root.getDirectory(path1, {create: false}, function(dirHandler) {
                        dirHandler.moveTo(parentDir, new_dirname, function(newDir) {
                            callback(null, newDir);
                        }, errorHandler);
                    }, errorHandler);
                }, errorHandler);
            } else {
                errorHandler(error);
            }
        };
        
        // First we will try check if this is a file and rename it
        this.fs.root.getFile(path1, {create: false}, fileSuccess, fileFailure);
    };
    
    this.truncate = function(fd, len, callback, progress) {
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error))
        };
    
        fd.createWriter(function(fileWriter) {
            fileWriter.onwriteend = function(e) {
                callback(null, e);
            };
            fileWriter.onerror = errorHandler
            
            if (progress)
                fileWriter.onprogress = progress;
                
            fileWriter.truncate(len);
        });
    };
    
    this.chmod = function(path, mode, callback) {
        callback();
    };
    
    this.stat = function(path, callback) {
        callback();
    };
    
    this.lstat = function(path, callback) {
        callback();
    };
    
    this.fstat = function(fd, callback) {
        callback();
    };
    
    this.link = function(srcpath, destpath, callback) {
        callback();
    };
    
    this.symlink = function(linkdata, path, callback) {
        callback();
    };
    
    this.unlink = function(path, callback) {
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error))
        };

        var successHandler = function(fileEntry) {
            fileEntry.remove(function() {
                callback(null);
            }, errorHandler);
        };

        this.fs.root.getFile(path, {create: false}, successHandler, errorHandler);
    };
    
    this.rmdir = function(path, callback) {
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error))
        };

        var successHandler = function(dirEntry) {
            dirEntry.remove(function() {
                callback(null);
            }, errorHandler);
        };

        this.fs.root.getDirectory(path, {create: false}, successHandler, errorHandler);
    };
    
    this.mkdir = function(path, callback) {
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error))
        };
        
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
            }, errorHandler);
        };
        createDir(this.fs.root, path.split('/'));
    };
    
    this.readdir = function(path, callback) {
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error))
        };
        
        var listHandler = function(dirs) {
            callback(null, dirs); 
        };
        
        this.fs.listDir(new_path, listHandler, errorHandler);
    };
    
    this.open = function(path, flags, mode, callback) {
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error))
        };
        
        var successHandler = function(fileHandler) {
            callback(null, fileHandler);
        };
        
        this.fs.root.getFile(path, {create: false}, successHandler, errorHandler);
    };
    
    this.write = function(fd, buffer, offset, length, position, callback, progress) {
        var _self = this,
            data;
            
        var errorHandler = function(error) {
            callback(_self.errorHandler(error))
        };
        
        // Offset can be 0, but length must always be a value > 1
        if (offset != null || offset != 'undefined' && length)
            data = buffer.slice(offset, length);
        else
            data = buffer;
            
        fd.createWriter(function(fileWriter) {
            // If we have a position we want to seek to append
            if (position)
                fileWriter.seek(position);
                
            fileWriter.onwriteend = function(e) {
                callback(null, this.result, e);
            };
            fileWriter.onerror = errorHandler;
            if (progress)
                fileWriter.onprogress = progress;
            fileWriter.write(data);
        });
    };
    
    this.writeFile = function(filename, data, encoding, callback) {
        
    };
    
    this.read = function(fd, buffer, offset, length, position, callback) {
        
    };
    
    this.readFile = function(filename, encoding, callback) {
        
    };
})(WebFS.prototype);