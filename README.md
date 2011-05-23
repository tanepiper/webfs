WebFS - Nodejs filesystem implementation for Client Side
========================================================

WebFS by [Ajax.org](http://ajax.org) is a client side implementation of the
[nodejs filesystem](http://nodejs.org/docs/v0.4.8/api/fs.html).  It provides
all the async functions required to handle reading and writing of file and
directories by using the [W3C FileSystem API](http://dev.w3.org/2009/dap/file-system/pub/FileSystem/).

Useage
------

To use the library, include the `webfs.js` in your documents script tags and
create a new WebFS object.


Example
-------
    <!doctype html>
    <html>
        <head>
            <title>Test Page</title>
            <script type="text/javascript" src="jquery.js"></script>
            <script type="text/javascript" src="webfs.js"></script>
            <script type="text/javascript">
                var webfs = new WebFS();
                // Create a temporary file system of 500Mb
                webfs.setFileSystem(webfs.TEMPORARY, 500, function(error, wfs) {
                    // Read the contents of foo.txt
                    webfs.readFile('foo.txt', function(error, read, buffer) {
                        if (error) {
                            $('#content').text(error);
                        } else {                
                            // Get the string content of the buffer(Blob) passed back
                            webfs.readString(buffer, function(error, string) {;
                                $('#content').text(string);
                            });
                        }
                    });
                });
            </script>
        </head>
        
        <body>
            <div id="content"></div>
        </body>
    </html>

WebFS Available Members and Functions
-------------------------------------

On the WebFS object, the following objects are available:

`webfs.fs` - The native file system object.
`webfs.root` - The root directory of the native filesystem sandbox.

The following WebFS functions are available:

`webfs.isAvailable()` - Helper method to advise if requestFileSystem is available in the browser.

`webfs.setFileSystem(type, size, callback)` - If a native filesystem is not passed to the constructor use this function to se the filesystem.  Type can be webfs.TEMPORARY or web.fs.PERSISTENT.  Size is in MB.

`webfs.getFileSystem()` - Returns the native file system handler.

`webfs.createBlob(data, encoding)` - Creates a blob from the passed data with the mimetype encoding passed.  If not mimetype is passed it will be raw binary data.

`webfs.readString(data, encoding, callback)` - Returns a string from a passed Blob with the passed encoding. If not encoding is passed, the default is 'UTF-8'.

`webfs.readBinaryString(data, callback)` - Returns a binary string from the passed Blob.

`webfs.readArrayBuffer(data, callback)` - Returns an array buffer from the passed Blob.

`webfs.readDataUrl(data, callback)` - Returns a base64 dataurl from the passed Blob.

The following functions are available nodejs-style functions:

`webfs.rename(source, dest, callback)` - Rename or move a file or directory.

`webfs.truncate(fd, length, callback)` - Truncate a file passed in the file descriptor to the length provided.

`webfs.stat|lstat(path, callback)` - Returns a stat object for the path.

`webfs.fstat(fd, callback)` - Returns a stat object for the passed file descriptor.

`webfs.unlink|rmdir(path, callback)` - Removes the passed path from the filesystem, can be a file or directory.  Directories are removed recursivly.

`webfs.mkdir(path, mode, callback)` - Creates a directory from the path, directories are created recursivly.  Mode is not used and only provided for compatibility.

`webfs.readdir(path, callback)` - Returns an array of paths to files and directories within the passed path.

`webfs.close(fd, callback)` - Destroys the passed filehandler reference.

`webfs.open(path, flags, mode, callback)` - Returns a file descriptor for the passed path.  If the flag is one of ['w', 'w+', 'a', 'a+'] the file will be created if it does not exist.  Mode is not used and provided for nodejs compatibility.

`webfs.write(fd, buffer, offset, length, position, callback)` - Writes the buffer to the passed file handler.  Offset, length, position are not used and provided for nodejs compatibility.  Buffer can be a `File`, `Blob` or `String`.

`webfs.writeFile(path, data, encoding, callback)` - Writes the data to the passed file path, if the file does not exist it will be created.  Encoding is not used and provided for nodejs compatibility.

`webfs.read(fd, buffer, offset, length, position, callback)` - Reads the contents of the file description and places into the buffer.  Offset, length, position are not used and provided for nodejs compatibility.

`webfs.readFile(path, encoding, callback)` - Reads the content of the file passed as path.  Encoding is not used and provided for nodejs compatibility.

The following functions are available nodejs-style functions that return an empty callback, only provided for compatibility

`webfs.chmod(path, mode, callback)`

`webfs.link(srcpath, destpath, callback)`

`webfs.symlink(linkdata, path, callback)`

`webfs.readlink(path, callback)`

`webfs.realpath(path, callback)`