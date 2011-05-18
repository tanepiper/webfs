var WebFSExtra = (function() {
    
    function WebFSExtra(webfs) {
        this.fs = webfs.getFileSystem();
        this.root = webfs.getFileSystem().root;
    }
    
    /**
     * Copy src to dest.  If dest is a directory, must contain
     * a trailing / char.
     * @param {String} src The path to rename or copy
     * @param {String} dest The path to rename or copy to
     * @param {Function} callback Callback function on completion.  The first
     * argument returned is an error or null and second argument is the new handler
     * for the moved file or directory 
     */
    WebFSExtra.prototype.copy = function(src, dest, callback) {
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
    
    WebFSExtra.prototype.wget = function(url, callback) {
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
     * Opens a dir and returns a DirEntry reference
     * @param {String} path The path of the directory to remove
     * @param {String} options Options used for creation of file
     * @param {Function} callback Callback function, returns an error or null and
     * a reference to a FileEntry
     */
    WebFSExtra.prototype.openDir = function(path, options, callback) { 
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error));
        };
        
        var successHandler = function(dirHandler) {
            callback(null, dirHandler);
        };
        
        this.fs.root.getDirectory(path, options, successHandler, errorHandler);
    };
    
    return WebFSExtra;
})();