var WebFS = (function() {
    
    function WebFS(fs) {
        this.fs = fs;
        if (fs)
            this.root = fs.root;
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
    
    WebFS.prototype.DIR_SEPARATOR = '/';
    WebFS.prototype.TYPE_FILE = 'file';
    WebFS.prototype.TYPE_DIR = 'dir';
    
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
     * If the user does not use an external fs object, we can call this method
     * to create a new file system object
     * @param {Number} type Defines if the filesystem is TEMPORARY or PERSISTENT
     * @param {Number} size The size in MB of the filesystem, automatically
     * converted to bytes
     * @param {Function} callback The callback function on success or error
     */
    WebFS.prototype.setFileSystem = function(type, size, callback) {
        var _self = this;
        var request = window.requestFileSystem || window.webkitRequestFileSystem;
        
        var successHandler = function(fs) {
            _self.fs = fs;
            _self.root = fs.root;
            callback(null, fs);
        };
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error));
        };
        
        request(type, (size * 1024 *1024), successHandler, errorHandler);
    };
    
    /**
     * Get the current raw filesystem for this WebFS object
     */
    WebFS.prototype.getFileSystem = function() {
        return this.fs;
    };
    
    /**
     * Rename or move src to dest.  If dest is a directory, must contain
     * a trailing / char.
     * @param {String} src The path to rename or move
     * @param {String} dest The path to rename or move to
     * @param {Function} callback Callback function on completion.  The first
     * argument returned is an error or null and second argument is the new handler
     * for the moved file or directory 
     */
    WebFS.prototype.rename = 
    WebFS.prototype.move = function(src, dest, callback) {
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error));
        };
        
        var doMove = function(srcDirEntry, destDirEntry, newName) {
            var name = newName || null;
            srcDirEntry.moveTo(destDirEntry, name, function(newDirEntry) {
                callback(null, newDirEntry);  
            }, errorHandler);
        };
        
        if (dest[dest.length - 1] == _self.DIR_SEPARATOR) {
            _self.root.getDirectory(src, {}, function(srcDirEntry) {
                // Create blacklist for dirs we can't re-create.
                var create = ['.', './', '..', '../', '/'].indexOf(dest) != -1 ? false : true;
             
                _self.root.getDirectory(dest, {create: create}, function(destDirEntry) {
                    doMove(srcDirEntry, destDirEntry);
                }, errorHandler);
             }, function(error) {
                 // Try the src entry as a file instead.
                _self.root.getFile(src, {}, function(srcDirEntry) {
                    _self.root.getDirectory(dest, {}, function(destDirEntry) {
                        doMove(srcDirEntry, destDirEntry);
                    }, errorHandler);
                }, errorHandler);
            });
        } else {
            // Treat src/destination as files.
            _self.root.getFile(src, {}, function(srcFileEntry) {
                srcFileEntry.getParent(function(parentDirEntry) {
                    doMove(srcFileEntry, parentDirEntry, dest);
              }, errorHandler);
            }, errorHandler);
        }
    };
    
    /**
     * Copy src to dest.  If dest is a directory, must contain
     * a trailing / char.
     * @param {String} src The path to rename or copy
     * @param {String} dest The path to rename or copy to
     * @param {Function} callback Callback function on completion.  The first
     * argument returned is an error or null and second argument is the new handler
     * for the moved file or directory 
     */
    WebFS.prototype.copy = function(src, dest, callback) {
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error));
        };
        
        var doMove = function(srcDirEntry, destDirEntry, newName) {
            var name = newName || null;
            srcDirEntry.copyTo(destDirEntry, name, function(newDirEntry) {
                callback(null, newDirEntry);  
            }, errorHandler);
        };
        
        if (dest[dest.length - 1] == '/') {
            _self.root.getDirectory(src, {}, function(srcDirEntry) {
                // Create blacklist for dirs we can't re-create.
                var create = ['.', './', '..', '../', '/'].indexOf(dest) != -1 ? false : true;
             
                _self.root.getDirectory(dest, {create: create}, function(destDirEntry) {
                    doMove(srcDirEntry, destDirEntry);
                }, errorHandler);
             }, function(error) {
                 // Try the src entry as a file instead.
                _self.root.getFile(src, {}, function(srcDirEntry) {
                    _self.root.getDirectory(dest, {}, function(destDirEntry) {
                        doMove(srcDirEntry, destDirEntry);
                    }, errorHandler);
                }, errorHandler);
            });
        } else {
            // Treat src/destination as files.
            _self.root.getFile(src, {}, function(srcFileEntry) {
                srcFileEntry.getParent(function(parentDirEntry) {
                    doMove(srcFileEntry, parentDirEntry, dest);
              }, errorHandler);
            }, errorHandler);
        }
    };
    
    /**
     * Takes a file handler and truncates the content to the passed length
     * @param {FileEntry} fileEntry The file entry to be truncated
     * @param {Number} len The length to truncate the file to
     * @param {Function} callback Callback function, the first argument is an error
     * or null, the second argument is the result of the write, the third argument
     * is the event generated from the write
     */
    WebFS.prototype.truncate = function(fileEntry, len, callback, progress) {
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error));
        };
    
        fileEntry.createWriter(function(fileWriter) {
            fileWriter.onwriteend = function(evt) {
                callback(null, evt);
            };
            fileWriter.onerror = errorHandler;
            
            if (progress)
                fileWriter.onprogress = progress;
                
            fileWriter.truncate(len);
        });
    };
    
    /**
     * Deletes a path from the file system
     * @param {String} path The path to the file to remove
     * @param {Boolean} recursive Force a recursive delete
     * @param {Function} callback Callback function, only returns an error or null
     */
    WebFS.prototype.remove = function(path, recursive, callback) {
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error));
        };
        
        _self.root.getFile(path, {}, function(fileEntry) {
            fileEntry.remove(callback, errorHandler);
        }, function(error) {
            if (e.code == FileError.TYPE_MISMATCH_ERR) {
                if (recursive) {
                    _self.root.getDirectory(path, {}, function(dirEntry) {
                        dirEntry.removeRecursively(callback, errorHandler);
                    }, errorHandler);
                } else {
                    _self.root.getDirectory(path, {}, function(dirEntry) {
                        dirEntry.remove(callback, errorHandler);
                    }, errorHandler);
                }
            } else {
                errorHandler(error);
            }
        });
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
        
        var listHandler = function(dirHandler) {
            var dirReader = dirHandler.createReader();
            var entries = [];
            var readEntries = function() {
                dirReader.readEntries(function(results) {
                    if (!results.length) {
                        callback(null, entries.sort());
                    } else {
                        entries = entries.concat(Array.prototype.slice.call(results || [], 0));
                        readEntries();
                    }
                }, errorHandler);
            };
            readEntries();
        };
        
        _self.root.getDirectory(path, {}, listHandler, errorHandler);
    };
    
    
    /**
     * Opens a file and returns a FileEntry reference
     * @param {String} path The path of the directory to remove
     * @param {String} options Options used for creation of file
     * @param {Function} callback Callback function, returns an error or null and
     * a reference to a FileEntry
     */
    WebFS.prototype.openFile = function(path, options, callback) { 
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error));
        };
        
        var successHandler = function(fileHandler) {
            callback(null, fileHandler);
        };
        
        this.fs.root.getFile(path, options, successHandler, errorHandler);
    };
    
    /**
     * Opens a file and returns a FileEntry reference
     * @param {String} path The path of the directory to remove
     * @param {String} options Options used for creation of file
     * @param {Function} callback Callback function, returns an error or null and
     * a reference to a FileEntry
     */
    WebFS.prototype.openDir = function(path, options, callback) { 
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error));
        };
        
        var successHandler = function(dirHandler) {
            callback(null, dirHandler);
        };
        
        this.fs.root.getDirectory(path, options, successHandler, errorHandler);
    };
    
    /**
     * Writes the contents of a Blob or File to a FileEntry on the filesystem
     * @param {FileEntry} fileHandler The FileEntry to be written to
     * @param {Mixed} buffer The File or Blob to be read from
     * @param {Number} options The options to be passed
     * @param {Function} callback Callback function, only returns an error or null
     */
    WebFS.prototype.write = function(fileHandler, buffer, options, callback, progress) {
        var _self = this,
            data;
            
        var errorHandler = function(error) {
            callback(_self.errorHandler(error));
        };
        
        // Offset can be 0, but length must always be a value > 1
        if (options && (options.offset !== null || options.offset != 'undefined' && options.length))
            data = buffer.slice(options.offset, options.length);
        else
            data = buffer;
            
        var writerHandler = function(fileWriter) {
            // If we have a position we want to seek to append
            if (options && options.position)
                fileWriter.seek(options.position);
                
            fileWriter.onwriteend = function(e) {
                callback(null, e);
            };
            fileWriter.onerror = errorHandler;
            if (progress)
                fileWriter.onprogress = progress;
            fileWriter.write(data);
        };
            
        fileHandler.createWriter(writerHandler, errorHandler);
    };
    
    WebFS.prototype.read = function(fileHandler, buffer, options, callback, progress) {
        var _self = this,
            data;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error));
        };
        
        fileHandler.file(function(file) {
            var reader = new FileReader();
            
            reader.onloadend = function(e) {
                if (options && (options.offset !== null || options.offset != 'undefined' && options.length))
                    data = _self.createBlob(this.result.slice(offset, length));
                else
                    data = _self.createBlob(this.result);
                
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
    
    /**
     * Takes data, string or binary, and creates a binary blob.
     * @param {Mixed} data String or binary data
     * @param {String} encoding The mimetype to return the blob as
     */
    WebFS.prototype.createBlob = function(data, encoding) {
        var bb = new BlobBuilder();
        bb.append(data);
        if (encoding)
            return bb.getBlob(encoding);
        else
            return bb.getBlob();
    };
    
    WebFS.prototype.wget = function(url, callback) {
        if (url.search('^http://') == -1) {
            url = 'http://' + url;
        }
        
        var xhr = new XMLHttpRequest();
        xhr.onload = function(e) {
            if (this.status == 200 && this.readyState == 4) {
              callback(null, this.response);
            } else {
              callback(this);
            }
        };
        xhr.onerror = function(e) {
            callback(this);
        };
        xhr.open('GET', url, true);
        xhr.send();
    };
    
    /**
     * Method to get content as a string
     * @param {Mixed} data The File or content to read
     * @param {Object} options and object of options, not used yet
     * @param {Function} callback Callback method
     */
    WebFS.prototype.readString = function(data, encoding, callback, progress) {
        
        var reader = new FileReader();
        
        reader.onloadend = function(event) {
            callback(null, this.result);
        };
        
        reader.onerror = function(error) {
            callback(error);
        };
        
        if (progress)
            reader.onprogress = progress;
        
        data = reader.readAsText(data, encoding);
    };
    
    /**
     * Method to get content as a binaryString
     * @param {Mixed} data The File or content to read
     * @param {Object} options and object of options, not used yet
     * @param {Function} callback Callback method
     */
    WebFS.prototype.readBinaryString = function(data, callback, progress) {
        var reader = new FileReader();
        reader.onloadend = function(event) {
            callback(null, this.result);
        };
        reader.onerror = function(error) {
            callback(error);
        };
        
        if (progress)
            reader.onprogress = progress;
        
        reader.readAsBinaryString(data);
    };
    
    /**
     * Method to get content as a arrayBuffer
     * @param {Mixed} data The File or content to read
     * @param {Object} options and object of options, not used yet
     * @param {Function} callback Callback method
     */
    WebFS.prototype.readArrayBuffer = function(data, callback, progress) {
        var reader;
        reader = new FileReader();
        reader.onloadend = function(event) {
            callback(null, this.result);
        };
        reader.onerror = function(error) {
            callback(error);
        };
        
        if (progress)
            reader.onprogress = progress;
        
        reader.readAsArrayBuffer(data);
    };
    
    /**
     * Method to get content as a dataUrl
     * @param {Mixed} data The File or content to read
     * @param {Object} options and object of options, not used yet
     * @param {Function} callback Callback method
     */
    WebFS.prototype.readDataUrl = function(data, callback, progress) {
        var reader = new FileReader();
        reader.onloadend = function(event) {
            callback(null, this.result);
        };
        reader.onerror = function(error) {
            callback(error);
        };
        
        if (progress)
            reader.onprogress = progress;
        
        reader.readAsDataURL(data);
    };
    
    return WebFS;
})();