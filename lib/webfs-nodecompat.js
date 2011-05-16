var WebFS = (function() {
    
    function WebFS(fs) {
        this.fs = fs;
    }
    
    // Filesystem system types flags
    WebFS.prototype.TEMPORARY                   = 0;
    WebFS.prototype.PERSISTENT                  = 1;
    // Filesystem progress flags
    WebFS.prototype.EMPTY                       = 0;
    WebFS.prototype.LOADING                     = 1;
    WebFS.prototype.DONE                        = 2;
    // Filesystem error flags
    WebFS.prototype.NOT_FOUND_ERR               = 1;
    WebFS.prototype.SECURITY_ERR                = 2;
    WebFS.prototype.ABORT_ERR                   = 3;
    WebFS.prototype.NOT_READABLE_ERR            = 4;
    WebFS.prototype.ENCODING_ERR                = 5;
    WebFS.prototype.NO_MODIFICATION_ALLOWED_ERR = 6;
    WebFS.prototype.INVALID_STATE_ERR           = 7;
    WebFS.prototype.SYNTAX_ERR                  = 8;
    WebFS.prototype.INVALID_MODIFICATION_ERR    = 9;
    WebFS.prototype.QUOTA_EXCEEDED_ERR          = 10;
    WebFS.prototype.TYPE_MISMATCH_ERR           = 11;
    WebFS.prototype.PATH_EXISTS_ERR             = 12;
    
    WebFS.prototype.errorHandler = function(error) {
        var msg;
        
        switch(error.code) {
            case this.NOT_FOUND_ERR:
                msg = "The file or directory has not been found";
                break;
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
                msg = "The file or directory cannot be modified.";
                break;
            case this.INVALID_STATE_ERR:
                msg = "The file or directory state has changed since the last operation.";
                break;
            case this.SYNTAX_ERR:
                msg = "There is a syntax error with this file operation.";
                break;
            case this.INVALID_MODIFICATION_ERR:
                msg = "Invalid file operation.";
                break;
            case this.QUOTA_EXCEEDED_ERR:
                msg = "The quota for the filesystem has been exceeded.";
                break;
            case this.QUOTA_EXCEEDED_ERR:
                msg = "The quota for the filesystem has been exceeded.";
                break;
        }
        
        return msg;
        
    };
    
    /**
     * Rename or move path1 to path2
     * @param {String} path1 The path to rename or move
     * @param {String} path2 The path to rename or move to
     * @param {Function} callback Callback function on completion.  The first
     * argument returned is an error or null and second argument is the new handler
     * for the moved file or directory 
     */
    WebFS.prototype.rename = function(path1, path2, callback) {
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error));
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
    
    /**
     * Takes a file handler and truncates the content to the passed length
     * @param {FileEntry} fd The file entry to be truncated
     * @param {Number} len The length to truncate the file to
     * @param {Function} callback Callback function, the first argument is an error
     * or null, the second argument is the result of the write, the third argument
     * is the event generated from the write
     */
    WebFS.prototype.truncate = function(fd, len, callback, progress) {
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error));
        };
    
        fd.createWriter(function(fileWriter) {
            fileWriter.onwriteend = function(e) {
                callback(null, this.result, e);
            };
            fileWriter.onerror = errorHandler;
            
            if (progress)
                fileWriter.onprogress = progress;
                
            fileWriter.truncate(len);
        });
    };
    
    WebFS.prototype.chmod = function(path, mode, callback) {
        callback();
    };
    
    WebFS.prototype.stat = function(path, callback) {
        callback();
    };
    
    WebFS.prototype.lstat = function(path, callback) {
        callback();
    };
    
    WebFS.prototype.fstat = function(fd, callback) {
        callback();
    };
    
    WebFS.prototype.link = function(srcpath, destpath, callback) {
        callback();
    };
    
    WebFS.prototype.symlink = function(linkdata, path, callback) {
        callback();
    };
    
    
    /**
     * Unlink deletes a file from the filesystem
     * @param {String} path The path to the file to remove
     * @param {Function} callback Callback function, only returns an error or null
     */
    WebFS.prototype.unlink = function(path, callback) {
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error));
        };
        
        var successHandler = function(fileEntry) {
            fileEntry.remove(function() {
                callback(null);
            }, errorHandler);
        };

        this.fs.root.getFile(path, {create: false}, successHandler, errorHandler);
    };
    
    /**
     * Removes a directory from the filesystem
     * @param {String} path The path of the directory to remove
     * @param {Function} callback Callback function, only returns an error or null
     */
    WebFS.prototype.rmdir = function(path, callback) {
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error));
        };

        var successHandler = function(dirEntry) {
            dirEntry.remove(function() {
                callback(null);
            }, errorHandler);
        };

        this.fs.root.getDirectory(path, {create: false}, successHandler, errorHandler);
    };
    
    /**
     * Creates a directory on the filesystem, will recursivly create paths
     * @param {String} path The path of the directory to create
     * @param {Function} callback Callback function, returns an error or null and
     * a DirectoryEntry reference
     */
    WebFS.prototype.mkdir = function(path, callback) {
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error));
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
    
    /**
     * Reads the contents of a directory, returns the result as an array of entries
     * @param {String} path The path of the directory to list
     * @param {Function} callback Callback function, returns an error or null and
     * an array of entries
     */
    WebFS.prototype.readdir = function(path, callback) {
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error));
        };
        
        var listHandler = function(dirs) {
            callback(null, dirs); 
        };
        
        this.fs.listDir(new_path, listHandler, errorHandler);
    };
    
    
    /**
     * Opens a file and returns a FileEntry reference
     * @param {String} path The path of the directory to remove
     * @param {String} flags Unused, provided for compatibility
     * @param {Number} mode Unused, provied for compatibility
     * @param {Function} callback Callback function, returns an error or null and
     * a reference to a FileEntry
     */
    WebFS.prototype.open = function(path, flags, mode, callback) {
        /**
         * TODO: Work out a good way to take a path, and support the creation
         * of recursive dirs if the file does not exists, but only if the user
         * wants to create the file, which is not supported in the nodejs api
         */
         
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error));
        };
        
        var successHandler = function(fileHandler) {
            callback(null, fileHandler);
        };
        
        this.fs.root.getFile(path, {create: true}, successHandler, errorHandler);
    };
    
    /**
     * Writes the contents of a Blob or File to a FileEntry on the filesystem
     * @param {FileEntry} fd The FileEntry to be written to
     * @param {Mixed} buffer The File or Blob to be read from
     * @param {Number} offset The number of bytes to offset the read from the buffer
     * @param {Number} length The length of bytes to read from the buffer
     * @param {Number} position The position in bytes to begin writing to
     * @param {Function} callback Callback function, only returns an error or null
     */
    WebFS.prototype.write = function(fd, buffer, offset, length, position, callback, progress) {
        var _self = this,
            data;
            
        var errorHandler = function(error) {
            callback(_self.errorHandler(error));
        };
        
        // Offset can be 0, but length must always be a value > 1
        if (offset !== null || offset != 'undefined' && length)
            data = buffer.slice(offset, length);
        else
            data = buffer;
            
        var writerHandler = function(fileWriter) {
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
        };
            
        fd.createWriter(writerHandler, errorHandler);
    };
    
    
    /**
     * Writes a Blob or File to the passed filename
     * @param {String} filename The filename to be created
     * @param {Mixed} buffer The blob or File containing the file data
     * @param {String} encoding Currently unused
     * @param {Function} callback Callback Function
     */
    WebFS.prototype.writeFile = function(filename, buffer, encoding, callback, progress) {
        var _self = this;
        
        this.open(filename, null, null, function(error, fileHandler) {
            if (error)
                return callback(error);
            _self.truncate(fileHandler, 0, function(error) {
                _self.write(fileHandler, buffer, null, null, null, callback, progress);
            });
        });
    };
    
    WebFS.prototype.read = function(fd, buffer, offset, length, position, callback, progress) {
        var _self = this,
            data;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error));
        };
        
        fd.file(function(file) {
            var reader = new FileReader();
            
            reader.onloadend = function(e) {
                if (offset !== null || offset != 'undefined' && length)
                    data = this.result.slice(offset, length);
                else
                    data = this.result;
                
                callback(null, data, e);
            };
            reader.onerror = errorHandler;
            
            if (progress) {
                reader.onprogress = progress;
            }
            reader.readAsArrayBuffer(file);
        });
    };
    
    WebFS.prototype.readFile = function(filename, encoding, callback, position) {
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error));
        };
        
        var successHandler = function(error, fileHandler) {
            _self.read(fileHandler, null, null, null, null, callback, position);
        };
        
        this.open(filename, null, null, successHandler);
    };
    
    return WebFS;
})();