pushthings
==========

Just a node.js server with a creative name to push images and do stuff with them, like posting on a Jekyll blog, and share the post on pump.io/twitter/whatever


Modules
-------
* Jekyll support: OK
* Twitter support: OK
* Imgur uploading support: OK
* Local storage support: OK
* pump.io support: WIP


Pushing something
-----------------

Just make a POST with the parameters:
* apikey = yoursweetkey
* text = The short title you want to post with
* img = the image file
* description = an **optional** long description of the image


Security
--------

Everything goes over HTTPS so its supposed to be secure enough for a toy project.
