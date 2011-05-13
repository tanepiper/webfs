var WebFSUtil = function(fs) {
    this.fs = fs;
};

(function() {
    
    this.recursiveDelete = function(path, callback) {
        var _self = this;
        
        var errorHandler = function(error) {
            callback(_self.errorHandler(error));
        };

        var successHandler = function(dirEntry) {
            dirEntry.removeRecursively(function() {
                callback();
            }, errorHandler);
        };

        this.fs.root.getDirectory(path, {create: false}, successHandler, errorHandler);
    };
    
})(WebFSUtil.prototype);