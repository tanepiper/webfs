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
    
    /**
     * Method to get content as a string
     * @param {Mixed} data The File or content to read
     * @param {Object} options and object of options, not used yet
     * @param {Function} callback Callback method
     */
    this.readString = function(data, encoding, callback, progress) {
        
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
    this.readBinaryString = function(data, options, callback, progress) {
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
    this.readArrayBuffer = function(data, options, callback, progress) {
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
    this.readDataUrl = function(data, options, callback, progress) {
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
    
})(WebFSUtil.prototype);