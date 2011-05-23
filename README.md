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
    <script type="text/javscript" src="webfs.js">
    <script type="text/javascript">
        var webfs = new WebFS();
        webfs.setFileSystem(webfs.TEMPORARY, 500, function(error, wfs) {

            var buffer = new BlobBuilder();
            webfs.readFile('/path/to/foo.txt', buffer, function(error, read, buffer) {
                var string = webfs.readAsString(buffer);
                $('#content').text(string);
            });
        });
    </script>