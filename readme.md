Cross Domain Storage (xds)

Inspired by http://www.nczonline.net/blog/2010/09/07/learning-from-xauth-cross-domain-localstorage/

Almost a complete ripoff of Zakas' work, but with whitelisting removed (need to get around cross-origin for another project).

TLDR;
Put xds.js on whatever site, put xds-serve up on some mutually accessible site, now you can share local storage space between all sites.

Note, whitelisting is removed, this allows the bad guys to change values in your set storage!.. then again if you're interested in this you probably already know that.